import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = Number(process.env.PORT) || 3000;
  const dbPath = path.resolve(process.cwd(), 'smart_resume_guide.db');
  const db = new Database(dbPath);

  // Initialize Database Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      mobile TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT DEFAULT 'student',
      is_verified INTEGER DEFAULT 1,
      plan TEXT DEFAULT 'Free',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      full_name TEXT,
      institute TEXT,
      current_education TEXT,
      degree TEXT,
      year_semester TEXT,
      skills TEXT,
      interests TEXT,
      career_goal TEXT,
      aim_ambition TEXT,
      linkedin TEXT,
      github TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS career_roadmaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      career_goal TEXT,
      overview TEXT,
      learning_roadmap TEXT,
      additional_skills TEXT,
      certifications TEXT,
      practical_experience TEXT,
      career_prep TEXT,
      progress_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      target_role TEXT,
      template_id TEXT DEFAULT 'modern',
      personal_info TEXT,
      summary TEXT,
      objective TEXT,
      education TEXT,
      skills TEXT,
      projects TEXT,
      experience TEXT,
      certifications TEXT,
      achievements TEXT,
      extracurricular TEXT,
      languages TEXT,
      ats_score INTEGER DEFAULT 85,
      missing_info TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS networking_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      name TEXT,
      career_goal TEXT,
      skills TEXT,
      institute TEXT,
      bio TEXT,
      public_visibility INTEGER DEFAULT 1,
      avatar TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER,
      receiver_id INTEGER,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(id),
      FOREIGN KEY(receiver_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER,
      receiver_id INTEGER,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sender_id) REFERENCES users(id),
      FOREIGN KEY(receiver_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS skills_certs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      item_type TEXT,
      name TEXT,
      category TEXT,
      provider TEXT,
      link TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS mentors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      title TEXT,
      company TEXT,
      specialization TEXT,
      experience_years INTEGER,
      rating REAL,
      reviews_count INTEGER,
      hourly_rate TEXT,
      bio TEXT,
      verified INTEGER DEFAULT 1,
      avatar TEXT,
      availability TEXT
    );

    CREATE TABLE IF NOT EXISTS mentor_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      mentor_id INTEGER,
      scheduled_at TEXT,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      feedback TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(mentor_id) REFERENCES mentors(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      plan_name TEXT,
      amount TEXT,
      status TEXT DEFAULT 'active',
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      renewal_date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS admin_announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      type TEXT DEFAULT 'info',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      message TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Seed default data if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    db.prepare('INSERT INTO users (email, mobile, password, name, role, plan) VALUES (?, ?, ?, ?, ?, ?)').run(
      'admin@smartresumeguide.com', '9999999999', 'admin123', 'System Administrator', 'admin', 'Personal Mentorship'
    );

    const studentRes = db.prepare('INSERT INTO users (email, mobile, password, name, role, plan) VALUES (?, ?, ?, ?, ?, ?)').run(
      'student@example.com', '9876543210', 'password123', 'Alex Morgan', 'student', 'Free'
    );
    const studentId = studentRes.lastInsertRowid;

    db.prepare(`
      INSERT INTO student_profiles (user_id, full_name, institute, current_education, degree, year_semester, skills, interests, career_goal, aim_ambition, linkedin, github)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      studentId, 'Alex Morgan', 'Stanford University', 'Undergraduate', 'B.Sc. Computer Science', 'Year 3 / Sem 6',
      'Python, React, TypeScript, SQL, Git, Problem Solving', 'Artificial Intelligence, Web Development, Cloud Computing',
      'Full Stack AI Engineer', 'Build intelligent enterprise systems that impact millions of users globally.',
      'linkedin.com/in/alexmorgan', 'github.com/alexmorgan'
    );

    db.prepare(`
      INSERT INTO networking_users (user_id, name, career_goal, skills, institute, bio, public_visibility, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      studentId, 'Alex Morgan', 'Full Stack AI Engineer', 'Python, React, TypeScript', 'Stanford University', 'Passionate CS undergrad exploring AI and full-stack architecture.', 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    );

    const mentorsData = [
      ['Dr. Sarah Jenkins', 'Senior AI Research Scientist', 'Google AI', 'Machine Learning & LLMs', 10, 4.9, 142, '$45/session', 'Former Stanford lecturer with 10+ years in AI engineering and mentorship.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Mon, Wed, Fri (2 PM - 6 PM)'],
      ['Michael Chang', 'Principal Software Architect', 'Meta', 'System Design & Scalability', 12, 4.8, 98, '$40/session', 'Passionate about guiding students into top tech careers and robust architectures.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Tue, Thu (10 AM - 2 PM)'],
      ['Priya Sharma', 'Lead Full Stack Engineer', 'Stripe', 'Frontend, Node.js & Cloud', 8, 4.9, 115, '$35/session', 'Expert in modern web tech, API integrations, and interview coaching.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Sat, Sun (11 AM - 4 PM)']
    ];

    const insertMentor = db.prepare(`
      INSERT INTO mentors (name, title, company, specialization, experience_years, rating, reviews_count, hourly_rate, bio, verified, avatar, availability)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const m of mentorsData) {
      insertMentor.run(...m);
    }

    db.prepare(`
      INSERT INTO admin_announcements (title, content, type)
      VALUES (?, ?, ?)
    `).run('Welcome to Smart Resume Guide 2.0', 'Explore our brand new AI Career Roadmaps, interactive Resume Builder with PDF export, and connect with top-tier tech mentors.', 'success');
    
    db.prepare(`
      INSERT INTO admin_announcements (title, content, type)
      VALUES (?, ?, ?)
    `).run('New Mentorship Slots Available', 'Dr. Sarah Jenkins has opened 5 new mentorship slots for Basic and Personal plan subscribers this week.', 'info');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  // API Routes
  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ? OR mobile = ?').get(identifier, identifier) as any;
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email/mobile or password.' });
    }
    const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(user.id);
    res.json({ success: true, user, profile });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, mobile, password, name, role } = req.body;
    try {
      const info = db.prepare('INSERT INTO users (email, mobile, password, name, role) VALUES (?, ?, ?, ?, ?)').run(
        email, mobile, password, name, role || 'student'
      );
      const userId = info.lastInsertRowid;
      
      db.prepare('INSERT INTO student_profiles (user_id, full_name, career_goal) VALUES (?, ?, ?)').run(userId, name, 'Software Engineer');
      db.prepare('INSERT INTO networking_users (user_id, name, career_goal, institute, bio) VALUES (?, ?, ?, ?, ?)').run(userId, name, 'Software Engineer', 'Unassigned College', 'Ready to build the future.');
      
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(userId);
      res.json({ success: true, user, profile });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed. Email or mobile may already exist.' });
    }
  });

  app.get('/api/profile/:userId', (req, res) => {
    const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.params.userId);
    const user = db.prepare('SELECT id, email, mobile, name, role, plan FROM users WHERE id = ?').get(req.params.userId);
    res.json({ user, profile });
  });

  app.post('/api/profile/update', (req, res) => {
    const { userId, full_name, institute, current_education, degree, year_semester, skills, interests, career_goal, aim_ambition, linkedin, github } = req.body;
    db.prepare(`
      UPDATE student_profiles 
      SET full_name = ?, institute = ?, current_education = ?, degree = ?, year_semester = ?, skills = ?, interests = ?, career_goal = ?, aim_ambition = ?, linkedin = ?, github = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(full_name, institute, current_education, degree, year_semester, skills, interests, career_goal, aim_ambition, linkedin, github, userId);

    db.prepare(`UPDATE users SET name = ? WHERE id = ?`).run(full_name, userId);
    db.prepare(`UPDATE networking_users SET name = ?, career_goal = ?, skills = ?, institute = ? WHERE user_id = ?`).run(full_name, career_goal, skills, institute, userId);

    res.json({ success: true });
  });

  app.post('/api/roadmap/generate', async (req, res) => {
    const { userId, careerGoal, skills, education, experience } = req.body;
    try {
      const prompt = `Act as an expert career counselor and senior industry architect. Generate a highly personalized and comprehensive career roadmap for a student with the following details:
- Career Goal: ${careerGoal}
- Current Education / Degree: ${education}
- Existing Skills: ${skills}
- Additional Experience: ${experience || 'Fresh undergraduate student'}

Return the response STRICTLY as a JSON object with the following keys:
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

      const info = db.prepare(`
        INSERT INTO career_roadmaps (user_id, career_goal, overview, learning_roadmap, additional_skills, certifications, practical_experience, career_prep, progress_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId, careerGoal, jsonResult.overview,
        JSON.stringify(jsonResult.learning_roadmap),
        JSON.stringify(jsonResult.additional_skills),
        JSON.stringify(jsonResult.certifications),
        JSON.stringify(jsonResult.practical_experience),
        JSON.stringify(jsonResult.career_prep),
        JSON.stringify({ completed_milestones: [] })
      );

      const saved = db.prepare('SELECT * FROM career_roadmaps WHERE id = ?').get(info.lastInsertRowid);
      res.json({ success: true, roadmap: saved });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI Roadmap generation failed.' });
    }
  });

  app.get('/api/roadmap/:userId', (req, res) => {
    const roadmaps = db.prepare('SELECT * FROM career_roadmaps WHERE user_id = ? ORDER BY id DESC').all(req.params.userId);
    res.json(roadmaps);
  });

  app.get('/api/resumes/:userId', (req, res) => {
    const resumes = db.prepare('SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC').all(req.params.userId);
    res.json(resumes);
  });

  app.post('/api/resumes/save', (req, res) => {
    const { id, user_id, title, target_role, template_id, personal_info, summary, objective, education, skills, projects, experience, certifications, achievements, extracurricular, languages } = req.body;
    
    if (id) {
      db.prepare(`
        UPDATE resumes 
        SET title = ?, target_role = ?, template_id = ?, personal_info = ?, summary = ?, objective = ?, education = ?, skills = ?, projects = ?, experience = ?, certifications = ?, achievements = ?, extracurricular = ?, languages = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(title, target_role, template_id, personal_info, summary, objective, education, skills, projects, experience, certifications, achievements, extracurricular, languages, id);
      res.json({ success: true, id });
    } else {
      const info = db.prepare(`
        INSERT INTO resumes (user_id, title, target_role, template_id, personal_info, summary, objective, education, skills, projects, experience, certifications, achievements, extracurricular, languages)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(user_id, title, target_role, template_id, personal_info, summary, objective, education, skills, projects, experience, certifications, achievements, extracurricular, languages);
      res.json({ success: true, id: info.lastInsertRowid });
    }
  });

  app.delete('/api/resumes/:id', (req, res) => {
    db.prepare('DELETE FROM resumes WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/networking/users/:userId', (req, res) => {
    const users = db.prepare('SELECT * FROM networking_users WHERE user_id != ? AND public_visibility = 1').all(req.params.userId);
    const connections = db.prepare('SELECT * FROM connections WHERE sender_id = ? OR receiver_id = ?').all(req.params.userId, req.params.userId);
    res.json({ users, connections });
  });

  app.post('/api/networking/connect', (req, res) => {
    const { sender_id, receiver_id } = req.body;
    db.prepare('INSERT INTO connections (sender_id, receiver_id, status) VALUES (?, ?, ?)').run(sender_id, receiver_id, 'pending');
    db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(receiver_id, 'New Connection Request', 'You received a new connection request from a peer.');
    res.json({ success: true });
  });

  app.post('/api/networking/respond', (req, res) => {
    const { connection_id, status } = req.body;
    db.prepare('UPDATE connections SET status = ? WHERE id = ?').run(status, connection_id);
    res.json({ success: true });
  });

  app.get('/api/networking/messages/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;
    const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `).all(user1, user2, user2, user1);
    res.json(messages);
  });

  app.post('/api/networking/messages', (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    db.prepare('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)').run(sender_id, receiver_id, content);
    res.json({ success: true });
  });

  app.get('/api/skills-certs/:userId', (req, res) => {
    const items = db.prepare('SELECT * FROM skills_certs WHERE user_id = ?').all(req.params.userId);
    res.json(items);
  });

  app.post('/api/skills-certs/save', (req, res) => {
    const { user_id, item_type, name, category, provider, link, status, notes } = req.body;
    db.prepare(`
      INSERT INTO skills_certs (user_id, item_type, name, category, provider, link, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(user_id, item_type, name, category, provider, link, status || 'pending', notes);
    res.json({ success: true });
  });

  app.post('/api/skills-certs/toggle', (req, res) => {
    const { id, status } = req.body;
    db.prepare('UPDATE skills_certs SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  });

  app.get('/api/mentors', (req, res) => {
    const mentors = db.prepare('SELECT * FROM mentors').all();
    res.json(mentors);
  });

  app.post('/api/mentors/book', (req, res) => {
    const { user_id, mentor_id, scheduled_at, notes } = req.body;
    db.prepare(`
      INSERT INTO mentor_sessions (user_id, mentor_id, scheduled_at, status, notes)
      VALUES (?, ?, ?, 'scheduled', ?)
    `).run(user_id, mentor_id, scheduled_at, notes);

    db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
      user_id, 'Mentorship Session Booked', `Your session has been scheduled for ${scheduled_at}.`
    );

    res.json({ success: true });
  });

  app.get('/api/mentor-sessions/:userId', (req, res) => {
    const sessions = db.prepare(`
      SELECT ms.*, m.name as mentor_name, m.title as mentor_title, m.avatar as mentor_avatar, m.specialization as mentor_spec
      FROM mentor_sessions ms
      JOIN mentors m ON ms.mentor_id = m.id
      WHERE ms.user_id = ?
      ORDER BY ms.scheduled_at DESC
    `).all(req.params.userId);
    res.json(sessions);
  });

  app.post('/api/subscriptions/upgrade', (req, res) => {
    const { user_id, plan_name, amount } = req.body;
    db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan_name, user_id);
    db.prepare(`
      INSERT INTO subscriptions (user_id, plan_name, amount, status, renewal_date)
      VALUES (?, ?, ?, 'active', datetime('now', '+30 days'))
    `).run(user_id, plan_name, amount);

    db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
      user_id, 'Subscription Upgraded!', `Welcome to the ${plan_name} plan. All premium benefits are now unlocked.`
    );

    res.json({ success: true });
  });

  app.get('/api/notifications/:userId', (req, res) => {
    const notifs = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC').all(req.params.userId);
    const announcements = db.prepare('SELECT * FROM admin_announcements ORDER BY created_at DESC LIMIT 5').all();
    res.json({ notifications: notifs, announcements });
  });

  app.post('/api/notifications/read/:id', (req, res) => {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/admin/data', (req, res) => {
    const users = db.prepare('SELECT id, email, mobile, name, role, plan, created_at FROM users').all();
    const mentors = db.prepare('SELECT * FROM mentors').all();
    const subscriptions = db.prepare('SELECT s.*, u.name as user_name, u.email FROM subscriptions s JOIN users u ON s.user_id = u.id').all();
    const announcements = db.prepare('SELECT * FROM admin_announcements ORDER BY created_at DESC').all();
    res.json({ users, mentors, subscriptions, announcements });
  });

  app.post('/api/admin/announcement', (req, res) => {
    const { title, content, type } = req.body;
    db.prepare('INSERT INTO admin_announcements (title, content, type) VALUES (?, ?, ?)').run(title, content, type || 'info');
    res.json({ success: true });
  });

  app.post('/api/admin/verify-mentor/:id', (req, res) => {
    const { verified } = req.body;
    db.prepare('UPDATE mentors SET verified = ? WHERE id = ?').run(verified ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for frontend
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Resume Guide running on http://localhost:${PORT}`);
  });
}

startServer();
