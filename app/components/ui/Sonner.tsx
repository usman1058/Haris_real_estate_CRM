// src/components/ui/sonner.tsx
"use client";

import { useEffect, useState } from "react";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <Sonner richColors position="top-right" />;
}
