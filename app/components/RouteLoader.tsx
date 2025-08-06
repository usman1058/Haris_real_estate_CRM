'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LinearProgress } from '@mui/material';

const RouteLoader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 800); // Simulates route load time

    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? <LinearProgress color="primary" /> : null;
};

export default RouteLoader;
