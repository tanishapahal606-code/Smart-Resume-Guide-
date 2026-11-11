import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Megaphone, Sparkles } from 'lucide-react';
import { User, NotificationItem, Announcement } from '../types';

interface NotificationsViewProps {
  user: User;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    fetch(`/api/notifications/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setAnnouncements(data.announcements || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, [user.id]);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/read/${id}`, { method: 'POST' });
      fetchNotifs();
    } catch (err) {}
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications & Announcements</span>
          </div>
          <h2 className="text-xl font-bold text-white">System Alerts & Updates</h2>
          <p className="text-xs text-slate-400">Stay informed about your mentorship sessions, connection requests, and platform announcements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-400" />
            <span>Personal Notifications</span>
          </h3>

          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                    <p className="text-[10px] text-slate-500 mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                  </div>
                  {notif.is_read === 0 && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="px-2.5 py-1 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 text-[10px] font-semibold rounded-lg transition whitespace-nowrap"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-10">No personal notifications.</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-indigo-400" />
            <span>Platform Announcements</span>
          </h3>

          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-teal-300">{ann.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ann.content}</p>
                  <p className="text-[10px] text-slate-500 mt-2">{new Date(ann.created_at).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-10">No announcements.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
