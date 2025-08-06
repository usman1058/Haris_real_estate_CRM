"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/app/components/ui/Button";
import { ThemeToggle } from "@/app/components/ui/theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import "@/style/globals.css"; // Ensure global styles are applied

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full px-6 py-3 bg-white shadow-sm flex items-center justify-between sticky top-0 z-50">
      {/* Logo + Brand */}
      <Link href="/" className="flex items-center space-x-2">
        {/* Logo image */}
        <Image
          src="/logo.png" // <-- Replace with your image path
          alt="Logo"
          width={32}
          height={32}
          className="rounded-md"
        />
        <span className="text-xl font-semibold tracking-tight text-gray-800">
          Haris Real Estate CRM
        </span>
      </Link>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {session?.user && (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
            
          </div>
        )}
      </div>
    </header>
  );
}
