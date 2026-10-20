import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import UploadBox from "../../components/resume/UploadBox";
import ATSScoreCard from "../../components/resume/ATSScoreCard";
import SkillsCard from "../../components/resume/SkillsCard";
import SuggestionsCard from "../../components/resume/SuggestionsCard";
import AnalysisTabs from "../../components/resume/AnalysisTabs";
import { uploadResume } from "../../services/resumeServices";
import { FileText, RotateCcw } from "lucide-react";

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResumeUpload = async (file) => {
    try {
      setResumeFile(file);
      setLoading(true);
      setError("");
      const data = await uploadResume(file);
      setAnalysis(data.resume);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setAnalysis(null);
    setError("");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resume Analyzer</h1>
          <p className="text-sm text-slate-500">Upload your resume for AI-powered ATS analysis.</p>
        </div>
        {resumeFile && (
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            <RotateCcw size={16} /> New Analysis
          </button>
        )}
      </div>

      {!resumeFile ? (
        <UploadBox onFileSelect={handleResumeUpload} />
      ) : (
        <div className="space-y-6">
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                <p className="font-medium text-slate-900">Analyzing your resume...</p>
                <p className="text-sm text-slate-500 mt-1">AI is checking ATS compatibility</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">{error}</div>
          )}

          {analysis && (
            <>
              {/* File info */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                <FileText size={20} className="text-indigo-600" />
                <span className="text-sm font-medium text-slate-900">{resumeFile.name}</span>
                <span className="text-xs text-slate-400">{(resumeFile.size / 1024).toFixed(0)} KB</span>
              </div>

              <div className="grid xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <AnalysisTabs
                    summary={analysis.summary}
                    strengths={analysis.strengths}
                    weaknesses={analysis.weaknesses}
                    missingSkills={analysis.missingSkills}
                    suggestions={analysis.suggestions}
                  />
                  <SuggestionsCard suggestions={analysis.suggestions} />
                </div>
                <div className="space-y-6">
                  <ATSScoreCard score={analysis.atsScore} />
                  <SkillsCard missingSkills={analysis.missingSkills} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;
