import Card from "../ui/Card";

const SkillsCard = ({ missingSkills = [] }) => {
  return (
    <Card className="p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Missing Skills</h2>
        <p className="mt-1 text-sm text-slate-500">Skills not found in your resume</p>
      </div>
      <div className="mt-6">
        {missingSkills.length === 0 ? (
          <p className="text-slate-500">No missing skills detected.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-red-100 text-red-700 px-4 py-2 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SkillsCard;
