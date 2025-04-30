"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Plus, Calendar, MoreHorizontal, Edit, Copy, Trash2, LogOut } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { collection, getDocs, query, where, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { templates } from "@/lib/templates"
import type { SavedResume } from "@/lib/types"

export default function DashboardPage() {
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [newResumeName, setNewResumeName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession() // ✅ move hook call here

  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!session?.user?.email) {
        router.push("/login")
        return
      }

      setUserName(session?.user?.name || session?.user?.email || "User")

      try {
        const q = query(
          collection(db, "resumes"),
          where("userEmail", "==", session?.user.email)
        )
        const snapshot = await getDocs(q)
        const resumes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SavedResume[]
        console.log(resumes)
        setSavedResumes(resumes)
      } catch (error) {
        console.error("Error fetching resumes from Firestore:", error)
        toast({
          title: "Error loading resumes",
          description: "There was an error loading your saved resumes.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchUserResumes()
    }
  }, [session, status, router, toast])

  const handleCreateNewResume = async () => {
    try {
      // const { data: session } = useSession()
      if (!session?.user?.email) return
  
      const newResume: SavedResume = {
        id: `resume_${Date.now()}`,
        name: newResumeName || "Untitled Resume",
        lastUpdated: new Date().toISOString(),
        templateId: "modern",
        userEmail: session.user.email,
        data: {
                personalInfo: {
                  firstName: "",
                  lastName: "",
                  title: "",
                  email: "",
                  phone: "",
                  location: "",
                  website: "",
                  summary: "",
                },
                education: [],
                experience: [],
                projects: [],
                skills: [],
              },
      }
  
      await addDoc(collection(db, "resumes"), newResume)
  
      toast({ title: "Resume created", description: "Your new resume has been created." })
      setIsDialogOpen(false)
      setNewResumeName("")
      router.push("/builder")
    } catch (error) {
      console.error("Error creating new resume:", error)
      toast({
        title: "Error creating resume",
        description: "There was an error creating your new resume.",
        variant: "destructive",
      })
    }
  }

  // const handleCreateNewResume = () => {
  //   try {
  //     // Create a new resume with a unique ID
  //     const newResumeId = `resume_${Date.now()}`

  //     // Create the saved resume object
  //     const newResume: SavedResume = {
  //       id: newResumeId,
  //       name: newResumeName || "Untitled Resume",
  //       lastUpdated: new Date().toISOString(),
  //       templateId: "modern", // Default template
  //       data: {
  //         personalInfo: {
  //           firstName: "",
  //           lastName: "",
  //           title: "",
  //           email: "",
  //           phone: "",
  //           location: "",
  //           website: "",
  //           summary: "",
  //         },
  //         education: [],
  //         experience: [],
  //         projects: [],
  //         skills: [],
  //       },
  //     }

  //     // Update the saved resumes
  //     const updatedResumes = [...savedResumes, newResume]
  //     setSavedResumes(updatedResumes)
  //     localStorage.setItem("savedResumes", JSON.stringify(updatedResumes))

  //     // Set as current resume and redirect to builder
  //     localStorage.setItem("currentResumeId", newResumeId)

  //     toast({
  //       title: "Resume created",
  //       description: "Your new resume has been created.",
  //     })

  //     router.push("/builder")
  //   } catch (error) {
  //     console.error("Error creating new resume:", error)
  //     toast({
  //       title: "Error creating resume",
  //       description: "There was an error creating your new resume.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsDialogOpen(false)
  //     setNewResumeName("")
  //   }
  // }

  const handleEditResume = (resumeId: string) => {
    localStorage.setItem("currentResumeId", resumeId)
    router.push("/builder")
  }

  const handleDuplicateResume = async (resume: SavedResume) => {
    try {
      if (!session?.user?.email) return
  
      const duplicateId = `resume_${Date.now()}`
      const duplicateResume: SavedResume = {
        ...resume,
        id: duplicateId,
        name: `${resume.name} (Copy)`,
        lastUpdated: new Date().toISOString(),
        userEmail: session.user.email, // Ensure the user is tied to the duplicate
      }
  
      // Save to Firestore
      await setDoc(doc(db, "resumes", duplicateId), duplicateResume)
  
      // Update local state
      const updatedResumes = [...savedResumes, duplicateResume]
      setSavedResumes(updatedResumes)
  
      toast({
        title: "Resume duplicated",
        description: "A copy of your resume has been created.",
      })
    } catch (error) {
      console.error("Error duplicating resume:", error)
      toast({
        title: "Error duplicating resume",
        description: "There was an error creating a copy of your resume.",
        variant: "destructive",
      })
    }
  }
  
  const handleDeleteResume = async (resumeId: string) => {
    try {
      if (!session?.user?.email) return
  
      // Delete from Firestore
      await deleteDoc(doc(db, "resumes", resumeId))
  
      const updatedResumes = savedResumes.filter((resume) => resume.id !== resumeId)
      setSavedResumes(updatedResumes)
  
      // Clear current resume if it's being deleted
      const currentResumeId = localStorage.getItem("currentResumeId")
      if (currentResumeId === resumeId) {
        localStorage.removeItem("currentResumeId")
      }
  
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted.",
      })
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast({
        title: "Error deleting resume",
        description: "There was an error deleting your resume.",
        variant: "destructive",
      })
    }
  }
  
  const handleLogout = async () => {
    localStorage.removeItem("user")
    await signOut({ callbackUrl: "/login" })
  }

  const getTemplateName = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    return template ? template.name : "Unknown Template"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex mx-auto h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            <span className="font-bold">ResumeBuilder</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {userName}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8 mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Resumes</h1>
              <p className="text-muted-foreground">Manage and create your professional resumes</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Resume
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Resume</DialogTitle>
                  <DialogDescription>Give your resume a name to help you identify it later.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Resume Name</Label>
                    <Input
                      id="name"
                      value={newResumeName}
                      onChange={(e) => setNewResumeName(e.target.value)}
                      placeholder="e.g., Software Developer Resume"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewResume}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading your resumes...</p>
              </div>
            </div>
          ) : savedResumes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No resumes yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
                  Create your first resume to get started on your professional journey.
                </p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedResumes.map((resume) => (
                <Card key={resume.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{resume.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditResume(resume.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateResume(resume)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteResume(resume.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>Template: {getTemplateName(resume.templateId)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Last updated: {format(new Date(resume.lastUpdated), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full" onClick={() => handleEditResume(resume.id)}>
                      Open Resume
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
