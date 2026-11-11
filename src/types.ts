export interface User {
  id: number;
  email: string;
  mobile: string;
  name: string;
  role: 'student' | 'admin';
  plan: 'Free' | 'Basic Mentorship' | 'Personal Mentorship';
  created_at: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  full_name: string;
  institute: string;
  current_education: string;
  degree: string;
  year_semester: string;
  skills: string;
  interests: string;
  career_goal: string;
  aim_ambition: string;
  linkedin: string;
  github: string;
  updated_at: string;
}

export interface CareerRoadmap {
  id: number;
  user_id: number;
  career_goal: string;
  overview: string;
  learning_roadmap: string; // JSON string
  additional_skills: string; // JSON string
  certifications: string; // JSON string
  practical_experience: string; // JSON string
  career_prep: string; // JSON string
  progress_json: string; // JSON string
  created_at: string;
}

export interface Resume {
  id: number;
  user_id: number;
  title: string;
  target_role: string;
  template_id: string;
  personal_info: string;
  summary: string;
  objective: string;
  education: string;
  skills: string;
  projects: string;
  experience: string;
  certifications: string;
  achievements: string;
  extracurricular: string;
  languages: string;
  ats_score: number;
  missing_info: string;
  updated_at: string;
}

export interface NetworkingUser {
  id: number;
  user_id: number;
  name: string;
  career_goal: string;
  skills: string;
  institute: string;
  bio: string;
  public_visibility: number;
  avatar: string;
}

export interface Connection {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
}

export interface SkillCertItem {
  id: number;
  user_id: number;
  item_type: 'skill' | 'cert';
  name: string;
  category: string;
  provider: string;
  link: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes: string;
}

export interface Mentor {
  id: number;
  name: string;
  title: string;
  company: string;
  specialization: string;
  experience_years: number;
  rating: number;
  reviews_count: number;
  hourly_rate: string;
  bio: string;
  verified: number;
  avatar: string;
  availability: string;
}

export interface MentorSession {
  id: number;
  user_id: number;
  mentor_id: number;
  scheduled_at: string;
  status: string;
  notes: string;
  feedback: string;
  mentor_name: string;
  mentor_title: string;
  mentor_avatar: string;
  mentor_spec: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  created_at: string;
}
