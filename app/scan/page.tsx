"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Upload, FileText, Check, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function ScanPage() {
    const router = useRouter()
    const { toast } = useToast()

    const [file, setFile] = useState<File | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [scanResult, setScanResult] = useState<any | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setScanResult(null)
        }
    }

    const handleScan = async () => {
        if (!file) return

        setIsScanning(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/ai/scan", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Scan failed")
            }

            const data = await response.json()
            setScanResult(data)
            toast({
                title: "Scan Completed",
                description: "Your resume has been analyzed successfully.",
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Scan Failed",
                description: "There was an error scanning your resume.",
                variant: "destructive",
            })
        } finally {
            setIsScanning(false)
        }
    }

    const handleImport = () => {
        if (scanResult?.data) {
            // Save to localStorage to be picked up by the builder
            localStorage.setItem("tempResumeData", JSON.stringify(scanResult.data))
            router.push("/builder")
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/30">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 md:px-0 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex mx-auto h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                        <span>ResumeAI</span>
                    </Link>
                    <div className="ml-auto flex items-center gap-4">
                        <Link href="/builder">
                            <Button variant="ghost">Builder</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto py-10 px-4 md:px-0">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">AI Resume Scanner</h1>
                        <p className="text-muted-foreground">
                            Upload your existing resume (PDF or DOCX) to get an instant review and convert it to our builder.
                        </p>
                    </div>

                    {!scanResult ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Resume</CardTitle>
                                <CardDescription>
                                    Supported formats: PDF, DOCX (Max 5MB)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
                                    <Label htmlFor="resume-file">Resume File</Label>
                                    <Input
                                        id="resume-file"
                                        type="file"
                                        accept=".pdf,.docx,.doc"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                {file && (
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
                                        <FileText className="h-4 w-4" />
                                        {file.name}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button onClick={handleScan} disabled={!file || isScanning} className="w-full sm:w-auto">
                                    {isScanning ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Scan & Analyze
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Scan Results</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-normal text-muted-foreground">Score:</span>
                                            <span className={`text-xl font-bold ${scanResult.review.score >= 80 ? 'text-green-600' :
                                                    scanResult.review.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {scanResult.review.score}/100
                                            </span>
                                        </div>
                                    </CardTitle>
                                    <CardDescription>{scanResult.review.summary}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <h3 className="font-semibold flex items-center text-green-700">
                                                <Check className="mr-2 h-4 w-4" /> Strengths
                                            </h3>
                                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                                {scanResult.review.strengths.map((s: string, i: number) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold flex items-center text-red-600">
                                                <AlertCircle className="mr-2 h-4 w-4" /> Improvements
                                            </h3>
                                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                                {scanResult.review.weaknesses.map((w: string, i: number) => (
                                                    <li key={i}>{w}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="font-semibold mb-2">Parsed Data Preview</h3>
                                        <div className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-40">
                                            {JSON.stringify(scanResult.data.personalInfo, null, 2)}
                                            {/* Truncated for display */}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={() => setScanResult(null)}>
                                        Upload Another
                                    </Button>
                                    <Button onClick={handleImport} className="bg-[#C5172E]">
                                        Import to Builder <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
