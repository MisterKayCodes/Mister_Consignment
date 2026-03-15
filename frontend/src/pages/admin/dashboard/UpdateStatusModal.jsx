import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, History, Camera, Loader2 } from 'lucide-react';
import { Button, Input } from '../../../components/ui/Primitives';
import { shipmentApi } from '../../../api/shipments';
import { useState } from 'react';

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
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const resp = await shipmentApi.uploadFile(file);
      setUpdateForm({ ...updateForm, photo_url: resp.data.url });
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white border border-zinc-100 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] w-full max-w-4xl grid md:grid-cols-2 gap-10 max-h-[95vh] overflow-y-auto"
      >
        <div className="flex flex-col h-fit md:h-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight uppercase">
                {editingHistoryId ? 'EDIT STATUS' : 'NEW UPDATE'}
              </h2>
              <p className="text-zinc-500 font-bold text-xs md:text-sm tracking-widest">{selectedShipment?.tracking_id}</p>
            </div>
            <Button variant="ghost" onClick={() => setShowUpdate(false)} className="md:hidden p-2 min-w-0">✕</Button>
          </div>
          
          <form onSubmit={handleUpdateStatus} className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Current State</p>
              <Input placeholder="Status (e.g. Hold, Stop, In Transit)" value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})} required className="uppercase font-bold" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Hub Location</p>
              <Input placeholder="Current Location" value={updateForm.location} onChange={e => setUpdateForm({...updateForm, location: e.target.value})} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Internal Remarks</p>
              <Input placeholder="Remarks" value={updateForm.remarks} onChange={e => setUpdateForm({...updateForm, remarks: e.target.value})} />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Photo Evidence (Optional)</p>
              <div className="flex flex-col gap-4">
                {updateForm.photo_url ? (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-zinc-200 group">
                    <img src={updateForm.photo_url} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => setUpdateForm({...updateForm, photo_url: ''})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className={`
                    w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                    ${uploading ? 'bg-zinc-50 border-zinc-200 cursor-wait' : 'border-zinc-200 hover:border-purple-300 hover:bg-purple-50/30'}
                  `}>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                    {uploading ? (
                      <Loader2 className="animate-spin text-purple-600 mb-2" size={24} />
                    ) : (
                      <Camera className="text-zinc-400 mb-2" size={24} />
                    )}
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {uploading ? 'Uploading...' : 'Tap to Upload Photo'}
                    </span>
                  </label>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <Button type="submit" className="w-full py-4 rounded-xl">
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

        <div className="flex flex-col h-fit md:h-full md:border-l border-zinc-100 md:pl-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg md:text-xl font-bold text-zinc-900 flex items-center gap-2">
              <History size={18} className="text-purple-600" /> HISTORICAL LEDGER
            </h3>
            <Button variant="ghost" onClick={() => setShowUpdate(false)} className="hidden md:flex p-2 min-w-0">✕</Button>
          </div>
          
          <div className="space-y-4 max-h-[400px] md:max-h-none overflow-y-auto pr-2 pb-10">
            <AnimatePresence initial={false}>
              {selectedShipment?.history?.slice().reverse().map((h) => (
                <motion.div key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className={`p-4 rounded-xl border transition-all ${editingHistoryId === h.id ? 'bg-purple-50 border-purple-200 shadow-sm' : 'bg-zinc-50 border-zinc-100 group hover:border-purple-200 hover:bg-white'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className={`font-black uppercase text-[9px] tracking-[0.2em] mb-1 ${editingHistoryId === h.id ? 'text-purple-600' : 'text-zinc-400'}`}>
                          {new Date(h.timestamp).toLocaleDateString()}
                        </p>
                        <h4 className="font-bold text-zinc-900 uppercase tracking-tight">{h.status}</h4>
                      </div>
                      <div className="flex gap-1">
                        <Button onClick={() => handleEditHistory(h)} variant="ghost" className="p-2 min-w-0 text-zinc-400 hover:text-purple-600">
                          <Edit2 size={14} />
                        </Button>
                        <Button onClick={() => handleDeleteHistory(h.id)} variant="ghost" className="p-2 min-w-0 text-zinc-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-2">{h.location || 'Central Processing'}</p>
                    {h.photo_url && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-zinc-200 shadow-sm">
                          <img src={h.photo_url} alt="Shipment Status" className="w-full h-32 object-cover" onError={(e) => e.target.style.display='none'} />
                        </div>
                    )}
                    {h.remarks && <p className="text-[10px] italic text-zinc-400 font-medium">"{h.remarks}"</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!selectedShipment?.history?.length && (
              <p className="text-zinc-400 text-xs italic text-center py-10 uppercase font-bold tracking-widest">No history recorded</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
