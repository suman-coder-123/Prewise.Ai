import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getPreferences, updatePreferences } from "../../services/userServices";
import { MapPin, Laptop, Building, MapPinned, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user: authUser, setUser } = useAuth();
  const [preferredCity, setPreferredCity] = useState("");
  const [workType, setWorkType] = useState("any");
  const [willingToRelocate, setWillingToRelocate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPreferences()
      .then((d) => {
        if (d.success && d.user.preferences) {
          setPreferredCity(d.user.preferences.preferredCity || "");
          setWorkType(d.user.preferences.workType || "any");
          setWillingToRelocate(d.user.preferences.willingToRelocate || false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = await updatePreferences({ preferredCity, workType, willingToRelocate });
      if (data.success) {
        setUser(data.user);
        toast.success("Preferences saved!");
      }
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const workTypes = [
    { value: "remote", label: "Remote", icon: Laptop, desc: "Work from anywhere" },
    { value: "hybrid", label: "Hybrid", icon: Building, desc: "Partial office" },
    { value: "onsite", label: "On-site", icon: MapPinned, desc: "Full office" },
    { value: "any", label: "Open to All", icon: MapPin, desc: "Any work type" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Location Preferences</h1>
        <p className="text-sm text-slate-500">Set your job search preferences for better matches.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          {/* City */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <MapPin size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Preferred City</h3>
                <p className="text-xs text-slate-500">Where would you like to work?</p>
              </div>
            </div>
            <input
              type="text"
              value={preferredCity}
              onChange={(e) => setPreferredCity(e.target.value)}
              placeholder="e.g. Bangalore, New York, London"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition"
            />
          </div>

          {/* Work Type */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Work Type Preference</h3>
            <div className="grid grid-cols-2 gap-3">
              {workTypes.map((wt) => (
                <button
                  key={wt.value}
                  onClick={() => setWorkType(wt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    workType === wt.value
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <wt.icon size={20} className={workType === wt.value ? "text-indigo-600" : "text-slate-400"} />
                  <p className={`mt-2 font-semibold text-sm ${workType === wt.value ? "text-indigo-600" : "text-slate-900"}`}>
                    {wt.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{wt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Relocate */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Willing to Relocate</h3>
                <p className="text-xs text-slate-500 mt-1">Open to jobs in other cities?</p>
              </div>
              <button
                onClick={() => setWillingToRelocate(!willingToRelocate)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  willingToRelocate ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    willingToRelocate ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
