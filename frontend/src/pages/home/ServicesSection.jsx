import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function ServicesSection({ services }) {
  return (
    <section id="services" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
          Explore Our Services
        </span>
        <h2 className="text-5xl font-black text-zinc-900 mt-6 mb-4 tracking-tight">
          Transport <span className="gradient-text">Solutions</span>
        </h2>
        <p className="text-zinc-500 font-medium max-w-xl mx-auto text-lg">
          From express air to sea and road — comprehensive logistics engineered for reliability.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            className="group premium-card flex flex-col"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${svc.accent} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <svc.icon size={22} />
            </div>
            <h3 className="font-black text-xl text-zinc-900 mb-3">{svc.title}</h3>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6 flex-1">{svc.desc}</p>
            <ul className="space-y-2">
              {svc.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                  <CheckCircle2 size={14} className="text-purple-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
