'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
  )
}
