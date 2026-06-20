import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Profile from "../models/Profile";
import { Student } from "../models/studentModel";
import FriendRequest from "../models/friendRequest";

export const getLoggedInStudent = async (req: Request) => {
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

export const addProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, password, studentID, bio, interests, department, contactInfo } = req.body;

    const existingProfile = await Profile.findOne({
      $or: [{ studentID }, { email }, { contactInfo }],
    });
    if (existingProfile) {
      return res.status(400).json({
        message: "Profile with this studentID, email, or contact info already exists.",
      });
    }

    let student = await Student.findOne({ email });

    if (!student) {
      student = new Student({
        name,
        email,
        password,
        role: "registered",
      });
      await student.save();
    } else {
      if (student.role !== "registered") {
        student.role = "registered";
        await student.save();
      }
    }

    const profile = new Profile({
      studentID,
      name,
      email,
      bio,
      interests,        
      department,
      contactInfo,
      student: student._id as mongoose.Types.ObjectId,
    });
    await profile.save();

    res.status(201).json({
      message: "Profile created successfully and student is registered",
      profile,
    });
  } catch (error: any) {
    console.error("Add profile error:", error);
    res.status(500).json({ message: "Error adding profile", error: error.message });
  }
};

export const getProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.find().populate("student");
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profiles", error });
  }
};

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findById(req.params.id).populate("student");
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile", error });
  }
};

export const getProfileByStudentID = async (req: Request, res: Response) => {
  try {
    const { id: studentID } = req.params;
    if (!studentID) {
      return res.status(400).json({ message: "Please provide a Student ID to search." });
    }

    const profile = await Profile.findOne({
      studentID: { $regex: new RegExp(`^${studentID}$`, "i") },
    }).populate("student");

    if (!profile) return res.status(200).json(null);

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile by Student ID", error });
  }
};

export const getProfileByEmail = async (req: Request, res: Response) => {
  try {
    let { email } = req.query;
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    email = email.toString().trim();

    const profile = await Profile.findOne({
      email: { $regex: `^${email}$`, $options: "i" }
    });

    if (!profile)
      return res
        .status(404)
        .json({ message: `No profile found for email: ${email}` });

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving profile by email",
      error,
    });
  }
};

export const searchProfilesByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Please provide a name to search." });
    }

    const profiles = await Profile.find({
      name: { $regex: new RegExp(name as string, "i") },
    }).populate("student");

    if (profiles.length === 0)
      return res.status(404).json({ message: `No profiles found for name: ${name}` });

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error searching profiles by name", error });
  }
};

export const searchProfilesByDepartment = async (req: Request, res: Response) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ message: "Please provide a department to search." });
    }

    const profiles = await Profile.find({
      department: { $regex: new RegExp(department as string, "i") },
    }).populate("student");

    if (profiles.length === 0)
      return res.status(200).json([]);

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error searching profiles by department", error });
  }
};

export const checkUniqueProfileFields = async (req: Request, res: Response) => {
  try {
    const { studentID, email, contactInfo } = req.body;

    if (!studentID || !email || !contactInfo)
      return res.status(400).json({ message: "studentID, email, and contactInfo required" });

    const duplicate = await Profile.findOne({
      $or: [
        { studentID },
        { email },
        { contactInfo },
      ],
    });

    if (duplicate && duplicate.studentID !== studentID) {
      return res.status(409).json({
        message: `Student ID, email or contact info already exists for another user`,
      });
    }

    res.status(200).json({ message: "Unique" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking uniqueness", error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { studentID, ...otherFields } = req.body;
    if (!studentID) return res.status(400).json({ message: "studentID required" });

    const profile = await Profile.findOne({ studentID }).exec();
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const studentUpdates: Partial<{ name: string; email: string }> = {};

    if (otherFields.name !== undefined) studentUpdates.name = otherFields.name;
    if (otherFields.email !== undefined) studentUpdates.email = otherFields.email;

    let updatedStudent = null;
    const studentRefId = profile.student ? profile.student.toString() : null;

    if (Object.keys(studentUpdates).length > 0) {
      if (studentRefId) {
        updatedStudent = await Student.findByIdAndUpdate(
          new Types.ObjectId(studentRefId),
          { $set: studentUpdates },
          { new: true, runValidators: true }
        ).exec();
      } else {
        updatedStudent = await Student.findOneAndUpdate(
          { email: profile.email },
          { $set: studentUpdates },
          { new: true, runValidators: true }
        ).exec();
      }
    }

    if (studentUpdates.email !== undefined) {
      otherFields.email = studentUpdates.email;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { studentID },
      { $set: otherFields },
      { new: true, runValidators: true }
    ).exec();

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
      student: updatedStudent ?? undefined,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: "Error updating profile", error });
  }
};

export const deleteProfileById = async (req: Request, res: Response) => {
  try {
    const loggedInStudent = await getLoggedInStudent(req);
    if (!loggedInStudent)
      return res.status(401).json({ message: "Unauthorized: Login required" });

    const profile = await Profile.findById(req.params.id);
    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    if (
      profile.student?.toString() !==
      (loggedInStudent._id as Types.ObjectId).toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own profile" });
    }

    await Profile.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error });
  }
};

export const deleteProfileByStudentID = async (req: Request, res: Response) => {
  try {
    const loggedInStudent = await getLoggedInStudent(req);
    if (!loggedInStudent)
      return res.status(401).json({ message: "Unauthorized: Login required" });

    const { studentID } = req.params;
    const profile = await Profile.findOne({ studentID });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    if (
      profile.student?.toString() !==
      (loggedInStudent._id as Types.ObjectId).toString()
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own profile" });
    }

    await Profile.findOneAndDelete({ studentID });
    res.status(200).json({
      message: `Profile for studentID ${studentID} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error });
  }
};

export const deleteProfileByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const profile = await Profile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ message: `Profile with email ${email} not found` });
    }

    const studentId = profile.student;

    await FriendRequest.deleteMany({
      $or: [
        { sender: studentId },
        { receiver: studentId }
      ]
    });

    console.log("Deleted all friend requests involving:", studentId);

    await Profile.findOneAndDelete({ email });

    if (studentId) {
      await Student.findByIdAndDelete(studentId);
    }

    res.status(200).json({
      message: `Profile, student, and all related friend requests deleted successfully`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting profile and related data", error });
  }
};

export const searchProfilesByStudentID = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.query;
    if (!studentID) {
      return res.status(400).json({ message: "Please provide a Student ID to search." });
    }

    const profiles = await Profile.find({
      studentID: { $regex: new RegExp(`${studentID}`, "i") },
    }).populate("student");

    if (profiles.length === 0)
      return res.status(404).json({ message: `No profiles found for Student ID: ${studentID}` });

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Error searching profiles by Student ID", error });
  }
};
