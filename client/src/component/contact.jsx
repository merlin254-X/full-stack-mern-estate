/**
 * Contact.jsx  –  East Bridge Developers
 * ─────────────────────────────────────
 * Deps: framer-motion, lucide-react
 * Fonts (index.html):
 *   Playfair Display + DM Sans  (see Home.jsx header comment)
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, User, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';

/* ─── tiny textarea auto-resize hook ────────────────────────────── */
function useAutoResize(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    };
    el.addEventListener('input', resize);
    resize();
    return () => el.removeEventListener('input', resize);
  }, [ref]);
}

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message,  setMessage]  = useState('');
  const [status,   setStatus]   = useState('idle'); // idle | loading | sent
  const textareaRef = { current: null };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res  = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        // Pre-fill a polite starter message
        setMessage(`Hi ${data.username},\n\nI'm interested in "${listing.name}" and would love to learn more.\n\nLooking forward to hearing from you!`);
      } catch (err) {
        console.error('Error fetching landlord:', err);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const charCount   = message.length;
  const charLimit   = 1000;
  const charPct     = Math.min((charCount / charLimit) * 100, 100);
  const charWarning = charCount > charLimit * 0.9;

  /* simulate a "sending" flash before mailto opens */
  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || status !== 'idle') return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('sent');
      window.location.href = `mailto:${landlord.email}?subject=Regarding ${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`;
    }, 800);
  };

  if (!landlord) return (
    <div className="flex items-center justify-center py-8 gap-2 text-gray-400 text-sm">
      <Loader2 size={16} className="animate-spin" />
      Loading contact info…
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* ── Header strip ──────────────────────────────────── */}
      <div className="bg-[#0c1117] px-6 py-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 text-gray-900 font-bold text-lg uppercase">
          {landlord.username?.[0] ?? '?'}
        </div>
        <div>
          <p className="text-white font-semibold leading-tight">{landlord.username}</p>
          <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
            <Mail size={10} /> {landlord.email}
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2.5 py-1 rounded-full">
            Agent
          </span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="px-6 py-6">

        {/* About this enquiry */}
        <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-5 border border-gray-100">
          <MessageSquare size={14} className="text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
          <p className="text-xs text-gray-500 leading-relaxed">
            Enquiring about{' '}
            <span className="font-semibold text-gray-800">{listing.name}</span>
            {' '}— your message will be sent directly via email.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'sent' ? (

            /* ── Sent state ─────────────────────────────── */
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <p className="font-semibold text-gray-800">Email client opened!</p>
              <p className="text-xs text-gray-400 max-w-xs">
                Your default mail app should be opening. If it didn't,{' '}
                <a
                  href={`mailto:${landlord.email}`}
                  className="text-amber-600 underline underline-offset-2"
                >
                  click here
                </a>{' '}
                to email directly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                ← Edit message
              </button>
            </motion.div>

          ) : (

            /* ── Compose state ──────────────────────────── */
            <motion.form
              key="form"
              onSubmit={handleSend}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              <div className="relative">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                  Your Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here…"
                  maxLength={charLimit}
                  className={`
                    w-full resize-none border rounded-xl px-4 py-3 text-sm text-gray-800
                    placeholder-gray-300 focus:outline-none transition-colors leading-relaxed
                    ${charWarning
                      ? 'border-amber-300 focus:border-amber-400 bg-amber-50/30'
                      : 'border-gray-200 focus:border-gray-400 bg-gray-50'}
                  `}
                />
                {/* char meter */}
                <div className="flex items-center justify-end gap-2 mt-1.5">
                  <div className="h-0.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${charWarning ? 'bg-amber-400' : 'bg-gray-300'}`}
                      style={{ width: `${charPct}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${charWarning ? 'text-amber-500' : 'text-gray-300'}`}>
                    {charCount}/{charLimit}
                  </span>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={!message.trim() || status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-[#0c1117] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Opening mail client…
                  </>
                ) : (
                  <>
                    <Send size={14} strokeWidth={2} />
                    Send Message
                  </>
                )}
              </motion.button>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                This will open your default email client.
                Your email address will be shared with the agent.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
