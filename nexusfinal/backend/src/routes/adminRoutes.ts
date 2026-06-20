import express from "express";
import {
  adminLogin,
  adminLogout,
  postAnnouncement,
  addSociety,
  updateSociety,
  deleteSociety,
  getAllUsers,
  deleteUser,
  moderateContent,
} from "../controllers/AdminController";

const router = express.Router();

// Authentication
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

// Announcements
router.post("/announcement", postAnnouncement);

// Societies Management
router.post("/societies", addSociety);
router.put("/societies/:id", updateSociety);
router.delete("/societies/:id", deleteSociety);

// Users Management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Moderate content
router.post("/moderate", moderateContent);

export default router;
