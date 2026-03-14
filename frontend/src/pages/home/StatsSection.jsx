import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedCounter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const steps = 60;
        const inc = value / steps;
        const interval = setInterval(() => {
          start += inc;
          if (start >= value) { setCount(value); clearInterval(interval); }
          else setCount(Math.floor(start));
        }, 1800 / steps);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} className="tabular-nums">{count.toLocaleString()}{suffix}</span>;
}

export function StatsSection({ stats }) {
  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            Our Goals in Numbers
          </span>
          <h2 className="text-4xl font-black text-white mt-6 tracking-tight">
            Built on proven <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">performance.</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <stat.icon size={22} className="text-purple-400" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 break-all">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
