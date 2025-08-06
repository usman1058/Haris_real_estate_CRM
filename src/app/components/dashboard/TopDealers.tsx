'use client';

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

interface Dealer {
  name: string;
  properties: number;
}

const TopDealers = ({ dealers = [] }: { dealers?: Dealer[] }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">🏅 Top Dealers</Typography>
        <List>
          {dealers.map((d, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={d.name}
                secondary={`${d.properties} properties`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TopDealers;
