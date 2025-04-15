import { 
    Card, 
    CardContent, 
    Typography, 
    Checkbox, 
    IconButton, 
    Box, 
    Chip, 
    CardActions 
  } from '@mui/material';
  import { Delete, Edit } from '@mui/icons-material';
  import { format } from 'date-fns';
  
  function TaskItem({ task, onToggle, onDelete, onEdit }) {
    const priorityColors = {
      high: 'error',
      medium: 'warning',
      low: 'success'
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return 'No due date';
      try {
        return format(new Date(dateString), 'MMM d, yyyy');
      } catch {
        return dateString;
      }
    };
  
    return (
      <Card 
        sx={{ 
          mb: 2, 
          opacity: task.completed ? 0.7 : 1,
          borderLeft: 4,
          borderColor: `${priorityColors[task.priority]}.main`
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={task.completed}
              onChange={() => onToggle(task.id, task.completed)}
              color="primary"
            />
            <Box flexGrow={1}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary'
                }}
              >
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due: {formatDate(task.dueDate)}
              </Typography>
            </Box>
            <Chip 
              label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
              color={priorityColors[task.priority]} 
              size="small"
            />
          </Box>
          
          {task.description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 1, 
                ml: 5, 
                fontStyle: 'italic',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.description}
            </Typography>
          )}
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          <IconButton size="small" onClick={() => onEdit(task)} aria-label="edit">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(task.id)} aria-label="delete">
            <Delete fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
  
  export default TaskItem;