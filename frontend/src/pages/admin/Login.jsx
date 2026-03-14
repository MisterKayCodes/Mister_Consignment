import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button, Input, Card } from '../../components/ui/Primitives';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create x-www-form-urlencoded body for OAuth2
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000' : `http://${window.location.hostname}:8000`;
      const response = await axios.post(`${baseUrl}/api/auth/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      login(response.data.access_token, response.data.is_super_admin);
      showToast('Login successful', 'success');
      navigate('/admin');
    } catch (err) {
      showToast('Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <Card className="max-w-md w-full relative z-10 !p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mx-auto mb-6">
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300">VL</span>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">Admin Login</h2>
          <p className="text-zinc-500 font-medium mt-2">Authorized personnel only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] ml-1">Username</p>
            <Input 
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full text-lg p-4 font-semibold text-zinc-800 placeholder:font-normal placeholder:opacity-40"
            />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] ml-1">Passkey</p>
            <Input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-lg p-4 tracking-widest font-black text-zinc-800 placeholder:tracking-normal placeholder:font-normal placeholder:opacity-40"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 mt-8 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
