import React from "react";
import Footer from "../components/ui/Footer";
import LoginCard from "../components/auth/LoginCard";

const LoginPage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl h-full mx-auto bg-page-bg md:rounded-[2.5rem] shadow-sm border border-white/50 flex flex-col font-sans text-slate-900 overflow-hidden">
      <LoginCard />
      <Footer paddingY="py-2" />
    </div>
  );
};

export default LoginPage;
