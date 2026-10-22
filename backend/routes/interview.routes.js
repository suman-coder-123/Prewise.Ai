import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import validateId from "../middleware/validateId.middleware.js";
import {
  generateInterview,
  getMyInterviews,
  getInterviewById,
  submitAnswer,
  deleteInterview,
} from "../controllers/interview.controller.js";

const router = express.Router();
router.param("id", validateId);

router.post("/generate", authMiddleware, generateInterview);
router.get("/", authMiddleware, getMyInterviews);
router.get("/:id", authMiddleware, getInterviewById);
router.post("/:id/answer", authMiddleware, submitAnswer);
router.delete("/:id", authMiddleware, deleteInterview);

export default router;
