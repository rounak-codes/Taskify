//import { useState } from 'react';
import { Container, Grid, Box, Paper, Typography } from '@mui/material';
import TaskList from '../components/tasks/TaskList';
import { useAuth } from '../contexts/AuthContext';

function DashboardPage() {
  const { currentUser } = useAuth();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4">
              Welcome, {currentUser?.displayName || 'User'}!
            </Typography>
            <Typography color="textSecondary">
              Manage your tasks and stay productive
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <TaskList />
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;