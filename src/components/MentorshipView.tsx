import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Star, Calendar, Clock, CheckCircle2, ShieldCheck, 
  Award, Briefcase, ArrowRight, Check 
} from 'lucide-react';
import { User, Mentor, MentorSession } from '../types';
import confetti from 'canvas-confetti';

interface MentorshipViewProps {
  user: User;
  onUpdatePlan: (planName: string) => void;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({ user, onUpdatePlan }) => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      fetch('/api/mentors').then(res => res.json()),
      fetch(`/api/mentor-sessions/${user.id}`).then(res => res.json())
    ]).then(([mentorsData, sessionsData]) => {
      setMentors(mentorsData || []);
      setSessions(sessionsData || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !sessionDate) return;

    try {
      const res = await fetch('/api/mentors/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          mentor_id: selectedMentor.id,
          scheduled_at: sessionDate,
          notes: sessionNotes
        }),
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        alert('Mentorship session booked successfully!');
        setSelectedMentor(null);
        setSessionDate('');
        setSessionNotes('');
        fetchData();
      }
    } catch (err) {
      alert('Failed to book session.');
    }
  };

  const handleUpgrade = async (planName: string, amount: string) => {
    try {
      const res = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, plan_name: planName, amount }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdatePlan(planName);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        alert(`Successfully upgraded to ${planName}!`);
      }
    } catch (err) {
      alert('Subscription upgrade failed.');
    }
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Premium Mentorship & Subscriptions</span>
          </div>
          <h2 className="text-xl font-bold text-white">Expert Mentor-Led Career Guidance</h2>
          <p className="text-xs text-slate-400">Book 1-to-1 sessions with verified industry experts from Google, Meta, Stripe and more.</p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
          Active Plan: {user.plan}
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Explorer</span>
            <h3 className="text-2xl font-bold text-white mt-2">$0 <span className="text-xs text-slate-400">/ forever</span></h3>
            <p className="text-xs text-slate-400 mt-2">Essential career tools for independent students.</p>
            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> AI Career Roadmap</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Smart Resume Builder & PDF</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Basic Student Networking</li>
            </ul>
          </div>
          <button disabled className="mt-8 w-full py-2.5 bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed">
            Current Plan
          </button>
        </div>

        <div className="bg-slate-900/90 border border-teal-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-teal-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Basic Mentorship</span>
            <h3 className="text-2xl font-bold text-white mt-2">$29 <span className="text-xs text-slate-400">/ month</span></h3>
            <p className="text-xs text-slate-400 mt-2">Ideal for focused career preparation and resume review.</p>
            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> 2 1-to-1 Mentor Sessions / mo</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Professional Resume Review</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Mock Interview Practice</li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade('Basic Mentorship', '$29/mo')}
            className="mt-8 w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Upgrade to Basic
          </button>
        </div>

        <div className="bg-slate-900/90 border border-purple-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Ultimate
          </div>
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Personal Mentorship</span>
            <h3 className="text-2xl font-bold text-white mt-2">$59 <span className="text-xs text-slate-400">/ month</span></h3>
            <p className="text-xs text-slate-400 mt-2">End-to-end dedicated mentorship and portfolio mastery.</p>
            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Unlimited 1-to-1 Mentor Sessions</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Direct WhatsApp / Chat Access</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Guaranteed Internship Referrals</li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade('Personal Mentorship', '$59/mo')}
            className="mt-8 w-full py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Upgrade to Personal
          </button>
        </div>
      </div>

      {/* Mentors Directory */}
      <div className="space-y-6">
        <h3 className="text-base font-bold text-white">Verified Industry Mentors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
                <img src={mentor.avatar} alt={mentor.name} className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1">
                    <span>{mentor.name}</span>
                    {mentor.verified === 1 && <ShieldCheck className="w-4 h-4 text-teal-400" />}
                  </h4>
                  <p className="text-xs text-teal-400 font-medium">{mentor.title} at {mentor.company}</p>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{mentor.rating} ({mentor.reviews_count} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{mentor.bio}</p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-white">{mentor.hourly_rate}</span>
                <button
                  onClick={() => setSelectedMentor(mentor)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white">Book Session with {selectedMentor.name}</h3>
            
            <form onSubmit={handleBookSession} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Session Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Topics / Questions for Mentor</label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="What would you like to discuss?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
