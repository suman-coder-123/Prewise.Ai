import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const skills = [
  { name: "React", level: 95, color: "bg-indigo-600" },
  { name: "Node.js", level: 82, color: "bg-emerald-500" },
  { name: "TypeScript", level: 88, color: "bg-violet-500" },
  { name: "Python", level: 70, color: "bg-cyan-500" },
  { name: "SQL", level: 65, color: "bg-amber-500" },
];

const ResumePreview = () => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Resume Analysis</h3>
          <p className="text-sm text-slate-400 mt-1">AI-powered ATS scoring</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
          <span className="text-2xl font-extrabold text-emerald-600">92</span>
          <span className="text-xs font-medium text-emerald-600">/100</span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="h-2.5 rounded-full bg-slate-100">
          <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: "92%" }}></div>
        </div>
      </div>

      {/* Skills */}
      <h4 className="text-sm font-semibold text-slate-700 mb-3">Detected Skills</h4>
      <div className="space-y-3 mb-6">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 w-20 shrink-0">{skill.name}</span>
            <div className="flex-1 h-2 rounded-full bg-slate-100">
              <div className={`h-2 rounded-full ${skill.color}`} style={{ width: `${skill.level}%` }}></div>
            </div>
            <span className="text-xs font-bold text-slate-700 w-8 text-right">{skill.level}%</span>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Top Suggestions</h4>
        <div className="space-y-2">
          {[
            "Add quantifiable achievements with metrics",
            "Include more industry-specific keywords",
            "Strengthen the professional summary section",
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
