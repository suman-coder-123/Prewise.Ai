import { extractTextFromPDF } from "../services/pdf.service.js";
import { analyzeResume, extractSkillsFromResume, matchJobsWithAI } from "../services/gemini.service.js";
import { searchJobs } from "../services/jobSearch.service.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a PDF file" });
    }

    console.log("[Resume] File received:", req.file.originalname, "Size:", req.file.size);

    let resumeText;
    try {
      resumeText = await extractTextFromPDF(req.file.buffer);
      console.log("[Resume] Extracted text length:", resumeText?.length);
    } catch (pdfError) {
      console.error("[Resume] PDF extraction failed:", pdfError.message);
      return res.status(400).json({ success: false, message: "Failed to extract text from PDF: " + pdfError.message });
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ success: false, message: "Could not extract text from PDF" });
    }

    let analysis;
    try {
      analysis = await analyzeResume(resumeText);
      console.log("[Resume] Analysis complete. Score:", analysis.atsScore);
    } catch (geminiError) {
      console.error("[Resume] Gemini analysis failed:", geminiError.message);
      console.error("[Resume] Full error:", geminiError);
      return res.status(500).json({ success: false, message: "AI analysis failed: " + geminiError.message });
    }

    let skillData = null;
    try {
      skillData = await extractSkillsFromResume(resumeText);
      console.log("[Resume] Skills extracted:", skillData?.allSkills?.length || 0, "skills");
    } catch (skillError) {
      console.error("[Resume] Skill extraction failed:", skillError.message);
    }

    if (skillData) {
      await User.findByIdAndUpdate(req.user.id, {
        skills: skillData.allSkills || [],
        experienceLevel: skillData.experienceLevel || "junior",
        suggestedRoles: skillData.suggestedRoles || [],
        profileSummary: skillData.summary || "",
      });
      console.log("[Resume] User profile updated with extracted skills");
    }

    const resume = await Resume.create({
      user: req.user.id,
      originalFileName: req.file.originalname,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      extractedSkills: skillData?.allSkills || [],
      experienceLevel: skillData?.experienceLevel || "",
      suggestedRoles: skillData?.suggestedRoles || [],
    });

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",
      resume,
      profileUpdated: !!skillData,
      extractedSkills: skillData?.allSkills || [],
      suggestedRoles: skillData?.suggestedRoles || [],
    });

  } catch (error) {
    console.error("[Resume] Unexpected error:", error.message, error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSmartSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const skills = user.skills || [];
    const suggestedRoles = user.suggestedRoles || [];
    const preferences = user.preferences || {};

    console.log("[SmartSuggest] User skills:", skills.length, "Roles:", suggestedRoles.length);

    if (skills.length === 0 && suggestedRoles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No skills found. Please upload your resume first.",
        jobs: [],
        skillBased: false,
      });
    }

    const searchQueries = [];

    if (suggestedRoles.length > 0) {
      searchQueries.push(...suggestedRoles.slice(0, 3));
    }

    if (skills.length > 0) {
      const topSkills = skills.slice(0, 5);
      topSkills.forEach((skill) => {
        if (!searchQueries.some((q) => q.toLowerCase().includes(skill.toLowerCase()))) {
          searchQueries.push(`${skill} developer India`);
        }
      });
    }

    if (searchQueries.length === 0) {
      searchQueries.push("software developer India");
    }

    console.log("[SmartSuggest] Searching for:", searchQueries);

    const searchPromises = searchQueries.map((query) =>
      searchJobs(query, "India").catch((err) => {
        console.error(`[SmartSuggest] Search failed for "${query}":`, err.message);
        return [];
      })
    );

    const searchResults = await Promise.all(searchPromises);
    let allJobs = searchResults.flat();

    console.log("[SmartSuggest] Total raw jobs:", allJobs.length);

    if (allJobs.length === 0) {
      console.log("[SmartSuggest] No results, trying fallback searches...");
      const fallbackQueries = ["software developer India", "web developer India", "IT jobs India"];
      const fallbackResults = await Promise.all(
        fallbackQueries.map((q) => searchJobs(q, "India").catch(() => []))
      );
      allJobs = fallbackResults.flat();
      console.log("[SmartSuggest] Fallback jobs:", allJobs.length);
    }

    const seen = new Set();
    const uniqueJobs = allJobs.filter((job) => {
      const key = `${job.company}-${job.title}`.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log("[SmartSuggest] Unique jobs:", uniqueJobs.length);

    const userProfile = {
      skills: skills,
      preferredCities: preferences.preferredCity
        ? [preferences.preferredCity]
        : ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"],
      workType: preferences.workType || "any",
      experience: user.experience || 0,
      currentRole: user.currentRole || "",
      targetRole: suggestedRoles[0] || "",
    };

    let rankedJobs = uniqueJobs;
    if (uniqueJobs.length > 0) {
      try {
        rankedJobs = await matchJobsWithAI(uniqueJobs, userProfile);
        rankedJobs.sort((a, b) => (b.aiMatch?.score || 0) - (a.aiMatch?.score || 0));
        console.log("[SmartSuggest] AI ranking complete. Top score:", rankedJobs[0]?.aiMatch?.score);
      } catch (error) {
        console.error("[SmartSuggest] AI ranking failed:", error.message);
      }
    }

    console.log(`[SmartSuggest] Final: ${rankedJobs.length} jobs for ${skills.length} skills`);

    return res.status(200).json({
      success: true,
      count: rankedJobs.length,
      jobs: rankedJobs.slice(0, 20),
      skillBased: true,
      userSkills: skills,
      suggestedRoles: suggestedRoles,
      experienceLevel: user.experienceLevel || "Not specified",
      searchQueries: searchQueries,
    });

  } catch (error) {
    console.error("[SmartSuggest] Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    return res.status(200).json({ success: true, message: "Resume deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    return res.status(200).json({ success: true, resume });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const debugUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(1);
    const latestResume = resumes[0] || null;

    return res.status(200).json({
      success: true,
      user: {
        skills: user.skills || [],
        suggestedRoles: user.suggestedRoles || [],
        experienceLevel: user.experienceLevel || "",
        profileSummary: user.profileSummary || "",
      },
      latestResume: latestResume ? {
        extractedSkills: latestResume.extractedSkills || [],
        suggestedRoles: latestResume.suggestedRoles || [],
        experienceLevel: latestResume.experienceLevel || "",
        atsScore: latestResume.atsScore,
      } : null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
