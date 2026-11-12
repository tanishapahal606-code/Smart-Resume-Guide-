import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle2, BookOpen, ExternalLink, Sparkles, 
  CheckSquare, Square, Plus, ShieldCheck 
} from 'lucide-react';
import { User, SkillCertItem } from '../types';
import { dbService } from '../services/db';

interface SkillsCertsViewProps {
  user: User;
}

export const SkillsCertsView: React.FC<SkillsCertsViewProps> = ({ user }) => {
  const [items, setItems] = useState<SkillCertItem[]>([]);

  const fetchItems = () => {
    const data = dbService.getSkillsCerts(user.id);
    setItems(data || []);
  };

  useEffect(() => {
    fetchItems();
  }, [user.id]);

  const toggleStatus = (item: SkillCertItem) => {
    const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
    dbService.toggleSkillCert(item.id, nextStatus);
    fetchItems();
  };

  const defaultRecommendations = [
    { name: 'Python for Data Structures & Algorithms', type: 'skill' as const, category: 'Technical', provider: 'Coursera / Stanford', link: 'https://coursera.org' },
    { name: 'React 19 & TypeScript Masterclass', type: 'skill' as const, category: 'Frontend', provider: 'Frontend Masters', link: 'https://frontendmasters.com' },
    { name: 'AWS Certified Solutions Architect Associate', type: 'cert' as const, category: 'Cloud Computing', provider: 'Amazon Web Services', link: 'https://aws.amazon.com/certification' },
    { name: 'Google Professional Machine Learning Engineer', type: 'cert' as const, category: 'Artificial Intelligence', provider: 'Google Cloud', link: 'https://cloud.google.com/certification' },
    { name: 'Effective Leadership & Communication', type: 'skill' as const, category: 'Soft Skills', provider: 'LinkedIn Learning', link: 'https://linkedin.com/learning' }
  ];

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Skills & Certifications Guide</span>
          </div>
          <h2 className="text-xl font-bold text-white">Recommended Skills & Official Certifications</h2>
          <p className="text-xs text-slate-400">Master industry-standard technical skills and track official certifications.</p>
        </div>

        <span className="px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          Basic Recommendations Free
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultRecommendations.map((rec, idx) => {
          const matchedItem = items.find(i => i.name === rec.name);
          const isCompleted = matchedItem?.status === 'completed';

          const handleClick = () => {
            if (matchedItem) {
              toggleStatus(matchedItem);
            } else {
              dbService.saveSkillCert({
                user_id: user.id,
                item_type: rec.type,
                name: rec.name,
                category: rec.category,
                provider: rec.provider,
                link: rec.link,
                status: 'completed',
                notes: 'Completed via platform recommendation'
              });
              fetchItems();
            }
          };

          return (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                    rec.type === 'cert' ? 'bg-purple-500/10 text-purple-300' : 'bg-teal-500/10 text-teal-300'
                  }`}>
                    {rec.category} • {rec.type}
                  </span>
                  {isCompleted ? (
                    <span className="text-xs font-semibold text-teal-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Pending</span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{rec.name}</h4>
                <p className="text-xs text-slate-400">Provider: {rec.provider}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={rec.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <span>Official Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleClick}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                    isCompleted 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow'
                  }`}
                >
                  {isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
