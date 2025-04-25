"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Download, Save } from "lucide-react"
import { jsPDF } from "jspdf"
import "@/lib/Roboto-VariableFont_wdth,wght-normal"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeEditor } from "@/components/resume-editor"
import { ResumePreview } from "@/components/resume-preview"
import { TemplateSelector } from "@/components/template-selector"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import type { ResumeData, Template, SavedResume } from "@/lib/types"
import { defaultResumeData } from "@/lib/default-data"
import { templates } from "@/lib/templates"

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [activeTab, setActiveTab] = useState("edit")
  const [resumeName, setResumeName] = useState("My Resume")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()

  const handleSave = () => {
    try {
      // Create a unique ID for the resume
      const resumeId = localStorage.getItem("currentResumeId") || `resume_${Date.now()}`

      // Create the saved resume object
      const savedResume: SavedResume = {
        id: resumeId,
        name: resumeName,
        lastUpdated: new Date().toISOString(),
        templateId: selectedTemplate.id,
        data: resumeData,
      }

      // Save to localStorage
      localStorage.setItem("currentResumeId", resumeId)

      // Get existing resumes or initialize empty array
      const savedResumesString = localStorage.getItem("savedResumes")
      const savedResumes: SavedResume[] = savedResumesString ? JSON.parse(savedResumesString) : []

      // Update or add the current resume
      const existingIndex = savedResumes.findIndex((resume) => resume.id === resumeId)
      if (existingIndex >= 0) {
        savedResumes[existingIndex] = savedResume
      } else {
        savedResumes.push(savedResume)
      }

      // Save the updated resumes array
      localStorage.setItem("savedResumes", JSON.stringify(savedResumes))

      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving resume:", error)
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  // const handleDownload = async () => {
  //   try {
  //     setIsGeneratingPDF(true)

  //     // Get the resume preview element
  //     const resumeElement = document.getElementById("resume-preview")
  //     if (!resumeElement) {
  //       throw new Error("Resume preview element not found")
  //     }

  //     // Create a canvas from the resume element
  //     const canvas = await html2canvas(resumeElement, {
  //       scale: 3, // Higher scale for better quality
  //       useCORS: true,
  //       logging: false,
  //       backgroundColor: "#ffffff",
  //     })

  //     // Calculate dimensions to fit on A4
  //     const imgData = canvas.toDataURL("image/png")
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     })

  //     const pdfWidth = pdf.internal.pageSize.getWidth()
  //     const pdfHeight = pdf.internal.pageSize.getHeight()
  //     const canvasRatio = canvas.height / canvas.width
  //     const imgWidth = pdfWidth
  //     const imgHeight = pdfWidth * canvasRatio

  //     // Add the image to the PDF
  //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

  //     // If the resume is longer than one page, add additional pages
  //     if (imgHeight > pdfHeight) {
  //       let remainingHeight = imgHeight
  //       let currentPosition = -pdfHeight

  //       while (remainingHeight > pdfHeight) {
  //         pdf.addPage()
  //         pdf.addImage(imgData, "PNG", 0, currentPosition, imgWidth, imgHeight)
  //         remainingHeight -= pdfHeight
  //         currentPosition -= pdfHeight
  //       }
  //     }

  //     // Save the PDF
  //     pdf.save(`${resumeName || "resume"}.pdf`)

  //     toast({
  //       title: "PDF generated",
  //       description: "Your resume has been downloaded as a PDF.",
  //     })
  //   } catch (error) {
  //     console.error("Error generating PDF:", error)
  //     toast({
  //       title: "Error generating PDF",
  //       description: "There was an error creating your PDF. Please try again.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsGeneratingPDF(false)
  //   }
  // }

  // const handleDownload = () => {
  //   try {
  //     setIsGeneratingPDF(true);
  
  //     // Get the resume preview element
  //     const resumeElement = document.getElementById("resume-preview");
  //     if (!resumeElement) {
  //       throw new Error("Resume preview element not found");
  //     }
  
  //     // Set options for pdf generation
  //     const opt = {
  //       margin: 10,
  //       filename: `${resumeName || "resume"}.pdf`,
  //       html2canvas: { 
  //         // Use the default html2canvas options for better rendering
  //         useCORS: true,
  //         logging: false
  //       },
  //       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  //     };
  
  //     // Generate PDF with html2pdf.js, now it renders text correctly
  //     html2pdf()
  //       .set(opt)
  //       .from(resumeElement)
  //       .save();
  
  //     toast({
  //       title: "PDF generated",
  //       description: "Your resume has been downloaded as a PDF.",
  //     });
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //     toast({
  //       title: "Error generating PDF",
  //       description: "There was an error creating your PDF. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsGeneratingPDF(false);
  //   }
  // };


  const handleDownload = () => {
    try {
      setIsGeneratingPDF(true);

      // Get the resume preview element
      const resumeElement = document.getElementById("resume-preview");
      if (!resumeElement) {
        throw new Error("Resume preview element not found");
      }

      // Initialize jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Save the generated PDF
      pdf.html(resumeElement, {
        callback: (doc) => {
          doc.save(`${resumeName || "resume"}.pdf`);
        },
        margin: [10, 10, 10, 10],
        html2canvas: { scale: 0.26 }, // Optional: If you still want to handle images or complex styles
      });

      toast({
        title: "PDF generated",
        description: "Your resume has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating PDF",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  useEffect(() => {
    let currentResumeId: string | null = null
    let savedResumesString: string | null = null
    let savedResumes: SavedResume[] = []

    try {
      // Load saved resume data if available
      currentResumeId = localStorage.getItem("currentResumeId")

      if (currentResumeId) {
        savedResumesString = localStorage.getItem("savedResumes")

        if (savedResumesString) {
          savedResumes = JSON.parse(savedResumesString)
          const currentResume = savedResumes.find((resume) => resume.id === currentResumeId)

          if (currentResume) {
            setResumeData(currentResume.data)
            setResumeName(currentResume.name)

            // Set the template
            const template = templates.find((t) => t.id === currentResume.templateId)
            if (template) {
              setSelectedTemplate(template)
            }
          }
        }
      }

      // Check if a template was selected from the templates page
      const selectedTemplateId = localStorage.getItem("selectedTemplate")
      if (selectedTemplateId) {
        const template = templates.find((t) => t.id === selectedTemplateId)
        if (template) {
          setSelectedTemplate(template)
        }
        // Clear the selection after loading
        localStorage.removeItem("selectedTemplate")
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex mx-auto h-16 items-center">
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={isGeneratingPDF}>
              <Download className="mr-2 h-4 w-4" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {isMobile ? (
          <div className="container py-4 mx-auto max-w-screen-md">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-4">
                <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div id="resume-preview">
                  <ResumePreview resumeData={resumeData} template={selectedTemplate} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="container grid mx-auto grid-cols-1 gap-4 py-4 lg:grid-cols-2">
            <div className="overflow-auto p-4">
              <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} />
            </div>
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-auto rounded-lg border bg-white p-4 shadow">
              <div id="resume-preview">
                <ResumePreview resumeData={resumeData} template={selectedTemplate} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
