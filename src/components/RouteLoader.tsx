"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LinearProgress } from "@mui/material";

const RouteLoader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600); // fake delay
    return () => clearTimeout(timer);
  }, [pathname]);

  return loading ? <LinearProgress color="primary" /> : null;
};

export default RouteLoader;
