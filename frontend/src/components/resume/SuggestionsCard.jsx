import { Sparkles } from "lucide-react";
import Card from "../ui/Card";

const SuggestionsCard = ({ suggestions = [] }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
          <Sparkles className="text-violet-600" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Suggestions</h2>
          <p className="text-sm text-slate-500">Personalized improvements</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {suggestions.length === 0 ? (
          <p className="text-slate-500">No suggestions available.</p>
        ) : (
          suggestions.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-300"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Tip {index + 1}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default SuggestionsCard;
