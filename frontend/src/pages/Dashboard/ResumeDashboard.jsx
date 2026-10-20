import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMyResumes, uploadResume, deleteResume } from "../../services/resumeServices";
import { FileText, UploadCloud, Trash2, ExternalLink, Clock } from "lucide-react";
import toast from "react-hot-toast";

const ResumeDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getMyResumes()
      .then((d) => { if (d.success) setResumes(d.resumes); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Only PDF files allowed"); return; }
    try {
      setUploading(true);
      const data = await uploadResume(file);
      if (data.success) {
        setResumes((prev) => [data.resume, ...prev]);
        toast.success("Resume analyzed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this resume?")) return;
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-sm text-slate-500">Manage your analyzed resumes.</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl cursor-pointer transition">
          <UploadCloud size={16} /> Upload
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {uploading && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          <span className="text-sm text-indigo-700 font-medium">Analyzing with AI...</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : resumes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText size={40} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-900">No resumes yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">Upload your first resume to get AI analysis.</p>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl cursor-pointer">
            <UploadCloud size={16} /> Upload Resume
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-sm transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{r.originalFileName}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  {r.summary && <span className="text-xs text-slate-400 truncate max-w-xs">{r.summary}</span>}
                </div>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full shrink-0 ${r.atsScore >= 70 ? "bg-emerald-50 text-emerald-600" : r.atsScore >= 50 ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"}`}>
                {r.atsScore}%
              </span>
              <button onClick={() => handleDelete(r._id)} className="p-2 text-slate-400 hover:text-red-500 transition shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ResumeDashboard;
