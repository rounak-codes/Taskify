import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Tabs, 
  Tab, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  CircularProgress 
} from '@mui/material';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { useTasks } from '../../hooks/useTasks';

function TaskList() {
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleCompletion } = useTasks();
  const [tabValue, setTabValue] = useState(0);
  const [editTask, setEditTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setDialogOpen(true);
  };

  const handleUpdate = (taskId, taskData) => {
    updateTask(taskId, taskData);
    setDialogOpen(false);
    setEditTask(null);
  };

  const filteredTasks = () => {
    switch(tabValue) {
      case 0: // All
        return tasks;
      case 1: // Active
        return tasks.filter(task => !task.completed);
      case 2: // Completed
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" my={3}>
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Paper sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" mb={2}>Add New Task</Typography>
        <TaskForm onAddTask={addTask} />
      </Paper>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`All (${tasks.length})`} />
          <Tab label={`Active (${tasks.filter(t => !t.completed).length})`} />
          <Tab label={`Completed (${tasks.filter(t => t.completed).length})`} />
        </Tabs>
        
        <Divider />
        
        <Box p={3}>
          {filteredTasks().length === 0 ? (
            <Typography color="textSecondary" align="center">
              No tasks found
            </Typography>
          ) : (
            filteredTasks().map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={toggleCompletion} 
                onDelete={deleteTask} 
                onEdit={handleEdit} 
              />
            ))
          )}
        </Box>
      </Paper>
      
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {editTask && (
            <TaskForm 
              initialData={editTask} 
              onUpdate={handleUpdate} 
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TaskList;