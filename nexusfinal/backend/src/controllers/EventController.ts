import { Request, Response } from "express";
import { Event } from "../models/Event";

// 🎯 Get all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events ❌", error });
  }
};

// 🎯 Get event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found ❌" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event ❌", error });
  }
};

// ➕ Create a new event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, venue, society } = req.body;
    if (!title || !description || !date || !venue || !society)
      return res.status(400).json({ message: "All fields are required ❌" });

    const newEvent = new Event({ title, description, date, venue, society });
    await newEvent.save();
    res.status(201).json({ message: "Event created ✅", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event ❌", error });
  }
};

// ✏️ Update event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found ❌" });
    res.status(200).json({ message: "Event updated ✅", event });
  } catch (error) {
    res.status(500).json({ message: "Error updating event ❌", error });
  }
};

// 🗑️ Delete event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found ❌" });
    res.status(200).json({ message: "Event deleted 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event ❌", error });
  }
};
