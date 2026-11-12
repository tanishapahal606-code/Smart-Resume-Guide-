import React, { useState } from 'react';
import { User as UserIcon, Building, GraduationCap, Award, BookOpen, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { User, StudentProfile } from '../types';
import { dbService } from '../services/db';

interface ProfileViewProps {
  user: User;
  profile: StudentProfile | null;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, profile, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    institute: profile?.institute || '',
    current_education: profile?.current_education || 'Undergraduate',
    degree: profile?.degree || '',
    year_semester: profile?.year_semester || '',
    skills: profile?.skills || '',
    interests: profile?.interests || '',
    career_goal: profile?.career_goal || '',
    aim_ambition: profile?.aim_ambition || '',
    linkedin: profile?.linkedin || '',
    github: profile?.github || '',
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    setTimeout(() => {
      const profiles = dbService.getProfiles();
      const updatedProfiles = profiles.map(p => p.user_id === user.id ? { ...p, ...formData, updated_at: new Date().toISOString() } : p);
      dbService.saveProfiles(updatedProfiles);

      const users = dbService.getUsers();
      const updatedUsers = users.map(u => u.id === user.id ? { ...u, name: formData.full_name } : u);
      dbService.saveUsers(updatedUsers);

      onUpdateProfile({ ...profile!, ...formData });
      setSuccessMessage('Student profile updated successfully!');
      setSaving(false);
    }, 400);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Student Profile & Personal Information</h2>
          <p className="text-xs text-slate-400">Complete your academic and career details to power AI recommendations.</p>
        </div>
        <span className="px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          100% Free Module
        </span>
      </div>

      {successMessage && (
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Institute / College Name</label>
            <input
              type="text"
              name="institute"
              required
              value={formData.institute}
              onChange={handleChange}
              placeholder="e.g. Stanford University"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Current Education Level</label>
            <select
              name="current_education"
              value={formData.current_education}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="School Student">School Student</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Fresher / Job Seeker">Fresher / Job Seeker</option>
              <option value="Working Professional">Working Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Degree / Course</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="e.g. B.Sc. Computer Science"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Current Year or Semester</label>
            <input
              type="text"
              name="year_semester"
              value={formData.year_semester}
              onChange={handleChange}
              placeholder="e.g. Year 3 / Semester 6"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Future Career Goal</label>
            <input
              type="text"
              name="career_goal"
              required
              value={formData.career_goal}
              onChange={handleChange}
              placeholder="e.g. Full Stack AI Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Current Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. Python, React, TypeScript, SQL, Git"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Interests & Domains</label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="e.g. Artificial Intelligence, Web Development, Cloud Computing"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Aim and Ambition</label>
          <textarea
            name="aim_ambition"
            rows={3}
            value={formData.aim_ambition}
            onChange={handleChange}
            placeholder="Describe what you want to achieve in your professional career..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">LinkedIn Profile URL</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="linkedin.com/in/username"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">GitHub Profile URL</label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="github.com/username"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-teal-500/20 transition"
          >
            {saving ? 'Saving Profile...' : 'Save Student Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
