import React, { useEffect, useState } from 'react';
import { 
  Sparkles, Map, FileText, Users, Award, TrendingUp, 
  ArrowRight, CheckCircle2, Clock, Briefcase, ChevronRight 
} from 'lucide-react';
import { User, StudentProfile, CareerRoadmap, Announcement } from '../types';

interface DashboardViewProps {
  user: User;
  profile: StudentProfile | null;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, profile, onNavigate }) => {
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/roadmap/${user.id}`).then(res => res.json()),
      fetch(`/api/notifications/${user.id}`).then(res => res.json())
    ]).then(([roadmapsData, notifsData]) => {
      setRoadmaps(roadmapsData || []);
      setAnnouncements(notifsData.announcements || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user.id]);

  const latestRoadmap = roadmaps[0];

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900/40 via-slate-900 to-indigo-950/60 border border-teal-500/30 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Companion Active</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {profile?.full_name || user.name}!
          </h1>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            Your current career goal is <span className="text-teal-400 font-bold">{profile?.career_goal || 'Software Engineer'}</span>. 
            Explore your AI roadmap, build industry-ready resumes, or connect with expert mentors.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-500/20 transition flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              <span>View Career Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('resumes')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Smart Resume Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Map className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg">AI Ready</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{latestRoadmap ? 'Active' : 'Pending'}</p>
          <p className="text-xs text-slate-400">Personalized Career Roadmap</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">Builder</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">ATS Ready</p>
          <p className="text-xs text-slate-400">Multiple Professional Templates</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">Network</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">Global</p>
          <p className="text-xs text-slate-400">Peer Collaboration Active</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">Mentorship</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">Expert 1-1</p>
          <p className="text-xs text-slate-400">Certified Industry Mentors</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roadmap Preview / Prompt */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Career Roadmap Summary</h3>
              <p className="text-xs text-slate-400">Tailored specifically to your profile and ambitions</p>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <span>View Full Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {latestRoadmap ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Career Overview</p>
                <p className="text-xs text-slate-300 leading-relaxed">{latestRoadmap.overview}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Target Goal</p>
                  <p className="text-sm font-bold text-white">{latestRoadmap.career_goal}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Progress Status</p>
                  <p className="text-sm font-bold text-white">In Progress (Stage 1)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
              <Map className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">No Career Roadmap Generated Yet</h4>
              <p className="text-xs text-slate-400 mb-4">Generate your AI personalized career roadmap instantly.</p>
              <button
                onClick={() => onNavigate('roadmap')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow transition"
              >
                Generate Roadmap Now
              </button>
            </div>
          )}
        </div>

        {/* Announcements & Quick Shortcuts */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
            <h3 className="text-sm font-bold text-white mb-4">Platform Announcements</h3>
            <div className="space-y-3">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-xs font-bold text-teal-300 mb-1">{ann.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No recent announcements.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
            <h3 className="text-sm font-bold text-white mb-4">Quick Shortcuts</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('resumes')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition text-xs font-medium text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Create New Resume</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => onNavigate('networking')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition text-xs font-medium text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Discover Peers</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => onNavigate('mentorship')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition text-xs font-medium text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Book Mentor Session</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
