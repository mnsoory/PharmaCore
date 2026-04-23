import React from 'react';
import { Search, Mic } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="relative flex-1 max-w-96 mx-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      
      <input
        type="text"
        placeholder="Search for products or categories..."
        className="w-full h-12 pl-12 pr-12 rounded-full bg-slate-50 border border-slate-100 shadow-inner
                   placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100
                   transition-all duration-300"
      />
      
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
        <Mic className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar;