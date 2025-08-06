'use client';
import {
  Box, Typography, TextField, Button, Avatar, Grid,
} from '@mui/material';
import { useState } from 'react';

const dummyProfile = {
  name: 'Haris Real Estate',
  email: 'admin@harisrealestate.com',
  role: 'Admin',
  bio: 'Managing Lahore, DHA, and Bahria region',
  avatar: '',
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(dummyProfile);

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    alert('Profile updated (connect to DB later)');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField
            label="Name"
            fullWidth
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Role"
            fullWidth
            value={profile.role}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Bio"
            multiline
            fullWidth
            rows={4}
            value={profile.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
          />
        </Grid>
      </Grid>
      <Button sx={{ mt: 4 }} variant="contained" onClick={handleSave}>
        Save Changes
      </Button>
    </Box>
  );
};

export default ProfilePage;
