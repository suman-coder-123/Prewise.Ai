import Interview from "../models/Interview.js";
import { generateInterviewQuestions, evaluateAnswer } from "../services/gemini.service.js";

export const generateInterview = async (req, res) => {
  try {
    const { role, skills, difficulty, numberOfQuestions } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const count = numberOfQuestions || 5;

    const parsed = await generateInterviewQuestions(role, skills || [], difficulty || "medium", count);

    const interview = await Interview.create({
      user: req.user.id,
      role,
      skills: skills || [],
      difficulty: difficulty || "medium",
      questions: parsed.questions.map((q) => ({ question: q.question })),
    });

    return res.status(201).json({ success: true, interview });
  } catch (error) {
    console.error("Generate Interview Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    return res.status(200).json({ success: true, interview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      return res.status(400).json({ success: false, message: "Invalid question index" });
    }

    interview.questions[questionIndex].answer = answer;

    const evaluation = await evaluateAnswer(interview.questions[questionIndex].question, answer);

    interview.questions[questionIndex].feedback = evaluation.feedback;
    interview.questions[questionIndex].score = evaluation.score || 0;

    if (questionIndex === interview.questions.length - 1) {
      interview.status = "completed";
      const scored = interview.questions.filter((q) => q.score > 0);
      const total = scored.reduce((sum, q) => sum + q.score, 0);
      interview.score = scored.length > 0 ? Math.round((total / (scored.length * 10)) * 100) : 0;
    }

    await interview.save();

    return res.status(200).json({
      success: true,
      evaluation: { score: evaluation.score, feedback: evaluation.feedback },
      interview,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }
    return res.status(200).json({ success: true, message: "Interview deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
