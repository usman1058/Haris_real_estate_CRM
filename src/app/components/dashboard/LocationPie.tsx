'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const LocationPie = ({ data = [] }: { data?: { location: string; count: number }[] }) => {
  const pieData = {
    labels: data.map((item) => item.location),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: ['#1976d2', '#9c27b0', '#f44336', '#ff9800', '#4caf50'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🗺️ Properties by Location
        </Typography>
        <div style={{ height: 220 }}>
          <Pie data={pieData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPie;
