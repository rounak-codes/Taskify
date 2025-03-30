import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask, loading, error } = useTasks();
  
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Find the task in the tasks array
  useEffect(() => {
    const foundTask = tasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      setFormData({
        title: foundTask.title || '',
        description: foundTask.description || '',
        dueDate: foundTask.dueDate || '',
        priority: foundTask.priority || 'medium',
      });
    }
  }, [id, tasks]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(id, formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    try {
      await deleteTask(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = () => {
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  if (loading && !task) {
    return <div className="max-w-2xl mx-auto p-4 text-center py-8">Loading task details...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto p-4 text-red-500 py-4">Error: {error}</div>;
  }

  if (!task) {
    return <div className="max-w-2xl mx-auto p-4 text-center py-8">Task not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isEditing ? (
          // Edit form
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Task</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter task description"
              />
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // Task details view
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-3 py-1 text-sm border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTaskCompletion}
                  className={`px-3 py-1 text-sm rounded-full ${
                    task.completed 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}
                >
                  {task.completed ? 'Completed' : 'In Progress'}
                </button>
                
                <span className={`text-sm px-3 py-1 rounded-full ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
                
                {task.dueDate && (
                  <span className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {task.description ? (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-700">Description</h3>
                  <p className="mt-2 text-gray-600 whitespace-pre-line">{task.description}</p>
                </div>
              ) : (
                <p className="italic text-gray-500">No description provided</p>
              )}
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                ← Back to Task List
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900">Delete Task</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleDelete}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}