import { MessageSquare } from 'lucide-react';
import { Button, Input, Card } from '../../../components/ui/Primitives';

export function TrackTicketView({ ticketId, setTicketId, fetchTicket, loading, setIsCreating }) {
  return (
    <Card className="max-w-md mx-auto text-center">
      <MessageSquare size={48} className="mx-auto text-purple-100 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Track Ticket</h2>
      <p className="text-zinc-500 mb-8 font-medium">Enter your TKT ID to join the chat.</p>
      <form defaultValue={ticketId} onSubmit={(e) => { e.preventDefault(); fetchTicket(); }} className="space-y-4">
        <Input placeholder="TKT-XXXXXX" value={ticketId} onChange={e => setTicketId(e.target.value)} className="text-center text-xl font-black uppercase" />
        <Button type="submit" disabled={loading} className="w-full">
           Open Conversation
        </Button>
        <button type="button" onClick={() => setIsCreating(true)} className="text-sm text-zinc-400 font-bold hover:text-purple-600 uppercase tracking-widest w-full">
          Nevermind, create new
        </button>
      </form>
    </Card>
  );
}
