// app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ClientProviders from "@/components/client-providers"
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  metadataBase: new URL('https://peakcv.rivqo.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  title: "peakCV - Create professional resumes in minutes",
  description: "Build ATS-ready CVs in minutes with our easy-to-use resume builder. Get hired faster with our AI-powered resume builder. Built by Rivqo Digital LTD",
  icons: {
    icon: "/fav.png",
  },
  openGraph: {
    type: "website",
    url: "https://peakcv.rivqo.com/",
    title: "peakCV - Create professional resumes in minutes",
    description: "Build ATS-ready CVs in minutes with our easy-to-use resume builder. Get hired faster with our AI-powered resume builder. Built by Rivqo Digital LTD",
    images: [
      {
        url: "/peakCV-preview.png",
        width: 1200,
        height: 630,
        alt: "peakCV Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "peakCV - Create professional resumes in minutes",
    description: "Build ATS-ready CVs in minutes with our easy-to-use resume builder. Get hired faster with our AI-powered resume builder. Built by Rivqo Digital LTD",
    images: ["/peakCV-preview.png"],
    site: "@your_twitter_handle", // optional
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  )
}
