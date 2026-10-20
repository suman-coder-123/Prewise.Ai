const stats = [
  { value: "10K+", label: "Developers" },
  { value: "25K+", label: "Interviews Practice" },
  { value: "96%", label: "Success Rate" },
];

const HeroStats = () => {
  return (
    <div className="flex items-center gap-0 mt-10 divide-x divide-slate-200">
      {stats.map((stat, i) => (
        <div key={i} className={`px-6 ${i === 0 ? "pl-0" : ""}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stat.value}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;
