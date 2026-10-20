import Job from "../models/Job.js";
import User from "../models/User.js";
import { searchJobs, matchJobToPreferences, getJobInsights } from "../services/jobSearch.service.js";

export const createJob = async (req, res) => {
  try {
    const { company, role, status, location, salary, notes, url } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: "Company and role are required" });
    }

    const job = await Job.create({
      user: req.user.id,
      company,
      role,
      status,
      location,
      salary,
      notes,
      url,
    });

    return res.status(201).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { returnDocument: "after" }
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    return res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchExternalJobs = async (req, res) => {
  try {
    const { query, location } = req.query;
    const user = await User.findById(req.user.id).select("preferences skills resume");
    const preferences = user?.preferences || {};

    const userProfile = {
      skills: user?.skills || [],
      preferredCities: preferences.preferredCity ? [preferences.preferredCity] : ["Bangalore", "Mumbai", "Delhi", "Hyderabad"],
      workType: preferences.workType || "any",
      experience: preferences.experience || null,
      currentRole: preferences.currentRole || null,
      targetRole: query || null,
    };

    const jobs = await searchJobs(query || "", location || "", userProfile);
    const matched = jobs.map((job) => ({
      ...job,
      matchStatus: matchJobToPreferences(job, preferences),
    }));

    return res.status(200).json({ success: true, count: matched.length, jobs: matched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getIndianJobInsights = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    const insights = await getJobInsights(query);
    return res.status(200).json({ success: true, insights });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
