import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { tasks, loading } = useTasks();
  const navigate = useNavigate();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-gray-600 mt-2">
            {loading ? 'Loading tasks...' : `You have ${tasks.filter(t => !t.completed).length} active tasks`}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Welcome, {currentUser?.email}</h2>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md ml-4">Logout</button>
        </div>
      </header>
      
      <div className="mb-6">
        <button 
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showTaskForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>
      
      {showTaskForm && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Task</h2>
          <TaskForm onComplete={() => setShowTaskForm(false)} />
        </div>
      )}
      
      <TaskList />
    </div>
  );
}