'use client';
import { Typography, Box } from "@mui/material";

const WelcomeBanner = ({ name = "Admin" }) => {
  const today = new Date().toLocaleDateString();
  return (
    <Box mb={3}>
      <Typography variant="h4" fontWeight="bold">Welcome back, {name} 👋</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Here's what's happening today — {today}
      </Typography>
    </Box>
  );
};

export default WelcomeBanner;
