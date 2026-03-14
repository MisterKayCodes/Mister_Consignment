import { motion } from 'framer-motion';
import { Button, Input } from '../../../components/ui/Primitives';

export function ResetPasswordModal({ passwordReset, setPasswordReset, handlePasswordReset, loading }) {
  return (
    <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-zinc-100 p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] w-full max-w-md">
         <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Reset Access</h2>
               <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">User: {passwordReset.username}</p>
            </div>
            <Button variant="ghost" onClick={() => setPasswordReset({ ...passwordReset, showModal: false })} className="p-2 min-w-0">✕</Button>
         </div>
         
         <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] ml-1">New Passkey</p>
              <Input 
                type="password"
                placeholder="Enter new password" 
                value={passwordReset.newPassword} 
                onChange={e => setPasswordReset({...passwordReset, newPassword: e.target.value})} 
                required 
                autoFocus
                className="w-full text-lg p-4 font-semibold text-zinc-800"
              />
              <p className="text-[9px] text-zinc-400 font-medium ml-1">Minimum 4 characters required for network security.</p>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full py-4 uppercase tracking-widest font-black shadow-lg shadow-purple-500/20">
              {loading ? 'Updating Secret...' : 'Commit New Password'}
            </Button>
         </form>
      </motion.div>
    </div>
  );
}
