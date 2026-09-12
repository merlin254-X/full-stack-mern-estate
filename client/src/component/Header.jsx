import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Menu, ChevronRight } from 'lucide-react';

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

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const term = new URLSearchParams(location.search).get('searchTerm');
    if (term) setSearchTerm(term);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-sm border-b border-black/5 py-3' : 'py-5'
        }`}
        style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-[1.35rem] font-semibold tracking-tight text-[#111111]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                East-<span style={{ color: '#C9A227' }}>Gates</span>
              </span>
              <span className="hidden sm:inline text-[11px] font-medium tracking-[0.22em] uppercase text-black/35">
                Developers
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-[#F3F4F6] rounded-full px-1.5 py-1">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <span
                    className={`relative block px-5 py-2 text-[13px] font-medium rounded-full ${
                      active ? 'text-[#111111] bg-white shadow-sm' : 'text-black/45 hover:text-[#111111]'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2.5 rounded-full text-black/50 hover:text-[#111111] hover:bg-black/5"
              aria-label="Search"
            >
              <Search size={17} strokeWidth={1.9} />
            </button>

            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-[#C9A227]/80"
                />
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/sign-in"
                  className="px-5 py-2 text-[13px] font-medium rounded-full border border-black/10 text-[#111111] hover:bg-black/5"
                >
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="px-5 py-2.5 text-[13px] font-semibold rounded-full bg-[#111111] text-white hover:bg-black"
                >
                  Join Now
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2.5 rounded-full text-[#111111]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-black/5 bg-white"
            >
              <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center gap-3">
                <Search size={16} className="text-black/30" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Kigali, Nairobi, property type…"
                  className="flex-1 bg-transparent text-sm text-[#111111] focus:outline-none placeholder:text-black/30"
                />
                <button type="submit" className="bg-[#111111] text-white text-xs font-bold px-4 py-2 rounded-full">
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] z-50 bg-white flex flex-col p-8"
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/30 mb-8">Menu</p>
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between py-4 text-[17px] font-medium text-[#111111] border-b border-black/5"
                >
                  {label}
                  <ChevronRight size={16} className="text-black/25" />
                </Link>
              ))}
              {!currentUser && (
                <div className="mt-auto flex flex-col gap-3">
                  <Link to="/sign-in" className="text-center py-3 rounded-2xl border border-black/10 font-semibold">
                    Login
                  </Link>
                  <Link to="/sign-up" className="text-center py-3 rounded-2xl bg-[#111111] text-white font-semibold">
                    Join Now
                  </Link>
                </div>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}