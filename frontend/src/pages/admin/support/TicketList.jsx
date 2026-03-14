import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function TicketList({ filteredTickets, selectedTicket, handleSelectTicket }) {
  return (
    <div className="col-span-4 flex flex-col overflow-hidden">
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Inbox size={12} /> Inbox Ledger
      </p>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredTickets.length === 0 ? (
          <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl p-10 text-center">
            <Inbox size={36} className="mx-auto text-zinc-200 mb-3" />
            <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">Inbox Empty</p>
            <p className="text-zinc-400 text-[10px] mt-1">No support tickets found.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredTickets.map(t => {
              const isSelected = selectedTicket?.ticket_id === t.ticket_id;
              return (
                <motion.div
                  key={t.ticket_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleSelectTicket(t)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-500/20'
                      : 'bg-white border-zinc-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-purple-200' : 'text-purple-600'}`}>
                      {t.ticket_id}
                    </span>
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-white/60' : 'text-zinc-400'}`}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-bold text-sm truncate mb-3">{t.subject}</p>
                  <div className="flex items-center justify-between">
                    {isSelected ? (
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/20 text-white`}>
                        {t.status}
                      </span>
                    ) : (
                      <StatusBadge status={t.status} />
                    )}
                    <ChevronRight size={14} className={isSelected ? 'text-white' : 'text-zinc-300'} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
