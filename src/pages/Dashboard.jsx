import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Welcome, {currentUser?.email}</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mt-4">Logout</button>
    </div>
  );
}
