import { motion } from 'framer-motion';

export const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100",
  };
  
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500/50 focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all text-zinc-900 placeholder:text-zinc-400 ${className}`}
    {...props}
  />
);

export const Card = ({ children, className = "", ...props }) => (
  <div className={`premium-card ${className}`} {...props}>
    {children}
  </div>
);
