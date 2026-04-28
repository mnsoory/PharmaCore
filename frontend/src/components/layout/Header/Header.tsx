import React from "react";
import Logo from "../../ui/Logo";
import SearchBar from "./SearchBar";
import UserActions from "./UserActions";
import { useAuthStore } from "../../../store/useAuthStore";

interface HeaderProps {
    className?:string;
}
const Header: React.FC<HeaderProps> =({className})  => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className={`z-50 w-full h-min backdrop-blur-md border-slate-100 px-8 py-6 rounded-t-[2.5rem] ${className}`}>
      <div className="max-w-480 mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Logo />
          <SearchBar />
        </div>

        <UserActions />
      </div>

      <div className="mt-6">
        <h2 className="text-3xl font-bold text-slate-900 ml-54 tracking-tight">
          Welcome {user?.fullName}!
        </h2>
      </div>
    </header>
  );
};

export default Header;
