import { useState } from 'react';
import { Search, MapPin, User, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Card } from '../../components/ui/Primitives';
import { useShipment } from '../../hooks/useShipment';
import { TrackingTimeline } from './TrackingTimeline';
import { shipmentApi } from '../../api/shipments';

export default function TrackingPage() {
  const [tid, setTid] = useState('');
  const { shipment, loading, error, trackShipment } = useShipment();

  const handleSearch = (e) => {
    e.preventDefault();
    if (tid.trim()) trackShipment(tid.trim());
  };

  const handleDownloadInvoice = () => {
    window.open(shipmentApi.getInvoiceUrl(shipment.tracking_id), '_blank');
  };

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-zinc-900">
            Find your <span className="text-purple-600">Goods.</span>
          </h1>
          <p className="text-zinc-500 text-xl font-medium max-w-xl mx-auto">
            Experience the future of consignment tracking with a precise, real-time visual timeline.
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-20 bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-purple-500/10 border border-zinc-100">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={24} />
            <Input
              value={tid}
              onChange={(e) => setTid(e.target.value)}
              placeholder="VL-XXXXXXXX"
              className="pl-16 h-16 text-xl bg-transparent border-none focus:ring-0"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-16 px-12 rounded-[2rem]">
            {loading ? 'Processing...' : 'Track Origin'}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-red-500 bg-red-50 border border-red-100 rounded-3xl p-6 mb-12"
            >
              {error}
            </motion.div>
          )}

          {shipment && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="flex items-center gap-6 group hover:bg-purple-50/30">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Receiver</p>
                    <h3 className="text-2xl font-black text-zinc-900">{shipment.receiver_name}</h3>
                  </div>
                </Card>
                <Card className="flex items-center gap-6 group hover:bg-indigo-50/30">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Destination</p>
                    <h3 className="text-2xl font-black text-zinc-900">{shipment.receiver_address_masked}</h3>
                  </div>
                </Card>
              </div>

              <Card className="p-10">
                <div className="flex justify-between items-center mb-12">
                   <div>
                     <h2 className="text-3xl font-black text-zinc-900 mb-1">Live Journey</h2>
                     <p className="text-zinc-500 font-medium">Tracking {shipment.tracking_id}</p>
                   </div>
                   <Button onClick={handleDownloadInvoice} variant="secondary" className="flex gap-2 items-center text-sm py-3 px-6 rounded-2xl">
                      <Download size={18} /> Get Invoice
                   </Button>
                </div>
                <TrackingTimeline history={shipment.history} shipmentId={shipment.tracking_id} />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
