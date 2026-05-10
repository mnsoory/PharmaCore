import React from "react";
import { Search, Mic } from "lucide-react";

const SearchBar: React.FC = () => (
  <button className="relative hidden h-9 w-55 md:w-75 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-100 sm:flex dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
    <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    <span className="flex-1 text-left">Search for products...</span>
    <Mic size={16}/>
  </button>
);

export default SearchBar;