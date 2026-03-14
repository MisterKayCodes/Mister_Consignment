import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function TestimonialsSection({ testimonials }) {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
          Client Testimonials
        </span>
        <h2 className="text-4xl font-black text-zinc-900 mt-6 mb-4 tracking-tight">
          What our <span className="gradient-text">clients say.</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="premium-card flex flex-col"
          >
            <div className="flex gap-1 mb-6">
              {Array(t.rating).fill(0).map((_, j) => (
                <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-zinc-600 font-medium leading-relaxed text-base mb-8 flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-zinc-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                {t.name[0]}
              </div>
              <div>
                <p className="font-black text-zinc-900">{t.name}</p>
                <p className="text-xs text-zinc-400 font-medium">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
