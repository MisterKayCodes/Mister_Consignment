import { motion } from 'framer-motion';
import { Button, Input } from '../../../components/ui/Primitives';

export function CreateShipmentModal({
  newShipment,
  setNewShipment,
  handleCreate,
  setShowCreate
}) {
  return (
    <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-zinc-100 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">REGISTER SHIPMENT</h2>
          <Button variant="ghost" onClick={() => setShowCreate(false)} className="p-2 min-w-0">✕</Button>
        </div>
        <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Origin Details</p>
            <Input placeholder="Sender Name" value={newShipment.sender_name} onChange={e => setNewShipment({...newShipment, sender_name: e.target.value})} required />
            <Input placeholder="Sender Address" value={newShipment.sender_address} onChange={e => setNewShipment({...newShipment, sender_address: e.target.value})} />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Destination Details</p>
            <Input placeholder="Receiver Name" value={newShipment.receiver_name} onChange={e => setNewShipment({...newShipment, receiver_name: e.target.value})} required />
            <Input placeholder="Receiver Address" value={newShipment.receiver_address} onChange={e => setNewShipment({...newShipment, receiver_address: e.target.value})} />
            <Input placeholder="Receiver Email" type="email" value={newShipment.receiver_email} onChange={e => setNewShipment({...newShipment, receiver_email: e.target.value})} />
          </div>
          <div className="sm:col-span-2 space-y-4 pt-4 border-t border-zinc-100">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Cargo Specs</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input placeholder="Dimensions" value={newShipment.dimensions} onChange={e => setNewShipment({...newShipment, dimensions: e.target.value})} />
              <Input placeholder="Weight (kg)" type="number" value={newShipment.weight} onChange={e => setNewShipment({...newShipment, weight: parseFloat(e.target.value)})} />
            </div>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 mt-8">
            <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Dismiss</Button>
            <Button type="submit" className="px-12">Submit Entry</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
