import { Request, Response } from "express";
import mongoose from "mongoose";
import { Student } from "../models/studentModel";  // ✅ your schema

// 🧍 Register a new non-registered student
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // check if already exists
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // create and save
    const newStudent = new Student({
      name,
      email,
      password,
      role: "non-registered",
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully", student: newStudent });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering student", error });
  }
};

export const getPublicAnnouncements = async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: "Database not connected yet" });
    }

    const announcements = await db.collection("announcements").find().toArray();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcements", error });
  }
};

export const getAllSocieties = async (req: Request, res: Response) => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(500).json({ message: "Database not connected yet" });
    }

    const societies = await db.collection("societies").find().toArray();
    res.status(200).json(societies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching societies", error });
  }
};


