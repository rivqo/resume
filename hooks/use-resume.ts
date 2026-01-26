import { useState, useEffect, useCallback, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { ResumeData, SavedResume } from '@/lib/types'
import { defaultResumeData } from '@/lib/default-data'

// Simple debounce hook implementation inside since it's small
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

export function useResume(resumeId: string | null) {
    const { data: session } = useSession()
    const { toast } = useToast()

    const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
    const [resumeName, setResumeName] = useState("")
    const [templateId, setTemplateId] = useState("modern")

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    // Use refs to track if changes are from user or initial load
    const isInitialLoad = useRef(true)

    // Debounce the changing data
    const debouncedData = useDebounce({ resumeData, resumeName, templateId }, 2000)

    // Load resume on mount
    useEffect(() => {
        const loadResume = async () => {
            if (!resumeId || !session?.user?.uid) {
                setIsLoading(false)
                return
            }

            try {
                const docRef = doc(db, "resumes", resumeId)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data() as SavedResume
                    setResumeData(data.data)
                    setResumeName(data.name)
                    setTemplateId(data.templateId)
                    setLastSaved(new Date(data.lastUpdated))
                }
            } catch (error) {
                console.error("Error loading resume:", error)
                toast({
                    title: "Error loading resume",
                    description: "Could not fetch resume data.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
                isInitialLoad.current = false
            }
        }

        loadResume()
    }, [resumeId, session?.user?.uid, toast])

    // Auto-save effect
    useEffect(() => {
        // Skip save on initial load or if no resumeId/user
        if (isInitialLoad.current || !resumeId || !session?.user?.uid) return

        const saveResume = async () => {
            setIsSaving(true)
            try {
                let nameToSave = debouncedData.resumeName;
                const { firstName, lastName } = debouncedData.resumeData.personalInfo;

                // Auto-generate name if it's default or empty, and we have personal info
                if ((!nameToSave || nameToSave.trim() === "" || nameToSave === "Untitled Resume") && (firstName || lastName)) {
                    nameToSave = `${firstName} ${lastName} Resume`.trim();
                    // We also need to update the local state so the UI reflects it
                    // However, we should be careful not to cause loops. 
                    // Since this effect depends on debouncedData, updating state will trigger it again eventually.
                    // But if nameToSave equals the new calculated name, it typically stabilizes.
                    // To avoid flicker/loop issues, we might defer this state update or just save it to DB.
                    // A better approach for the UI: Only update if we are sure.
                    // Let's just save it to DB for now, and optionally update state if it differs.
                    if (nameToSave !== resumeName) {
                        setResumeName(nameToSave);
                    }
                }

                const docRef = doc(db, "resumes", resumeId)
                const updateData: Partial<SavedResume> = {
                    id: resumeId,
                    name: nameToSave,
                    data: debouncedData.resumeData,
                    templateId: debouncedData.templateId,
                    lastUpdated: new Date().toISOString(),
                    userId: session.user.uid,
                }

                await setDoc(docRef, updateData, { merge: true })

                setLastSaved(new Date())
                // Optional: Silent toast or indicator? mostly indicator is better
            } catch (error) {
                console.error("Error auto-saving:", error)
                toast({
                    title: "Auto-save failed",
                    description: "Check your internet connection.",
                    variant: "destructive",
                })
            } finally {
                setIsSaving(false)
            }
        }

        saveResume()
    }, [debouncedData, resumeId, session?.user?.uid, toast])

    return {
        resumeData,
        setResumeData,
        resumeName,
        setResumeName,
        templateId,
        setTemplateId,
        isLoading,
        isSaving,
        lastSaved,
    }
}
