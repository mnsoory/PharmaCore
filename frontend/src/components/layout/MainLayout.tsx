import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "@/components/ui/Footer";
import { useSidebarStore } from "@/store/useSidebarStore";

const MainLayout: React.FC = () => {
  const { collapsed } = useSidebarStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className={`flex flex-1 flex-col min-w-0 transition-all duration-300 ${
        collapsed ? "lg:ms-20" : "lg:ms-65"
      }`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;