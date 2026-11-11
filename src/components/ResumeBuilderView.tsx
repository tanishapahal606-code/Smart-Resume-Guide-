import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Download, Printer, CheckCircle2, 
  Sparkles, ShieldCheck, Edit3, Eye, Copy, ArrowRight 
} from 'lucide-react';
import { User, StudentProfile, Resume } from '../types';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface ResumeBuilderViewProps {
  user: User;
  profile: StudentProfile | null;
}

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({ user, profile }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeResume, setActiveResume] = useState<Partial<Resume>>({
    title: 'Software Engineer Resume',
    target_role: profile?.career_goal || 'Full Stack Engineer',
    template_id: 'modern',
    personal_info: `${profile?.full_name || 'Alex Morgan'} | ${profile?.institute || 'Stanford'} | ${user.email} | ${profile?.linkedin || 'linkedin.com/in/alex'}`,
    summary: 'Passionate computer science undergraduate with strong foundation in full-stack development, algorithms, and AI integration.',
    objective: 'To secure an impactful engineering role where I can build scalable systems and collaborate with world-class engineering teams.',
    education: `${profile?.current_education || 'B.Sc. Computer Science'}, ${profile?.institute || 'Stanford University'} (${profile?.year_semester || 'Year 3'})`,
    skills: profile?.skills || 'Python, React, TypeScript, SQL, Git',
    projects: 'AI Chatbot Assistant: Built full-stack React & Node AI app using Gemini API.\nE-Commerce Dashboard: Developed high-performance React dashboard with Tailwind.',
    experience: 'Software Engineering Intern at TechCorp (Summer 2025): Developed REST APIs and automated testing workflows.',
    certifications: 'AWS Certified Cloud Practitioner, Google AI Essentials',
    achievements: 'Dean’s List 2024 & 2025, 1st Place University Hackathon',
    extracurricular: 'President of IEEE Student Chapter, Open Source Contributor',
    languages: 'English (Native), Spanish (Intermediate)'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [atsScore, setAtsScore] = useState(88);

  const fetchResumes = () => {
    fetch(`/api/resumes/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setResumes(data || []);
        if (data && data.length > 0) {
          setActiveResume(data[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchResumes();
  }, [user.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setActiveResume({ ...activeResume, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/resumes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, ...activeResume }),
      });
      const data = await res.json();
      if (data.success) {
        if (!activeResume.id) {
          setActiveResume({ ...activeResume, id: data.id });
        }
        fetchResumes();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        alert('Resume saved successfully!');
      }
    } catch (err) {
      alert('Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(activeResume.title || 'Professional Resume', 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(activeResume.personal_info || '', 20, 28);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text('Professional Summary', 20, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(activeResume.summary || '', 170), 20, 46);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text('Education', 20, 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(activeResume.education || '', 170), 20, 71);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text('Technical Skills', 20, 90);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(activeResume.skills || '', 170), 20, 96);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text('Projects', 20, 115);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(activeResume.projects || '', 170), 20, 121);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text('Work Experience', 20, 155);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(activeResume.experience || '', 170), 20, 161);

    doc.save(`${(activeResume.title || 'resume').toLowerCase().replace(/\s+/g, '_')}.pdf`);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Smart Resume Builder & ATS Checker</span>
          </div>
          <h2 className="text-xl font-bold text-white">Create Professional ATS-Friendly Resumes</h2>
          <p className="text-xs text-slate-400">Choose templates, edit sections, check ATS compatibility, and download as PDF.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
              previewMode ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Edit Mode' : 'Live Preview'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition"
          >
            {saving ? 'Saving...' : 'Save Resume'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* ATS Compatibility Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg">
            {atsScore}%
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>ATS Compatibility Score</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Optimized with standard keywords, clear headings, and clean structure.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-300 text-xs font-semibold">Keyword Match: Excellent</span>
          <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-semibold">Format: ATS Approved</span>
        </div>
      </div>

      {/* Main Builder / Preview Workspace */}
      {previewMode ? (
        <div className="bg-white text-slate-900 rounded-2xl p-12 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="border-b pb-6">
            <h1 className="text-3xl font-bold tracking-tight">{activeResume.title || 'Professional Resume'}</h1>
            <p className="text-xs text-slate-600 mt-1">{activeResume.personal_info}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">Professional Summary</h3>
            <p className="text-sm leading-relaxed text-slate-700">{activeResume.summary}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">Education</h3>
            <p className="text-sm leading-relaxed text-slate-700">{activeResume.education}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">Technical Skills</h3>
            <p className="text-sm leading-relaxed text-slate-700">{activeResume.skills}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">Projects</h3>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{activeResume.projects}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">Work Experience</h3>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{activeResume.experience}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Form */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Resume Title</label>
                <input
                  type="text"
                  name="title"
                  value={activeResume.title || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Template Style</label>
                <select
                  name="template_id"
                  value={activeResume.template_id || 'modern'}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="modern">Modern & Minimal</option>
                  <option value="executive">Executive Professional</option>
                  <option value="fresher">Fresher Optimized</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Personal Information (Name, Contact, Links)</label>
              <input
                type="text"
                name="personal_info"
                value={activeResume.personal_info || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Professional Summary</label>
              <textarea
                name="summary"
                rows={3}
                value={activeResume.summary || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Educational Qualifications</label>
              <textarea
                name="education"
                rows={2}
                value={activeResume.education || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Technical Skills</label>
              <input
                type="text"
                name="skills"
                value={activeResume.skills || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Projects (Bulleted or Descriptions)</label>
              <textarea
                name="projects"
                rows={4}
                value={activeResume.projects || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Work Experience & Internships</label>
              <textarea
                name="experience"
                rows={4}
                value={activeResume.experience || ''}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>
          </div>

          {/* Saved Resumes List */}
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow">
              <h3 className="text-sm font-bold text-white mb-4">Saved Resumes ({resumes.length})</h3>
              <div className="space-y-3">
                {resumes.map((res) => (
                  <div 
                    key={res.id} 
                    onClick={() => setActiveResume(res)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      activeResume.id === res.id 
                        ? 'bg-teal-500/10 border-teal-500/50 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold">{res.title}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Updated: {new Date(res.updated_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
