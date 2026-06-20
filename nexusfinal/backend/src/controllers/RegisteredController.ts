import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { Student, IStudent } from "../models/studentModel";



// ----- LOGIN -----
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({ message: "Invalid email or password ❌" });
    }

    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password ❌" });
    }

    const token = jwt.sign(
      { userId: student._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful ✅",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error during login ❌",
      error: (error as Error).message,
    });
  }
};



// ----- VIEW PROFILE -----
export const viewProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await Student.findById(id)
      .populate("friends", "name email");


    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profile", error: (error as Error).message });
  }
};

// ----- UPDATE PROFILE -----
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const updates = req.body;
    const updated = await Student.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Profile updated", user: updated });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile", error: (error as Error).message });
  }
};

// ----- ADD FRIEND -----
export const addFriend = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.body;
    const user = await Student.findById(req.params.id);
    const friend = await Student.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ message: "User or Friend not found" });

    const userFriendIds = (user.friends || []).map((f: Types.ObjectId) =>
      f.toString()
    );

    const friendIdStr = (friend._id as Types.ObjectId).toString();
    if (userFriendIds.includes(friendIdStr)) {
      return res.status(400).json({ message: "Already friends" });
    }

    user.friends = [...(user.friends || []), friend._id as Types.ObjectId];
    friend.friends = [...(friend.friends || []), user._id as Types.ObjectId];

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend added successfully", user });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "Error adding friend", error });
  }
};


// ----- REMOVE FRIEND -----
export const removeFriend = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.body;
    const user = await Student.findById(req.params.id);
    const friend = await Student.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ message: "User or Friend not found" });

    const friendIdStr = (friend._id as Types.ObjectId).toString();
    const userIdStr = (user._id as Types.ObjectId).toString();

    user.friends = (user.friends || []).filter(
      (f: Types.ObjectId) => f.toString() !== friendIdStr
    );

    friend.friends = (friend.friends || []).filter(
      (f: Types.ObjectId) => f.toString() !== userIdStr
    );

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully", user });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Error removing friend", error });
  }
};

//---forgot password-----
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    student.password = password;
    await student.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// ----- SEARCH FRIENDS -----
export const searchFriends = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";
    const results = await Student.find({
      role: "registered",
      name: { $regex: q, $options: "i" },
    }).select("name email");

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Error searching friends", error: (error as Error).message });
  }
};

// ----- ANNOUNCEMENTS -----
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = [
      { id: 1, title: "Midterm Schedule Released", description: "Check your portal for details." },
      { id: 2, title: "Sports Week Announced!", description: "Join your society teams!" },
    ];
    return res.status(200).json(announcements);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching announcements", error: (error as Error).message });
  }
};

// ----- SOCIETIES -----
export const getSocieties = async (req: Request, res: Response) => {
  try {
    const societies = [
      { id: 1, name: "Tech Society", description: "Coding, AI, and Hackathons" },
      { id: 2, name: "Literary Club", description: "Debates, writings, and literature" },
      { id: 3, name: "Sports Society", description: "Cricket, Football, and Athletics" },
    ];
    return res.status(200).json(societies);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching societies", error: (error as Error).message });
  }
};

// ----- VIEW FRIEND PROFILE -----
export const viewFriendProfile = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid friend id" });
    }

    const friend = await Student.findById(friendId).select("name email societies");
    if (!friend) return res.status(404).json({ message: "Friend not found" });

    return res.status(200).json(friend);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching friend profile", error: (error as Error).message });
  }
  
};
export const getStudentByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;
  const student = await Student.findOne({ email });
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ id: student._id });
};

