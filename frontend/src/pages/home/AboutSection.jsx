import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe2, Award, TrendingUp, Users } from 'lucide-react';

export function AboutSection({ heroAirImg }) {
  return (
    <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
            About Vantage
          </span>
          <h2 className="text-5xl font-black text-zinc-900 mt-6 mb-6 tracking-tight leading-[1.05]">
            Logistics Around<br /><span className="gradient-text">the World.</span>
          </h2>
          <p className="text-zinc-500 font-medium leading-relaxed text-lg mb-8">
            Vantage Logistics is a premier global consignment provider — we support industry
            and trade in the worldwide exchange of goods through land, air, and sea transport.
          </p>
          <p className="text-zinc-500 font-medium leading-relaxed mb-10">
            Experience the power of seamless global logistics with Vantage. From express delivery
            to comprehensive supply chain management, we are your trusted partner for moving goods
            across borders and continents.
          </p>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Shield, label: 'Secure & Insured', desc: 'Every shipment protected' },
              { icon: Zap, label: 'Real-Time Tracking', desc: 'Live visual timeline' },
              { icon: Globe2, label: 'Global Network', desc: '180+ countries covered' },
              { icon: Award, label: 'Certified Partner', desc: 'Industry-leading standards' },
            ].map(item => (
              <div key={item.label} className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">{item.label}</p>
                  <p className="text-zinc-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-500/10">
            <img src={heroAirImg} alt="Vantage Logistics air freight" className="w-full h-[550px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl shadow-purple-500/10 border border-zinc-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <TrendingUp size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900">98%</p>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">On-Time Rate</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -top-6 -right-6 bg-zinc-950 rounded-2xl p-5 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                <Users size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-black text-white">12,000+</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Shipments</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
