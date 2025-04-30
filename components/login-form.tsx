"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleAuthButton } from "@/components/auth-button"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
  
      try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        // const token = await result.user.getIdToken()
  
        const nextAuthRes = await signIn("credentials", {
          redirect: false,
          email,
          password, // <- pass the Firebase token
        })
  
        if (nextAuthRes?.ok) {
          router.push("/dashboard")
        } else {
          throw new Error(nextAuthRes?.error || "Login failed")
        }
      } catch (err: any) {
        console.error(err)
        toast({
            title: "Login failed",
            description: "Login error: " + err.message,
            variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

  return (
        <>
          <CardContent className="grid gap-4">
            <GoogleAuthButton text="Sign in" />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </Link>
            </div>
          </CardFooter>
      </>
  )
}
