import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:ms-65 min-w-0">
        <Header />
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