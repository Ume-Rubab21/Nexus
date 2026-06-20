import { Request, Response } from "express";
import { Announcement } from "../models/Announcement";
import { Society } from "../models/Society";
import { Student } from "../models/studentModel";

// Mock admin data (still static)
const admin = { email: "admin@campusconnect.com", password: "12345" };

// Session flag
let isLoggedIn = false;

// 🧾 Admin Login
export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === admin.email && password === admin.password) {
    isLoggedIn = true;
    return res.status(200).json({ message: "Login successful ✅" });
  } else {
    return res.status(401).json({ message: "Invalid credentials ❌" });
  }
};

// 🚪 Logout
export const adminLogout = (req: Request, res: Response) => {
  if (isLoggedIn) {
    isLoggedIn = false;
    return res.status(200).json({ message: "Logged out successfully 👋" });
  }
  res.status(400).json({ message: "Admin is not logged in" });
};

// 📢 Post new announcement
export const postAnnouncement = async (req: Request, res: Response) => {
  if (!isLoggedIn) return res.status(403).json({ message: "Unauthorized" });
  try {
    const { title, description } = req.body;
    const announcement = new Announcement({ title, description });
    await announcement.save();
    res.status(201).json({ message: "Announcement posted ✅", announcement });
  } catch (err) {
    res.status(500).json({ message: "Error posting announcement", err });
  }
};

// 🏛 Add Society
export const addSociety = async (req: Request, res: Response) => {
  if (!isLoggedIn) return res.status(403).json({ message: "Unauthorized" });
  try {
    const { name, description } = req.body;
    const society = new Society({ name, description });
    await society.save();
    res.status(201).json({ message: "Society added ✅", society });
  } catch (err) {
    res.status(500).json({ message: "Error adding society", err });
  }
};

// ✏️ Update Society
export const updateSociety = async (req: Request, res: Response) => {
  if (!isLoggedIn) return res.status(403).json({ message: "Unauthorized" });
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedSociety = await Society.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedSociety) return res.status(404).json({ message: "Society not found" });
    res.json({ message: "Society updated ✅", updatedSociety });
  } catch (err) {
    res.status(500).json({ message: "Error updating society", err });
  }
};

// 🗑️ Delete Society
export const deleteSociety = async (req: Request, res: Response) => {
  if (!isLoggedIn) return res.status(403).json({ message: "Unauthorized" });
  try {
    const { id } = req.params;
    await Society.findByIdAndDelete(id);
    res.json({ message: "Society deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting society", err });
  }
};

// 👥 Get all users (students)
export const getAllUsers = async (req: Request, res: Response) => {
  if (!isLoggedIn) return res.status(403).json({ message: "Unauthorized" });
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", err });
  }
};

// 🗑️ Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  if (!isLoggedIn) return res.status(403).json({ message: "Unauthorized" });
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: "User removed successfully 🗑️" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", err });
  }
};

// ⚖️ Moderate content
export const moderateContent = (req: Request, res: Response) => {
  if (!isLoggedIn) return res.status(403).json({ message: "Unauthorized" });
  res.json({ message: "All inappropriate content removed 🚫" });
};
