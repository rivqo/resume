"use client"

import type { ResumeData, Template } from "@/lib/types"

interface ResumePreviewProps {
  resumeData: ResumeData
  template: Template
}

export function ResumePreview({ resumeData, template }: ResumePreviewProps) {
  // Render the selected template with the resume data
  return <div className="h-full w-full">{template.component({ resumeData })}</div>
}
