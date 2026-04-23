import React, { useState } from 'react';
import { Bell, ChevronDown, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { authService } from '../../../services/authService';
import { useNotificationStore } from '../../../store/useNotificationStore';

const UserActions: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hasUnread = useNotificationStore(state => state.hasUnread);
  const logout = authService.logout;

  return (
    <div className="flex items-center gap-4">
      <button className="relative p-2.5 rounded-full bg-white shadow-small text-slate-600
                         hover:text-blue-600 hover:shadow-inner-white transition-all duration-300">
        <Bell className="w-5 h-5" />
        {hasUnread && (<span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>)}
      </button>

      <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-medium
                         shadow-small hover:shadow-inner-white transition-all duration-300">
        <span className="text-sm">EN</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      <button className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold
                         shadow-emerald-lg hover:bg-emerald-700 transition-colors">
        Team Das...
      </button>

      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 p-1 rounded-full bg-slate-100 shadow-small
                     hover:shadow-inner-white transition-all duration-300"
        >
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-slate-500"/>
            </div>
          )}
          
          <div className="flex flex-col text-left pr-3">
            <span className="text-sm font-semibold text-slate-900">{user?.fullName || "Budiono Siregar"}</span>
            <span className="text-xs text-slate-500 -mt-0.5">{user?.email || "budionosiregar@gm..."}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-48 rounded-2xl bg-white shadow-lg border border-slate-100 p-2 z-50 animate-fade-in">
            <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              Profile
            </button>
            
            <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              Settings
            </button>
            
            <div className="h-px bg-slate-100 my-2"/>
            
            <button 
                onClick={() => {logout(); clearAuth(); setIsDropdownOpen(false);}}
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActions;