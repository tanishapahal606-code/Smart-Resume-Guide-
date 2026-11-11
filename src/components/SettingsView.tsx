import React, { useState } from 'react';
import { Settings, Shield, Lock, User as UserIcon, LogOut, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  user: User;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onLogout }) => {
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setPassword('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Account & Application Settings</h2>
          <p className="text-xs text-slate-400">Manage your security credentials and application preferences.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Password updated successfully!</span>
        </div>
      )}

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-teal-400" />
          <span>User Credentials</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <input
              type="text"
              disabled
              value={user.email}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Mobile Number</label>
            <input
              type="text"
              disabled
              value={user.mobile}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Change Password</span>
          </h3>

          <div className="max-w-md">
            <label className="block text-xs font-medium text-slate-400 mb-1">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Update Password
          </button>
        </form>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold rounded-xl transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
