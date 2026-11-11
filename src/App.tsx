import React, { useState, useEffect } from 'react';
import { User, StudentProfile } from './types';
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { ResumeBuilderView } from './components/ResumeBuilderView';
import { NetworkingView } from './components/NetworkingView';
import { SkillsCertsView } from './components/SkillsCertsView';
import { MentorshipView } from './components/MentorshipView';
import { ProgressView } from './components/ProgressView';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { Minus, Square, X, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const handleLogin = (loggedInUser: User, loggedInProfile: StudentProfile) => {
    setUser(loggedInUser);
    setProfile(loggedInProfile);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setProfile(null);
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Desktop Application Window Header Bar */}
      <div className="h-9 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-teal-500/80 cursor-pointer"></div>
          <span className="ml-3 text-xs font-medium text-slate-400">Smart Resume Guide — Professional Desktop Suite 2.0</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1 text-teal-400 font-semibold">
            <Shield className="w-3.5 h-3.5" /> Secure Session
          </span>
          <div className="flex items-center gap-3">
            <Minus className="w-3.5 h-3.5 hover:text-slate-200 cursor-pointer" />
            <Square className="w-3 h-3 hover:text-slate-200 cursor-pointer" />
            <X className="w-3.5 h-3.5 hover:text-red-400 cursor-pointer" onClick={handleLogout} />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 h-[calc(100vh-2.25rem)] overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          userRole={user.role}
          userPlan={user.plan}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          <Header
            user={user}
            profile={profile}
            currentView={currentView}
            onNavigate={setCurrentView}
          />

          <main className="flex-1 overflow-y-auto">
            {currentView === 'dashboard' && (
              <DashboardView user={user} profile={profile} onNavigate={setCurrentView} />
            )}
            {currentView === 'profile' && (
              <ProfileView user={user} profile={profile} onUpdateProfile={(updated) => setProfile(updated)} />
            )}
            {currentView === 'roadmap' && (
              <CareerRoadmapView user={user} profile={profile} />
            )}
            {currentView === 'resumes' && (
              <ResumeBuilderView user={user} profile={profile} />
            )}
            {currentView === 'networking' && (
              <NetworkingView user={user} profile={profile} />
            )}
            {currentView === 'skills' && (
              <SkillsCertsView user={user} />
            )}
            {currentView === 'mentorship' && (
              <MentorshipView user={user} onUpdatePlan={(plan) => setUser({ ...user, plan: plan as any })} />
            )}
            {currentView === 'progress' && (
              <ProgressView user={user} profile={profile} />
            )}
            {currentView === 'notifications' && (
              <NotificationsView user={user} />
            )}
            {currentView === 'settings' && (
              <SettingsView user={user} onLogout={handleLogout} />
            )}
            {currentView === 'admin' && (
              <AdminView user={user} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
