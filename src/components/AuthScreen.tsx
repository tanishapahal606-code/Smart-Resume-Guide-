import React, { useState } from 'react';
import { Briefcase, Mail, Phone, Lock, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: any, profile: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [tab, setTab] = useState<'email' | 'mobile'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP state for mobile login simulation
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
        });
        const data = await res.json();
        if (data.success) {
          onLogin(data.user, data.profile);
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email || `${mobile}@mobile.user`, mobile: mobile || identifier, password, name, role: 'student' }),
        });
        const data = await res.json();
        if (data.success) {
          onLogin(data.user, data.profile);
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type: 'student' | 'admin') => {
    setLoading(true);
    const id = type === 'admin' ? 'admin@smartresumeguide.com' : 'student@example.com';
    const pwd = type === 'admin' ? 'admin123' : 'password123';
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id, password: pwd }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user, data.profile);
      }
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glowing gradients */}
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

        {isLogin && (
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setTab('email')}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                tab === 'email' ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'border-slate-800 text-slate-400'
              }`}
            >
              Email Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('mobile')}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                tab === 'mobile' ? 'border-teal-500/50 bg-teal-500/10 text-teal-300' : 'border-slate-800 text-slate-400'
              }`}
            >
              Mobile + OTP
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
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

          {tab === 'email' || !isLogin ? (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {isLogin ? 'Email or Mobile Number' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={isLogin ? 'text' : 'email'}
                  required
                  value={isLogin ? identifier : email}
                  onChange={(e) => isLogin ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                  placeholder={isLogin ? 'student@example.com or mobile' : 'student@example.com'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          ) : (
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
