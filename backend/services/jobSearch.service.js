import axios from "axios";
import { matchJobsWithAI, getIndianJobInsights } from "./gemini.service.js";

const generateApplyLink = (title, company) => {
  const query = encodeURIComponent(`${title} ${company} apply job`);
  return `https://www.google.com/search?q=${query}`;
};

const fetchJobsPipe = async (query = "", location = "") => {
  try {
    const body = { limit: 25 };
    if (query) {
      body.job_title_or = [query];
    }
    if (location) {
      body.location = [location];
    }

    const { data } = await axios.post(
      "https://api.jobspipe.dev/v1/sandbox/jobs/search",
      body,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      }
    );

    const jobs = data?.data || data?.jobs || [];
    if (!jobs || jobs.length === 0) return [];

    return jobs.map((job) => ({
      source: "linkedin",
      title: job.job_title || "",
      company: job.company || job.employer_name || "",
      location: job.location || "Remote",
      url: (job.final_url && !job.final_url.includes("example.com"))
        ? job.final_url
        : generateApplyLink(job.job_title, job.company || job.employer_name),
      tags: job.technology_slugs ? job.technology_slugs.split(" ") : (job.job_employment_type ? [job.job_employment_type] : []),
      salary: job.min_annual_salary_usd
        ? `$${job.min_annual_salary_usd} - $${job.max_annual_salary_usd}`
        : job.salary || "",
      date: job.date_posted || "",
      remote: job.remote === true || (job.location || "").toLowerCase().includes("remote"),
      description: "",
    }));
  } catch (error) {
    console.error("[JobsPipe]", error.response?.status, error.message);
    return [];
  }
};

const fetchRemotive = async (query = "") => {
  try {
    const { data } = await axios.get("https://remotive.com/api/remote-jobs", {
      timeout: 15000,
    });
    if (!data || !data.jobs) return [];

    let jobs = data.jobs.map((job) => ({
      source: "remotive",
      title: job.title || "",
      company: job.company_name || "",
      location: job.candidate_required_location || "Remote",
      url: job.apply_url || job.url || generateApplyLink(job.title, job.company_name),
      tags: job.tags || [],
      salary: job.salary || "",
      date: job.publication_date || "",
      remote: true,
      description: (job.description || "").replace(/<[^>]*>/g, "").slice(0, 250),
    }));

    if (query) {
      const q = query.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return jobs;
  } catch (error) {
    console.error("[Remotive]", error.message);
    return [];
  }
};

const fetchArbeitnow = async (query = "") => {
  try {
    const { data } = await axios.get("https://www.arbeitnow.com/api/job-board-api", {
      timeout: 15000,
    });
    if (!data || !data.data) return [];

    let jobs = data.data.map((job) => ({
      source: "arbeitnow",
      title: job.title,
      company: job.company_name,
      location: job.location || "Not specified",
      url: job.url || job.apply_url || "#",
      tags: job.tags || [],
      salary: job.salary || "",
      date: job.created_at,
      remote: job.remote || false,
      description: "",
    }));

    if (query) {
      const q = query.toLowerCase();
      jobs = jobs.filter(
        (j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
      );
    }

    return jobs;
  } catch (error) {
    console.error("[Arbeitnow]", error.message);
    return [];
  }
};

const fetchJSearchIndia = async (query = "", location = "") => {
  try {
    const searchTag = query
      ? query.toLowerCase().split(" ")[0]
      : "developer";

    const { data } = await axios.get(
      "https://jobicy.com/api/v2/remote-jobs",
      {
        params: {
          tag: searchTag,
          count: 25,
        },
        timeout: 15000,
      }
    );

    if (!data || !data.jobs) return [];

    return data.jobs
      .filter((job) => {
        const geo = (job.jobGeo || "").toLowerCase();
        const company = (job.companyName || "").toLowerCase();
        return (
          geo.includes("india") ||
          geo.includes("asia") ||
          geo.includes("worldwide") ||
          geo.includes("remote") ||
          company.includes("india")
        );
      })
      .map((job) => ({
        source: "linkedin",
        title: job.jobTitle || "",
        company: job.companyName || "",
        location: job.jobGeo || "Remote - India",
        url: generateApplyLink(job.jobTitle, job.companyName),
        tags: job.jobTags || [],
        salary: job.annualSalaryMin
          ? `${job.annualSalaryMin} - ${job.annualSalaryMax || ""} ${job.annualSalaryCurrency || "USD"}`
          : "",
        date: job.pubDate || "",
        remote: true,
        description: (job.jobDescription || "").replace(/<[^>]*>/g, "").slice(0, 250),
      }));
  } catch (error) {
    console.error("[Jobicy India]", error.response?.status, error.message);
    return [];
  }
};

const fetchHimalayasIndia = async (query = "") => {
  try {
    const params = {
      limit: 25,
      country: "India",
    };
    if (query) {
      params.search = query;
    }

    const { data } = await axios.get(
      "https://himalayas.app/jobs/api",
      {
        params,
        timeout: 15000,
      }
    );

    if (!data || !data.jobs) return [];

    return data.jobs.map((job) => ({
      source: "linkedin",
      title: job.title || "",
      company: job.companyName || "",
      location: job.locationRestrictions?.[0] || "India",
      url: job.applicationLink || (job.companySlug ? `https://himalayas.app/companies/${job.companySlug}` : "#"),
      tags: job.categories || [],
      salary: job.minSalary
        ? `${job.minSalary} - ${job.maxSalary || ""} ${job.currency || "USD"}`
        : "",
      date: job.pubDate ? new Date(job.pubDate * 1000).toISOString() : "",
      remote: true,
      description: (job.description || "").replace(/<[^>]*>/g, "").slice(0, 250),
      jobType: "startup",
    }));
  } catch (error) {
    console.error("[Himalayas India]", error.response?.status, error.message);
    return [];
  }
};

const fetchIndianStartups = async (query = "") => {
  try {
    const searchTerms = query
      ? `${query} startup india`
      : "software developer startup india";

    const { data } = await axios.get(
      "https://himalayas.app/jobs/api",
      {
        params: {
          limit: 25,
          search: searchTerms,
        },
        timeout: 15000,
      }
    );

    if (!data || !data.jobs) return [];

    return data.jobs.map((job) => ({
      source: "linkedin",
      title: job.title || "",
      company: job.companyName || "",
      location: job.locationRestrictions?.[0] || "India",
      url: job.applicationLink || "#",
      tags: [...(job.categories || []), "startup"],
      salary: job.minSalary
        ? `${job.minSalary} - ${job.maxSalary || ""} ${job.currency || "USD"}`
        : "",
      date: job.pubDate ? new Date(job.pubDate * 1000).toISOString() : "",
      remote: true,
      description: (job.description || "").replace(/<[^>]*>/g, "").slice(0, 250),
      jobType: "startup",
    }));
  } catch (error) {
    console.error("[IndianStartups]", error.response?.status, error.message);
    return [];
  }
};

export const searchJobs = async (query = "", location = "", userProfile = null) => {
  const isIndiaSearch = !location || location.toLowerCase().includes("india");

  const sources = [
    fetchJobsPipe(query, location),
    fetchRemotive(query),
    fetchArbeitnow(query),
  ];

  if (isIndiaSearch) {
    sources.push(fetchJSearchIndia(query, location || "India"));
    sources.push(fetchHimalayasIndia(query));
    sources.push(fetchIndianStartups(query));
  }

  const results = await Promise.allSettled(sources);

  const all = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const seen = new Set();
  const unique = all.filter((job) => {
    const key = `${job.company}-${job.title}`.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let enriched = unique;

  if (userProfile && isIndiaSearch) {
    try {
      console.log(`[Jobs] Running AI matching for ${unique.length} jobs...`);
      enriched = await matchJobsWithAI(unique, userProfile);
      enriched.sort((a, b) => (b.aiMatch?.score || 0) - (a.aiMatch?.score || 0));
      console.log(`[Jobs] AI matching complete. Top score: ${enriched[0]?.aiMatch?.score || "N/A"}`);
    } catch (error) {
      console.error("[Jobs] AI matching failed, using location-based sort:", error.message);
    }
  }

  const indiaJobs = enriched.filter(
    (j) =>
      (j.location || "").toLowerCase().includes("india") ||
      (j.location || "").toLowerCase().includes("bangalore") ||
      (j.location || "").toLowerCase().includes("mumbai") ||
      (j.location || "").toLowerCase().includes("delhi") ||
      (j.location || "").toLowerCase().includes("hyderabad") ||
      (j.location || "").toLowerCase().includes("chennai") ||
      (j.location || "").toLowerCase().includes("pune") ||
      (j.location || "").toLowerCase().includes("kolkata")
  );

  const otherJobs = enriched.filter((j) => !indiaJobs.includes(j));

  const sorted = [...indiaJobs, ...otherJobs];

  const counts = results.map((r, i) => {
    const names = isIndiaSearch
      ? ["JobsPipe", "Remotive", "Arbeitnow", "Jobicy", "Himalayas", "IndianStartups"]
      : ["JobsPipe", "Remotive", "Arbeitnow"];
    return `${names[i]}: ${r.status === "fulfilled" ? r.value.length : 0}`;
  });
  console.log(`[Jobs] Total: ${unique.length}, India: ${indiaJobs.length}, AI: ${userProfile ? "Yes" : "No"} (${counts.join(", ")})`);

  return sorted.slice(0, 50);
};

export const getJobInsights = async (query) => {
  return await getIndianJobInsights(query);
};

export const matchJobToPreferences = (job, preferences) => {
  if (!preferences || !preferences.preferredCity) return "unknown";

  const city = preferences.preferredCity.toLowerCase();
  const workType = preferences.workType || "any";

  if (job.remote && workType === "remote") return "match";
  if (job.remote && workType === "any") return "match";
  if (job.location && job.location.toLowerCase().includes(city)) return "match";
  if (job.remote && workType === "hybrid") return "partial";
  if (job.location && !job.location.toLowerCase().includes(city)) {
    return preferences.willingToRelocate ? "partial" : "mismatch";
  }

  return "unknown";
};
