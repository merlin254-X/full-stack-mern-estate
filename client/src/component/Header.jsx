/**
 * Header.jsx  –  East Bridge Developers
 * Extra modern version
 */

import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, X, User, Menu, ChevronRight } from 'lucide-react';

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current?.contains(e.target)) handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
  { label: 'About', to: '/about' },
];

export default function Header() {
  const { currentUser } = useSelector((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const { scrollY } = useScroll();

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const term = new URLSearchParams(location.search).get('searchTerm');
    if (term) setSearchTerm(term);
  }, [location]);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 16));

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 120);
  }, [searchOpen]);

  useClickOutside(searchRef, () => setSearchOpen(false));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    setSearchOpen(false);
  };

  const isHomePage = location.pathname === '/';

  // Dynamic colors
  const isDark = scrolled || !isHomePage;

  return (
    <>
      <header
        className={`
          fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out
          ${scrolled
            ? 'bg-[#0b0f14]/80 backdrop-blur-2xl border-b border-white/[0.06] py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent py-5'}
        `}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-baseline gap-1.5"
            >
              <span
                className="text-[1.35rem] font-semibold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  East-
                </span>
                <span className="text-amber-400">Gates</span>
              </span>
              <span className={`text-[11px] font-medium tracking-[0.22em] uppercase ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                Developers
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 bg-white/[0.03] rounded-full px-1.5 py-1 border border-white/[0.04]">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    className={`
                      relative px-5 py-2 text-[13px] font-medium rounded-full transition-colors duration-200
                      ${active
                        ? isDark ? 'text-white' : 'text-gray-900'
                        : isDark ? 'text-white/45 hover:text-white/85' : 'text-gray-500 hover:text-gray-900'}
                    `}
                  >
                    {label}
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className={`absolute inset-0 rounded-full -z-10 ${
                          isDark ? 'bg-white/10' : 'bg-gray-900/8'
                        }`}
                        transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2.5">

            {/* Search */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setSearchOpen((v) => !v)}
              className={`
                p-2.5 rounded-full transition-all duration-200
                ${isDark
                  ? 'text-white/55 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-900/5'}
              `}
              aria-label="Search"
            >
              <Search size={17} strokeWidth={1.9} />
            </motion.button>

            {/* Avatar / Sign In */}
            {currentUser ? (
              <Link to="/profile">
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative"
                >
                  <img
                    src={currentUser.avatar}
                    alt="profile"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-400/80 ring-offset-2 ring-offset-transparent"
                  />
                </motion.div>
              </Link>
            ) : (
              <Link to="/sign-in" className="hidden md:block">
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_4px_20px_rgba(251,191,36,0.25)]"
                >
                  <User size={14} strokeWidth={2.2} />
                  Sign In
                </motion.div>
              </Link>
            )}

            {/* Mobile menu */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`md:hidden p-2.5 rounded-full ${isDark ? 'text-white/70' : 'text-gray-700'}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="ham"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Expandable Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`overflow-hidden border-t ${
                isDark ? 'border-white/[0.06]' : 'border-gray-200/80'
              }`}
            >
              <form
                onSubmit={handleSubmit}
                className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center gap-3"
              >
                <Search
                  size={16}
                  className={`flex-shrink-0 ${isDark ? 'text-white/35' : 'text-gray-400'}`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search location, property type, or keyword…"
                  className={`
                    flex-1 bg-transparent text-sm focus:outline-none placeholder:opacity-40
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex items-center gap-1 bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-amber-300 transition-colors"
                >
                  Search
                  <ChevronRight size={13} strokeWidth={2.5} />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] z-50 bg-[#0b0f14] border-l border-white/[0.06] flex flex-col p-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <div className="mb-10">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/25">
                  Menu
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ label, to }, i) => (
                  <motion.div
                    key={to}
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 + 0.08, duration: 0.35 }}
                  >
                    <Link
                      to={to}
                      className="group flex items-center justify-between py-4 text-[17px] font-medium text-white/75 hover:text-white border-b border-white/[0.05] transition-colors"
                    >
                      {label}
                      <ChevronRight
                        size={16}
                        className="text-white/20 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {!currentUser && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="mt-auto"
                >
                  <Link
                    to="/sign-in"
                    className="flex items-center justify-center gap-2.5 w-full bg-amber-400 text-gray-900 font-semibold py-3.5 rounded-2xl hover:bg-amber-300 transition-colors shadow-[0_8px_24px_rgba(251,191,36,0.2)]"
                  >
                    <User size={16} strokeWidth={2.2} />
                    Sign In
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