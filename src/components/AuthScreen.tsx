import React, { useState } from 'react';
import { Briefcase, Mail, Phone, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { dbService, initDB } from '../services/db';

interface AuthScreenProps {
  onLogin: (user: any, profile: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  initDB();
  const [isLogin, setIsLogin] = useState(true);
  const [tab, setTab] = useState<'email' | 'mobile'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = dbService.getUsers();
      const profiles = dbService.getProfiles();

      if (isLogin) {
        const foundUser = users.find(u => u.email === identifier || u.mobile === identifier);
        if (foundUser && foundUser.password === password) {
          const foundProfile = profiles.find(p => p.user_id === foundUser.id) || null;
          onLogin(foundUser, foundProfile);
        } else {
          setError('Invalid email/mobile or password. Try demo buttons below.');
        }
      } else {
        const existing = users.find(u => u.email === email || u.mobile === mobile);
        if (existing) {
          setError('User with this email or mobile already exists.');
        } else {
          const newUserId = Date.now();
          const newUser = {
            id: newUserId,
            email: email || `${mobile}@mobile.user`,
            mobile: mobile || identifier,
            password,
            name,
            role: 'student' as const,
            plan: 'Free' as const,
            created_at: new Date().toISOString()
          };
          users.push(newUser);
          dbService.saveUsers(users);

          const newProfile = {
            id: Date.now(),
            user_id: newUserId,
            full_name: name,
            institute: 'Unassigned College',
            current_education: 'Undergraduate',
            degree: 'B.Sc. Computer Science',
            year_semester: 'Year 1 / Sem 1',
            skills: 'Problem Solving, Communication',
            interests: 'Technology, Software Engineering',
            career_goal: 'Software Engineer',
            aim_ambition: 'Build impactful applications.',
            linkedin: '',
            github: '',
            updated_at: new Date().toISOString()
          };
          profiles.push(newProfile);
          dbService.saveProfiles(profiles);

          // Add networking profile
          const networkingUsers = JSON.parse(localStorage.getItem('srg_networking_users') || '[]');
          networkingUsers.push({
            id: Date.now(),
            user_id: newUserId,
            name,
            career_goal: 'Software Engineer',
            skills: 'Problem Solving',
            institute: 'Unassigned College',
            bio: 'Ready to build the future.',
            public_visibility: 1,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          });
          localStorage.setItem('srg_networking_users', JSON.stringify(networkingUsers));

          onLogin(newUser, newProfile);
        }
      }
      setLoading(false);
    }, 400);
  };

  const handleDemoLogin = (type: 'student' | 'admin') => {
    const users = dbService.getUsers();
    const profiles = dbService.getProfiles();
    const foundUser = users.find(u => type === 'admin' ? u.role === 'admin' : u.role === 'student');
    if (foundUser) {
      const foundProfile = profiles.find(p => p.user_id === foundUser.id) || null;
      onLogin(foundUser, foundProfile);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-lg shadow-teal-500/20 mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-teal-400 bg-clip-text text-transparent">
            Smart Resume Guide
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your Ultimate AI Career Development Companion
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex bg-slate-950/60 p-1 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              isLogin ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              !isLogin ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          )}

          {!isLogin ? (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email or Mobile Number</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In to Workspace' : 'Create Free Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-3">Quick Demo Access</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="flex-1 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex-1 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
