"use client"
import { PlusCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { ResumeData } from "@/lib/types"

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

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    })
  }

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })
  }

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    })
  }

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          bullets: [""],
        },
      ],
    })
  }

  const updateExperience = (id: string, field: string, value: string | string[]) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    })
  }

  const addBullet = (experienceId: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === experienceId ? { ...exp, bullets: [...exp.bullets, ""] } : exp,
      ),
    })
  }

  const updateBullet = (experienceId: string, index: number, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) => {
        if (exp.id === experienceId) {
          const newBullets = [...exp.bullets]
          newBullets[index] = value
          return { ...exp, bullets: newBullets }
        }
        return exp
      }),
    })
  }

  const removeBullet = (experienceId: string, index: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) => {
        if (exp.id === experienceId) {
          const newBullets = [...exp.bullets]
          newBullets.splice(index, 1)
          return { ...exp, bullets: newBullets }
        }
        return exp
      }),
    })
  }

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          id: Date.now().toString(),
          title: "",
          link: "",
          startDate: "",
          endDate: "",
          description: "",
          bullets: [""],
        },
      ],
    })
  }

  const updateProject = (id: string, field: string, value: string | string[]) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
    })
  }

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter((project) => project.id !== id),
    })
  }

  const addProjectBullet = (projectId: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((project) =>
        project.id === projectId ? { ...project, bullets: [...project.bullets, ""] } : project,
      ),
    })
  }

  const updateProjectBullet = (projectId: string, index: number, value: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((project) => {
        if (project.id === projectId) {
          const newBullets = [...project.bullets]
          newBullets[index] = value
          return { ...project, bullets: newBullets }
        }
        return project
      }),
    })
  }

  const removeProjectBullet = (projectId: string, index: number) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map((project) => {
        if (project.id === projectId) {
          const newBullets = [...project.bullets]
          newBullets.splice(index, 1)
          return { ...project, bullets: newBullets }
        }
        return project
      }),
    })
  }

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ""],
    })
  }

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...resumeData.skills]
    newSkills[index] = value
    setResumeData({
      ...resumeData,
      skills: newSkills,
    })
  }

  const removeSkill = (index: number) => {
    const newSkills = [...resumeData.skills]
    newSkills.splice(index, 1)
    setResumeData({
      ...resumeData,
      skills: newSkills,
    })
  }

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible defaultValue="personal-info">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Information</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={resumeData.personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={resumeData.personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={resumeData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo("title", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website/LinkedIn</Label>
                <Input
                  id="website"
                  value={resumeData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>Education</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                <Card key={edu.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Education Entry</h4>
                      <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                        <Input
                          id={`institution-${edu.id}`}
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                          <Input
                            id={`degree-${edu.id}`}
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                          <Input
                            id={`field-${edu.id}`}
                            value={edu.fieldOfStudy}
                            onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`start-date-${edu.id}`}>Start Date</Label>
                          <DatePicker
                            date={edu.startDate ? new Date(edu.startDate) : undefined}
                            setDate={(date) => updateEducation(edu.id, "startDate", date.toISOString().split("T")[0])}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`end-date-${edu.id}`}>End Date</Label>
                          <DatePicker
                            date={edu.endDate ? new Date(edu.endDate) : undefined}
                            setDate={(date) => updateEducation(edu.id, "endDate", date.toISOString().split("T")[0])}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`edu-description-${edu.id}`}>Description</Label>
                        <Textarea
                          id={`edu-description-${edu.id}`}
                          rows={3}
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full" onClick={addEducation}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Work Experience</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {resumeData.experience.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Experience Entry</h4>
                      <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`company-${exp.id}`}>Company</Label>
                        <Input
                          id={`company-${exp.id}`}
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`position-${exp.id}`}>Position</Label>
                          <Input
                            id={`position-${exp.id}`}
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`location-${exp.id}`}>Location</Label>
                          <Input
                            id={`location-${exp.id}`}
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`exp-start-date-${exp.id}`}>Start Date</Label>
                          <DatePicker
                            date={exp.startDate ? new Date(exp.startDate) : undefined}
                            setDate={(date) => updateExperience(exp.id, "startDate", date.toISOString().split("T")[0])}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`exp-end-date-${exp.id}`}>End Date</Label>
                          <DatePicker
                            date={exp.endDate ? new Date(exp.endDate) : undefined}
                            setDate={(date) => {
                              if (date) {
                                updateExperience(exp.id, "endDate", date.toISOString().split("T")[0])
                              } else {
                                updateExperience(exp.id, "endDate", "")
                              }
                            }}
                            allowEmpty={true}
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`exp-description-${exp.id}`}>Description</Label>
                        <Textarea
                          id={`exp-description-${exp.id}`}
                          rows={3}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bullet Points</Label>
                        {exp.bullets.map((bullet, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={bullet}
                              onChange={(e) => updateBullet(exp.id, index, e.target.value)}
                              placeholder={`Bullet point ${index + 1}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBullet(exp.id, index)}
                              disabled={exp.bullets.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => addBullet(exp.id)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Bullet
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full" onClick={addExperience}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="projects">
          <AccordionTrigger>Projects</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {resumeData.projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Project Entry</h4>
                      <Button variant="ghost" size="icon" onClick={() => removeProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`title-${project.id}`}>Project Title</Label>
                        <Input
                          id={`title-${project.id}`}
                          value={project.title}
                          onChange={(e) => updateProject(project.id, "title", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`link-${project.id}`}>Project Link</Label>
                        <Input
                          id={`link-${project.id}`}
                          value={project.link}
                          onChange={(e) => updateProject(project.id, "link", e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`project-start-date-${project.id}`}>Start Date</Label>
                          <DatePicker
                            date={project.startDate ? new Date(project.startDate) : undefined}
                            setDate={(date) => updateProject(project.id, "startDate", date.toISOString().split("T")[0])}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`project-end-date-${project.id}`}>End Date</Label>
                          <DatePicker
                            date={project.endDate ? new Date(project.endDate) : undefined}
                            setDate={(date) => {
                              if (date) {
                                updateProject(project.id, "endDate", date.toISOString().split("T")[0])
                              } else {
                                updateProject(project.id, "endDate", "")
                              }
                            }}
                            allowEmpty={true}
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                        <Textarea
                          id={`project-description-${project.id}`}
                          rows={3}
                          value={project.description}
                          onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bullet Points</Label>
                        {project.bullets.map((bullet, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={bullet}
                              onChange={(e) => updateProjectBullet(project.id, index, e.target.value)}
                              placeholder={`Bullet point ${index + 1}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProjectBullet(project.id, index)}
                              disabled={project.bullets.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => addProjectBullet(project.id)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Bullet
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full" onClick={addProject}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger>Skills</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder={`Skill ${index + 1}`}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={addSkill}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date) => void
  allowEmpty?: boolean
  placeholder?: string
}

function DatePicker({ date, setDate, allowEmpty = false, placeholder = "Pick a date" }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            if (date) {
              setDate(date)
              setOpen(false)
            } else if (allowEmpty) {
              // Handle empty selection if allowed
              setOpen(false)
            }
          }}
          initialFocus
        />
        {allowEmpty && (
          <div className="border-t p-3">
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={() => {
                setDate(new Date(0)) // Use a placeholder date that will be ignored
                setOpen(false)
              }}
            >
              Clear / Present
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
