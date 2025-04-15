import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: 'calc(100vh - 150px)',
          textAlign: 'center',
          py: 5
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Taskify
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          A simple and powerful task management application
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Organize Your Tasks
              </Typography>
              <Typography paragraph>
                Create, manage, and track your daily tasks with ease. 
                Stay productive and never miss a deadline.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Set Priorities
              </Typography>
              <Typography paragraph>
                Assign priority levels to tasks and focus on what matters most.
                Complete your work efficiently.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Track Progress
              </Typography>
              <Typography paragraph>
                Monitor your task completion, track your productivity,
                and achieve your goals faster.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 5 }}>
          {currentUser ? (
            <Button 
              component={Link} 
              to="/dashboard" 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ minWidth: 200 }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Box>
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ minWidth: 200, mr: 2 }}
              >
                Sign In
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="outlined" 
                color="primary" 
                size="large"
                sx={{ minWidth: 200, mt: { xs: 2, sm: 0 } }}
              >
                Create Account
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;