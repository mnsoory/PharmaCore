import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="w-full max-w-344 min-h-[90vh] bg-page-bg rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden relative">
      <Header className="bg-blue-300/20" />
      <div className="flex flex-1 min-h-0"> 
        
        <aside className="w-54 h-full border-r bg-blue-300/20 border-slate-100  backdrop-blur-sm shrink-0">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-8 bg-page-bg/50">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;