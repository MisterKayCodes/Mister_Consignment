import { useState, useEffect } from 'react';
import { Plane, Ship, Truck, Package, Warehouse, Globe2, Clock, Shield, Zap, Award, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

import heroAir from '../assets/hero_air.png';
import heroOcean from '../assets/hero_ocean.png';
import heroLand from '../assets/hero_land.png';

import { HeroSection } from './home/HeroSection';
import { ServicesSection } from './home/ServicesSection';
import { StatsSection } from './home/StatsSection';
import { AboutSection } from './home/AboutSection';
import { TestimonialsSection } from './home/TestimonialsSection';
import { FaqSection } from './home/FaqSection';

// ─── DATA ────────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    bg: heroAir,
    tag: 'Air Freight Solutions',
    headline: ['Speed the world', 'forward.'],
    sub: 'Express air freight to every corner of the globe — delivered on time, every time.',
    cta: 'Track a Shipment',
    ctaLink: '/track',
  },
  {
    bg: heroOcean,
    tag: 'Ocean Freight Network',
    headline: ['Cross every', 'ocean.'],
    sub: 'Full and partial container loads across all major global shipping lanes.',
    cta: 'Explore Services',
    ctaLink: '/#services',
  },
  {
    bg: heroLand,
    tag: 'Land Transport',
    headline: ['Move cargo,', 'seamlessly.'],
    sub: 'Multimodal land transport solutions for door-to-door delivery anywhere.',
    cta: 'Get a Quote',
    ctaLink: '/support',
  },
];

const SERVICES = [
  { icon: Plane, title: 'Air Freight', desc: 'When speed is paramount. Our air freight network connects every major global hub.', features: ['General Air Cargo', 'Charter Services', 'Intermodal Solutions'], accent: 'from-purple-500 to-indigo-600' },
  { icon: Ship, title: 'Ocean Freight', desc: 'Cost-effective and reliable transportation across long sea distances.', features: ['Full Container Load (FCL)', 'Less-than-Container (LCL)', 'Intermodal Solutions'], accent: 'from-indigo-500 to-blue-600' },
  { icon: Truck, title: 'Land Transport', desc: 'Swift and reliable road solutions across all terrains and distances.', features: ['Part & Full Loads', 'Multimodal Solutions', 'Intermodal Solutions'], accent: 'from-violet-500 to-purple-600' },
  { icon: Warehouse, title: 'Warehousing', desc: 'Simplify storage logistics effortlessly with our managed warehouse solutions.', features: ['Storage Management', 'Inventory Control', 'Supply Chain Mgmt'], accent: 'from-purple-600 to-fuchsia-600' },
];

const STATS = [
  { value: 98, suffix: '%', label: 'On-Time Delivery', icon: Clock },
  { value: 180, suffix: '+', label: 'Countries Served', icon: Globe2 },
  { value: 12000, suffix: '+', label: 'Shipments Tracked', icon: Package },
  { value: 24, suffix: '/7', label: 'Support Coverage', icon: HeadphonesIcon },
];

const INDUSTRIES = [
  'Aerospace & Defense', 'Automotive', 'Healthcare & Pharma',
  'Fashion & Retail', 'Electronics', 'Oil & Gas Cargo',
  'Industrial & Manufacturing', 'Energy & Chemicals', 'Engineering',
  'Marine Parts', 'Cloud Computing', 'Semicon & Solar',
];

const TESTIMONIALS = [
  { name: 'Emily Ingrosso', role: 'Operations Director, Apex Global', quote: 'Working with Vantage Logistics has been a game-changer. Their attention to detail and proactive approach have significantly improved our bottom line.', rating: 5 },
  { name: 'David Brown', role: 'Supply Chain Lead, Orbis Manufacturing', quote: 'Vantage has been instrumental in streamlining our supply chain. Their dedication to efficiency and reliability makes them a true valued partner.', rating: 5 },
  { name: 'Sofia Marchetti', role: 'Logistics Manager, Crest Pharma', quote: "We've been impressed with Vantage's ability to adapt to our evolving requirements. Their flexibility and customer-first mindset are unmatched.", rating: 5 },
];

const FAQS = [
  { q: 'How do I track my shipment?', a: 'Navigate to the "Track" page and enter your Vantage tracking ID (e.g. VL-XXXXXXXX). You\'ll see a real-time visual timeline of your shipment\'s journey.' },
  { q: 'What shipping modes do you support?', a: 'We support Air Freight, Ocean Freight (FCL & LCL), and Land Transport (full/partial loads). All modes are available with door-to-door coverage.' },
  { q: 'Can I get a PDF invoice for my shipment?', a: 'Yes. On the tracking page, after locating your shipment, click "Get Invoice" to download a professionally formatted PDF receipt.' },
  { q: 'How do I contact support for a held shipment?', a: 'If your shipment shows "On Hold", click the "contact support" link directly on your timeline entry. It will pre-fill your inquiry with all relevant details.' },
  { q: 'What industries do you serve?', a: 'We specialize across 12+ verticals including Aerospace, Automotive, Healthcare & Pharma, Electronics, Fashion & Retail, Oil & Gas, and more.' },
];

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function Homepage() {
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);

  // Auto-rotate hero every 2 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const goSlide = (idx) => {
    setDir(idx > slide ? 1 : -1);
    setSlide(idx);
  };

  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSection slide={slide} dir={dir} slides={HERO_SLIDES} goSlide={goSlide} />

      {/* Intro Strip */}
      <section className="bg-zinc-950 py-6 overflow-hidden">
        <div className="flex gap-16 animate-[scroll_20s_linear_infinite] whitespace-nowrap w-max">
          {[...INDUSTRIES, ...INDUSTRIES].map((ind, i) => (
            <span key={i} className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-4">
              <span className="w-1 h-1 rounded-full bg-purple-600" /> {ind}
            </span>
          ))}
        </div>
      </section>

      <ServicesSection services={SERVICES} />
      <StatsSection stats={STATS} />
      <AboutSection heroAirImg={heroAir} />

      {/* Industries */}
      <section className="py-20 px-6 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
              Industry Competence
            </span>
            <h2 className="text-3xl font-black text-zinc-900 mt-6 tracking-tight">Tailored for your sector.</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {INDUSTRIES.map((ind, i) => (
              <motion.span
                key={ind}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-5 py-2.5 bg-white rounded-full text-sm font-bold text-zinc-700 border border-zinc-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all cursor-default shadow-sm"
              >
                {ind}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={TESTIMONIALS} />
      <FaqSection faqs={FAQS} />

      {/* CTA Banner */}
      <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-indigo-900/20" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(124,58,237,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.05]">
              Ready to move your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">cargo forward?</span>
            </h2>
            <p className="text-zinc-400 text-xl font-medium mb-12 max-w-xl mx-auto leading-relaxed">
              Track a shipment in seconds or reach out to our global operations team today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/track">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-black px-10 py-5 rounded-2xl text-sm uppercase tracking-widest transition-colors shadow-2xl shadow-purple-900/50">
                  <MapPin size={18} /> Track Package
                </motion.button>
              </Link>
              <Link to="/support">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black px-10 py-5 rounded-2xl text-sm uppercase tracking-widest transition-colors">
                  Contact Operations
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex flex-col items-start gap-1 mb-6">
                <span className="text-white font-black text-xl tracking-[0.15em]">VANTAGE</span>
                <span className="text-purple-400 text-[0.5rem] font-bold uppercase tracking-[0.3em]">LOGISTICS</span>
              </div>
              <p className="text-zinc-500 font-medium leading-relaxed max-w-sm">Delivering excellence, every mile of the way. Trusted by businesses across 180+ countries.</p>
            </div>
            <div>
              <h5 className="text-white font-black text-xs uppercase tracking-widest mb-6">Navigate</h5>
              <ul className="space-y-3">
                {[['Home', '/'], ['Services', '/#services'], ['About', '/#about'], ['Track Package', '/track'], ['Support', '/support']].map(([label, href]) => (
                  <li key={label}><Link to={href} className="text-zinc-500 hover:text-purple-400 text-sm font-medium transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-white font-black text-xs uppercase tracking-widest mb-6">Services</h5>
              <ul className="space-y-3">
                {['Air Freight', 'Ocean Freight', 'Land Transport', 'Warehousing', 'Supply Chain'].map(s => (
                  <li key={s}><span className="text-zinc-500 text-sm font-medium">{s}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-zinc-600 text-sm font-medium">© 2026 Vantage Logistics. All rights reserved.</p>
            <p className="text-zinc-700 text-xs font-medium uppercase tracking-widest">Delivering Excellence, Every Mile</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
