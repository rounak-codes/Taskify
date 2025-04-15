import { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function TaskForm({ onAddTask, initialData = null, onUpdate = null }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [priority, setPriority] = useState(initialData?.priority || 'medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      dueDate,
      priority,
    };
    
    if (initialData && onUpdate) {
      onUpdate(initialData.id, taskData);
    } else {
      onAddTask(taskData);
    }
    
    // Clear form if adding a new task
    if (!initialData) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="Task Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      
      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Description"
        name="description"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <TextField
        margin="normal"
        fullWidth
        id="dueDate"
        label="Due Date"
        name="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          labelId="priority-label"
          id="priority"
          value={priority}
          label="Priority"
          onChange={(e) => setPriority(e.target.value)}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        {initialData ? 'Update Task' : 'Add Task'}
      </Button>
    </Box>
  );
}

export default TaskForm;