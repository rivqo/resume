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

interface ExperienceSectionProps {
    resumeData: ResumeData
    setResumeData: (data: ResumeData) => void
}

export function ExperienceSection({ resumeData, setResumeData }: ExperienceSectionProps) {
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

    return (
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
    )
}
