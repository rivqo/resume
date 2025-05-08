"use client"

import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, Download, Plus, Save } from "lucide-react"
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
import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import LoginForm from "@/components/login-form"

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [activeTab, setActiveTab] = useState("edit")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingSave, setPendingSave] = useState(false)
  const [resumeName, setResumeName] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()
  const { data: session, status } = useSession() // ✅ move hook call here

  const openLoginModal = () => {
    setShowLoginModal(true); // or dispatch modal open state if using context/store
  }

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    if (pendingSave && session?.user?.email) {
      handleSave();
      const pending = localStorage.getItem("pendingResumeSave");
      if (pending) {
        setResumeData(JSON.parse(pending));
        localStorage.removeItem("pendingResumeSave");
      }
      setPendingSave(false);
    }
  }, [showLoginModal, session?.user?.email]);

  const handleSave = async () => {
    try {
      if (!session?.user?.email) {
        const resumeId = localStorage.getItem("currentResumeId") || `resume_${Date.now()}`
        const pendingResume: SavedResume = {
          id: resumeId,
          name: resumeName,
          lastUpdated: new Date().toISOString(),
          templateId: selectedTemplate.id,
          data: resumeData,
          userId: "", // No user yet
        }
  
        localStorage.setItem("pendingResumeSave", JSON.stringify(pendingResume));
        setPendingSave(true);
        openLoginModal();
        return;
      }
  
      // Try to use pendingResume if available
      const pending = localStorage.getItem("pendingResumeSave");
      const resumeToSave: SavedResume = 
      pending
        ? { ...JSON.parse(pending), userId: session.user.uid }
        : 
        {
            id: localStorage.getItem("currentResumeId") || `resume_${Date.now()}`,
            name: resumeName,
            lastUpdated: new Date().toISOString(),
            templateId: selectedTemplate.id,
            data: resumeData,
            userId: session.user.uid || "",
          };
  
      await setDoc(doc(db, "resumes", resumeToSave.id), resumeToSave);
  
      localStorage.removeItem("pendingResumeSave");
  
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume.",
        variant: "destructive",
      });
    }
  };
  

  // const handleSave = async () => {
  //   try {
  //     if (!session?.user?.email) {
  //       setPendingSave(true); 
  //       openLoginModal(); // This should be your function to open the modal
  //       return;
  //     }
  //     const resumeId = localStorage.getItem("currentResumeId") || `resume_${Date.now()}`
  //     localStorage.setItem("currentResumeId", resumeId)
  
  //     const savedResume: SavedResume = {
  //       id: resumeId,
  //       name: resumeName,
  //       lastUpdated: new Date().toISOString(),
  //       templateId: selectedTemplate.id,
  //       data: resumeData,
  //       userId: session?.user?.uid || "",
  //     }
  
  //     await setDoc(doc(db, "resumes", resumeId), savedResume)
  
  //     toast({
  //       title: "Resume saved",
  //       description: "Your resume has been saved successfully.",
  //     })
  //   } catch (error) {
  //     console.error("Error saving resume:", error)
  //     toast({
  //       title: "Error saving resume",
  //       description: "There was an error saving your resume.",
  //       variant: "destructive",
  //     })
  //   }
  // }

  function copyComputedStyles(source: HTMLElement, target: HTMLElement) {
    const computed = window.getComputedStyle(source);
    for (const key of computed) {
      target.style.setProperty(key, computed.getPropertyValue(key), computed.getPropertyPriority(key));
    }
  
    Array.from(source.children).forEach((srcChild, i) => {
      const tgtChild = target.children[i] as HTMLElement;
      if (tgtChild) copyComputedStyles(srcChild as HTMLElement, tgtChild);
    });
  }

  const handleDownload = () => {
    try {
      setIsGeneratingPDF(true);

      // Get the resume preview element
      const resumeElement = document.getElementById("resume-container");
      if (!resumeElement) {
        throw new Error("Resume preview element not found");
      }

      resumeElement.classList.add("print");

      // Initialize jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Save the generated PDF
      pdf.html(resumeElement, {
        callback: (doc) => {
          const pos = resumeData.personalInfo.firstName + " " + resumeData.personalInfo.lastName + " " + resumeData.personalInfo.title + " Resume" ;
          doc.save(`${resumeName || pos}.pdf`);
          resumeElement.classList.remove("print");
        },
        margin: [20, 0, 20, 0],
        html2canvas: { scale: 0.26 }, // Optional: If you still want to handle images or complex styles
      });
      toast({
        title: "PDF generated",
        description: "Your resume has been downloaded as a PDF.",
      });
      // document.body.removeChild(pdfContainer);
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
    const loadResumeFromFirebase = async () => {
      const currentResumeId = localStorage.getItem("currentResumeId")
      const email = session?.user?.email
      if (!email) return
  
      try {
        const q = query(collection(db, "resumes"), where("userId", "==", session?.user?.uid))
        const querySnapshot = await getDocs(q)
        const resumes: SavedResume[] = []
  
        querySnapshot.forEach((doc) => resumes.push(doc.data() as SavedResume))
  
        const currentResume = resumes.find((r) => r.id === currentResumeId)
        if (currentResume) {
          setResumeData(currentResume.data)
          setResumeName(currentResume.name)
          const template = templates.find((t) => t.id === currentResume.templateId)
          if (template) setSelectedTemplate(template)
        }
  
        const selectedTemplateId = localStorage.getItem("selectedTemplate")
        if (selectedTemplateId) {
          const selected = templates.find((t) => t.id === selectedTemplateId)
          if (selected) setSelectedTemplate(selected)
          localStorage.removeItem("selectedTemplate")
        }
      } catch (error) {
        console.error("Error loading resume from Firestore:", error)
      }
    }
  
    loadResumeFromFirebase()
  }, [session?.user?.email])
  

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
                onSelectTemplate={setSelectedTemplate}
              />
            </div>
          ) : (
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
              <Button size="sm" className="bg-[#C5172E]" onClick={handleDownload} disabled={isGeneratingPDF}>
                <Download className="mr-2 h-4 w-4" />
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 px-4 md:px-0 bg-white">
        <Dialog  open={showLoginModal} onOpenChange={setShowLoginModal}>
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
        <div id="resume-container" style={{position: "absolute", top: 0, zIndex: -1}} className='pdf-container'>
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
                {/* <div id="pdf-container" style={{ position: 'absolute', top: '-10000px', width: '210mm', minHeight: '297mm', padding: '20mm', background: 'white' }} /> */}
                <div id="resume-preview">
                  <ResumePreview resumeData={resumeData} template={selectedTemplate} />
                </div>
              </TabsContent>
            </Tabs>
            {activeTab == "preview" && (
              <div className="sticky bottom-8 right-4 flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
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
