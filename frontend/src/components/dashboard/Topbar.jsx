import { useAuth } from "../../context/AuthContext";

const Topbar = ({ children }) => {
  const { user } = useAuth();
  const initial = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {children}
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"}, {user?.fullName?.split(" ")[0] || "User"}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          {initial}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
