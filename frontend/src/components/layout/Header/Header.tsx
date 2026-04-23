import React from "react";
import Logo from "../../ui/Logo";
import SearchBar from "./SearchBar";
import UserActions from "./UserActions";
import { useAuthStore } from "../../../store/useAuthStore";

const Header: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="w-full h-min bg-gray-200/30 backdrop-blur-md border-b border-slate-100 px-8 py-6 rounded-t-[2.5rem]">
      <div className="max-w-480 mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Logo />
          <SearchBar />
        </div>

        <UserActions />
      </div>

      <div className="mt-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome {user?.fullName}!
        </h2>
      </div>
    </header>
  );
};

export default Header;
