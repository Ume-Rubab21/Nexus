import express from "express";
import { forgotPassword } from "../controllers/RegisteredController";

import {
  login,
  viewProfile,
  updateProfile,
  addFriend,
  removeFriend,
  searchFriends,
  getAnnouncements,
  getSocieties,
  viewFriendProfile,
} from "../controllers/RegisteredController";
import { getStudentByEmail } from "../controllers/RegisteredController";

const router = express.Router();

router.post("/login", login);
router.get("/student/:email", getStudentByEmail);
router.get("/:id/profile", viewProfile);
router.put("/:id/profile", updateProfile);
router.post("/:id/add-friend", addFriend);
router.post("/:id/remove-friend", removeFriend);
router.get("/search", searchFriends);
router.get("/announcements", getAnnouncements);
router.get("/societies", getSocieties);
router.get("/:friendId/friend-profile", viewFriendProfile);
router.post("/forgot-password", forgotPassword);

export default router;
