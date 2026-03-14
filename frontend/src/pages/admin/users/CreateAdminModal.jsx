import { motion } from 'framer-motion';
import { Button, Input } from '../../../components/ui/Primitives';

export function CreateAdminModal({ newUser, setNewUser, handleCreate, setShowCreate, loading }) {
  return (
    <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-zinc-100 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] w-full max-w-md">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">New Admin</h2>
            <Button variant="ghost" onClick={() => setShowCreate(false)} className="p-2 min-w-0">✕</Button>
         </div>
         
         <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] ml-1">Username</p>
              <Input 
                placeholder="New admin username" 
                value={newUser.username} 
                onChange={e => setNewUser({...newUser, username: e.target.value})} 
                required 
                className="w-full text-lg p-4 font-semibold text-zinc-800"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] ml-1">Passkey</p>
              <Input 
                type="password"
                placeholder="••••••••" 
                value={newUser.password} 
                onChange={e => setNewUser({...newUser, password: e.target.value})} 
                required 
                className="w-full text-lg p-4 font-semibold text-zinc-800"
              />
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100 mt-4 cursor-pointer" onClick={() => setNewUser({...newUser, is_super_admin: !newUser.is_super_admin})}>
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${newUser.is_super_admin ? 'bg-purple-600 border-purple-600 text-white' : 'border-zinc-300'}`}>
                {newUser.is_super_admin && <span className="text-xs font-bold">✓</span>}
              </div>
              <span className="font-bold text-sm text-zinc-700">Grant Super Admin permissions</span>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full py-4 uppercase tracking-widest font-black shadow-lg shadow-purple-500/20">
              {loading ? 'Processing...' : 'Provision Account'}
            </Button>
         </form>
      </motion.div>
    </div>
  );
}
