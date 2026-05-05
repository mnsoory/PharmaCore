import React from "react";

interface Props {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  hideBelow?: "sm" | "md" | "lg";
  className?: string;
}

const alignClass = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};
const hideClass = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

const TableCell: React.FC<Props> = ({
  children,
  align = "start",
  hideBelow,
  className = "",
}) => (
  <td
    className={`py-3 ${alignClass[align]} ${hideBelow ? hideClass[hideBelow] : ""} ${className}`}
  >
    {children}
  </td>
);

export default TableCell;
