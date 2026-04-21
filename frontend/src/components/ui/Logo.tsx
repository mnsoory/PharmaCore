import { Pill } from "lucide-react";

const Logo = () => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-9 h-9 bg-[#0a2e2f] rounded-full flex items-center justify-center">
      <Pill size={20} className="text-[#adf58e]" strokeWidth={2.5} />
    </div>
    <span className="text-2xl font-bold font-logo tracking-tighter text-slate-800">
      Pharmacore
    </span>
  </div>
);

export default Logo;