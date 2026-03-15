import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, Trash2, ArrowLeft, RefreshCw, UserPlus, Key } from 'lucide-react';
import { Button, Card } from '../../components/ui/Primitives';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/shipments';
import { CreateAdminModal } from './users/CreateAdminModal';
import { ResetPasswordModal } from './users/ResetPasswordModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const { showToast, askConfirm } = useNotification();
  const { isSuperAdmin, token } = useAuth();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    is_super_admin: false
  });

  const [passwordReset, setPasswordReset] = useState({
    userId: null,
    username: '',
    newPassword: '',
    showModal: false
  });

  // Redirect if not super admin
  useEffect(() => {
    if (!isSuperAdmin) {
      showToast('Access denied', 'error');
      navigate('/admin');
    }
  }, [isSuperAdmin, navigate, showToast]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Using relative path to maintain /api prefix from baseURL
      const resp = await api.get('/admins/');
      setUsers(resp.data);
    } catch (e) {
      console.error(e);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admins/', newUser);
      setShowCreate(false);
      setNewUser({ username: '', password: '', is_super_admin: false });
      showToast('Admin created successfully', 'success');
      fetchUsers();
    } catch (e) {
      const errorMsg = e.response?.data?.detail || 'Error creating admin';
      showToast(errorMsg, 'error');
    }
  };

  const handleDelete = async (id, username) => {
    const confirmed = await askConfirm({
      title: 'Remove Admin?',
      message: `Are you sure you want to completely remove ${username}? They will lose all access.`,
      confirmText: 'Remove Access',
      type: 'danger'
    });
    if (!confirmed) return;
    
    try {
      await api.delete(`/admins/${id}`);
      showToast('Admin removed', 'success');
      fetchUsers();
    } catch (e) {
      const errorMsg = e.response?.data?.detail || 'Error deleting admin';
      showToast(errorMsg, 'error');
    }
  };

  const toggleRole = async (id, currentIsSuper) => {
    try {
      await api.patch(`/admins/${id}/role?is_super_admin=${!currentIsSuper}`);
      showToast('Role updated successfully', 'success');
      fetchUsers();
    } catch (e) {
      const errorMsg = e.response?.data?.detail || 'Error updating role';
      showToast(errorMsg, 'error');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!passwordReset.newPassword || passwordReset.newPassword.length < 4) {
      showToast('Password must be at least 4 characters', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await api.patch(`/admins/${passwordReset.userId}/password`, {
        password: passwordReset.newPassword
      });
      showToast(`Password for ${passwordReset.username} updated`, 'success');
      setPasswordReset({ userId: null, username: '', newPassword: '', showModal: false });
    } catch (e) {
      const errorMsg = e.response?.data?.detail || 'Error updating password';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isSuperAdmin) return null;

  return (
    <div className="pt-40 px-6 pb-20 max-w-5xl mx-auto">
      <Link to="/admin" className="inline-flex items-center gap-2 text-zinc-500 hover:text-purple-600 transition-colors font-bold uppercase tracking-widest text-sm mb-8">
        <ArrowLeft size={16} /> Back to Command Center
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <ShieldAlert className="text-purple-600" size={32} />
             <h1 className="text-4xl font-black text-zinc-900 tracking-tight uppercase">Team Management</h1>
           </div>
          <p className="text-zinc-500 font-medium ml-11">Manage system administrators and network authority.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="flex gap-2 items-center rounded-2xl">
          <UserPlus size={20} /> Add Admin
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {users.map((user) => (
            <motion.div key={user.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:border-purple-200 p-6">
                <div className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${user.is_super_admin ? 'bg-amber-100 text-amber-600' : 'bg-purple-50 text-purple-600'}`}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-zinc-900">{user.username}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${user.is_super_admin ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-600'}`}>
                         {user.is_super_admin ? 'Super Admin' : 'Admin'}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={() => toggleRole(user.id, user.is_super_admin)} 
                    variant="secondary" 
                    className="text-xs py-2 px-4 flex-1 sm:flex-none"
                  >
                    {user.is_super_admin ? 'Demote to Admin' : 'Make Super Admin'}
                  </Button>
                  <Button 
                    onClick={() => setPasswordReset({ 
                        userId: user.id, 
                        username: user.username, 
                        newPassword: '', 
                        showModal: true 
                    })} 
                    variant="ghost" 
                    className="text-zinc-500 hover:text-purple-600 hover:bg-purple-50 text-xs py-2 px-3 flex-1 sm:flex-none"
                  >
                    <Key size={16} />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(user.id, user.username)} 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs py-2 px-3 flex-1 sm:flex-none"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {users.length === 0 && loading && (
           <div className="flex justify-center p-10"><RefreshCw className="animate-spin text-purple-600" size={32} /></div>
        )}
      </div>

      {showCreate && (
        <CreateAdminModal
          newUser={newUser}
          setNewUser={setNewUser}
          handleCreate={handleCreate}
          setShowCreate={setShowCreate}
          loading={loading}
        />
      )}

      {/* Password Reset Modal */}
      {passwordReset.showModal && (
        <ResetPasswordModal
          passwordReset={passwordReset}
          setPasswordReset={setPasswordReset}
          handlePasswordReset={handlePasswordReset}
          loading={loading}
        />
      )}
    </div>
  );
}
