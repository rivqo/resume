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

interface EducationSectionProps {
    resumeData: ResumeData
    setResumeData: (data: ResumeData) => void
}

export function EducationSection({ resumeData, setResumeData }: EducationSectionProps) {
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

    return (
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
    )
}
