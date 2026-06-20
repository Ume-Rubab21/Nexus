import express from "express";
import {
  getAllSocieties,
  getSocietyById,
  createSociety,
  updateSociety,
  deleteSociety,
} from "../controllers/SocietyController";

const router = express.Router();

router.get("/", getAllSocieties);
router.get("/:id", getSocietyById);
router.post("/", createSociety);
router.put("/:id", updateSociety);
router.delete("/:id", deleteSociety);

export default router;
