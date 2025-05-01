"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { templates } from "@/lib/templates"
import { defaultResumeData } from "@/lib/default-data"

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const router = useRouter()

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Store the selected template in localStorage
    localStorage.setItem("selectedTemplate", templateId)
    // Redirect to builder page
    router.push("/builder")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 md:px-0 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex mx-auto h-16 items-center">
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="ml-auto">
            <Link href="/builder">
              <Button variant="outline" size="sm">
                Skip to Builder
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8 mx-auto px-4 md:px-0">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Choose a Template</h1>
            <p className="mt-2 text-muted-foreground">
              Select from our professional templates to get started with your resume
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`overflow-hidden transition-all border-[#C5172E] ${
                  selectedTemplate === template.id ? "ring-2 ring-primary" : "hover:shadow-md"
                }`}
              >
                <div className="relative aspect-[3/4] overflow-hidden border-b border-[#C5172E]">
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <div className="h-full w-full scale-[0.7] transform overflow-hidden bg-white p-4">
                      {template.component({ resumeData: defaultResumeData })}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 bg-gradient-to-t from-[#F6B2BB] to-[#FFE6E9]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{template.name}</h3>
                    <Button size="sm" className="bg-[#C5172E]" onClick={() => handleSelectTemplate(template.id)}>
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
