import { Download, CheckCircle2, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import AnimatedCounter from "../ui/AnimatedCounter";

const ATSScoreCard = ({ score = 0 }) => {
  const getLabel = (s) => {
    if (s >= 80) return "Excellent Resume";
    if (s >= 60) return "Good Resume";
    if (s >= 40) return "Needs Improvement";
    return "Poor Resume";
  };

  const getColor = (s) => {
    if (s >= 80) return "text-green-600";
    if (s >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="p-6 sticky top-6">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">ATS Score</p>
        <h2 className="mt-5 text-6xl font-black text-indigo-600">
          <AnimatedCounter value={score} suffix="%" />
        </h2>
        <p className={`mt-3 font-semibold ${getColor(score)}`}>{getLabel(score)}</p>
      </div>
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-slate-500">Resume Strength</span>
          <span className="font-semibold">{score}%</span>
        </div>
        <ProgressBar progress={score} />
      </div>
    </Card>
  );
};

export default ATSScoreCard;
