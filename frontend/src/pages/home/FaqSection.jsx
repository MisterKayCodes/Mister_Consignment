import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="border border-zinc-100 rounded-2xl overflow-hidden bg-white hover:border-purple-200 transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-8 py-6 text-left">
        <h4 className="font-bold text-zinc-900 pr-6">{q}</h4>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={20} className="text-purple-500 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
          >
            <p className="px-8 pb-6 text-zinc-500 font-medium leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection({ faqs }) {
  return (
    <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
            FAQ
          </span>
          <h2 className="text-4xl font-black text-zinc-900 mt-6 mb-4 tracking-tight">
            Common <span className="gradient-text">questions.</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </div>
    </section>
  );
}
