import React, { useState } from "react";
import Logo from "../ui/Logo";
import { Lock, Eye, EyeOff, Search, CheckCircle2 } from "lucide-react";

const LoginCard: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  return (
    <div className="flex grow items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-xl shadow-slate-200 border border-white relative overflow-hidden">
              <div className="flex flex-col items-center mb-8">
                <Logo/>
    
                <h1 className="text-2xl font-bold text-center mb-2 tracking-tight text-balance">
                  Welcome back to PharmaCore!
                </h1>
                <p className="text-slate-500 text-sm text-center">
                  Please log in to manage your pharmacy results.
                </p>
              </div>
    
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Username / Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0a2e2f] transition-colors">
                      <Search size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="budionosiregar@gma..."
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-[#f0f2f5] border border-slate-200 rounded-full py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2e2f]/10 focus:bg-white transition-all"
                    />
                  </div>
                </div>
    
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0a2e2f] transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full bg-[#f0f2f5] border border-slate-200 rounded-full py-3.5 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2e2f]/10 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
    
                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-[#0a2e2f] checked:border-[#0a2e2f] transition-all cursor-pointer"
                      />
                      <CheckCircle2
                        size={14}
                        className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-slate-900 hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </a>
                </div>
    
                <button className="w-full bg-[#0a2e2f] text-white py-4 rounded-full font-bold shadow-lg shadow-slate-200 hover:brightness-110 transition-all active:scale-[0.98] mt-2 cursor-pointer">
                  Sign In
                </button>
    
                <div className="text-center pt-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Don't have an account?{" "}
                    <a
                      href="#"
                      className="text-slate-900 font-bold hover:underline underline-offset-4 transition-colors"
                    >
                      Request Access.
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
  );
};

export default LoginCard;
