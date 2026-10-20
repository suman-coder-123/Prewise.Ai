import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMyResumes } from "../../services/resumeServices";
import { getMyInterviews } from "../../services/interviewServices";
import { getMyJobs } from "../../services/jobServices";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

const Analytics = () => {
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

  const resumeChartData = resumes.slice(0, 8).map((r, i) => ({
    name: `#${i + 1}`,
    score: r.atsScore,
  }));

  const jobStatusData = [
    { name: "Applied", value: jobs.filter((j) => j.status === "applied").length },
    { name: "Interview", value: jobs.filter((j) => j.status === "interview").length },
    { name: "Offer", value: jobs.filter((j) => j.status === "offer").length },
    { name: "Rejected", value: jobs.filter((j) => j.status === "rejected").length },
  ].filter((d) => d.value > 0);

  const interviewData = completedInterviews.map((i) => ({
    name: i.role.length > 12 ? i.role.substring(0, 12) + "..." : i.role,
    score: i.score,
  }));

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm">Track your preparation progress.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Resumes", value: resumes.length, color: "bg-indigo-50 text-indigo-600" },
          { label: "Avg ATS Score", value: `${avgScore}%`, color: "bg-emerald-50 text-emerald-600" },
          { label: "Interviews", value: completedInterviews.length, color: "bg-cyan-50 text-cyan-600" },
          { label: "Jobs Applied", value: jobs.length, color: "bg-orange-50 text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resume Scores */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Resume ATS Scores</h3>
          {resumeChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumeChartData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 100]} fontSize={12} />
                  <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
                  <Bar dataKey="score" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              Upload resumes to see scores
            </div>
          )}
        </div>

        {/* Interview Scores */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Interview Scores</h3>
          {interviewData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interviewData}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 100]} fontSize={12} />
                  <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
                  <Bar dataKey="score" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              Complete interviews to see scores
            </div>
          )}
        </div>

        {/* Job Status Pie */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Job Applications</h3>
          {jobStatusData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={jobStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {jobStatusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {jobStatusData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-600">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              Add jobs to see distribution
            </div>
          )}
        </div>

        {/* Top Skills Found */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Strengths from Resumes</h3>
          {resumes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {[...new Set(resumes.flatMap((r) => r.strengths || []))].slice(0, 20).map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
              No data yet
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
