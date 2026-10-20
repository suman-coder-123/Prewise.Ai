import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["applied", "interview", "offer", "rejected"],
    default: "applied",
  },
  location: {
    type: String,
    default: "",
  },
  salary: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
