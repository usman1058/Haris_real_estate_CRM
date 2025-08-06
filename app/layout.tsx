"use client" // ⬅ Add this at the very top

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeContextProvider } from "@/context/ThemeContext"
import SessionWrapper from "./components/SessionWrapper"
import RouteLoader from "./components/RouteLoader"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/components/sidemenu/Sidemenu"
import { AppHeader } from "@/app/components/Header/Header"
import ClientOnly from "@/app/components/ClientOnly"
import { LoadingProvider } from "@/app/context/LoadingContext";
import { Toaster } from "sonner" // ✅ Sonner's Toaster

import "@/app/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeContextProvider>
          <SessionWrapper>
            <RouteLoader />

            {/* ✅ Global Loading Wrapper */}
            <LoadingProvider>
              {/* ✅ Fix hydration issue by rendering Toaster client-side only */}
              <ClientOnly>
                <Toaster position="top-right" richColors />
              </ClientOnly>

              <ClientOnly>
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex flex-1 flex-col">
                      <AppHeader />
                      <main className="flex-1 overflow-auto">{children}</main>
                    </div>
                  </div>
                </SidebarProvider>
              </ClientOnly>
            </LoadingProvider>

          </SessionWrapper>
        </ThemeContextProvider>
      </body>
    </html>
  )
}
