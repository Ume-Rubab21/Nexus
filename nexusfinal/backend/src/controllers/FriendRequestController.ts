import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import FriendRequest from "../models/friendRequest";
import { Student } from "../models/studentModel";

// ✅ Helper: Retrieve logged-in student
const getLoggedInStudent = async (req: Request) => {
  const studentId = req.headers["student-id"] as string;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    console.log("❌ Missing or invalid student-id header:", studentId);
    return null;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    console.log("❌ No student found for ID:", studentId);
    return null;
  }

  console.log("✅ Logged in student:", student.name, student.role);
  return student;
};


//send req
export const sendFriendRequestByEmail = async (req: Request, res: Response) => {
  try {
    const senderEmail = (req.body.senderEmail || "").toString().trim().toLowerCase();
    const receiverEmail = (req.body.receiverEmail || "").toString().trim().toLowerCase();

    if (!senderEmail || !receiverEmail) {
      return res.status(400).json({ message: "senderEmail and receiverEmail are required" });
    }

    // same email -> cannot add yourself
    if (senderEmail === receiverEmail) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    // Find both users by email
    const sender = await Student.findOne({ email: senderEmail });
    const receiver = await Student.findOne({ email: receiverEmail });

    if (!sender) return res.status(404).json({ message: "Sender profile not found" });
    if (!receiver) return res.status(404).json({ message: "Receiver profile not found" });

    const senderId = sender._id as Types.ObjectId;
    const receiverId = receiver._id as Types.ObjectId;

    // Check if a request already exists (same direction)
    const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
    if (existingRequest) return res.status(400).json({ message: "Friend request already sent" });

    // Check if they are already friends (accepted in either direction)
    const alreadyFriends = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: "Accepted" },
        { sender: receiverId, receiver: senderId, status: "Accepted" },
      ],
    });
    if (alreadyFriends) return res.status(400).json({ message: "This user is already your friend" });

    // Create next requestId (increment last)
    const lastRequest = await FriendRequest.findOne({}, {}, { sort: { requestId: -1 } });
    const nextRequestId = lastRequest ? (lastRequest.requestId || 0) + 1 : 1;

    const request = await FriendRequest.create({
      requestId: nextRequestId,
      sender: senderId,
      receiver: receiverId,
      status: "Pending",
    });

    // populate response with sender & receiver summary
    await request.populate("sender", "name email department");
    await request.populate("receiver", "name email department");

    return res.status(201).json({ message: "Friend request sent successfully", request });
  } catch (error) {
    console.error("❌ Error sending friend request by email:", error);
    return res.status(500).json({ message: "Error sending friend request", error });
  }
};


// Get friends by email
export const getFriendsByEmail = async (req: Request, res: Response) => {
  try {
    // Accept email either as URL param (/friends/:email) or query (?email=...) or body
    const email = (req.params.email || req.query.email || req.body.email || "").toString().trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Email is required" });

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student with that email not found" });

    const studentId = student._id as Types.ObjectId;

    const friends = await FriendRequest.find({
      $or: [
        { sender: studentId, status: "Accepted" },
        { receiver: studentId, status: "Accepted" },
      ],
    })
      .populate("sender", "name department email")   // include email to help frontend identify
      .populate("receiver", "name department email");

    if (!friends || friends.length === 0) return res.status(404).json({ message: "No friends found" });

    // Optionally transform results: return the peer (friend) info rather than full requests
    const friendList = friends
  .map((fr) => {
    const isSender = fr.sender && (fr.sender as any)._id?.toString() === studentId.toString();
    const peer = isSender ? fr.receiver : fr.sender;

    if (!peer) return null; 

    return {
      requestId: fr._id,
      friendshipWith: peer,
      status: fr.status,
      createdAt: fr.createdAt,
      updatedAt: fr.updatedAt,
    };
  })
  .filter(Boolean); // remove null entries


    return res.status(200).json({ message: "Friends retrieved", data: friendList });
  } catch (error) {
    console.error("Error retrieving friends by email:", error);
    return res.status(500).json({ message: "Error retrieving friends list", error });
  }
};





// GET /api/friendrequests/sent?email=someone@example.com
export const getSentRequests = async (req: Request, res: Response) => {
  try {
    const email = (req.params.email || req.query.email || req.body.email || "")
      .toString()
      .trim()
      .toLowerCase();

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const student = await Student.findOne({ email });
    if (!student)
      return res.status(404).json({ message: "Student with that email not found" });

    const studentId = student._id as Types.ObjectId;

    // 🔥 Return only PENDING sent requests
    const requests = await FriendRequest.find({
      sender: studentId,
      status: "Pending",
    }).populate("receiver", "name email department status");

    return res.status(200).json({
      message: "Pending sent requests retrieved",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    return res.status(500).json({
      message: "Error fetching sent requests",
      error,
    });
  }
};


// GET /api/friendrequests/received?email=someone@example.com
export const getReceivedRequests = async (req: Request, res: Response) => {
  try {
    const email = (req.params.email || req.query.email || req.body.email || "")
      .toString()
      .trim()
      .toLowerCase();

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const student = await Student.findOne({ email });
    if (!student)
      return res.status(404).json({ message: "Student with that email not found" });

    const studentId = student._id as Types.ObjectId;

    // 🔥 Only received PENDING requests
    const requests = await FriendRequest.find({
      receiver: studentId,
      status: "Pending",
    }).populate("sender", "name email department status");

    return res.status(200).json({
      message: "Pending received requests retrieved",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching received requests:", error);
    return res.status(500).json({
      message: "Error fetching received requests",
      error,
    });
  }
};




export const respondToRequest = async (req: Request, res: Response) => {
  try {
    // Expect either { id, idType: "_id" | "requestId", action }
    const { id, idType, action } = req.body;

    if (!id || !["Accept", "Reject"].includes(action))
      return res.status(400).json({ message: "Invalid request: id and action required" });

    let requestDoc = null;

    // If front-end explicitly tells idType:
    if (idType === "_id") {
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Invalid _id format" });

      requestDoc = await FriendRequest.findById(id);
    } else if (idType === "requestId") {
      const numericId = Number(id);
      if (isNaN(numericId)) return res.status(400).json({ message: "Invalid requestId" });

      requestDoc = await FriendRequest.findOne({ requestId: numericId });
    } else {
      // try to detect: if looks like ObjectId search by _id, otherwise by requestId
      if (mongoose.Types.ObjectId.isValid(id)) {
        requestDoc = await FriendRequest.findById(id);
      } else {
        const numericId = Number(id);
        if (!isNaN(numericId)) requestDoc = await FriendRequest.findOne({ requestId: numericId });
      }
    }

    if (!requestDoc) return res.status(404).json({ message: "Friend request not found" });

    if (action === "Reject") {
      // delete the request document
      await FriendRequest.deleteOne({ _id: requestDoc._id });
      return res.status(200).json({ message: "Friend request rejected and removed" });
    } else {
      // Accept case: mark accepted and save
      requestDoc.status = "Accepted";
      await requestDoc.save();
      return res.status(200).json({ message: "Friend request accepted" });
    }
  } catch (error) {
    console.error("Error responding to friend request:", error);
    return res.status(500).json({ message: "Error responding to friend request", error });
  }
};


// Cancel Sent Request (using _id)
export const cancelFriendRequest = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.requestId; // keep as string (MongoDB _id)
    if (!requestId) return res.status(400).json({ message: "Invalid requestId" });

    const request = await FriendRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ message: "Request not found" });

    // Directly delete the request
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request canceled" });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    res.status(500).json({ message: "Error canceling friend request", error });
  }
};




// View Friends List
export const getFriendsList = async (req: Request, res: Response) => {
  try {
    const loggedInStudent = await getLoggedInStudent(req);
    if (!loggedInStudent)
      return res.status(401).json({ message: "Unauthorized: Login required" });

    const friends = await FriendRequest.find({
      $or: [
        { sender: loggedInStudent._id as Types.ObjectId, status: "Accepted" },
        { receiver: loggedInStudent._id as Types.ObjectId, status: "Accepted" },
      ],
    })
      .populate("sender", "name department")
      .populate("receiver", "name department");

    if (friends.length === 0)
      return res.status(404).json({ message: "No friends found" });

    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving friends list", error });
  }
};

// controllers/friendController.ts
export const removeFriend = async (req: Request, res: Response) => {
  try {
    const { friendId, myId } = req.params;

    console.log("Params received:", req.params);

    if (!friendId || !myId) {
      return res.status(400).json({ message: "Both friendId and myId are required" });
    }

    const result = await FriendRequest.deleteMany({
      $or: [
        { sender: myId, receiver: friendId },
        { sender: friendId, receiver: myId },
      ],
    });

    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No friend requests found between these users" });
    }

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Error removing friend", error });
  }
};




export const checkFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderEmail = (req.query.senderEmail || "").toString().trim().toLowerCase();
    const receiverEmail = (req.query.receiverEmail || "").toString().trim().toLowerCase();
    if (!senderEmail || !receiverEmail) {
      return res.status(400).json({ message: "senderEmail and receiverEmail required" });
    }

    // Find sender and receiver
    const sender = await Student.findOne({ email: senderEmail });
    const receiver = await Student.findOne({ email: receiverEmail });
    if (!sender || !receiver) return res.status(404).json({ message: "Users not found" });

    const request = await FriendRequest.findOne({
      $or: [
        { sender: sender._id, receiver: receiver._id },
        { sender: receiver._id, receiver: sender._id },
      ],
    }).populate("sender", "email name").populate("receiver", "email name");

    res.status(200).json({ request: request || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking friend request", error: err });
  }
};

export const getRelationship = async (req: Request, res: Response) => {
  try {
    const email1 = (req.query.email1 || "").toString().trim().toLowerCase();
    const email2 = (req.query.email2 || "").toString().trim().toLowerCase();

    if (!email1 || !email2) {
      return res.status(400).json({ message: "email1 and email2 are required" });
    }

    // same email → impossible
    if (email1 === email2) {
      return res.status(400).json({ message: "Cannot check relation with yourself" });
    }

    // Find both students
    const user1 = await Student.findOne({ email: email1 });
    const user2 = await Student.findOne({ email: email2 });

    if (!user1) return res.status(404).json({ message: "User1 not found" });
    if (!user2) return res.status(404).json({ message: "User2 not found" });

    const id1 = user1._id as Types.ObjectId;
    const id2 = user2._id as Types.ObjectId;

    // 1) Are they friends?
    const friends = await FriendRequest.findOne({
      $or: [
        { sender: id1, receiver: id2, status: "Accepted" },
        { sender: id2, receiver: id1, status: "Accepted" },
      ],
    });

    if (friends) {
      return res.status(200).json({ relation: "Friends" });
    }

    // 2) Has user1 SENT a request to user2?
    const sent = await FriendRequest.findOne({
      sender: id1,
      receiver: id2,
      status: "Pending",
    });

    if (sent) {
      return res.status(200).json({ relation: "Sent" });
    }

    // 3) Has user1 RECEIVED a request from user2?
    const received = await FriendRequest.findOne({
      sender: id2,
      receiver: id1,
      status: "Pending",
    });

    if (received) {
      return res.status(200).json({ relation: "Received" });
    }

    // 4) No relation (no record exists in DB)
    return res.status(200).json({ relation: "No Relation" });

  } catch (error) {
    console.error("Error getting relationship:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

