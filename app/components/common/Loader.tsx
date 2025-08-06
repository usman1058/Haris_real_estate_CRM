'use client';
import { Box, CircularProgress } from '@mui/material';

const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="70vh"
    width="100%"
  >
    <CircularProgress />
  </Box>
);

export default Loader;
