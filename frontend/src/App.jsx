import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LifeBuoy, Menu, X } from 'lucide-react';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/Login';
import AdminUsers from './pages/admin/Users';
import TrackingPage from './pages/tracking';
import AdminDashboard from './pages/admin';
import SupportPage from './pages/support';
import SupportDashboard from './pages/admin/SupportDashboard';
import Homepage from './pages/Homepage';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On non-home pages, always show solid nav
  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <div className="flex justify-center fixed top-0 left-0 right-0 z-50">
        <nav className={`w-full transition-all duration-500 ${
          transparent
            ? 'bg-transparent border-transparent shadow-none mt-0 py-6 px-8'
            : 'bg-white/90 backdrop-blur-xl border-b border-zinc-100 shadow-sm shadow-purple-500/5 mt-0 py-4 px-8'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-[0.85rem] transition-all duration-300 ${
                transparent
                  ? 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
                  : 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-zinc-700/60 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/25 hover:border-purple-500/40'
              } overflow-hidden`}>
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <span className={`text-sm font-black tracking-[0.15em] leading-none mb-[0.1rem] relative z-10 ${transparent ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300'}`}>
                  VANTAGE
                </span>
                <span className="text-[0.45rem] font-bold text-purple-400 uppercase tracking-[0.3em] leading-none relative z-10">
                  LOGISTICS
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {[['Home', '/'], ['Services', '/#services'], ['About', '/#about'], ['Track', '/track']].map(([label, href]) => (
                <Link
                  key={label}
                  to={href}
                  className={`text-xs font-black uppercase tracking-widest transition-all hover:text-purple-500 ${
                    transparent ? 'text-white/80' : 'text-zinc-500'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {isLoggedIn && (
                <Link to="/admin" className={`text-xs font-black uppercase tracking-widest transition-all hover:text-purple-500 ${transparent ? 'text-white/80' : 'text-zinc-500'}`}>
                  Admin
                </Link>
              )}
              <Link
                to="/support"
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${
                  transparent
                    ? 'text-white border-white/30 hover:bg-white/20'
                    : 'text-purple-600 border-purple-100 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <LifeBuoy size={14} /> Support
              </Link>
              {isLoggedIn && (
                <button
                  onClick={logout}
                  className={`text-xs font-black uppercase tracking-widest transition-all hover:text-red-500 ${transparent ? 'text-white/60' : 'text-zinc-400'}`}
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className={`md:hidden p-2 rounded-xl transition-colors ${transparent ? 'text-white' : 'text-zinc-600'}`}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl flex flex-col pt-28 px-8 pb-12 md:hidden">
          <div className="space-y-6">
            {[['Home', '/'], ['Services', '/#services'], ['About', '/#about'], ['Track Package', '/track'], ['Support', '/support'], ...(isLoggedIn ? [['Admin', '/admin']] : [])].map(([label, href]) => (
              <Link key={label} to={href} onClick={() => setMobileOpen(false)}
                className="block text-2xl font-black text-white hover:text-purple-400 uppercase tracking-widest transition-colors">
                {label}
              </Link>
            ))}
            {isLoggedIn && (
              <button onClick={() => { logout(); setMobileOpen(false); }}
                className="block text-2xl font-black text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/support/:ticketId" element={<SupportPage />} />
          <Route path="/admin/support" element={<ProtectedRoute><SupportDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
