import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, List as ListIcon, RefreshCw, ChevronRight, Edit2, Trash2, History, MessageSquare, ShieldCheck, Users as UsersIcon } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui/Primitives';
import { shipmentApi } from '../../api/shipments';
import api from '../../api/shipments'; // for direct admins call
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { UpdateStatusModal } from './dashboard/UpdateStatusModal';
import { CreateShipmentModal } from './dashboard/CreateShipmentModal';

export default function AdminDashboard() {
  const [shipments, setShipments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const { showToast, askConfirm } = useNotification();
  const { isSuperAdmin, user } = useAuth();
  
  const [newShipment, setNewShipment] = useState({
    sender_name: '', sender_address: '',
    receiver_name: '', receiver_address: '',
    package_type: 'Air', weight: 0, dimensions: '', description: ''
  });
  
  const [updateForm, setUpdateForm] = useState({
    status: '', remarks: '', location: '', photo_url: ''
  });

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const resp = await shipmentApi.api.get('/shipments/');
      setShipments(resp.data);
      // Update selected shipment if it's currently being viewed in modal
      if (selectedShipment) {
        const updated = resp.data.find(s => s.id === selectedShipment.id);
        if (updated) setSelectedShipment(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    if (!isSuperAdmin) return;
    try {
      const resp = await api.get('admins/');
      setAdmins(resp.data);
    } catch (e) {
      console.error('Failed to fetch admins', e);
    }
  };

  useEffect(() => { 
    fetchShipments(); 
    fetchAdmins();
  }, [isSuperAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await shipmentApi.createShipment(newShipment);
      setShowCreate(false);
      fetchShipments();
      showToast('Shipment registered successfully', 'success');
    } catch (e) { showToast('Error creating shipment', 'error'); }
  };

  const handleOpenUpdate = (shipment) => {
    setSelectedShipment(shipment);
    setUpdateForm({ status: '', remarks: '', location: '', photo_url: '' });
    setEditingHistoryId(null);
    setShowUpdate(true);
  };

  const handleEditHistory = (h) => {
    setEditingHistoryId(h.id);
    setUpdateForm({ 
      status: h.status, 
      remarks: h.remarks || '', 
      location: h.location || '',
      photo_url: h.photo_url || ''
    });
  };

  const handleDeleteHistory = async (hid) => {
    const confirmed = await askConfirm({
      title: 'Delete History?',
      message: 'Are you sure you want to delete this status? This action cannot be undone.',
      confirmText: 'Delete Status',
      type: 'danger'
    });
    if (!confirmed) return;
    try {
      await shipmentApi.deleteHistory(hid);
      fetchShipments();
      showToast('Status history deleted', 'success');
    } catch (e) { showToast('Error deleting status', 'error'); }
  };

  const handleDeleteShipment = async (sid, trackingId) => {
    if (!isSuperAdmin) {
       showToast('Only Super Authority can delete ledgers', 'error');
       return;
    }
    const confirmed = await askConfirm({
      title: 'ERASE LEDGER?',
      message: `Are you sure you want to completely erase shipment ${trackingId}? All history will be destroyed.`,
      confirmText: 'Erase Data',
      type: 'danger'
    });
    if (!confirmed) return;
    try {
      await shipmentApi.deleteShipment(sid);
      fetchShipments();
      showToast('Shipment erased from ledger', 'success');
    } catch (e) { showToast('Error erasing shipment', 'error'); }
  };

  const handleUpdateStatus = async (e, quickId = null, quickStatus = null, quickRemarks = null) => {
     if (e && e.preventDefault) e.preventDefault();
     
     const sid = quickId || selectedShipment?.id;
     const payload = quickStatus ? { status: quickStatus, remarks: quickRemarks, location: 'Delivered' } : updateForm;

     try {
       if (editingHistoryId && !quickId) {
         await shipmentApi.updateHistory(editingHistoryId, payload);
       } else {
         await shipmentApi.addHistory(sid, payload);
       }
       setUpdateForm({ status: '', remarks: '', location: '', photo_url: '' });
       setEditingHistoryId(null);
       await fetchShipments(); // Make sure this finishes
       showToast(editingHistoryId ? 'Status updated' : 'New status added', 'success');
     } catch (e) { showToast('Error saving status', 'error'); }
  };

  return (
    <div className="pt-40 px-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-2 uppercase">Command Center</h1>
             <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 ${isSuperAdmin ? 'bg-amber-100 text-amber-700 shadow-sm shadow-amber-200' : 'bg-purple-100 text-purple-700'}`}>
                {isSuperAdmin ? 'Super Authority' : 'Standard Admin'}
             </span>
             {!isSuperAdmin && (
                <button 
                  onClick={() => { localStorage.clear(); window.location.href = '/admin/login'; }}
                  className="text-[8px] uppercase font-black text-red-500 hover:underline cursor-pointer opacity-50"
                  title="Force refresh your session if permissions feel wrong"
                >
                  Sync Session
                </button>
             )}
          </div>
          <p className="text-zinc-500 font-medium italic">Welcome back, <span className="text-zinc-900 font-black">{user || 'Admin'}</span>. Network provisioning active.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="flex gap-2 items-center rounded-2xl">
          <Plus size={20} /> Register Shipment
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3 mb-6 text-zinc-900">
             <ListIcon size={20} /> <span className="font-bold text-lg uppercase tracking-widest">Active Ledger</span>
          </div>
          <AnimatePresence>
            {shipments.map((s) => (
              <motion.div key={s.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="flex flex-col sm:flex-row justify-between items-center gap-6 group hover:border-purple-200">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </div>
                    <div>
                      <span className="text-purple-600 font-black text-sm tracking-wider uppercase">{s.tracking_id}</span>
                      <h3 className="font-bold text-xl text-zinc-900">{s.receiver_name}</h3>
                      <p className="text-zinc-500 font-medium text-sm">{s.current_status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button onClick={() => handleOpenUpdate(s)} variant="secondary" className="text-sm py-2 px-6 flex-1 sm:flex-none">Manage Status</Button>
                    <Button onClick={() => handleUpdateStatus(null, s.id, 'Delivered', 'Package arrived')} className="bg-green-600 text-white hover:bg-green-700 text-sm py-2 px-4 flex-1 sm:flex-none">Vantage Deliver</Button>
                    {isSuperAdmin && (
                      <Button onClick={() => handleDeleteShipment(s.id, s.tracking_id)} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-100/50 p-2 min-w-0 flex-none rounded-xl">
                        <Trash2 size={20} />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-8">
            <Card className="bg-purple-600 text-white border-none shadow-2xl shadow-purple-500/20">
               <h4 className="font-bold text-xl mb-3">Network Control</h4>
               <p className="text-purple-100 text-sm mb-6 leading-relaxed">Broadcast project-wide updates or manage global hub states.</p>
               <Input placeholder="Global Hub Location" className="mb-4 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20" />
               <div className="flex flex-col gap-3">
                 <Button variant="secondary" className="w-full text-purple-600 font-black text-sm">System Update</Button>
                 
                 {/* Only let Super Admin manage the team */}
                 {isSuperAdmin && (
                   <Link to="/admin/users" className="w-full">
                      <Button className="w-full bg-white text-zinc-900 border-none font-black text-sm hover:bg-zinc-100">
                         Team Management
                      </Button>
                   </Link>
                 )}
                 
                 <Link to="/admin/support" className="w-full">
                    <Button className="w-full bg-white/10 hover:bg-white/20 border-white/10 text-white font-black text-sm flex gap-2 items-center justify-center">
                       <MessageSquare size={16} /> Inquiry Inbox
                    </Button>
                 </Link>
               </div>
            </Card>

            {/* Admin Team Preview (Super Admin Only) */}
            {isSuperAdmin && (
              <Card className="border-none bg-zinc-900 text-white shadow-xl">
                 <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                       <ShieldCheck size={20} className="text-amber-400" /> Administrative Team
                    </h4>
                    <Link to="/admin/users" className="text-[10px] uppercase font-black text-amber-400 hover:underline">View All</Link>
                 </div>
                 <div className="space-y-4">
                    {admins.slice(0, 4).map(admin => (
                       <div key={admin.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                <UsersIcon size={14} />
                             </div>
                             <div>
                                <p className="text-sm font-bold">{admin.username}</p>
                                <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-black">
                                   {admin.is_super_admin ? 'Super Power' : 'Field Agent'}
                                </p>
                             </div>
                          </div>
                          {admin.is_super_admin && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>}
                       </div>
                    ))}
                    {admins.length === 0 && <p className="text-zinc-500 text-xs italic text-center py-4">Scanning network for active nodes...</p>}
                 </div>
              </Card>
            )}
           
           <Card className="border-dashed border-zinc-200 p-6 flex flex-col items-center text-center justify-center min-h-[200px]">
              <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mb-4">
                <ChevronRight size={24} />
              </div>
              <p className="text-zinc-400 text-sm font-medium">Waiting for selected <br/> shipment analytics</p>
           </Card>
        </div>
      </div>

      {/* Update Status Modal */}
      {showUpdate && (
        <UpdateStatusModal
          selectedShipment={selectedShipment}
          updateForm={updateForm}
          setUpdateForm={setUpdateForm}
          editingHistoryId={editingHistoryId}
          setEditingHistoryId={setEditingHistoryId}
          handleUpdateStatus={handleUpdateStatus}
          handleEditHistory={handleEditHistory}
          handleDeleteHistory={handleDeleteHistory}
          setShowUpdate={setShowUpdate}
        />
      )}

      {showCreate && (
        <CreateShipmentModal
          newShipment={newShipment}
          setNewShipment={setNewShipment}
          handleCreate={handleCreate}
          setShowCreate={setShowCreate}
        />
      )}
    </div>
  );
}
