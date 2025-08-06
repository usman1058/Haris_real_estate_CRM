import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricCard = ({ title, value, icon, color }: any) => (
  <Card sx={{ borderLeft: `6px solid ${color}`, boxShadow: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary">{title}</Typography>
          <Typography variant="h4" fontWeight="bold">{value}</Typography>
        </Box>
        <Box fontSize={40} color={color}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default MetricCard;
