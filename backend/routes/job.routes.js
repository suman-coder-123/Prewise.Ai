import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  searchExternalJobs,
  getIndianJobInsights,
} from "../controllers/job.controller.js";

const router = express.Router();

router.get("/search", authMiddleware, searchExternalJobs);
router.get("/insights", authMiddleware, getIndianJobInsights);
router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getMyJobs);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

export default router;
