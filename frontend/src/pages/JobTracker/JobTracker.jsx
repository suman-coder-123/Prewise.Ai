import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { createJob, getMyJobs, updateJob, deleteJob } from "../../services/jobServices";
import { Plus, Trash2, X, Search, ExternalLink, MapPin, Globe, Sparkles, TrendingUp, Star } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const COLUMNS = [
  { key: "applied", label: "Applied", color: "border-l-blue-500" },
  { key: "interview", label: "Interview", color: "border-l-yellow-500" },
  { key: "offer", label: "Offer", color: "border-l-emerald-500" },
  { key: "rejected", label: "Rejected", color: "border-l-red-500" },
];

const MATCH_STYLES = {
  match: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Great Match" },
  partial: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", label: "Partial Match" },
  mismatch: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Far from Preference" },
  unknown: { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", label: "" },
};

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", location: "", salary: "", notes: "", status: "applied" });

  // Find Jobs tab
  const [tab, setTab] = useState("tracker");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState(null);

  // Smart Suggestions tab
  const [smartJobs, setSmartJobs] = useState([]);
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartSkills, setSmartSkills] = useState([]);
  const [smartRoles, setSmartRoles] = useState([]);
  const [smartFetched, setSmartFetched] = useState(false);

  useEffect(() => {
    getMyJobs().then((d) => { if (d.success) setJobs(d.jobs); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fetchSmartSuggestions = async () => {
    try {
      setSmartLoading(true);
      setSmartFetched(false);
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://prewise-ai-dn78.vercel.app/api/resume/suggestions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Smart suggestions response:", data);
      if (data.success) {
        setSmartJobs(data.jobs || []);
        setSmartSkills(data.userSkills || []);
        setSmartRoles(data.suggestedRoles || []);
        setSmartFetched(true);
        if (data.jobs?.length === 0) {
          toast("No jobs found for your skills. Try searching manually.", { icon: "🔍" });
        }
      }
    } catch (err) {
      console.error("Smart suggestions error:", err);
      toast.error("Failed to load suggestions");
    } finally {
      setSmartLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "smart" && !smartFetched) {
      fetchSmartSuggestions();
    }
  }, [tab, smartFetched]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = await createJob(form);
      if (data.success) {
        setJobs((prev) => [data.job, ...prev]);
        setForm({ company: "", role: "", location: "", salary: "", notes: "", status: "applied" });
        setShowForm(false);
        toast.success("Job added!");
      }
    } catch (err) {
      toast.error("Failed to add job");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const data = await updateJob(id, { status });
      if (data.success) setJobs((prev) => prev.map((j) => (j._id === id ? data.job : j)));
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Deleted");
    } catch {}
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setSearching(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://prewise-ai-dn78.vercel.app/api/jobs/search", {
        params: { query: searchQuery, location: searchLocation },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setSearchResults(data.jobs);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleAddFromSearch = async (job) => {
    try {
      setAddingId(job.title + job.company);
      const data = await createJob({
        company: job.company,
        role: job.title,
        location: job.location,
        salary: job.salary || "",
        notes: `Source: ${job.source}`,
        url: job.url || "",
        status: "applied",
      });
      if (data.success) {
        setJobs((prev) => [data.job, ...prev]);
        toast.success("Added to tracker!");
      }
    } catch (err) {
      toast.error("Failed to add");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Tracker</h1>
          <p className="text-sm text-slate-500">{jobs.length} application{jobs.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="bg-slate-100 rounded-xl p-1 flex">
            <button onClick={() => setTab("tracker")} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === "tracker" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              My Jobs
            </button>
            <button onClick={() => setTab("find")} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === "find" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              Find Jobs
            </button>
            <button onClick={() => setTab("smart")} className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${tab === "smart" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              <Sparkles size={14} className="text-amber-500" />
              For You
            </button>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition">
            <Plus size={16} /> Add Job
          </button>
        </div>
      </div>

      {/* Add Job Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Add Job</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Company *" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required className="px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-600" />
                <input type="text" placeholder="Role *" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required className="px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-600" />
                <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-600" />
                <input type="text" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none">
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <input type="text" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-600" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition">Add</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FIND JOBS TAB */}
      {tab === "find" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-sm text-slate-900 mb-4">Search Jobs — LinkedIn, Indeed, Remotive & More</h3>
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title or keyword..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Location (optional)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button type="submit" disabled={searching} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50 whitespace-nowrap">
                {searching ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">{searchResults.length} real jobs found</p>
              {searchResults.map((job, i) => {
                const match = MATCH_STYLES[job.matchStatus] || MATCH_STYLES.unknown;
                const sourceColors = {
                  linkedin: "bg-blue-50 text-blue-700 border-blue-200",
                  remotive: "bg-violet-50 text-violet-700 border-violet-200",
                  arbeitnow: "bg-orange-50 text-orange-700 border-orange-200",
                };
                const sourceLabels = {
                  linkedin: "LinkedIn/Remote",
                  remotive: "Remotive",
                  arbeitnow: "Arbeitnow",
                };
                return (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-sm transition">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Globe size={18} className="text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sourceColors[job.source] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                            {sourceLabels[job.source] || job.source}
                          </span>
                          {job.matchStatus && job.matchStatus !== "unknown" && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${match.bg} ${match.text} border ${match.border} whitespace-nowrap`}>
                              {match.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{job.company} &middot; {job.location}</p>
                        {job.salary && <p className="text-xs text-emerald-600 font-medium mt-1">{job.salary}</p>}
                        {job.description && (
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{job.description.slice(0, 150)}...</p>
                        )}
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.tags.slice(0, 6).map((tag) => (
                              <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        {job.url && (
                          <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 transition" title="Open job posting">
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleAddFromSearch(job)}
                          disabled={addingId === job.title + job.company}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                        >
                          {addingId === job.title + job.company ? "Adding..." : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!searching && searchResults.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Search size={40} className="mx-auto text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-900">Search for jobs</h3>
              <p className="text-sm text-slate-500 mt-1">Find jobs from LinkedIn, Remotive & more, then add them to your tracker.</p>
            </div>
          )}
        </div>
      )}

      {/* SMART SUGGESTIONS TAB */}
      {tab === "smart" && (
        <div className="space-y-6">
          {smartSkills.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">Your Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {smartSkills.slice(0, 12).map((skill, i) => (
                  <span key={i} className="text-xs bg-white text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 font-medium">
                    {skill}
                  </span>
                ))}
                {smartSkills.length > 12 && (
                  <span className="text-xs text-slate-500">+{smartSkills.length - 12} more</span>
                )}
              </div>
              {smartRoles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-100">
                  <p className="text-xs text-slate-500 mb-2">Suggested roles based on your resume:</p>
                  <div className="flex flex-wrap gap-2">
                    {smartRoles.map((role, i) => (
                      <span key={i} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {smartLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-sm text-slate-500">AI is finding the best jobs for you...</p>
            </div>
          ) : smartJobs.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  <span className="font-bold text-slate-900">{smartJobs.length}</span> personalized matches found
                </p>
                <button onClick={fetchSmartSuggestions} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {smartJobs.map((job, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                        {job.aiMatch?.score ? (
                          <span className="text-white font-bold text-sm">{job.aiMatch.score}%</span>
                        ) : (
                          <Star size={20} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                          {job.aiMatch?.indiaFit && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              job.aiMatch.indiaFit === "excellent" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              job.aiMatch.indiaFit === "good" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              "bg-slate-50 text-slate-500 border border-slate-200"
                            }`}>
                              🇮🇳 {job.aiMatch.indiaFit}
                            </span>
                          )}
                          {job.aiMatch?.careerGrowth && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              job.aiMatch.careerGrowth === "high" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              "bg-slate-50 text-slate-500 border border-slate-200"
                            }`}>
                              <TrendingUp size={10} className="inline mr-0.5" />
                              {job.aiMatch.careerGrowth}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{job.company} &middot; {job.location}</p>
                        {job.salary && <p className="text-xs text-emerald-600 font-medium mt-1">{job.salary}</p>}
                        {job.aiMatch?.reason && (
                          <p className="text-xs text-indigo-600 mt-1.5 italic">"{job.aiMatch.reason}"</p>
                        )}
                        {job.description && (
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{job.description.slice(0, 150)}...</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        {job.url && (
                          <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 transition" title="Open job posting">
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleAddFromSearch(job)}
                          disabled={addingId === job.title + job.company}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                        >
                          {addingId === job.title + job.company ? "Adding..." : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : smartFetched ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Sparkles size={40} className="mx-auto text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-900">No jobs found</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">
                {smartSkills.length > 0
                  ? `We searched for jobs matching your skills but couldn't find any right now.`
                  : "Upload your resume first to get personalized job recommendations."}
              </p>
              <button
                onClick={fetchSmartSuggestions}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition"
              >
                Try Again
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* TRACKER TAB */}
      {tab === "tracker" && (
        <>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {COLUMNS.map((col) => {
                const colJobs = jobs.filter((j) => j.status === col.key);
                return (
                  <div key={col.key} className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${col.color} p-4`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm text-slate-900">{col.label}</h3>
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{colJobs.length}</span>
                    </div>
                    <div className="space-y-3">
                      {colJobs.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No jobs</p>
                      ) : (
                        colJobs.map((job) => (
                          <div key={job._id} className="bg-slate-50 rounded-xl p-3">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{job.company}</p>
                                <p className="text-xs text-slate-500 truncate">{job.role}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                {job.url && (
                                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition p-1">
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                                <button onClick={() => handleDelete(job._id)} className="text-slate-400 hover:text-red-500 p-1">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            {job.location && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {job.location}</p>}
                            <div className="mt-2">
                              <select value={job.status} onChange={(e) => handleStatusChange(job._id, e.target.value)} className="text-xs px-2 py-1 rounded-lg border border-slate-200 outline-none bg-white">
                                {COLUMNS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default JobTracker;
