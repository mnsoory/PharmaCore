import React from "react";
import { NavLink } from "react-router-dom";
import menuItems from "./menuItems";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-54 h-full py-6 flex flex-col gap-8 select-none">
      {menuItems.map((group, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <h3 className="px-8 text-[10px] font-bold text-slate-700 tracking-widest uppercase">
            {group.group}
          </h3>

          <nav className="flex flex-col gap-1 px-2">
            {group.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-2 py-0.5 rounded-2xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-slate-100 shadow-[inset_2px_2px_12px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`
                      p-2 rounded-xl transition-all
                      ${
                        isActive
                          ? "bg-slate-100 shadow-sm text-slate-900"
                          : "bg-transparent group-hover:bg-white/50"
                      }
                    `}
                    >
                      <item.icon size={12} strokeWidth={isActive ? 2 : 2} />
                    </div>
                    <span
                      className={`text-sm font-semibold ${isActive ? "opacity-100" : "opacity-70"}`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
