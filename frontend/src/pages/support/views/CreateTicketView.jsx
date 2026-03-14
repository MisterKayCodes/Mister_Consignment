import { Button, Input, Card } from '../../../components/ui/Primitives';

export function CreateTicketView({ newTicket, setNewTicket, handleCreate, loading, setIsCreating }) {
  return (
    <Card className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Open a New Ticket</h2>
      <form onSubmit={handleCreate} className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Subject</p>
          <Input placeholder="What do you need help with?" value={newTicket.subject} onChange={e => setNewTicket({...newTicket, subject: e.target.value})} required />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Your Name</p>
          <Input placeholder="Enter your full name" value={newTicket.sender_name} onChange={e => setNewTicket({...newTicket, sender_name: e.target.value})} required />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Message</p>
          <textarea 
            className="w-full h-40 bg-zinc-50 border border-zinc-100 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            placeholder="Describe your issue..."
            value={newTicket.first_message}
            onChange={e => setNewTicket({...newTicket, first_message: e.target.value})}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full py-4 rounded-2xl">
          {loading ? 'Creating Ticket...' : 'Launch Support Ticket'}
        </Button>
        <div className="text-center">
           <button type="button" onClick={() => setIsCreating(false)} className="text-sm text-zinc-400 font-bold hover:text-purple-600 uppercase tracking-widest">
             I have a ticket ID
           </button>
        </div>
      </form>
    </Card>
  );
}
