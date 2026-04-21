import React from "react";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/ui/Footer";
import dashboardImg from "../assets/dashboard-preview.png";
import Logo from "../components/ui/Logo";
import {
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  HelpCircle,
  Mail,
} from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const FeaturesContent = (className: string) => (
    <div className={`${className} flex flex-col gap-3`}>
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-lg space-y-3">
        <div className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer">
          <HelpCircle size={18} className="text-slate-400" />
          <span className="text-xs font-medium">Technical Support</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer">
          <Mail size={18} className="text-slate-400" />
          <span className="text-xs font-medium">Contact Admin</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#adf58e] p-4 rounded-2xl flex flex-col items-center gap-2 border border-white shadow-sm transition-transform duration-300 ease-in-out hover:translate-y-2 cursor-pointer">
          <LayoutDashboard size={14} className="text-slate-900" />
          <span className="text-[10px] font-bold text-center text-slate-900">
            Inventory
          </span>
        </div>
        <div className="bg-[#8fe1d5] p-4 rounded-2xl flex flex-col items-center gap-2 border border-white shadow-sm transition-transform duration-300 ease-in-out hover:translate-y-2 cursor-pointer">
          <BarChart3 size={14} className="text-slate-900" />
          <span className="text-[10px] font-bold text-center text-slate-900">
            Analytics
          </span>
        </div>
        <div className="bg-[#f2afb6] p-4 rounded-2xl flex flex-col items-center gap-2 border border-white shadow-sm transition-transform duration-300 ease-in-out hover:translate-y-2 cursor-pointer">
          <ShieldCheck size={14} className="text-slate-900" />
          <span className="text-[10px] font-bold text-center text-slate-900">
            Security
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl h-full bg-page-bg rounded-none md:rounded-[2.5rem] shadow-sm border border-white/50 flex flex-col overflow-hidden relative font-sans text-slate-900">
      <header className="p-4 pb-2 flex justify-between items-center shrink-0">
        <Logo/>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="text-center mb-4 shrink-0">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight text-slate-800">
            Modern Pharmacy Management
          </h1>
          <p className="text-[14px] text-slate-600 max-w-xl pb-2 mx-auto">
            A complete, secure, data-driven solution for managing sales, stock,
            and suppliers.
          </p>
        </div>

        <div className="relative w-full max-w-sm mb-6 shrink-0">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-100 border border-slate-50 aspect-4/3 flex items-center justify-center">
            <img
              src={dashboardImg}
              alt="Preview"
              className="w-full h-auto object-contain opacity-90"
            />
          </div>

          {FeaturesContent(
            "hidden lg:flex absolute right-[-26vw] xl:right-[-22vw] top-1/2 -translate-y-1/2 w-64",
          )}
        </div>

        <div 
        onClick={() => navigate('/login')}
        className="flex flex-col items-center gap-4 w-full max-w-sm shrink-0 mb-4">
          <button className="w-full bg-[#0a2e2f] text-white py-3 rounded-full text-lg font-semibold shadow-md hover:brightness-110 transition-all active:scale-95">
            Enter System
          </button>

          <div className="flex items-center gap-4 w-full text-slate-300">
            <div className="h-0.5 bg-[#bbd] flex-1"></div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600">
              or
            </span>
            <div className="h-0.5 bg-[#bbd] flex-1"></div>
          </div>

          {FeaturesContent("flex lg:hidden mt-2 scale-90 w-96")}
        </div>
      </main>

      <Footer paddingY="p-3" />
    </div>
  );
};

export default LandingPage;
