import React, { useState, useEffect } from 'react';
import { 
  Map, Sparkles, CheckCircle2, ChevronRight, BookOpen, 
  Award, Briefcase, Code, Wrench, Shield, CheckSquare 
} from 'lucide-react';
import { User, StudentProfile, CareerRoadmap } from '../types';
import { dbService, generateAICareerRoadmap } from '../services/db';

interface CareerRoadmapViewProps {
  user: User;
  profile: StudentProfile | null;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ user, profile }) => {
  const [roadmaps, setRoadmaps] = useState<CareerRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [customGoal, setCustomGoal] = useState(profile?.career_goal || 'Full Stack AI Engineer');

  const fetchRoadmaps = () => {
    const data = dbService.getRoadmaps(user.id);
    setRoadmaps(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [user.id]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateAICareerRoadmap(
        user.id,
        customGoal,
        profile?.skills || 'Python, React, JavaScript',
        `${profile?.current_education || 'Undergraduate'} in ${profile?.degree || 'Computer Science'}`,
        profile?.aim_ambition || ''
      );
      fetchRoadmaps();
    } catch (err) {
      alert('Failed to generate roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const activeRoadmap = roadmaps[0];

  let learningRoadmap: any = {};
  let additionalSkills: any = {};
  let certifications: any[] = [];
  let practicalExp: any = {};
  let careerPrep: any = {};

  if (activeRoadmap) {
    try {
      learningRoadmap = JSON.parse(activeRoadmap.learning_roadmap || '{}');
      additionalSkills = JSON.parse(activeRoadmap.additional_skills || '{}');
      certifications = JSON.parse(activeRoadmap.certifications || '[]');
      practicalExp = JSON.parse(activeRoadmap.practical_experience || '{}');
      careerPrep = JSON.parse(activeRoadmap.career_prep || '{}');
    } catch (e) {}
  }

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Career Roadmap</span>
          </div>
          <h2 className="text-xl font-bold text-white">Your Personalized Career Masterplan</h2>
          <p className="text-xs text-slate-400">Tailored precisely to your educational background, current skills, and future goals.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Target Career Goal..."
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 flex-1 md:w-64"
          />
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition whitespace-nowrap"
          >
            {generating ? 'Analyzing AI...' : 'Generate Roadmap'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading your personalized career roadmap...</div>
      ) : activeRoadmap ? (
        <div className="space-y-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
            <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-2">Career Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{activeRoadmap.overview}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-teal-400" />
              <span>Step-by-Step Learning Roadmap</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['beginner', 'intermediate', 'advanced', 'career_prep'].map((stage, idx) => (
                <div key={stage} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded">
                      Stage {idx + 1}: {stage.replace('_', ' ')}
                    </span>
                    <ul className="mt-4 space-y-2.5">
                      {Array.isArray(learningRoadmap[stage]) && learningRoadmap[stage]?.map((item: string, i: number) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-400" />
                <span>Recommended Skills & Tools</span>
              </h3>
              <div className="space-y-3">
                {Object.entries(additionalSkills || {}).map(([key, val]: [string, any]) => (
                  <div key={key} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{key.replace('_', ' ')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(val) && val.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Recommended Certifications</span>
              </h3>
              <div className="space-y-3">
                {Array.isArray(certifications) && certifications.map((cert: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{cert.name}</p>
                      <p className="text-[11px] text-slate-400">Provider: {cert.provider} • Level: {cert.level}</p>
                    </div>
                    <a
                      href={cert.official_link || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition"
                    >
                      Official Link
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Map className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white mb-1">No Roadmap Found</h4>
          <p className="text-xs text-slate-400 mb-4">Click generate above to build your AI career roadmap instantly.</p>
        </div>
      )}
    </div>
  );
};
