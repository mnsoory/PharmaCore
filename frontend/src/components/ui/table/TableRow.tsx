import React from "react";

const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="group border-b border-border/40 last:border-0 transition-all duration-150 hover:bg-sidebar-primary/5">
    {children}
  </tr>
);

export default TableRow;