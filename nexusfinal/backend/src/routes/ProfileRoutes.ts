import express from "express";
import {
  addProfile,
  getProfiles,
  getProfileById,
  getProfileByStudentID,
  getProfileByEmail, 
  updateProfile,
  deleteProfileById,
  searchProfilesByStudentID,
  searchProfilesByName,
  searchProfilesByDepartment,
  checkUniqueProfileFields,
  deleteProfileByEmail,
} from "../controllers/ProfileController";

const router = express.Router();

// ➕ Create new profile
router.post("/", addProfile);



// 🔍 Search by Student ID (partial)
router.get("/search/studentID", searchProfilesByStudentID); // <-- new route using query

// 📋 Get all profiles
router.get("/", getProfiles);

// 🔍 Search by name (must be before "/:id")
router.get("/search/name", searchProfilesByName);
//umique
router.post("/check-unique", checkUniqueProfileFields);

// 🔍 Search by department (must be before "/:id")
router.get("/search/department", searchProfilesByDepartment);

// 🔍 Get profile by email
router.get("/by-email", getProfileByEmail); // <-- new route
router.delete("/email/:email", deleteProfileByEmail);
router.delete("/student/:id", deleteProfileById);

// 🔍 Get profile by Student ID
router.get("/student/:id", getProfileByStudentID);



// 🔍 Get profile by MongoDB ID
router.get("/:id", getProfileById);

// ✏️ Update profile using studentID (no MongoDB ID needed)
router.put("/", updateProfile);

// ❌ Delete profile by MongoDB ID
router.delete("/:id", deleteProfileById);

export default router;
