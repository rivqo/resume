import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ResumeData } from "@/lib/types"

interface PersonalInfoFormProps {
    resumeData: ResumeData
    updatePersonalInfo: (field: string, value: string) => void
}

export function PersonalInfoForm({ resumeData, updatePersonalInfo }: PersonalInfoFormProps) {
    return (
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
    )
}
