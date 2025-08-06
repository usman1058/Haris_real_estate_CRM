'use client';
import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const DemandPage = () => {
  const [demands, setDemands] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/demand');
      const data = await res.json();
      setDemands(data);
    };
    fetchData();
  }, []);

  const filteredDemands = demands.filter((d: any) =>
    d.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'size', headerName: 'Size', width: 120 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'budget', headerName: 'Budget (PKR)', type: 'number', width: 150 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (params: any) => new Date(params.value).toLocaleString(),
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>📥 Buyer Demand</Typography>
      <TextField
        label="Filter by Location"
        fullWidth
        margin="normal"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
      />
      <Paper elevation={3} sx={{ height: 550, mt: 2 }}>
        <DataGrid
          rows={filteredDemands}
          columns={columns}
          pageSize={10}
        />
      </Paper>
    </Box>
  );
};

export default DemandPage;
