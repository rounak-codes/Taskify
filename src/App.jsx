import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/task/:id" element={<TaskDetail />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;