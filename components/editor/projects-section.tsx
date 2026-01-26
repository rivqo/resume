import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Trash2, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { ResumeData } from "@/lib/types"

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
                                setDate(new Date(0))
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

interface ProjectsSectionProps {
    resumeData: ResumeData
    setResumeData: (data: ResumeData) => void
}

export function ProjectsSection({ resumeData, setResumeData }: ProjectsSectionProps) {
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

    return (
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
                                <Button variant="outline" size="sm" className="mt-2" onClick={() => addProjectBullet(project.id)}>
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
    )
}
