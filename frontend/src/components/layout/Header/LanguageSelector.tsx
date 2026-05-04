import React from "react";
import { ChevronDown } from "lucide-react";

const LanguageSelector: React.FC = () => (
  <button className="flex items-center gap-1 h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium transition-colors hover:bg-slate-100">
    EN
    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
  </button>
);

export default LanguageSelector;