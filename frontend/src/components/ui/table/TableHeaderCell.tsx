import React from "react";

interface Props {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  hideBelow?: "sm" | "md" | "lg";
}

const alignClass = { start: "text-start", center: "text-center", end: "text-end" };
const hideClass = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };

const TableHeaderCell: React.FC<Props> = ({ children, align = "start", hideBelow }) => (
  <th className={`pb-3 pt-1 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider ${alignClass[align]} ${hideBelow ? hideClass[hideBelow] : ""}`}>
    {children}
  </th>
);

export default TableHeaderCell;