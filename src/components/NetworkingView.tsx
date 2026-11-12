import React, { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Check, MessageSquare, 
  Send, Sparkles, Building, Briefcase, Award 
} from 'lucide-react';
import { User, StudentProfile, NetworkingUser, Connection, Message } from '../types';
import { dbService } from '../services/db';

interface NetworkingViewProps {
  user: User;
  profile: StudentProfile | null;
}

export const NetworkingView: React.FC<NetworkingViewProps> = ({ user, profile }) => {
  const [peers, setPeers] = useState<NetworkingUser[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatPeer, setActiveChatPeer] = useState<NetworkingUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchNetworkingData = () => {
    const data = dbService.getNetworkingUsers(user.id);
    setPeers(data.users || []);
    setConnections(data.connections || []);
  };

  useEffect(() => {
    fetchNetworkingData();
  }, [user.id]);

  useEffect(() => {
    if (activeChatPeer) {
      const msgs = dbService.getMessages(user.id, activeChatPeer.user_id);
      setMessages(msgs || []);
    }
  }, [activeChatPeer, user.id]);

  const handleConnect = (receiverId: number) => {
    dbService.sendConnectionRequest(user.id, receiverId);
    fetchNetworkingData();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatPeer) return;

    dbService.sendMessage(user.id, activeChatPeer.user_id, newMessage);
    setNewMessage('');
    const msgs = dbService.getMessages(user.id, activeChatPeer.user_id);
    setMessages(msgs || []);
  };

  const filteredPeers = peers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.career_goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.institute.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.skills.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Student Networking System</span>
          </div>
          <h2 className="text-xl font-bold text-white">Connect with Peers & Professionals</h2>
          <p className="text-xs text-slate-400">Discover peers sharing similar career goals, exchange ideas, and collaborate on projects.</p>
        </div>

        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by goal, skills, or college..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPeers.map((peer) => {
            const existingConn = connections.find(c => 
              (c.sender_id === user.id && c.receiver_id === peer.user_id) ||
              (c.sender_id === peer.user_id && c.receiver_id === user.id)
            );

            return (
              <div key={peer.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-4">
                  <img src={peer.avatar} alt={peer.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{peer.name}</h4>
                    <p className="text-xs text-teal-400 font-medium flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3" />
                      <span>{peer.career_goal}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Building className="w-3 h-3" />
                      <span>{peer.institute}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{peer.bio}</p>

                <div className="flex flex-wrap gap-1.5">
                  {peer.skills.split(',').map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                      {s.trim()}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  {existingConn?.status === 'accepted' ? (
                    <button
                      onClick={() => setActiveChatPeer(peer)}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat & Collaborate</span>
                    </button>
                  ) : existingConn?.status === 'pending' ? (
                    <button disabled className="w-full py-2 bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed">
                      Request Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(peer.user_id)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-teal-400" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow flex flex-col h-[550px]">
          {activeChatPeer ? (
            <>
              <div className="pb-4 border-b border-slate-800 flex items-center gap-3">
                <img src={activeChatPeer.avatar} alt={activeChatPeer.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-white">{activeChatPeer.name}</h4>
                  <p className="text-[11px] text-teal-400">{activeChatPeer.career_goal}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                          isMe ? 'bg-teal-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">No messages yet. Start the conversation!</div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-700" />
              <p className="text-xs font-bold text-slate-400">Select a connected peer to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
