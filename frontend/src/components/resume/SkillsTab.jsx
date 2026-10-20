const SkillsTab = ({ strengths = [], missingSkills = [] }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Found Skills</h3>
        <div className="flex flex-wrap gap-3">
          {strengths.length > 0 ? strengths.map((skill, i) => (
            <span key={i} className="rounded-full bg-blue-100 px-4 py-2 text-blue-700 text-sm font-medium">{skill}</span>
          )) : <p className="text-slate-500">No skills detected.</p>}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Missing Skills</h3>
        <div className="flex flex-wrap gap-3">
          {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
            <span key={i} className="rounded-full bg-red-100 px-4 py-2 text-red-700 text-sm font-medium">{skill}</span>
          )) : <p className="text-slate-500">No missing skills.</p>}
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;
