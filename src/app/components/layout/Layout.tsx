"use client";

import Sidemenu from "../sidemenu/Sidemenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidemenu />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
