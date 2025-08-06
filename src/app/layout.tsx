// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CssBaseline, Container } from "@mui/material";
import { ThemeContextProvider } from "@/context/ThemeContext";
import SessionWrapper from "./components/SessionWrapper";
import Header from "./components/Header/Header";
import Layout from "./components/layout/Layout";
import RouteLoader from "./components/RouteLoader"; // ✅ NEW: shows progress bar on route change
import "../style/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haris Real Estate CRM",
  description: "Professional CRM for Real Estate Agency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#f4f6f8" }} // ✅ subtle background
      >
        <ThemeContextProvider>
          <SessionWrapper>
            <CssBaseline />
            <RouteLoader /> {/* ✅ NEW: linear loader during route changes */}
            <Header />
            <Layout>
              {children}
            </Layout>
          </SessionWrapper>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
