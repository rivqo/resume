"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { ResumeData } from "@/lib/types"
import { PersonalInfoForm } from "./editor/personal-info-form"
import { EducationSection } from "./editor/education-section"
import { ExperienceSection } from "./editor/experience-section"
import { ProjectsSection } from "./editor/projects-section"
import { SkillsSection } from "./editor/skills-section"

import { ReorderSectionsDialog } from "./editor/reorder-sections-dialog"

interface ResumeEditorProps {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
}

export function ResumeEditor({ resumeData, setResumeData }: ResumeEditorProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    })
  }

  const setSectionOrder = (order: string[]) => {
    setResumeData({
      ...resumeData,
      sectionOrder: order
    })
  }

  // Ensure sectionOrder has a default value if missing
  const currentSectionOrder = resumeData.sectionOrder || ["summary", "experience", "projects", "education", "skills"]

  return (
    <div className="space-y-6">
      <ReorderSectionsDialog sectionOrder={currentSectionOrder} setSectionOrder={setSectionOrder} />

      <Accordion type="single" collapsible defaultValue="personal-info">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Information</AccordionTrigger>
          <AccordionContent>
            <PersonalInfoForm resumeData={resumeData} updatePersonalInfo={updatePersonalInfo} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>Education</AccordionTrigger>
          <AccordionContent>
            <EducationSection resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Work Experience</AccordionTrigger>
          <AccordionContent>
            <ExperienceSection resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="projects">
          <AccordionTrigger>Projects</AccordionTrigger>
          <AccordionContent>
            <ProjectsSection resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger>Skills</AccordionTrigger>
          <AccordionContent>
            <SkillsSection resumeData={resumeData} setResumeData={setResumeData} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
