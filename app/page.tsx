"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession() // ✅ move hook call here

  useEffect(() => {
    if (session?.user?.email) {
      router.push("/dashboard")
      return
    }

  }, [session, router])
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full px-4 md:px-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex mx-auto h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <img src="/peakCV.png" alt="Peak CV logo" className="h-12 w-full" />
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-[#C5172E]">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-[#C5172E]">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-t from-[#F6B2BB] via-[#FFE6E9] to-[#ffffff] rounded-b-lg">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col justify-center items-center space-y-4 mb-10">
                <div className="space-y-4 flex-col items-center justify-center">
                  <h1 className="text-4xl text-center max-w-full md:max-w-[700px] font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create professional resumes in minutes
                  </h1>
                  <p className="text-muted-foreground text-center md:text-xl">
                    Build ATS-ready CVs in minutes with our easy-to-use resume builder.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row items-center justify-center">
                  <Link href="/templates">
                    <Button size="lg" className="w-full transition-all  text-xl py-8 px-8 ease-in-out bg-[#C5172E] hover:bg-[#4A102A]">
                      Start Building <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/resume-pic.png"
                  alt="Resume Builder Preview"
                  width={750}
                  height={450}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#C5172E] text-[#FFE6E9]">
          <div className="container px-4 mx-auto md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
              <p className="max-w-[85%] text-muted-foreground text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to create professional resumes that stand out
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-[#4A102A] p-6 shadow-sm bg-[#A51326]">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Live Preview</h3>
                <p className="text-center text-white">
                  See changes to your resume in real-time as you edit your information
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-[#4A102A] p-6 shadow-sm bg-[#A51326]">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M3 9h18"></path>
                    <path d="M9 21V9"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Multiple Templates</h3>
                <p className="text-center text-white">
                  Choose from a variety of professional templates to make your resume stand out
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-[#4A102A] p-6 shadow-sm bg-[#A51326]">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">PDF Download</h3>
                <p className="text-center text-white">
                  Download your resume as a professional PDF ready to send to employers
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex mx-auto flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Rivqo Digital LTD. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
