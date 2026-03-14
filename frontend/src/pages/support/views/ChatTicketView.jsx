import { CheckCheck, ChevronRight } from 'lucide-react';
import { Button, Input, Card } from '../../../components/ui/Primitives';

export function ChatTicketView({ ticket, message, setMessage, handleSendMessage, msgEndRef }) {
  return (
    <div className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-12">
        <Card className="flex flex-col h-[70vh] p-0 overflow-hidden">
           <div className="p-6 border-b border-zinc-50 bg-zinc-50/50 flex justify-between items-center">
              <div>
                <span className="text-xs font-black text-purple-600 tracking-widest uppercase">{ticket.ticket_id}</span>
                <h3 className="text-xl font-bold text-zinc-900">{ticket.subject}</h3>
              </div>
               <div className={{
                 'Pending':   'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-yellow-100 text-yellow-700',
                 'Resolving': 'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-100 text-blue-700',
                 'Resolved':  'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-green-100 text-green-700',
                 'Open':      'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-green-100 text-green-700',
                 'Closed':    'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500',
               }[ticket.status] || 'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500'}>
                 {ticket.status}
               </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col">
             {ticket.messages.map((m, i) => (
               <div key={i} className={`flex ${m.is_admin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl ${
                    m.is_admin 
                    ? 'bg-zinc-100 text-zinc-900 rounded-bl-none' 
                    : 'bg-purple-600 text-white shadow-xl shadow-purple-500/20 rounded-br-none'
                  }`}>
                     <p className={`text-[10px] font-black uppercase tracking-widest mb-1 opacity-60 ${m.is_admin ? 'text-zinc-500' : 'text-purple-100'}`}>
                       {m.is_admin ? 'Agent Response' : m.sender_name}
                     </p>
                     <p className="font-medium whitespace-pre-wrap">{m.content}</p>
                     <div className="flex items-center gap-1 mt-2 opacity-50">
                       <span className="text-[10px]">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       <CheckCheck size={12} className="ml-1" />
                     </div>
                  </div>
               </div>
             ))}
             <div ref={msgEndRef} />
           </div>

           <form onSubmit={handleSendMessage} className="p-6 border-t border-zinc-50 flex gap-4">
              <Input 
                placeholder="Type your message..." 
                value={message} 
                onChange={e => setMessage(e.target.value)}
                className="flex-1 rounded-2xl h-14"
              />
              <Button type="submit" className="h-14 px-6 rounded-2xl flex items-center gap-2 font-black text-sm uppercase tracking-widest bg-purple-600 text-white flex-shrink-0">
                <ChevronRight size={20} className="text-white" /> Send
              </Button>
           </form>
        </Card>
      </div>
    </div>
  );
}
