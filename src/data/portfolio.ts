export interface Profile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  email: string;
  location: string;
  social_links: { platform: string; url: string }[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
  tech_stack: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  live_url?: string;
  repo_url?: string;
  image_url?: string | null;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  messages: Message[];
}

export interface PortfolioContent {
  profile: Profile | null;
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  education: Education[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  result: string;
  end_date: string;
  sort_order?: number;
}
