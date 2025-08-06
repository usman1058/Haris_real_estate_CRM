'use client';

import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';

interface StatsOverviewProps {
  stats: {
    totalDealers: number;
    totalInventory: number;
    totalDemands: number;
    matches: number;
  };
}

const iconMap = {
  totalDealers: <PeopleIcon color="primary" fontSize="large" />,
  totalInventory: <HomeWorkIcon color="success" fontSize="large" />,
  totalDemands: <SearchIcon color="warning" fontSize="large" />,
  matches: <LinkIcon color="secondary" fontSize="large" />,
};

const labelMap: Record<keyof StatsOverviewProps['stats'], string> = {
  totalDealers: 'Dealers',
  totalInventory: 'Inventory',
  totalDemands: 'Buyer Demands',
  matches: 'Matches',
};

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <Grid container spacing={2}>
      {Object.entries(stats).map(([key, value]) => (
        <Grid item xs={6} md={3} key={key}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                {iconMap[key as keyof StatsOverviewProps['stats']]}
                <Box>
                  <Typography variant="subtitle2">{labelMap[key as keyof typeof stats]}</Typography>
                  <Typography variant="h6">{value}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsOverview;
