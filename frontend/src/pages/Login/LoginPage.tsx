import React from "react";
import Footer from "../../components/ui/Footer";
import LoginCard from "./components/LoginCard";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-muted/30">
      <LoginCard />
      <Footer paddingY="py-3" />
    </div>
  );
};

export default LoginPage;
