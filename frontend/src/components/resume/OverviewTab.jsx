const OverviewTab = ({ summary = "", strengths = [], weaknesses = [] }) => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-indigo-50 p-5">
        <h3 className="font-semibold">Overall Summary</h3>
        <p className="mt-2 text-slate-600">{summary || "No summary available."}</p>
      </div>
      <div className="rounded-2xl bg-green-50 p-5">
        <h3 className="font-semibold">Strengths</h3>
        <ul className="mt-3 space-y-2 text-slate-600">
          {strengths.length > 0 ? strengths.map((s, i) => (
            <li key={i}>{s}</li>
          )) : <li>No strengths identified.</li>}
        </ul>
      </div>
      <div className="rounded-2xl bg-orange-50 p-5">
        <h3 className="font-semibold">Weaknesses</h3>
        <ul className="mt-3 space-y-2 text-slate-600">
          {weaknesses.length > 0 ? weaknesses.map((w, i) => (
            <li key={i}>{w}</li>
          )) : <li>No weaknesses identified.</li>}
        </ul>
      </div>
    </div>
  );
};

export default OverviewTab;
