/**
 * Header.jsx  –  East Bridge Real Estates
 * ─────────────────────────────────
 * Deps (add to package.json if missing):
 *   framer-motion, lucide-react
 * Fonts (add to index.html <head>):
 *   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
 */

import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, X, User, Menu, ChevronRight } from 'lucide-react';

/* ─── tiny hook: detect click outside ─────────────────────────── */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (!ref.current?.contains(e.target)) handler(); };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

/* ─── nav links ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',    to: '/'       },
  { label: 'Search',  to: '/search' },
  { label: 'About',   to: '/about'  },
];

export default function Header() {
  const { currentUser } = useSelector((s) => s.user);
  const navigate        = useNavigate();
  const location        = useLocation();

  const [searchTerm,    setSearchTerm]    = useState('');
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);

  const searchRef  = useRef(null);
  const inputRef   = useRef(null);
  const { scrollY } = useScroll();

  /* hide mobile menu on route change */
  useEffect(() => setMobileOpen(false), [location]);

  /* sync search term from URL */
  useEffect(() => {
    const term = new URLSearchParams(location.search).get('searchTerm');
    if (term) setSearchTerm(term);
  }, [location]);

  /* scrolled state for header style */
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 20));

  /* focus input when search panel opens */
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [searchOpen]);

  useClickOutside(searchRef, () => setSearchOpen(false));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    setSearchOpen(false);
  };

  /* ─── styles ─────────────────────────────────────────────── */
  const headerBase = `
    fixed top-0 inset-x-0 z-50 transition-all duration-500
    ${scrolled
      ? 'bg-[#0c1117]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)] py-3'
      : 'bg-transparent py-5'}
  `;

  return (
    <>
      <header className={headerBase} style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">

          {/* ── Logo ───────────────────────────────────────────── */}
          <Link to="/" className="flex-shrink-0">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}>
              <span
                className="text-xl font-semibold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span className="text-white/90">East-</span>
                <span className="text-amber-400">Gates</span>
              </span>
              <span className="text-white/30 mx-1 text-lg font-light">·</span>
              <span className="text-white/50 text-sm font-light tracking-widest uppercase">Estates</span>
            </motion.div>
          </Link>

          {/* ── Desktop Nav ────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    className={`
                      relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${active ? 'text-white' : 'text-white/50 hover:text-white/90'}
                    `}
                  >
                    {label}
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white/8 rounded-lg -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ──────────────────────────────────── */}
          <div className="flex items-center gap-3">

            {/* Search toggle */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/8 transition-colors"
              aria-label="Toggle search"
            >
              <Search size={18} strokeWidth={1.8} />
            </motion.button>

            {/* Profile / Sign-in */}
            {currentUser ? (
              <Link to="/profile">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <img
                    src={currentUser.avatar}
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-amber-400/40 ring-offset-2 ring-offset-transparent"
                  />
                </motion.div>
              </Link>
            ) : (
              <Link to="/sign-in">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="hidden md:flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200"
                >
                  <User size={14} />
                  Sign In
                </motion.div>
              </Link>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 text-white/60 hover:text-white"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.div key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><X    size={20} /></motion.div>
                  : <motion.div key="ham" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Expandable Search Bar ────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-white/8"
            >
              <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                <Search size={16} className="text-white/40 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by location, property type…"
                  className="flex-1 bg-transparent text-white/90 placeholder-white/30 text-sm focus:outline-none"
                />
                {searchTerm && (
                  <motion.button
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    <X size={14} />
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-amber-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-amber-300 transition-colors flex items-center gap-1"
                >
                  Search <ChevronRight size={13} />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 bg-[#0c1117] border-l border-white/8 flex flex-col p-8 gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <div className="mb-8">
                <span className="text-white/30 text-xs font-medium tracking-widest uppercase">Navigation</span>
              </div>
              {NAV_LINKS.map(({ label, to }, i) => (
                <motion.div
                  key={to}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 + 0.05 }}
                >
                  <Link
                    to={to}
                    className="flex items-center justify-between py-3 text-white/80 hover:text-white text-lg font-medium border-b border-white/6 group"
                  >
                    {label}
                    <ChevronRight size={16} className="text-white/20 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
              {!currentUser && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-auto">
                  <Link
                    to="/sign-in"
                    className="flex items-center justify-center gap-2 bg-amber-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-amber-300 transition-colors"
                  >
                    <User size={16} /> Sign In
                  </Link>
                </motion.div>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
