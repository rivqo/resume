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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { templates } from "@/lib/templates"
import type { SavedResume } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [newResumeName, setNewResumeName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null)

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchUserResumes = async () => {
      if (!session?.user) {
        if (status === "unauthenticated") {
          router.push("/login")
        }
        return
      }

      setUserName(session?.user?.name || session?.user?.email || "User")

      try {
        const q = query(
          collection(db, "resumes"),
          where("userId", "==", session?.user?.uid)
        )
        const snapshot = await getDocs(q)
        const resumes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SavedResume[]
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

    if (status !== "loading") {
      fetchUserResumes()
    }
  }, [session, status, router, toast])

  const handleCreateNewResume = async () => {
    try {
      if (!session?.user) return

      const newResume: SavedResume = {
        id: `resume_${Date.now()}`,
        name: newResumeName || "Untitled Resume",
        lastUpdated: new Date().toISOString(),
        templateId: "modern",
        userId: session?.user?.uid,
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

      await setDoc(doc(db, "resumes", newResume.id), newResume)

      toast({ title: "Resume created", description: "Your new resume has been created." })
      setIsDialogOpen(false)
      setNewResumeName("")

      // Navigate to builder with the new ID
      localStorage.setItem("currentResumeId", newResume.id)
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

  const handleEditResume = (resumeId: string) => {
    localStorage.setItem("currentResumeId", resumeId)
    router.push("/builder")
  }

  const handleDuplicateResume = async (resume: SavedResume) => {
    try {
      if (!session?.user) return

      const duplicateId = `resume_${Date.now()}`
      const duplicateResume: SavedResume = {
        ...resume,
        id: duplicateId,
        name: `${resume.name} (Copy)`,
        lastUpdated: new Date().toISOString(),
        userId: session?.user.uid,
      }

      await setDoc(doc(db, "resumes", duplicateId), duplicateResume)

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

  const confirmDeleteResume = async () => {
    if (!resumeToDelete || !session?.user) return

    try {
      await deleteDoc(doc(db, "resumes", resumeToDelete))

      const updatedResumes = savedResumes.filter((resume) => resume.id !== resumeToDelete)
      setSavedResumes(updatedResumes)

      const currentResumeId = localStorage.getItem("currentResumeId")
      if (currentResumeId === resumeToDelete) {
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
    } finally {
      setResumeToDelete(null)
    }
  }

  const handleDeleteResume = async (resumeId: string) => {
    setResumeToDelete(resumeId)
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
      <header className="sticky px-4 md:px-0 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex mx-auto h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-[#C5172E] to-blue-600 bg-clip-text text-transparent">Peak CV</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Welcome, {userName}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Resumes</h1>
              <p className="text-muted-foreground">Manage and create your professional resumes</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C5172E]">
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : savedResumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No resumes created yet</h3>
              <p className="mb-4 text-sm text-muted-foreground max-w-sm">
                You haven't created any resumes. Start by creating a new one to showcase your professional profile.
              </p>
              <Button className="bg-[#C5172E]" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Resume
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedResumes.map((resume) => (
                <Card key={resume.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg truncate pr-2" title={resume.name}>{resume.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mr-2">
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
                            onClick={() => {
                              // Use setTimeout to ensure DropdownMenu closes properly before opening AlertDialog
                              // This prevents pointer-events: none getting stuck on the body
                              setTimeout(() => setResumeToDelete(resume.id), 0)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="truncate">Template: {getTemplateName(resume.templateId)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Updated: {format(new Date(resume.lastUpdated), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full hover:bg-slate-50" onClick={() => handleEditResume(resume.id)}>
                      Open Resume
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={!!resumeToDelete} onOpenChange={(open) => !open && setResumeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteResume} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
