import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export function HeroSection({ slide, dir, slides, goSlide }) {
  const current = slides[slide];

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col justify-end overflow-hidden">
      <AnimatePresence custom={dir} initial={false}>
        <motion.div
          key={slide} custom={dir} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={current.bg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-900/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-purple-400 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              {current.tag}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tight mb-6">
              {current.headline[0]}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                {current.headline[1]}
              </span>
            </h1>
            <p className="text-zinc-300 text-xl font-medium max-w-xl mb-10 leading-relaxed">{current.sub}</p>
            <div className="flex flex-wrap gap-4">
              <Link to={current.ctaLink}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-widest transition-colors shadow-xl shadow-purple-900/40">
                  {current.cta} <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/support">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-black px-8 py-4 rounded-2xl text-sm uppercase tracking-widest transition-colors">
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-10 right-6 flex items-center gap-4">
          <button onClick={() => goSlide((slide - 1 + slides.length) % slides.length)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'bg-purple-400 w-8' : 'bg-white/30 w-4 hover:bg-white/60'}`}
              />
            ))}
          </div>
          <button onClick={() => goSlide((slide + 1) % slides.length)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
