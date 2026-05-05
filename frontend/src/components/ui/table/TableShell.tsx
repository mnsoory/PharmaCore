import React from "react";

const TableShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full">{children}</table>
  </div>
);

export default TableShell;