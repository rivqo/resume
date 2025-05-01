"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleAuthButton } from "@/components/auth-button"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login - in a real app, this would authenticate with a backend
    setTimeout(() => {
      setIsLoading(false)
      // Store some user info in localStorage to simulate being logged in
      localStorage.setItem("user", JSON.stringify({ email }))
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="container px-4 md:px-6 flex mx-auto h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email to sign in to your account</CardDescription>
          </CardHeader>
          <LoginForm />
        </Card>
      </div>
    </div>
  )
}
