import express  from "express";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js"
import { getMyResume, getResumeById, uploadResume, deleteResume, getSmartSuggestions, debugUserProfile } from "../controllers/resume.controller.js";



const router = express.Router();

 router.get("/" , authMiddleware , getMyResume);
 router.get("/suggestions", authMiddleware, getSmartSuggestions);
 router.get("/debug", authMiddleware, debugUserProfile);

router.post("/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
 );


 router.get("/:id", authMiddleware , getResumeById);

 router.delete("/:id", authMiddleware, deleteResume);

 export default router;