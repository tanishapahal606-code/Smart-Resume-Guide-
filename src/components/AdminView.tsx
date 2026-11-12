import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Users, Award, Megaphone, CheckCircle2, 
  XCircle, Send, Sparkles, DollarSign 
} from 'lucide-react';
import { User } from '../types';
import { dbService } from '../services/db';

interface AdminViewProps {
  user: User;
}

export const AdminView: React.FC<AdminViewProps> = ({ user }) => {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [mentorsList, setMentorsList] = useState<any[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  const fetchAdminData = () => {
    setUsersList(dbService.getUsers());
    setMentorsList(dbService.getMentors());
    const notifs = dbService.getNotifications(user.id);
    setAnnouncementsList(notifs.announcements || []);
  };

  useEffect(() => {
    fetchAdminData();
  }, [user.id]);

  const handleVerifyMentor = (mentorId: number, currentVerified: number) => {
    dbService.verifyMentor(mentorId, currentVerified === 1 ? 0 : 1);
    fetchAdminData();
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    dbService.addAnnouncement(annTitle, annContent, 'info');
    setAnnTitle('');
    setAnnContent('');
    fetchAdminData();
    alert('Announcement broadcasted successfully!');
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator Control Panel</span>
          </div>
          <h2 className="text-xl font-bold text-white">Platform Administration System</h2>
          <p className="text-xs text-slate-400">Manage registered users, verify mentors, view subscriptions, and broadcast announcements.</p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-teal-400" />
          <span>Broadcast Platform Announcement</span>
        </h3>

        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. New Feature Released"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Announcement Content</label>
              <input
                type="text"
                required
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="e.g. Explore our new AI roadmap engine..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Now</span>
          </button>
        </form>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Registered Users ({usersList.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Email / Mobile</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {usersList.map((u: any) => (
                <tr key={u.id}>
                  <td className="py-3 font-bold text-white">{u.name}</td>
                  <td className="py-3 text-slate-400">{u.email}</td>
                  <td className="py-3 capitalize text-teal-400 font-semibold">{u.role}</td>
                  <td className="py-3">{u.plan}</td>
                  <td className="py-3 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-400" />
          <span>Manage & Verify Mentors ({mentorsList.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Title & Company</th>
                <th className="pb-3">Specialization</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {mentorsList.map((m: any) => (
                <tr key={m.id}>
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <img src={m.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span>{m.name}</span>
                  </td>
                  <td className="py-3 text-slate-400">{m.title} at {m.company}</td>
                  <td className="py-3 text-teal-300">{m.specialization}</td>
                  <td className="py-3">
                    {m.verified === 1 ? (
                      <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-semibold">Verified</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">Unverified</span>
                    )}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleVerifyMentor(m.id, m.verified)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        m.verified === 1 ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-teal-600 text-white hover:bg-teal-500'
                      }`}
                    >
                      {m.verified === 1 ? 'Revoke' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
