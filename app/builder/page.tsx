"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Download, Save, Loader2, CheckCircle } from "lucide-react"
import { jsPDF } from "jspdf"
import "@/lib/Roboto-VariableFont_wdth,wght-normal"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeEditor } from "@/components/resume-editor"
import { ResumePreview } from "@/components/resume-preview"
import { TemplateSelector } from "@/components/template-selector"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { templates } from "@/lib/templates"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import LoginForm from "@/components/login-form"
import { useResume } from "@/hooks/use-resume"

export default function BuilderPage() {
  const [resumeId, setResumeId] = useState<string | null>(null)

  // Initialize resumeId from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("currentResumeId")
      setResumeId(id)
    }
  }, [])

  const {
    resumeData,
    setResumeData,
    resumeName,
    templateId,
    setTemplateId,
    isLoading,
    isSaving,
    lastSaved,
  } = useResume(resumeId)

  const [activeTab, setActiveTab] = useState("edit")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()
  const { data: session } = useSession()

  const selectedTemplate = templates.find((t) => t.id === templateId) || templates[0]

  const openLoginModal = () => {
    setShowLoginModal(true);
  }

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleDownload = async () => {
    try {
      setIsGeneratingPDF(true);

      const resumeElement = document.getElementById("resume-container");
      if (!resumeElement) {
        throw new Error("Resume preview element not found");
      }

      // Temporarily make visible for capture
      resumeElement.classList.add("print");

      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Handle multi-page if content is long
      let heightLeft = pdfImgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfImgHeight);
      heightLeft -= pdfHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - pdfImgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfImgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = resumeName || `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} Resume`;
      pdf.save(`${fileName}.pdf`);

      resumeElement.classList.remove("print");

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
      document.getElementById("resume-container")?.classList.remove("print");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading && resumeId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 md:px-0 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex mx-auto h-16 items-center">
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span className="font-medium">Back</span>
          </Link>
          {isMobile ? (
            <div className="ml-auto flex items-center gap-2">
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={(t) => setTemplateId(t.id)}
              />
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              <div className="mr-4 flex items-center gap-2 text-sm text-muted-foreground">
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Saved
                  </>
                ) : null}
              </div>
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={(t) => setTemplateId(t.id)}
              />

              <Button size="sm" className="bg-[#C5172E]" onClick={handleDownload} disabled={isGeneratingPDF}>
                <Download className="mr-2 h-4 w-4" />
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 px-4 md:px-0 bg-white">
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log in to save your resume</DialogTitle>
              <DialogDescription>
                Log in to save your resume and access it from any device.
              </DialogDescription>
            </DialogHeader>
            <LoginForm nextPage={false} closeModal={closeLoginModal} />
          </DialogContent>
        </Dialog>
        <div id="resume-container" style={{ position: "absolute", top: 0, zIndex: -1 }} className='pdf-container'>
          <ResumePreview resumeData={resumeData} template={selectedTemplate} />
        </div>
        {isMobile ? (
          <div className="container py-4 mx-auto max-w-screen-md min-h-screen">
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
            {activeTab == "preview" && (
              <div className="sticky bottom-8 right-4 flex justify-center gap-2">
                <Button size="sm" className="bg-[#C5172E]" onClick={handleDownload} disabled={isGeneratingPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  {isGeneratingPDF ? "Generating..." : "Download PDF"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="container grid mx-auto grid-cols-1 gap-4 py-4 lg:grid-cols-2">
            <div className="overflow-auto p-4">
              <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} />
            </div>
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-auto rounded-lg border bg-white p-4 shadow">
              <div id="pdf-container" style={{ position: 'absolute', top: '-10000px', width: '210mm', minHeight: '297mm', padding: '20mm', background: 'white' }} />
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
