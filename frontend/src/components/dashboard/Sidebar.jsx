import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, BrainCircuit, Briefcase, BarChart3, LogOut, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, title: "Dashboard", to: "/dashboard" },
  { icon: FileText, title: "Resume Analyzer", to: "/resume-analyzer" },
  { icon: BrainCircuit, title: "AI Interview", to: "/interview" },
  { icon: Briefcase, title: "Job Tracker", to: "/job-tracker" },
  { icon: BarChart3, title: "Analytics", to: "/analytics" },
  { icon: Settings, title: "Preferences", to: "/settings" },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} h-screen bg-slate-900 text-white flex flex-col fixed top-0 left-0 transition-all duration-300 z-40`}>
      <div className={`px-6 py-6 border-b border-slate-800 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg">PreWise</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 mt-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition text-sm font-medium ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
