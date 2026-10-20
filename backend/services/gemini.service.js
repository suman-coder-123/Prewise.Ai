import axios from "axios";

const MODELS = [
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
  "gemini-3.5-flash",
];

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  let lastError;
  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      console.log(`[Gemini] Trying model: ${model}`);
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
      });
      console.log(`[Gemini] ${model} responded OK`);
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      const status = error.response?.status;
      console.log(`[Gemini] ${model} failed: ${status}`);
      lastError = error;
      if (status === 429) {
        console.log(`[Gemini] Rate limited, waiting 3s...`);
        await new Promise((r) => setTimeout(r, 3000));
      }
      if (status !== 404 && status !== 429 && status !== 503) throw error;
    }
  }
  throw lastError;
};

export const analyzeResume = async (resumeText) => {
  const prompt = `
You are an experienced ATS Resume Analyzer.
Analyze the following resume.
Return ONLY valid JSON with this structure:
{
  "atsScore": number,
  "summary": string,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}
Rules:
- Return only JSON, no markdown, no backticks.
- ATS score must be between 0 and 100.

Resume:
${resumeText}
`;

  const text = await callGemini(prompt);
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

export const generateInterviewQuestions = async (role, skills, difficulty, count) => {
  const prompt = `
You are an expert technical interviewer.
Generate ${count} interview questions for a "${role}" position.
${skills && skills.length ? `Focus on these skills: ${skills.join(", ")}.` : ""}
Difficulty: ${difficulty}.
Return ONLY valid JSON: { "questions": [{ "question": "string" }] }
Rules: Return only JSON, no markdown, no backticks.
`;

  const text = await callGemini(prompt);
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

export const evaluateAnswer = async (question, answer) => {
  const prompt = `
You are an interview evaluator. Rate this answer on a scale of 1-10 and provide brief feedback.
Question: ${question}
Answer: ${answer}
Return ONLY valid JSON: { "score": number, "feedback": "string" }
Rules: Return only JSON, no markdown, no backticks.
`;

  const text = await callGemini(prompt);
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

export const matchJobsWithAI = async (jobs, userProfile) => {
  if (!jobs || jobs.length === 0) return [];

  const jobsForAI = jobs.slice(0, 15).map((job, i) => ({
    id: i,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description || "",
    tags: job.tags || [],
    remote: job.remote,
  }));

  const prompt = `
You are an expert Indian job market advisor specializing in tech careers in India.

Given this user profile:
- Skills: ${userProfile.skills?.join(", ") || "Not specified"}
- Experience: ${userProfile.experience || "Not specified"} years
- Preferred cities: ${userProfile.preferredCities?.join(", ") || "Any city in India"}
- Work preference: ${userProfile.workType || "any"} (remote/hybrid/onsite)
- Current role: ${userProfile.currentRole || "Not specified"}
- Looking for: ${userProfile.targetRole || "Any role"}

Rank these jobs by relevance (best match first). Consider:
1. Skill match (most important)
2. Location preference (Indian cities preferred)
3. Work type preference
4. Career growth potential
5. Company reputation in India

Jobs to rank:
${JSON.stringify(jobsForAI, null, 2)}

Return ONLY valid JSON with this structure:
{
  "rankedJobs": [
    {
      "id": number,
      "matchScore": number (0-100),
      "reason": "brief reason for this score",
      "indiaFit": "excellent/good/fair/poor",
      "careerGrowth": "high/medium/low"
    }
  ]
}
Rules: Return only JSON, no markdown, no backticks. Rank all ${jobsForAI.length} jobs.`;

  try {
    const text = await callGemini(prompt);
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleaned);

    const ranked = result.rankedJobs || [];
    return jobs.slice(0, 15).map((job, i) => {
      const aiData = ranked.find((r) => r.id === i) || {};
      return {
        ...job,
        aiMatch: {
          score: aiData.matchScore || 50,
          reason: aiData.reason || "AI analysis pending",
          indiaFit: aiData.indiaFit || "good",
          careerGrowth: aiData.careerGrowth || "medium",
        },
      };
    });
  } catch (error) {
    console.error("[Gemini JobMatch]", error.message);
    return jobs.map((job) => ({
      ...job,
      aiMatch: { score: 50, reason: "AI analysis unavailable", indiaFit: "good", careerGrowth: "medium" },
    }));
  }
};

export const extractSkillsFromResume = async (resumeText) => {
  const prompt = `
You are an expert resume analyzer. Extract a comprehensive list of skills from this resume.

Focus on:
1. Technical skills (programming languages, frameworks, tools, databases)
2. Soft skills (leadership, communication, teamwork)
3. Domain skills (industry-specific knowledge)
4. Certifications if mentioned

Resume:
${resumeText}

Return ONLY valid JSON:
{
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "domainSkills": ["skill1", "skill2"],
  "allSkills": ["combined list of all skills"],
  "experienceLevel": "fresher/junior/mid/senior/lead",
  "suggestedRoles": ["role1", "role2", "role3"],
  "summary": "brief 2-line summary of candidate profile"
}
Rules:
- Return only JSON, no markdown, no backticks
- Extract at least 10-15 skills if present
- suggestedRoles should be realistic job titles this person can apply for`;

  try {
    const text = await callGemini(prompt);
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("[Gemini SkillExtract]", error.message);
    return null;
  }
};

export const getIndianJobInsights = async (query) => {
  const prompt = `
You are an expert on the Indian job market. Given this search: "${query}"

Provide brief insights about:
1. Top Indian cities for this role
2. Average salary range in India (INR)
3. Top companies hiring for this role in India
4. In-demand skills for this role in India

Return ONLY valid JSON:
{
  "topCities": ["city1", "city2"],
  "salaryRange": "₹X - ₹Y per annum",
  "topCompanies": ["company1", "company2"],
  "inDemandSkills": ["skill1", "skill2"]
}
Rules: Return only JSON, no markdown, no backticks.`;

  try {
    const text = await callGemini(prompt);
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("[Gemini Insights]", error.message);
    return null;
  }
};
