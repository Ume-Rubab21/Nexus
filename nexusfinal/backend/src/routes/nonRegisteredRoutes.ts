import express from "express";
import { registerStudent, getPublicAnnouncements, getAllSocieties } from "../controllers/NonRegisteredController";

const router = express.Router();

// POST /api/nonRegistered/registerStudent
router.post("/registerStudent", registerStudent);

// GET /api/nonRegistered/announcements
router.get("/announcements", getPublicAnnouncements);

// GET /api/nonRegistered/societies
router.get("/societies", getAllSocieties);

export default router;
