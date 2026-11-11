import React from 'react';
import { 
  LayoutDashboard, User, Map, FileText, Users, Award, 
  Sparkles, TrendingUp, Bell, Settings, ShieldAlert, LogOut, Briefcase 
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: 'student' | 'admin';
  userPlan: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, userRole, userPlan, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map },
    { id: 'resumes', label: 'Resume Builder', icon: FileText },
    { id: 'networking', label: 'Networking', icon: Users },
    { id: 'skills', label: 'Skills & Certifications', icon: Award },
    { id: 'mentorship', label: 'Premium Mentorship', icon: Sparkles },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (userRole === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none shrink-0">
      {/* App Branding */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide text-slate-100">Smart Resume</h1>
          <p className="text-[11px] text-teal-400 font-medium">Desktop Suite 2.0</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Plan Badge & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="mb-3 px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Plan</p>
            <p className="text-xs font-bold text-teal-300">{userPlan}</p>
          </div>
          <Sparkles className="w-4 h-4 text-teal-400" />
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Secure Logout</span>
        </button>
      </div>
    </aside>
  );
};
