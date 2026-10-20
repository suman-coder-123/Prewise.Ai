import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { generateInterview, getMyInterviews, submitAnswer, deleteInterview } from "../../services/interviewServices";
import { Trash2, ChevronRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const InterviewGenerator = () => {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQ, setNumQ] = useState(5);
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [active, setActive] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyInterviews().then((d) => { if (d.success) setInterviews(d.interviews); }).catch(() => {});
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!role.trim()) return;
    try {
      setLoading(true);
      setError("");
      const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const data = await generateInterview(role, skillList, difficulty, numQ);
      if (data.success) {
        setActive(data.interview);
        setCurrentQ(0);
        setAnswer("");
        setInterviews((prev) => [data.interview, ...prev]);
        toast.success("Interview generated!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    try {
      setSubmitting(true);
      const data = await submitAnswer(active._id, currentQ, answer);
      if (data.success) {
        setActive(data.interview);
        setAnswer("");
        if (currentQ < data.interview.questions.length - 1) {
          setCurrentQ((prev) => prev + 1);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInterview(id);
      setInterviews((prev) => prev.filter((i) => i._id !== id));
      if (active?._id === id) setActive(null);
    } catch {}
  };

  const q = active?.questions?.[currentQ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Interview</h1>
        <p className="text-sm text-slate-500">Generate and practice interview questions.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Generate Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-4">New Interview</h3>
            <form onSubmit={handleGenerate} className="space-y-3">
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (e.g. Frontend Developer)" required className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input type="number" min="1" max="20" value={numQ} onChange={(e) => setNumQ(Number(e.target.value))} className="px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none" />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50">
                {loading ? "Generating..." : "Generate"}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-3">History</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {interviews.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No interviews yet</p>
              ) : (
                interviews.map((i) => (
                  <div key={i._id} onClick={() => { setActive(i); setCurrentQ(0); setAnswer(""); }} className={`p-3 rounded-xl cursor-pointer border transition text-sm ${active?._id === i._id ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{i.role}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${i.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {i.status === "completed" ? `${i.score}%` : "Active"}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(i._id); }} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Interview */}
        <div className="lg:col-span-8">
          {active ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg text-slate-900">{active.role}</h2>
                  <p className="text-xs text-slate-500">{active.difficulty} &middot; {active.questions.length} questions</p>
                </div>
                <span className="text-xs text-slate-500">{currentQ + 1}/{active.questions.length}</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-slate-100 mb-6">
                <div className="h-1.5 rounded-full bg-indigo-600 transition-all" style={{ width: `${((currentQ + 1) / active.questions.length) * 100}%` }} />
              </div>

              {/* Question */}
              {q && (
                <>
                  <div className="bg-slate-50 rounded-xl p-5 mb-4">
                    <p className="text-sm font-medium text-slate-900">{q.question}</p>
                  </div>

                  {q.answer ? (
                    <div className="space-y-3">
                      <div className="bg-indigo-50 rounded-xl p-4">
                        <p className="text-xs font-medium text-indigo-600 mb-1">Your Answer</p>
                        <p className="text-sm text-slate-700">{q.answer}</p>
                      </div>
                      {q.feedback && (
                        <div className="bg-emerald-50 rounded-xl p-4">
                          <p className="text-xs font-medium text-emerald-600 mb-1">Feedback</p>
                          <p className="text-sm text-slate-700">{q.feedback}</p>
                        </div>
                      )}
                      {currentQ < active.questions.length - 1 && (
                        <button onClick={() => { setCurrentQ((prev) => prev + 1); setAnswer(""); }} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition">
                          Next Question <ChevronRight size={14} className="inline ml-1" />
                        </button>
                      )}
                      {currentQ === active.questions.length - 1 && active.status === "completed" && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                          <CheckCircle size={24} className="mx-auto text-emerald-600 mb-2" />
                          <p className="font-bold text-emerald-700">Interview Complete!</p>
                          <p className="text-sm text-slate-600 mt-1">Score: {active.score}%</p>
                        </div>
                      )}
                    </div>
                  ) : active.status === "completed" ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                      <p className="font-bold text-emerald-700">Interview Complete!</p>
                      <p className="text-sm text-slate-600 mt-1">Score: {active.score}%</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer..." rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-600 outline-none resize-none" />
                      <button onClick={handleSubmitAnswer} disabled={submitting || !answer.trim()} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
                        {submitting ? "Submitting..." : "Submit Answer"}
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Question list */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {active.questions.map((q, i) => (
                    <button key={i} onClick={() => { setCurrentQ(i); setAnswer(""); }} className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === currentQ ? "bg-indigo-600 text-white" : q.answer ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">&#127908;</span>
              </div>
              <h3 className="font-bold text-slate-900">Start an Interview</h3>
              <p className="text-sm text-slate-500 mt-1">Generate questions or pick one from history.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewGenerator;
