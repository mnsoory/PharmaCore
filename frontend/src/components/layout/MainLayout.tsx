import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
//import Sidebar from './Sidebar/Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="w-full max-w-7xl min-h-[90vh] bg-page-bg rounded-[2.5rem] shadow-2xl border border-white/50 flex relative">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 h-full border-r border-slate-100 bg-white/20 backdrop-blur-sm">
          {/* <Sidebar /> */}
          <div className="p-4 text-slate-400 text-sm italic text-center mt-10">
            Sidebar space
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 bg-page-bg">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
