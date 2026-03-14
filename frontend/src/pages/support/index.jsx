import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';
import { supportApi } from '../../api/shipments';
import { useNotification } from '../../context/NotificationContext';

import { CreateTicketView } from './views/CreateTicketView';
import { TrackTicketView } from './views/TrackTicketView';
import { ChatTicketView } from './views/ChatTicketView';

export default function SupportPage() {
  const { ticketId: urlTicketId } = useParams();
  const location = useLocation();
  const [ticketId, setTicketId] = useState(urlTicketId || '');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { showToast } = useNotification();
  const msgEndRef = useRef(null);
  
  // Create ticket form state
  const [isCreating, setIsCreating] = useState(!urlTicketId);
  const [newTicket, setNewTicket] = useState({
    subject: location.state?.subject || '',
    first_message: location.state?.context ? `Context from Timeline: ${location.state.context}\n\nMy Message: ` : '',
    sender_name: ''
  });

  const fetchTicket = async (id) => {
    setLoading(true);
    try {
      const resp = await supportApi.getTicket(id || ticketId);
      setTicket(resp.data);
      setIsCreating(false);
    } catch (e) {
      showToast('Ticket not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlTicketId) {
      fetchTicket(urlTicketId);
    }
  }, [urlTicketId]);
  
  // Auto-scroll logic
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await supportApi.createTicket(newTicket);
      setTicket(resp.data);
      setTicketId(resp.data.ticket_id);
      setIsCreating(false);
      window.history.pushState(null, '', `/support/${resp.data.ticket_id}`);
      showToast('Ticket created and waiting for agent', 'success');
    } catch (e) {
      showToast('Error creating ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await supportApi.addMessage(ticket.ticket_id, {
        sender_name: ticket.messages[0].sender_name,
        content: message,
        is_admin: 0
      });
      setMessage('');
      fetchTicket(ticket.ticket_id);
    } catch (e) {
      showToast('Error sending message', 'error');
    }
  };

  return (
    <div className="pt-40 px-6 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 bg-purple-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-purple-500/30">
          <LifeBuoy size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight uppercase">Vantage Support</h1>
          <p className="text-zinc-500 font-medium">Real-time resolution desk for global logistics.</p>
        </div>
      </div>

      {!ticket && isCreating ? (
        <CreateTicketView
          newTicket={newTicket}
          setNewTicket={setNewTicket}
          handleCreate={handleCreate}
          loading={loading}
          setIsCreating={setIsCreating}
        />
      ) : !ticket ? (
        <TrackTicketView
          ticketId={ticketId}
          setTicketId={setTicketId}
          fetchTicket={fetchTicket}
          loading={loading}
          setIsCreating={setIsCreating}
        />
      ) : (
        <ChatTicketView
          ticket={ticket}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          msgEndRef={msgEndRef}
        />
      )}
    </div>
  );
}
