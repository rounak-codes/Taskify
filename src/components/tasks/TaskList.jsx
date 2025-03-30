import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';

export default function TaskList() {
  const { tasks, loading, error, updateTask } = useTasks();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // Filter tasks based on completion status
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Sort tasks based on selected criterion
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityMap = { high: 1, medium: 2, low: 3 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Toggle task completion status
  const toggleTaskCompletion = (id, currentStatus) => {
    updateTask(id, { completed: !currentStatus });
  };

  // Priority color classes
  const priorityColor = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  if (loading && tasks.length === 0) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 text-sm rounded ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-sm rounded ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="sortBy" className="text-sm text-gray-600 mr-2">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      
      {sortedTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tasks found</div>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
          {sortedTasks.map(task => (
            <li key={task.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id, task.completed)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex flex-col">
                  <Link to={`/task/${task.id}`} className="text-lg font-medium text-gray-800 hover:text-blue-600">
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                  </Link>
                  {task.dueDate && (
                    <span className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[task.priority]}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <Link to={`/task/${task.id}`} className="p-1 text-gray-500 hover:text-blue-600">
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}