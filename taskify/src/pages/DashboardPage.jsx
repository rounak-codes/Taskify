import { Container, Box, Paper, Typography } from '@mui/material';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';

function DashboardPage() {
  const { currentUser } = useAuth();
  const { addTask } = useTasks();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Banner */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4">
          Welcome, {currentUser?.displayName || 'User'}!
        </Typography>
        <Typography color="textSecondary">
          Manage your tasks and stay productive
        </Typography>
      </Paper>
      
      {/* Main Content - Using Flexbox for side-by-side layout */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3
        }}
      >
        {/* Task Form - Left Column */}
        <Box sx={{ flex: { md: '0 0 350px' } }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" mb={2}>Add New Task</Typography>
            <TaskForm onAddTask={addTask} />
          </Paper>
        </Box>
        
        {/* Task List - Right Column */}
        <Box sx={{ flex: { md: '1 1 auto' } }}>
          <TaskList extractedTaskForm={true} />
        </Box>
      </Box>
    </Container>
  );
}

export default DashboardPage;