export interface Bio {
  _id?: string;
  name: string;
  roles?: string[];
  description: string;
  github?: string;
  resume?: string;
  linkedin?: string;
  twitter?: string;
  insta?: string;
  facebook?: string;
  image?: string;
  contactEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillItem {
  name: string;
  image: string;
}

export interface SkillCategory {
  _id?: string;
  id?: number;
  title: string;
  skills: SkillItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  _id?: string;
  id: number;
  img?: string;
  role: string;
  company: string;
  date: string;
  desc: string;
  skills?: string[];
  priority?: number;
  doc?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  _id?: string;
  id: number;
  img?: string;
  school: string;
  date: string;
  grade?: string;
  desc: string;
  degree: string;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMember {
  name?: string;
  img?: string;
  linkedin?: string;
  github?: string;
}

export interface Project {
  _id?: string;
  id: number;
  title: string;
  date?: string;
  description: string;
  image: string;
  tags?: string[];
  category: string;
  github?: string;
  webapp?: string;
  member?: ProjectMember[];
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioData {
  bio: Bio | null;
  skills: SkillCategory[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
}

export interface Message {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: "new" | "read";
  createdAt?: string;
  updatedAt?: string;
}

export interface Analytics {
  _id?: string;
  totalVisits: number;
  dailyVisits: { date: string; count: number }[];
  messageCount?: number;
}

export type PortfolioResourceType =
  | "skills"
  | "experiences"
  | "education"
  | "projects";

export interface ReorderItem {
  _id: string;
  priority: number;
}
