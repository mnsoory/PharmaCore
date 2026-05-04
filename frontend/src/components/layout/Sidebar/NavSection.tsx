import React, { useState } from "react";
import SectionHeader from "./SectionHeader";
import NavItem from "./NavItem";
import { type NavGroup } from "./menuItems";

interface Props {
  section: NavGroup;
  collapsed: boolean;
}

const NavSection: React.FC<Props> = ({ section, collapsed }) => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {!collapsed && (
        <SectionHeader
          title={section.group}
          open={open}
          onToggle={() => setOpen((p) => !p)}
        />
      )}

      <div
        className={`grid transition-all duration-200 ease-in-out ${
          collapsed
            ? "grid-rows-[1fr] opacity-100"
            : open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-visible">
          <div className={`space-y-0.5 ${!collapsed ? "mt-1" : ""}`}>
            {section.items.map((item) => (
              <NavItem key={item.path} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavSection;