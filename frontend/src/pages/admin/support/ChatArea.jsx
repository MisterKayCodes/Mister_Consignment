import { Clock, LifeBuoy, MessageSquare, CheckCircle, ChevronRight } from 'lucide-react';
import { Button, Input, Card } from '../../../components/ui/Primitives';
import { StatusBadge } from './StatusBadge';

export function ChatArea({ selectedTicket, handleMarkResolved, handleSendReply, reply, setReply, msgEndRef }) {
  if (!selectedTicket) {
    return (
      <div className="col-span-8 flex flex-col overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center text-zinc-300 border-2 border-dashed border-zinc-100 rounded-3xl p-12 text-center bg-white/50">
          <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mb-6">
            <MessageSquare size={40} className="opacity-20 text-purple-600" />
          </div>
          <h3 className="font-black text-2xl text-zinc-400 tracking-tighter mb-2 uppercase">Standby Mode</h3>
          <p className="text-zinc-400 font-semibold max-w-xs mx-auto text-sm leading-relaxed">
            Select a ticket from the inbox on the left to start communicating.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-8 flex flex-col overflow-hidden">
      <Card className="flex flex-col h-full p-0 overflow-hidden rounded-3xl border-zinc-100 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)]">
        {/* Chat Header */}
        <div className="p-6 border-b border-zinc-100 bg-white flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <LifeBuoy size={22} />
            </div>
            <div>
              <h3 className="font-black text-xl text-zinc-900">{selectedTicket.subject}</h3>
              <p className="text-zinc-400 font-bold text-[10px] tracking-widest uppercase mt-0.5">
                {selectedTicket.ticket_id} • {selectedTicket.messages?.[0]?.sender_name || 'Client'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={selectedTicket.status} />
            {selectedTicket.status !== 'Resolved' && (
              <button
                onClick={handleMarkResolved}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 font-black text-xs uppercase tracking-widest border border-green-100 hover:bg-green-100 transition-all"
              >
                <CheckCircle size={14} /> Mark Resolved
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-zinc-50/30 min-h-0">
          {(selectedTicket.messages || []).map((m, i) => (
            <div key={i} className={`flex ${m.is_admin ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-5 rounded-3xl ${
                m.is_admin
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20 rounded-br-none'
                  : 'bg-white border border-zinc-100 text-zinc-900 shadow-sm rounded-bl-none'
              }`}>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-1.5 opacity-70 ${m.is_admin ? 'text-purple-100' : 'text-zinc-400'}`}>
                  {m.is_admin ? 'Vantage Agent' : m.sender_name}
                </p>
                <p className="font-medium text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                <div className="flex items-center gap-1 mt-2 opacity-40">
                  <Clock size={10} />
                  <span className="text-[9px] font-bold">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={msgEndRef} />
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} className="p-5 bg-white border-t border-zinc-100 flex gap-3 flex-shrink-0">
          <Input
            placeholder={selectedTicket.status === 'Resolved' ? 'This ticket is resolved.' : 'Type your official response...'}
            value={reply}
            onChange={e => setReply(e.target.value)}
            disabled={selectedTicket.status === 'Resolved'}
            className="flex-1 h-14 rounded-2xl border-zinc-200"
          />
          <Button
            type="submit"
            disabled={selectedTicket.status === 'Resolved'}
            className="h-14 px-8 rounded-2xl flex items-center gap-2 font-black text-sm uppercase tracking-widest bg-purple-600 text-white disabled:opacity-40"
          >
            <ChevronRight size={18} className="text-white" /> Send Reply
          </Button>
        </form>
      </Card>
    </div>
  );
}
