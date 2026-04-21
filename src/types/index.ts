export interface ExperienceEntry {
  company: string
  role: string
  period: string
  type: 'full-time' | 'consultant'
  bullets: string[]
  techStack: string[]
  engagements?: ClientEngagement[]
}

export interface ClientEngagement {
  client: string
  location: string
  description: string
  bullets: string[]
  techStack: string[]
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export interface Project {
  title: string
  description: string
  techStack: string[]
  highlights: string[]
  link?: string
  type: 'enterprise' | 'personal' | 'research'
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  cover?: string
  content: string
}

export interface PersonalInfo {
  name: string
  initials: string
  title: string
  shortBio: string
  email: string
  linkedin: string
  github: string
}
