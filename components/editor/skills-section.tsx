import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Trash2 } from "lucide-react"
import type { ResumeData } from "@/lib/types"

interface SkillsSectionProps {
    resumeData: ResumeData
    setResumeData: (data: ResumeData) => void
}

export function SkillsSection({ resumeData, setResumeData }: SkillsSectionProps) {
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
    )
}
