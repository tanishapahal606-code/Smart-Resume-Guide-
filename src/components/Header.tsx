import React from 'react';
import { Bell, Sparkles, User as UserIcon, Shield, Search } from 'lucide-react';
import { User, StudentProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  user: User;
  profile: StudentProfile | null;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, profile, currentView, onNavigate }) => {
  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'profile': return 'Student Profile & Information';
      case 'roadmap': return 'Personalized AI Career Roadmap';
      case 'resumes': return 'Smart Resume Builder & ATS Checker';
      case 'networking': return 'Professional Networking & Connections';
      case 'skills': return 'Skills & Certifications Guide';
      case 'mentorship': return 'Premium Mentorship & 1-to-1 Sessions';
      case 'progress': return 'Career Progress & Milestone Tracker';
      case 'notifications': return 'Notifications & Announcements';
      case 'settings': return 'Account & Application Settings';
      case 'admin': return 'System Administration Panel';
      default: return 'Smart Resume Guide';
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 select-none">
      <div>
        <h2 className="text-base font-bold text-slate-100">{getTitle()}</h2>
        <p className="text-xs text-slate-400">Welcome back, {profile?.full_name || user.name}</p>
      </div>

      <div className="flex items-center gap-4">
        <PWAInstallButton />

        {user.plan === 'Free' && (
          <button
            onClick={() => onNavigate('mentorship')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-teal-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Upgrade to Premium</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition border border-slate-700/50"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
            {(profile?.full_name || user.name).charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-200">{profile?.full_name || user.name}</p>
            <p className="text-[10px] text-teal-400 font-medium capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
