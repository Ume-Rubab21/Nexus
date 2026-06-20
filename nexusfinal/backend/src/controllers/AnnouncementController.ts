import { Request, Response } from "express";
import { Announcement } from "../models/Announcement";
import mongoose from "mongoose";

// Get all announcements
export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return res.status(200).json(announcements);
  } catch (err) {
    console.error("getAllAnnouncements error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get announcement by id (ObjectId)
export const getAnnouncementById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid announcement id" });

  try {
    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ message: "Announcement not found" });
    return res.status(200).json(ann);
  } catch (err) {
    console.error("getAnnouncementById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create new announcement
export const createAnnouncement = async (req: Request, res: Response) => {
  const { title, description, createdBy } = req.body;
  if (!title || !description || !createdBy) {
    return res.status(400).json({ message: "Please provide title, description, and createdBy" });
  }

  try {
    const newAnnouncement = new Announcement({ title, description, createdBy });
    await newAnnouncement.save();
    return res.status(201).json({ message: "Announcement created", announcement: newAnnouncement });
  } catch (err) {
    console.error("createAnnouncement error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update announcement
export const updateAnnouncement = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, createdBy } = req.body;

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid announcement id" });

  try {
    const updated = await Announcement.findByIdAndUpdate(
      id,
      { $set: { title, description, createdBy } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Announcement not found" });
    return res.status(200).json({ message: "Announcement updated", announcement: updated });
  } catch (err) {
    console.error("updateAnnouncement error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid announcement id" });

  try {
    const removed = await Announcement.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Announcement not found" });
    return res.status(200).json({ message: "Announcement deleted" });
  } catch (err) {
    console.error("deleteAnnouncement error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
