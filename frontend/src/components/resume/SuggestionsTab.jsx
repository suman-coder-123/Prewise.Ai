const SuggestionsTab = ({ suggestions = [] }) => {
  return (
    <div className="space-y-4">
      {suggestions.length > 0 ? suggestions.map((item, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold">Suggestion {i + 1}</h3>
          <p className="mt-2 text-slate-600">{item}</p>
        </div>
      )) : (
        <p className="text-slate-500">No suggestions available.</p>
      )}
    </div>
  );
};

export default SuggestionsTab;
