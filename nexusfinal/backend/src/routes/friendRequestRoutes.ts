import express from "express";
import {
  sendFriendRequestByEmail,   // ⬅️ use THIS instead
  respondToRequest,
  cancelFriendRequest,
  getFriendsList,
  removeFriend,
  getSentRequests,
  getReceivedRequests,
  getFriendsByEmail,
  checkFriendRequest ,
  getRelationship         // ⬅️ optional (to get friends by email)
} from "../controllers/FriendRequestController";

const router = express.Router();

// Send request using email
router.post("/send", sendFriendRequestByEmail);

// Get friends using email (optional)
router.get("/by-email/:email", getFriendsByEmail);

// View sent requests (old, still uses logged in user)
router.get("/sent", getSentRequests);

// View received requests (old, still uses logged in user)
router.get("/received", getReceivedRequests);

// Accept or reject request
router.post("/respond", respondToRequest);

// Cancel sent request
router.delete("/cancel/:requestId", cancelFriendRequest);

// Get friends list (old, based on session login)
router.get("/friends", getFriendsList);

// Remove friend
router.delete("/remove/:friendId/:myId", removeFriend);
router.get("/check", checkFriendRequest);
router.get("/relation", getRelationship);

export default router;
