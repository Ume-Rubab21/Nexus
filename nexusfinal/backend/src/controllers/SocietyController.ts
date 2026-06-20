import { Request, Response } from "express";
import { Society } from "../models/Society";

// Get all societies
export const getAllSocieties = async (req: Request, res: Response) => {
  try {
    const societies = await Society.find().sort({ createdAt: -1 });
    return res.status(200).json(societies);
  } catch (err) {
    console.error("getAllSocieties error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get society by id (Mongo ObjectId)
export const getSocietyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const society = await Society.findById(id);
    if (!society) return res.status(404).json({ message: "Society not found" });
    return res.status(200).json(society);
  } catch (err) {
    console.error("getSocietyById error:", err);
    return res.status(400).json({ message: "Invalid society id" });
  }
};

// Create new society
export const createSociety = async (req: Request, res: Response) => {
  const { name, description, president } = req.body;
  if (!name || !description || !president)
    return res.status(400).json({ message: "Please provide name, description and president" });

  try {
    const newSociety = new Society({ name, description, president });
    await newSociety.save();
    return res.status(201).json({ message: "Society created", society: newSociety });
  } catch (err) {
    console.error("createSociety error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update society
export const updateSociety = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, president } = req.body;

  try {
    const updated = await Society.findByIdAndUpdate(
      id,
      { $set: { name, description, president } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Society not found" });
    return res.status(200).json({ message: "Society updated", society: updated });
  } catch (err) {
    console.error("updateSociety error:", err);
    return res.status(400).json({ message: "Invalid society id or validation error" });
  }
};

// Delete society
export const deleteSociety = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const removed = await Society.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Society not found" });
    return res.status(200).json({ message: "Society deleted" });
  } catch (err) {
    console.error("deleteSociety error:", err);
    return res.status(400).json({ message: "Invalid society id" });
  }
};
