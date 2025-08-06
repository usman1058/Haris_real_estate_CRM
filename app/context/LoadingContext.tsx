"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import GlobalLoading from "@/app/components/GlobalLoading"; // Import your global loading component

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && <GlobalLoading />} {/* Always renders on top */}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within LoadingProvider");
  return context;
}
