import type { ResumeData } from "./types"

export const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "linkedin.com/in/johndoe",
    summary:
      "Experienced software engineer with a passion for building scalable web applications. Skilled in JavaScript, TypeScript, React, and Node.js.",
  },
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2015-08-15",
      endDate: "2019-05-20",
      description: "Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development.",
    },
  ],
  experience: [
    {
      id: "1",
      company: "Tech Solutions Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2021-06-01",
      endDate: "",
      description: "Lead developer for the company's main web application.",
      bullets: [
        "Architected and implemented a new frontend using React and TypeScript",
        "Improved application performance by 40% through code optimization",
        "Mentored junior developers and conducted code reviews",
      ],
    },
    {
      id: "2",
      company: "StartUp Co.",
      position: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "2019-07-15",
      endDate: "2021-05-30",
      description: "Full-stack developer working on the company's SaaS platform.",
      bullets: [
        "Developed RESTful APIs using Node.js and Express",
        "Implemented authentication and authorization using JWT",
        "Collaborated with designers to implement responsive UI components",
      ],
    },
  ],
  projects: [
    {
      id: "1",
      title: "Personal Portfolio Website",
      link: "https://johndoe.dev",
      startDate: "2022-01-10",
      endDate: "2022-02-15",
      description: "A personal website showcasing my projects and skills.",
      bullets: [
        "Designed and developed a responsive website using React and Next.js",
        "Implemented dark mode and animations using Framer Motion",
        "Optimized for performance and accessibility",
      ],
    },
  ],
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "HTML/CSS", "Git", "RESTful APIs", "SQL", "MongoDB"],
  sectionOrder: ["summary", "experience", "projects", "education", "skills"],
}
