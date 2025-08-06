'use client';
import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const DealersPage = () => {
  const [dealers, setDealers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/dealers');
      const data = await res.json();
      setDealers(data);
    };
    fetchData();
  }, []);

  const filteredDealers = dealers.filter((dealer: any) =>
    dealer.name.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Dealer Name', flex: 1 },
    { field: 'properties', headerName: 'Properties', type: 'number', width: 150 },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>🧑‍💼 Dealers</Typography>
      <TextField
        label="Search Dealers"
        fullWidth
        margin="normal"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Paper elevation={3} sx={{ height: 500, mt: 2 }}>
        <DataGrid
          rows={filteredDealers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Paper>
    </Box>
  );
};

export default DealersPage;
