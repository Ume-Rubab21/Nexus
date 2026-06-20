import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,  
  deleteStudent,
} from "../controllers/StudentControllers";

const router = express.Router();

router.post("/", addStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent); 
router.delete("/:id", deleteStudent);

export default router;
