import { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Button, Input } from '../../components/ui/Primitives';
import { supportApi } from '../../api/shipments';
import { useNotification } from '../../context/NotificationContext';
import { TicketList } from './support/TicketList';
import { ChatArea } from './support/ChatArea';

export default function SupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast, askConfirm } = useNotification();
  const msgEndRef = useRef(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const resp = await supportApi.listTickets();
      setTickets(resp.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  useEffect(() => {
    setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [selectedTicket?.messages?.length]);

  const handleSelectTicket = async (t) => {
    setSelectedTicket(t);
    try {
      const resp = await supportApi.getTicket(t.ticket_id);
      setSelectedTicket(resp.data);
    } catch (_) {}
  };

  const handleMarkResolved = async () => {
    if (!selectedTicket) return;
    const confirmed = await askConfirm({
      title: 'Mark Resolved?',
      message: 'Mark this ticket as Resolved? The client will see this status.',
      confirmText: 'Yes, Resolve It',
      type: 'confirm'
    });
    if (!confirmed) return;
    try {
      await supportApi.updateStatus(selectedTicket.ticket_id, 'Resolved');
      setSelectedTicket(prev => ({ ...prev, status: 'Resolved' }));
      fetchTickets();
      showToast('Ticket marked as Resolved', 'success');
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedTicket) return;

    const replyContent = reply;
    const isFirstReply = ['Pending', 'Open'].includes(selectedTicket.status);
    const nextStatus = isFirstReply ? 'Resolving' : selectedTicket.status;

    // Optimistic: add message + update status immediately in UI
    const optimisticMsg = {
      sender_name: 'Vantage Agent',
      content: replyContent,
      is_admin: 1,
      timestamp: new Date().toISOString()
    };
    setSelectedTicket(prev => ({
      ...prev,
      status: nextStatus,
      messages: [...(prev.messages || []), optimisticMsg]
    }));
    setReply('');

    try {
      // 1. Send the message
      await supportApi.addMessage(selectedTicket.ticket_id, {
        sender_name: 'Vantage Agent',
        content: replyContent,
        is_admin: 1
      });
      // 2. If this was first reply, explicitly set status to Resolving in DB
      if (isFirstReply) {
        await supportApi.updateStatus(selectedTicket.ticket_id, 'Resolving');
      }
      // 3. Refresh sidebar
      fetchTickets();
      showToast('Reply sent', 'success');
    } catch (e) {
      showToast('Error sending reply', 'error');
    }
  };

  const filteredTickets = tickets.filter(t =>
    t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 px-6 pb-6 max-w-[1280px] mx-auto" style={{ height: 'calc(100vh - 1rem)' }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight uppercase">Support Desk</h1>
          <p className="text-zinc-500 font-medium">Resolution dashboard for client inquiries.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-56 h-11 rounded-2xl"
            />
          </div>
          <Button onClick={fetchTickets} variant="secondary" className="h-11 w-11 p-0 flex items-center justify-center rounded-2xl">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Left: Ticket List */}
        <TicketList
          filteredTickets={filteredTickets}
          selectedTicket={selectedTicket}
          handleSelectTicket={handleSelectTicket}
        />

        {/* Right: Chat Area */}
        <ChatArea
          selectedTicket={selectedTicket}
          handleMarkResolved={handleMarkResolved}
          handleSendReply={handleSendReply}
          reply={reply}
          setReply={setReply}
          msgEndRef={msgEndRef}
        />
      </div>
    </div>
  );
}
