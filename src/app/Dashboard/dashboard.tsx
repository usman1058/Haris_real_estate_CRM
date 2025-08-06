'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import WelcomeBanner from '@/app/components/dashboard/WelcomeBanner';
import MetricCard from '@/app/components/dashboard/MetricCard';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import PropertyChart from '@/app/components/dashboard/PropertyChart';
import LocationPie from '@/app/components/dashboard/LocationPie';
import TopDealers from '@/app/components/dashboard/TopDealers';
import SmartInsights from '@/app/components/dashboard/SmartInsights';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await fetch('/api/dashboard');
      const result = await res.json();
      setData(result);
    };
    fetchDashboardData();
  }, []);

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={isMobile ? 2 : 4}>
      <WelcomeBanner name="Haris" />

      <Grid container spacing={3}>
        {/* Metric Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Dealers"
            value={data.totalDealers}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Properties"
            value={data.totalInventory}
            icon={<HomeIcon />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Buyer Demands"
            value={data.totalDemands}
            icon={<SearchIcon />}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Smart Matches"
            value={data.matches}
            icon={<LinkIcon />}
            color="#9c27b0"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <PropertyChart data={data.chartData} />
        </Grid>
        <Grid item xs={12} md={4}>
          <LocationPie data={data.locationPie} />
        </Grid>

        {/* Top Dealers */}
        <Grid item xs={12} md={6}>
          <TopDealers dealers={data.topDealers} />
        </Grid>

        {/* AI Smart Insights */}
        <Grid item xs={12} md={6}>
          <SmartInsights insights={data.smartInsights} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
