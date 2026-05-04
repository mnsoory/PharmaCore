import React from "react";

const NavBadge: React.FC<{ count: number }> = ({ count }) => (
  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary/15 px-1.5 text-[10px] font-semibold text-sidebar-primary">
    {count}
  </span>
);

export default NavBadge;