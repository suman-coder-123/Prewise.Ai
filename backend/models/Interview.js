import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  feedback: { type: String, default: "" },
  score: { type: Number, default: 0 },
}, { _id: false });

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  skills: [{
    type: String,
  }],
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  questions: [questionSchema],
  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  score: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
