import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import jobRoutes from "./routes/job.routes.js";

const app = express();

// Behind Vercel's proxy.
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "https://prewise-ai.vercel.app",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Connect lazily on the first request and reuse the cached connection.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Prewise API is running",
  });
});

// JSON 404 for unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Central error handler (Multer errors included) so the frontend always
// receives JSON with a readable message.
app.use((err, req, res, next) => {
  console.error("[API] error:", err.message);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File is too large. Maximum size is 4 MB.",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE" || err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      message: "Unexpected file upload.",
    });
  }

  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

export default app;
