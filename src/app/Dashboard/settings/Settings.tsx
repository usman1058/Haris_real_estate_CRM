'use client';
import {
  Box, Typography, Switch, FormControlLabel, TextField, Button, Divider, Grid,
} from '@mui/material';
import { useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [password, setPassword] = useState('');

  const handleSave = () => {
    alert('Settings saved (functionality coming soon)');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Theme</Typography>
          <FormControlLabel
            control={<Switch checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}
            label="Dark Mode"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6">Notifications</Typography>
          <FormControlLabel
            control={<Switch checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />}
            label="Email Alerts"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6">Password Update</Typography>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
      </Grid>

      <Button sx={{ mt: 4 }} variant="contained" color="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
};

export default Settings;
