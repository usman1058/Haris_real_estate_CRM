'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface DataPoint {
  date: string;
  value: number;
}

const PropertyChart = ({ data = [] }: { data?: DataPoint[] }) => {
  const labels = data.map((d) => d.date);
  const values = data.map((d) => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Properties Added',
        data: values,
        fill: false,
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <Card sx={{ height: 300 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📈 Property Listing Trend
        </Typography>
        <div style={{ height: 220 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyChart;
