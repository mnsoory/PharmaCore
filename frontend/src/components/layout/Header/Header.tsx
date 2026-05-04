import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { Menu } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const { toggleMobile } = useSidebarStore();
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="sticky top-0 z-30">
      <header className="flex h-14 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-xl sm:px-5 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {/* زر الموبايل */}
          <button
            aria-label="Open menu"
            onClick={toggleMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <LeftSection />
        </div>
        <RightSection />
      </header>

      {isDashboard && (
        <div className="border-b border-slate-100 bg-white/60 backdrop-blur-md px-6 py-2.5 dark:bg-slate-900/60 dark:border-slate-800">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Welcome back,{" "}
          <span className="font-normal text-slate-500 dark:text-slate-400">
            {user?.fullName ?? "there"}
          </span>{" "}
          👋
        </p>
      </div>
      )}
    </div>
  );
};

export default Header;
