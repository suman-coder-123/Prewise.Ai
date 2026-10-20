import express from "express";
import { getCurrentUser, LoginUser, registerUser, updatePreferences } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route is working",
  });
});

router.post("/register" , registerUser);
router.post ("/login" , LoginUser);

router.get("/me" , authMiddleware , getCurrentUser);
router.put("/preferences" , authMiddleware , updatePreferences);

export default router ;