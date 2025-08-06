'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const SmartInsights = ({ insights = [] }: { insights?: string[] }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🧠 Smart Insights
        </Typography>
        <List>
          {insights.map((tip, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <EmojiObjectsIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary={tip} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SmartInsights;
