import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, CheckCircle2, Award, FileText, Users, 
  Map, Sparkles, CheckSquare 
} from 'lucide-react';
import { User, StudentProfile, CareerRoadmap, SkillCertItem, MentorSession } from '../types';
import { dbService } from '../services/db';

interface ProgressViewProps {
  user: User;
  profile: StudentProfile | null;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ user, profile }) => {
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [skillsCerts, setSkillsCerts] = useState<SkillCertItem[]>([]);
  const [sessions, setSessions] = useState<MentorSession[]>([]);

  useEffect(() => {
    setRoadmaps(dbService.getRoadmaps(user.id) || []);
    setSkillsCerts(dbService.getSkillsCerts(user.id) || []);
    setSessions(dbService.getMentorSessions(user.id) || []);
  }, [user.id]);

  const completedSkillsCerts = skillsCerts.filter(i => i.status === 'completed');

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Career Progress Dashboard</span>
          </div>
          <h2 className="text-xl font-bold text-white">Track Your Professional Journey</h2>
          <p className="text-xs text-slate-400">Visual statistics, completed milestones, and skills acquired.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-3">
            <Map className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-bold text-teal-400">Roadmap</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{roadmaps.length > 0 ? '100%' : '0%'}</p>
          <p className="text-xs text-slate-400">Career Masterplan Generated</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-3">
            <Award className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400">Skills & Certs</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{completedSkillsCerts.length}</p>
          <p className="text-xs text-slate-400">Completed Items</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">Mentorship</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{sessions.length}</p>
          <p className="text-xs text-slate-400">Sessions Attended</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold text-purple-400">Resume</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">ATS Ready</p>
          <p className="text-xs text-slate-400">Professional Score</p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-6">
        <h3 className="text-base font-bold text-white">Acquired Skills & Completed Certifications</h3>
        
        {completedSkillsCerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedSkillsCerts.map((item) => (
              <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">{item.category} • {item.item_type}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{item.name}</h4>
                  <p className="text-xs text-slate-400">Provider: {item.provider}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-teal-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
            No completed skills or certifications marked yet. Visit Skills & Certifications to check off your milestones.
          </div>
        )}
      </div>
    </div>
  );
};
