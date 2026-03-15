import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const icons = {
  Pending: Clock,
  "In Transit": Truck,
  Delivered: CheckCircle,
  "On Hold": AlertCircle,
  Default: Package
};

export const TimelineItem = ({ item, isLast, index, shipmentId }) => {
  const Icon = icons[item.status] || icons.Default;
  const isHold = item.status === "On Hold";
  const date = new Date(item.timestamp).toLocaleDateString();
  const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const navigate = useNavigate();

  const handleSupportClick = () => {
    navigate('/support', { 
      state: { 
        subject: `Support Request for Shipment #${shipmentId}`,
        context: `${item.status} | ${date} • ${time} | ${item.location || 'Central Hub'} | "${item.remarks}"`
      } 
    });
  };

  const renderRemarks = (text) => {
    if (!text) return null;
    const parts = text.split(/(contact support)/gi);
    return parts.map((part, i) => 
      part.toLowerCase() === 'contact support' ? (
        <span key={i} onClick={handleSupportClick} className="underline cursor-pointer hover:text-red-800 transition-colors">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className="relative flex gap-6 pb-8">
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/30 to-transparent" />
      )}
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`z-10 w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-500 ${
          isHold 
            ? 'bg-red-50 border-red-200 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
            : 'bg-purple-50 border-purple-100 text-purple-600'
        }`}
      >
        <Icon size={20} />
      </motion.div>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className="flex-1"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
          <h4 className={`font-bold text-xl ${isHold ? 'text-red-600' : 'text-zinc-900'}`}>{item.status}</h4>
          <span className="text-zinc-500 text-sm font-medium">{date} • {time}</span>
        </div>
        <p className="text-zinc-500 font-medium">{item.location || 'Central Processing Hub'}</p>
        {item.photo_url && (
           <div className="mt-4 rounded-2xl overflow-hidden border-2 border-purple-500/10 shadow-lg group relative max-w-sm">
              <img 
                src={item.photo_url.startsWith('/uploads/') ? `/api${item.photo_url}` : item.photo_url} 
                alt="Status evidence" 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                 <span className="text-white text-[10px] font-black uppercase tracking-widest">Visual Evidence Active</span>
              </div>
           </div>
        )}
        {item.remarks && (
          <p className={`text-sm mt-2 font-medium inline-block px-3 py-1 rounded-lg transition-all duration-500 ${
            isHold 
              ? 'text-red-700 bg-red-100/80 border border-red-200 animate-pulse' 
              : 'text-purple-600/70 bg-purple-50'
          }`}>
            "{renderRemarks(item.remarks)}"
          </p>
        )}
      </motion.div>
    </div>
  );
};

export const TrackingTimeline = ({ history = [], shipmentId }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      {history.slice().reverse().map((item, index) => (
        <TimelineItem 
          key={item.id} 
          item={item} 
          index={index} 
          isLast={index === history.length - 1} 
          shipmentId={shipmentId}
        />
      ))}
    </div>
  );
};
