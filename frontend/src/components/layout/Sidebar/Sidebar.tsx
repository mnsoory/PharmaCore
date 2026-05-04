import React from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import NavSection from "./NavSection";
import CollapseButton from "./CollapseButton";
import menuItems from "./menuItems";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { X } from "lucide-react";

const SidebarContent: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <>
    <SidebarHeader />
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
    >
      {menuItems.map((section, i) => (
        <React.Fragment key={section.group}>
          {!collapsed && i === menuItems.length - 1 && (
            <div className="my-2 border-t border-sidebar-border" />
          )}
          <NavSection section={section} collapsed={collapsed} />
        </React.Fragment>
      ))}
    </nav>
    <SidebarFooter />
  </>
);

const Sidebar: React.FC = () => {
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebarStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed ltr:left-0 rtl:right-0 top-0 z-40 hidden h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out lg:flex ${
          collapsed ? "w-20" : "w-65"
        }`}
      >
        <SidebarContent collapsed={collapsed} />
        <CollapseButton collapsed={collapsed} onClick={toggle} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed ltr:left-0 rtl:right-0 top-0 z-50 flex h-screen w-65 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
        }`}
      >
        <button
          aria-label="Close menu"
          onClick={closeMobile}
          className="absolute top-4 ltr:right-4 rtl:left-4 flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <SidebarContent collapsed={false} />
      </aside>
    </>
  );
};

export default Sidebar;