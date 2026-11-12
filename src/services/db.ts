import { User, StudentProfile, CareerRoadmap, Resume, NetworkingUser, Connection, Message, SkillCertItem, Mentor, MentorSession, NotificationItem, Announcement } from '../types';
import { GoogleGenAI } from '@google/genai';

const STORAGE_KEYS = {
  USERS: 'srg_users',
  PROFILES: 'srg_profiles',
  ROADMAPS: 'srg_roadmaps',
  RESUMES: 'srg_resumes',
  NETWORKING_USERS: 'srg_networking_users',
  CONNECTIONS: 'srg_connections',
  MESSAGES: 'srg_messages',
  SKILLS_CERTS: 'srg_skills_certs',
  MENTORS: 'srg_mentors',
  SESSIONS: 'srg_sessions',
  NOTIFICATIONS: 'srg_notifications',
  ANNOUNCEMENTS: 'srg_announcements',
  CURRENT_USER: 'srg_current_user'
};

// Initialize seed data
export function initDB() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: User[] = [
      { id: 1, email: 'admin@smartresumeguide.com', mobile: '9999999999', name: 'System Administrator', role: 'admin', plan: 'Personal Mentorship', created_at: new Date().toISOString() },
      { id: 2, email: 'student@example.com', mobile: '9876543210', name: 'Alex Morgan', role: 'student', plan: 'Free', created_at: new Date().toISOString() }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));

    const defaultProfiles: StudentProfile[] = [
      {
        id: 1,
        user_id: 2,
        full_name: 'Alex Morgan',
        institute: 'Stanford University',
        current_education: 'Undergraduate',
        degree: 'B.Sc. Computer Science',
        year_semester: 'Year 3 / Sem 6',
        skills: 'Python, React, TypeScript, SQL, Git, Problem Solving',
        interests: 'Artificial Intelligence, Web Development, Cloud Computing',
        career_goal: 'Full Stack AI Engineer',
        aim_ambition: 'Build intelligent enterprise systems that impact millions of users globally.',
        linkedin: 'linkedin.com/in/alexmorgan',
        github: 'github.com/alexmorgan',
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(defaultProfiles));

    const defaultNetworking: NetworkingUser[] = [
      { id: 1, user_id: 2, name: 'Alex Morgan', career_goal: 'Full Stack AI Engineer', skills: 'Python, React, TypeScript', institute: 'Stanford University', bio: 'Passionate CS undergrad exploring AI and full-stack architecture.', public_visibility: 1, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { id: 2, user_id: 3, name: 'Jessica Taylor', career_goal: 'Data Scientist', skills: 'Python, TensorFlow, SQL', institute: 'MIT', bio: 'Machine learning researcher and avid hackathon participant.', public_visibility: 1, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { id: 3, user_id: 4, name: 'David Chen', career_goal: 'Cloud DevOps Engineer', skills: 'Docker, Kubernetes, AWS, Go', institute: 'UC Berkeley', bio: 'Cloud infrastructure enthusiast building scalable systems.', public_visibility: 1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
    ];
    localStorage.setItem(STORAGE_KEYS.NETWORKING_USERS, JSON.stringify(defaultNetworking));

    const defaultMentors: Mentor[] = [
      { id: 1, name: 'Dr. Sarah Jenkins', title: 'Senior AI Research Scientist', company: 'Google AI', specialization: 'Machine Learning & LLMs', experience_years: 10, rating: 4.9, reviews_count: 142, hourly_rate: '$45/session', bio: 'Former Stanford lecturer with 10+ years in AI engineering and mentorship.', verified: 1, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', availability: 'Mon, Wed, Fri (2 PM - 6 PM)' },
      { id: 2, name: 'Michael Chang', title: 'Principal Software Architect', company: 'Meta', specialization: 'System Design & Scalability', experience_years: 12, rating: 4.8, reviews_count: 98, hourly_rate: '$40/session', bio: 'Passionate about guiding students into top tech careers and robust architectures.', verified: 1, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', availability: 'Tue, Thu (10 AM - 2 PM)' },
      { id: 3, name: 'Priya Sharma', title: 'Lead Full Stack Engineer', company: 'Stripe', specialization: 'Frontend, Node.js & Cloud', experience_years: 8, rating: 4.9, reviews_count: 115, hourly_rate: '$35/session', bio: 'Expert in modern web tech, API integrations, and interview coaching.', verified: 1, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', availability: 'Sat, Sun (11 AM - 4 PM)' }
    ];
    localStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(defaultMentors));

    const defaultAnnouncements: Announcement[] = [
      { id: 1, title: 'Welcome to Smart Resume Guide 2.0', content: 'Explore our brand new AI Career Roadmaps, interactive Resume Builder with PDF export, and connect with top-tier tech mentors.', type: 'success', created_at: new Date().toISOString() },
      { id: 2, title: 'New Mentorship Slots Available', content: 'Dr. Sarah Jenkins has opened 5 new mentorship slots for Basic and Personal plan subscribers this week.', type: 'info', created_at: new Date().toISOString() }
    ];
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements));

    const defaultResumes: Resume[] = [
      {
        id: 1,
        user_id: 2,
        title: 'Full Stack AI Engineer Resume',
        target_role: 'Full Stack AI Engineer',
        template_id: 'modern',
        personal_info: 'Alex Morgan | Stanford University | student@example.com | github.com/alexmorgan',
        summary: 'Passionate computer science undergraduate with strong foundation in full-stack development, algorithms, and AI integration.',
        objective: 'To secure an impactful engineering role where I can build scalable systems and collaborate with world-class engineering teams.',
        education: 'B.Sc. Computer Science, Stanford University (Year 3 / Sem 6)',
        skills: 'Python, React, TypeScript, SQL, Git, Problem Solving',
        projects: 'AI Chatbot Assistant: Built full-stack React & Node AI app using Gemini API.\nE-Commerce Dashboard: Developed high-performance React dashboard with Tailwind.',
        experience: 'Software Engineering Intern at TechCorp (Summer 2025): Developed REST APIs and automated testing workflows.',
        certifications: 'AWS Certified Cloud Practitioner, Google AI Essentials',
        achievements: 'Dean’s List 2024 & 2025, 1st Place University Hackathon',
        extracurricular: 'President of IEEE Student Chapter, Open Source Contributor',
        languages: 'English (Native), Spanish (Intermediate)',
        ats_score: 92,
        missing_info: '',
        updated_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(defaultResumes));
  }
}

// Database helper methods
export const dbService = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),

  getProfiles: (): StudentProfile[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]'),
  saveProfiles: (profiles: StudentProfile[]) => localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles)),

  getRoadmaps: (userId: number): CareerRoadmap[] => {
    const all: CareerRoadmap[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROADMAPS) || '[]');
    return all.filter(r => r.user_id === userId);
  },
  saveRoadmap: (roadmap: CareerRoadmap) => {
    const all: CareerRoadmap[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROADMAPS) || '[]');
    const newAll = [roadmap, ...all];
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(newAll));
  },

  getResumes: (userId: number): Resume[] => {
    const all: Resume[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESUMES) || '[]');
    return all.filter(r => r.user_id === userId);
  },
  saveResume: (resume: Resume): number => {
    const all: Resume[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESUMES) || '[]');
    if (resume.id) {
      const updated = all.map(r => r.id === resume.id ? resume : r);
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(updated));
      return resume.id;
    } else {
      const newId = Date.now();
      const newResume = { ...resume, id: newId, updated_at: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify([newResume, ...all]));
      return newId;
    }
  },
  deleteResume: (id: number) => {
    const all: Resume[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESUMES) || '[]');
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(all.filter(r => r.id !== id)));
  },

  getNetworkingUsers: (userId: number): { users: NetworkingUser[], connections: Connection[] } => {
    const users: NetworkingUser[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NETWORKING_USERS) || '[]');
    const connections: Connection[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONNECTIONS) || '[]');
    return {
      users: users.filter(u => u.user_id !== userId && u.public_visibility === 1),
      connections: connections.filter(c => c.sender_id === userId || c.receiver_id === userId)
    };
  },

  sendConnectionRequest: (senderId: number, receiverId: number) => {
    const connections: Connection[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONNECTIONS) || '[]');
    const newConn: Connection = { id: Date.now(), sender_id: senderId, receiver_id: receiverId, status: 'pending', created_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify([newConn, ...connections]));

    // Add notification
    const notifs: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    notifs.unshift({ id: Date.now(), user_id: receiverId, title: 'New Connection Request', message: 'You received a new connection request from a peer.', is_read: 0, created_at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  respondConnection: (connectionId: number, status: 'accepted' | 'rejected') => {
    const connections: Connection[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONNECTIONS) || '[]');
    const updated = connections.map(c => c.id === connectionId ? { ...c, status } : c);
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(updated));
  },

  getMessages: (user1: number, user2: number): Message[] => {
    const msgs: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    return msgs.filter(m => (m.sender_id === user1 && m.receiver_id === user2) || (m.sender_id === user2 && m.receiver_id === user1))
               .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  sendMessage: (senderId: number, receiverId: number, content: string) => {
    const msgs: Message[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    const newMsg: Message = { id: Date.now(), sender_id: senderId, receiver_id: receiverId, content, created_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([...msgs, newMsg]));
  },

  getSkillsCerts: (userId: number): SkillCertItem[] => {
    const all: SkillCertItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS_CERTS) || '[]');
    return all.filter(i => i.user_id === userId);
  },

  saveSkillCert: (item: Omit<SkillCertItem, 'id'>) => {
    const all: SkillCertItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS_CERTS) || '[]');
    const newItem: SkillCertItem = { ...item, id: Date.now() };
    localStorage.setItem(STORAGE_KEYS.SKILLS_CERTS, JSON.stringify([newItem, ...all]));
  },

  toggleSkillCert: (id: number, status: 'pending' | 'in_progress' | 'completed') => {
    const all: SkillCertItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS_CERTS) || '[]');
    const updated = all.map(i => i.id === id ? { ...i, status } : i);
    localStorage.setItem(STORAGE_KEYS.SKILLS_CERTS, JSON.stringify(updated));
  },

  getMentors: (): Mentor[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.MENTORS) || '[]'),

  bookMentorSession: (userId: number, mentorId: number, scheduledAt: string, notes: string) => {
    const sessions: MentorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    const mentors: Mentor[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENTORS) || '[]');
    const mentor = mentors.find(m => m.id === mentorId);

    const newSession: MentorSession = {
      id: Date.now(),
      user_id: userId,
      mentor_id: mentorId,
      scheduled_at: scheduledAt,
      status: 'scheduled',
      notes,
      feedback: '',
      mentor_name: mentor?.name || 'Mentor',
      mentor_title: mentor?.title || '',
      mentor_avatar: mentor?.avatar || '',
      mentor_spec: mentor?.specialization || ''
    };
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([newSession, ...sessions]));

    // Notification
    const notifs: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    notifs.unshift({ id: Date.now(), user_id: userId, title: 'Mentorship Session Booked', message: `Your session has been scheduled for ${scheduledAt}.`, is_read: 0, created_at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  getMentorSessions: (userId: number): MentorSession[] => {
    const sessions: MentorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
    return sessions.filter(s => s.user_id === userId);
  },

  upgradePlan: (userId: number, planName: string) => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const updated = users.map(u => u.id === userId ? { ...u, plan: planName as any } : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));

    const notifs: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    notifs.unshift({ id: Date.now(), user_id: userId, title: 'Subscription Upgraded!', message: `Welcome to the ${planName} plan. All premium benefits are now unlocked.`, is_read: 0, created_at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  getNotifications: (userId: number) => {
    const notifs: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const anns: Announcement[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
    return {
      notifications: notifs.filter(n => n.user_id === userId),
      announcements: anns
    };
  },

  markNotificationRead: (id: number) => {
    const notifs: NotificationItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const updated = notifs.map(n => n.id === id ? { ...n, is_read: 1 } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  },

  addAnnouncement: (title: string, content: string, type: string) => {
    const anns: Announcement[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
    const newAnn: Announcement = { id: Date.now(), title, content, type: type || 'info', created_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([newAnn, ...anns]));
  },

  verifyMentor: (mentorId: number, verified: number) => {
    const mentors: Mentor[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MENTORS) || '[]');
    const updated = mentors.map(m => m.id === mentorId ? { ...m, verified } : m);
    localStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(updated));
  }
};

// Gemini AI Roadmap generator
export async function generateAICareerRoadmap(userId: number, careerGoal: string, skills: string, education: string, experience: string): Promise<CareerRoadmap> {
  try {
    const apiKey = (window as any).GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Act as an expert career counselor and senior industry architect. Generate a highly personalized and comprehensive career roadmap for a student with the following details:
- Career Goal: ${careerGoal}
- Current Education / Degree: ${education}
- Existing Skills: ${skills}
- Additional Experience: ${experience || 'Fresh undergraduate student'}

Return the response STRICTLY as a valid JSON object with the following keys:
{
  "overview": "Detailed explanation of career, responsibilities, and qualifications.",
  "learning_roadmap": {
    "beginner": ["step 1", "step 2"],
    "intermediate": ["step 1", "step 2"],
    "advanced": ["step 1", "step 2"],
    "career_prep": ["step 1", "step 2"]
  },
  "additional_skills": {
    "technical": ["skill 1", "skill 2"],
    "programming": ["lang 1", "lang 2"],
    "tools": ["tool 1", "tool 2"],
    "soft_skills": ["skill 1", "skill 2"]
  },
  "certifications": [
    {"name": "Cert Name", "provider": "Provider Name", "official_link": "https://...", "level": "Beginner/Advanced"}
  ],
  "practical_experience": {
    "beginner_projects": ["project 1", "project 2"],
    "intermediate_projects": ["project 1", "project 2"],
    "advanced_projects": ["project 1", "project 2"],
    "internship_prep": ["tip 1", "tip 2"]
  },
  "career_prep": {
    "interview_prep": ["tip 1", "tip 2"],
    "portfolio": ["tip 1", "tip 2"],
    "github": ["tip 1", "tip 2"],
    "resume": ["tip 1", "tip 2"]
  }
}
Ensure valid JSON format without markdown ticks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text || '';
    let jsonResult;
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResult = JSON.parse(cleanText);
    } catch (e) {
      jsonResult = {
        overview: `Roadmap for ${careerGoal}: Focused on mastering core competencies, building practical projects, and positioning yourself for top roles.`,
        learning_roadmap: {
          beginner: ["Fundamentals of " + careerGoal, "Basic syntax and problem solving"],
          intermediate: ["Data structures & APIs", "Building intermediate mini-projects"],
          advanced: ["System design and scalable architecture", "Open source contribution"],
          career_prep: ["Mock interviews and resume polish"]
        },
        additional_skills: {
          technical: ["API Integration", "Debugging", "Version Control"],
          programming: ["Python", "JavaScript/TypeScript"],
          tools: ["Git", "Docker", "VS Code"],
          soft_skills: ["Communication", "Teamwork", "Time Management"]
        },
        certifications: [
          { name: "Certified Professional Developer", provider: "Industry Standard", official_link: "https://example.com", level: "Intermediate" }
        ],
        practical_experience: {
          beginner_projects: ["Personal Portfolio Website", "Task Management App"],
          intermediate_projects: ["Full-Stack E-Commerce Platform", "Real-Time Chat App"],
          advanced_projects: ["Enterprise Microservices Architecture", "AI-Powered Analytics Tool"],
          internship_prep: ["Resume optimization", "LinkedIn branding"]
        },
        career_prep: {
          interview_prep: ["LeetCode 150", "System design mock practice"],
          portfolio: ["Deploy live projects on Vercel/Netlify"],
          github: ["Maintain clean commit history and README files"],
          resume: ["Use ATS-friendly clean templates"]
        }
      };
    }

    const newRoadmap: CareerRoadmap = {
      id: Date.now(),
      user_id: userId,
      career_goal: careerGoal,
      overview: jsonResult.overview,
      learning_roadmap: JSON.stringify(jsonResult.learning_roadmap),
      additional_skills: JSON.stringify(jsonResult.additional_skills),
      certifications: JSON.stringify(jsonResult.certifications),
      practical_experience: JSON.stringify(jsonResult.practical_experience),
      career_prep: JSON.stringify(jsonResult.career_prep),
      progress_json: JSON.stringify({ completed_milestones: [] }),
      created_at: new Date().toISOString()
    };

    dbService.saveRoadmap(newRoadmap);
    return newRoadmap;
  } catch (err) {
    // Fallback if API key is missing or quota exceeded
    const fallbackRoadmap: CareerRoadmap = {
      id: Date.now(),
      user_id: userId,
      career_goal: careerGoal,
      overview: `Roadmap for ${careerGoal}: Comprehensive path covering technical foundations, portfolio projects, and interview preparation.`,
      learning_roadmap: JSON.stringify({
        beginner: ["Core Fundamentals", "Basic Problem Solving"],
        intermediate: ["Data Structures & APIs", "Mini Projects"],
        advanced: ["System Design", "Advanced Architecture"],
        career_prep: ["Resume & Mock Interviews"]
      }),
      additional_skills: JSON.stringify({ technical: ["Git", "REST APIs"], programming: ["Python", "JavaScript"], tools: ["VS Code", "Docker"], soft_skills: ["Communication"] }),
      certifications: JSON.stringify([{ name: "Professional Developer Cert", provider: "Industry Standard", official_link: "https://example.com", level: "Intermediate" }]),
      practical_experience: JSON.stringify({ beginner_projects: ["Portfolio Website"], intermediate_projects: ["Full-Stack App"], advanced_projects: ["Microservices"], internship_prep: ["Resume tuning"] }),
      career_prep: JSON.stringify({ interview_prep: ["LeetCode"], portfolio: ["Deploy apps"], github: ["Active commits"], resume: ["ATS check"] }),
      progress_json: JSON.stringify({ completed_milestones: [] }),
      created_at: new Date().toISOString()
    };
    dbService.saveRoadmap(fallbackRoadmap);
    return fallbackRoadmap;
  }
}
