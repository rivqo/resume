import type { JSX } from "react"

export interface PersonalInfo {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  description: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  description: string
  bullets: string[]
}

export interface Project {
  id: string
  title: string
  link: string
  startDate: string
  endDate: string
  description: string
  bullets: string[]
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: string[]
  sectionOrder: string[]
}

export interface Template {
  id: string
  name: string
  component: (props: { resumeData: ResumeData }) => JSX.Element
}

export interface SavedResume {
  id: string
  name: string
  userId: string
  lastUpdated: string
  templateId: string
  data: ResumeData
}
