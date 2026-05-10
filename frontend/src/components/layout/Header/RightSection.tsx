import React from "react";
import ThemeToggle from "./ThemeToggle";
import NotificationsButton from "./NotificationsButton";
import LanguageSelector from "./LanguageSelector";
import UserMenu from "./UserMenu";

const RightSection: React.FC = () => (
  <div className="flex items-center gap-3 md:gap-6">
    <ThemeToggle />
    <NotificationsButton />
    <LanguageSelector />
    <div className="mx-2 h-6 w-px bg-slate-200 dark:bg-slate-700" />
    <UserMenu />
  </div>
);

export default RightSection;