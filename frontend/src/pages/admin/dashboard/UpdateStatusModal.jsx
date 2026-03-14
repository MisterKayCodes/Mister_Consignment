import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, History } from 'lucide-react';
import { Button, Input } from '../../../components/ui/Primitives';

export function UpdateStatusModal({
  selectedShipment,
  updateForm,
  setUpdateForm,
  editingHistoryId,
  setEditingHistoryId,
  handleUpdateStatus,
  handleEditHistory,
  handleDeleteHistory,
  setShowUpdate
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-zinc-100 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] w-full max-w-4xl grid md:grid-cols-2 gap-10 max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">{editingHistoryId ? 'EDIT STATUS' : 'NEW UPDATE'}</h2>
              <p className="text-zinc-500 font-bold text-sm tracking-widest">{selectedShipment?.tracking_id}</p>
            </div>
            <Button variant="ghost" onClick={() => setShowUpdate(false)} className="md:hidden p-2 min-w-0">✕</Button>
          </div>
          
          <form onSubmit={handleUpdateStatus} className="space-y-6 flex-1 overflow-y-auto pr-2 pb-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Current State</p>
              <Input placeholder="Status (e.g. Hold, Stop, In Transit)" value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Hub Location</p>
              <Input placeholder="Current Location" value={updateForm.location} onChange={e => setUpdateForm({...updateForm, location: e.target.value})} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Internal Remarks</p>
              <Input placeholder="Remarks" value={updateForm.remarks} onChange={e => setUpdateForm({...updateForm, remarks: e.target.value})} />
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <Button type="submit" className="w-full">
                {editingHistoryId ? 'Save Changes' : 'Commit New Update'}
              </Button>
              {editingHistoryId && (
                <Button type="button" variant="ghost" onClick={() => { setEditingHistoryId(null); setUpdateForm({ status: '', remarks: '', location: '', photo_url: '' }); }}>
                  Cancel Editing
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="flex flex-col h-full border-l border-zinc-100 pl-10 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <History size={20} className="text-purple-600" /> Historical Ledger
            </h3>
            <Button variant="ghost" onClick={() => setShowUpdate(false)} className="hidden md:flex p-2 min-w-0">✕</Button>
          </div>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            <AnimatePresence initial={false}>
              {selectedShipment?.history?.slice().reverse().map((h) => (
                <motion.div key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className={`p-4 rounded-2xl border transition-all ${editingHistoryId === h.id ? 'bg-purple-50 border-purple-200' : 'bg-zinc-50 border-zinc-100 group hover:border-purple-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className={`font-bold uppercase text-xs tracking-widest mb-1 ${editingHistoryId === h.id ? 'text-purple-600' : 'text-zinc-400'}`}>
                          {new Date(h.timestamp).toLocaleDateString()}
                        </p>
                        <h4 className="font-bold text-zinc-900">{h.status}</h4>
                      </div>
                      <div className="flex gap-1">
                        <Button onClick={() => handleEditHistory(h)} variant="ghost" className="p-2 min-w-0 text-zinc-400 hover:text-purple-600">
                          <Edit2 size={16} />
                        </Button>
                        <Button onClick={() => handleDeleteHistory(h.id)} variant="ghost" className="p-2 min-w-0 text-zinc-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 font-medium mb-2">{h.location || 'Central Processing'}</p>
                    {h.photo_url && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-zinc-200">
                          <img src={h.photo_url} alt="Shipment Status" className="w-full h-32 object-cover" onError={(e) => e.target.style.display='none'} />
                        </div>
                    )}
                    {h.remarks && <p className="text-xs italic text-zinc-400">"{h.remarks}"</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
