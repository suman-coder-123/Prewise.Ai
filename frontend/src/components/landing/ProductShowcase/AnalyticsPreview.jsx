import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { day: "Mon", score: 40, fill: "#818cf8" },
  { day: "Tue", score: 70, fill: "#818cf8" },
  { day: "Wed", score: 50, fill: "#818cf8" },
  { day: "Thu", score: 90, fill: "#6366f1" },
  { day: "Fri", score: 65, fill: "#818cf8" },
];

const stats = [
  { label: "Avg Score", value: "63%", change: "+12%" },
  { label: "Interviews", value: "18", change: "+5" },
  { label: "Streak", value: "7 days", change: "Best" },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg">
        {payload[0].value}%
      </div>
    );
  }
  return null;
};

const AnalyticsPreview = () => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900 mb-2">Performance Analytics</h3>
      <p className="text-sm text-slate-400 mb-6">Track your preparation progress</p>

      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{s.value}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPreview;
