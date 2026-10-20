import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMyResumes } from "../../services/resumeServices";
import { getMyInterviews } from "../../services/interviewServices";
import { getMyJobs } from "../../services/jobServices";
import { FileText, Brain, Briefcase, TrendingUp, ArrowRight, Upload, Sparkles } from "lucide-react";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, i, j] = await Promise.allSettled([
          getMyResumes(),
          getMyInterviews(),
          getMyJobs(),
        ]);
        if (r.status === "fulfilled") setResumes(r.value.resumes || []);
        if (i.status === "fulfilled") setInterviews(i.value.interviews || []);
        if (j.status === "fulfilled") setJobs(j.value.jobs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completedInterviews = interviews.filter((i) => i.status === "completed");
  const avgScore = resumes.length
    ? Math.round(resumes.reduce((a, r) => a + (r.atsScore || 0), 0) / resumes.length)
    : 0;
  const jobsApplied = jobs.length;

  const stats = [
    { label: "Resumes Analyzed", value: resumes.length, icon: FileText, color: "bg-indigo-50 text-indigo-600" },
    { label: "Avg ATS Score", value: `${avgScore}%`, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
    { label: "Interviews Done", value: completedInterviews.length, icon: Brain, color: "bg-cyan-50 text-cyan-600" },
    { label: "Jobs Applied", value: jobsApplied, icon: Briefcase, color: "bg-orange-50 text-orange-600" },
  ];

  const quickActions = [
    { title: "Upload Resume", desc: "Get AI-powered ATS analysis", icon: Upload, to: "/resume-analyzer", color: "bg-indigo-600" },
    { title: "Start Interview", desc: "Practice with AI questions", icon: Brain, to: "/interview", color: "bg-emerald-600" },
    { title: "Track Jobs", desc: "Organize your applications", icon: Briefcase, to: "/job-tracker", color: "bg-orange-600" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.to}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition group"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h4 className="mt-4 font-bold text-slate-900 group-hover:text-indigo-600 transition">{action.title}</h4>
                <p className="mt-1 text-sm text-slate-500">{action.desc}</p>
                <ArrowRight size={16} className="mt-3 text-indigo-600 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Items */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        {/* Recent Resumes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Recent Resumes</h3>
            <Link to="/resume" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</Link>
          </div>
          {resumes.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <FileText size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No resumes yet. Upload your first one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 4).map((r) => (
                <div key={r._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={18} className="text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{r.originalFileName}</p>
                      <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ml-3 ${r.atsScore >= 70 ? "text-emerald-600" : r.atsScore >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                    {r.atsScore}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Interviews */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Recent Interviews</h3>
            <Link to="/interview" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</Link>
          </div>
          {interviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Brain size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No interviews yet. Start practicing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.slice(0, 4).map((i) => (
                <div key={i._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <Brain size={18} className="text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{i.role}</p>
                      <p className="text-xs text-slate-500">{i.questions.length} questions</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ml-3 ${i.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {i.status === "completed" ? `${i.score}%` : "In Progress"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
