import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Container, Paper, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useSession } from '@descope/react-sdk';

interface TicketStats {
  open: number;
  closed: number;
  in_progress: number;
}

interface DashboardData {
  servicenow: TicketStats;
  dynamics365: TicketStats;
  custom: TicketStats;
  total: TicketStats;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const { sessionToken } = useSession();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tickets/dashboard', {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [sessionToken]);

  const chartData = {
    labels: ['Open', 'Closed', 'In Progress'],
    datasets: [
      {
        label: 'ServiceNow',
        data: stats ? [stats.servicenow.open, stats.servicenow.closed, stats.servicenow.in_progress] : [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Dynamics 365',
        data: stats ? [stats.dynamics365.open, stats.dynamics365.closed, stats.dynamics365.in_progress] : [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Custom System',
        data: stats ? [stats.custom.open, stats.custom.closed, stats.custom.in_progress] : [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Statistics
            </Typography>
            {stats ? (
              <Bar data={chartData} />
            ) : (
              <Typography>Loading stats...</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
