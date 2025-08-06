'use client';
import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(data);
    };
    fetchData();
  }, []);

  const filteredInventory = inventory.filter((item: any) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'size', headerName: 'Size', width: 120 },
    { field: 'price', headerName: 'Price (PKR)', width: 150, type: 'number' },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (params: any) => new Date(params.value).toLocaleString(),
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>🏠 Inventory</Typography>
      <TextField
        label="Search Inventory Title"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Paper elevation={3} sx={{ height: 550, mt: 2 }}>
        <DataGrid
          rows={filteredInventory}
          columns={columns}
          pageSize={10}
        />
      </Paper>
    </Box>
  );
};

export default InventoryPage;
