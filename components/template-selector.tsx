"use client"

import { Check } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Template } from "@/lib/types"

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplate: Template
  onSelectTemplate: (template: Template) => void
}

export function TemplateSelector({ templates, selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <Select
      value={selectedTemplate.id}
      onValueChange={(value) => {
        const template = templates.find((t) => t.id === value)
        if (template) {
          onSelectTemplate(template)
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select template" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            <div className="flex items-center">
              {template.name}
              {template.id === selectedTemplate.id && <Check className="ml-2 h-4 w-4" />}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
