import { useState } from "react";
import OverviewTab from "./OverviewTab";
import SkillsTab from "./SkillsTab";
import SuggestionsTab from "./SuggestionsTab";

const tabs = ["Overview", "Skills", "Suggestions"];

const AnalysisTabs = ({ summary = "", strengths = [], weaknesses = [], missingSkills = [], suggestions = [] }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderContent = () => {
    switch (activeTab) {
      case "Overview": return <OverviewTab summary={summary} strengths={strengths} weaknesses={weaknesses} />;
      case "Skills": return <SkillsTab strengths={strengths} missingSkills={missingSkills} />;
      case "Suggestions": return <SuggestionsTab suggestions={suggestions} />;
      default: return <OverviewTab summary={summary} strengths={strengths} weaknesses={weaknesses} />;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-2">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
                activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">{renderContent()}</div>
    </div>
  );
};

export default AnalysisTabs;
