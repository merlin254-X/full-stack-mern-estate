import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRound } from 'lucide-react';
import { signInStart, signInSuccess, signInFailure, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import OAuth from '../component/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signInFailure(null));
    if (location.state?.signedUp) {
      setSuccessMsg('Account created. Sign in to continue.');
    }
  }, [dispatch, location.state]);

  useEffect(() => {
    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      setSuccessMsg('Signed in. Redirecting…');
      setTimeout(() => navigate('/'), 700);
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', { credentials: 'include' });
      const data = await res.json();
      if (data.success === false) return;
      dispatch(deleteUserSuccess(data));
      setMenuOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <img src="/hero1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <Link to="/" className="absolute top-6 left-6 z-30">
        <img src="/logo.png" alt="East Gates Developers" className="h-10 w-auto object-contain" />
      </Link>

      <div ref={menuRef} className="absolute top-6 right-6 z-30">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="h-11 w-11 rounded-full bg-white/90 text-[#111111] shadow-sm flex items-center justify-center"
        >
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <UserRound size={18} />
          )}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute right-0 mt-2 w-40 rounded-2xl bg-white shadow-lg overflow-hidden text-sm"
            >
              <Link to="/sign-in" onClick={() => setMenuOpen(false)} className="block px-4 py-3 hover:bg-black/5">
                Sign In
              </Link>
              <Link to="/sign-up" onClick={() => setMenuOpen(false)} className="block px-4 py-3 hover:bg-black/5">
                Sign Up
              </Link>
              {currentUser && (
                <button type="button" onClick={handleSignOut} className="w-full text-left px-4 py-3 hover:bg-black/5">
                  Sign Out
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pointer-events-none">
        <Link
          to="/"
          className="mb-4 inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-[#111111] shadow-sm hover:bg-white pointer-events-auto"
        >
          Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[440px] rounded-[28px] bg-[#F7F4EE] shadow-xl px-8 py-10 pointer-events-auto"
        >
          <h1 className="text-3xl text-center font-semibold text-[#111111]">Sign in</h1>
          <p className="mt-2 text-center text-sm text-black/50">Enter your email and password to continue.</p>

          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
              >
                {successMsg}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="mt-6" onSubmit={handleSubmit}>
            <label className="block text-sm text-[#111111] mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm mb-4 outline-none"
              value={formData.email}
              onChange={handleChange}
            />
            <label className="block text-sm text-[#111111] mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm mb-5 outline-none"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#C4A27A] text-white py-3 text-sm font-medium hover:opacity-90 disabled:opacity-70"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
            <div className="mt-4">
              <OAuth />
            </div>
          </form>
        </motion.div>
      </div>

      <p className="absolute bottom-5 inset-x-0 text-center text-xs text-white/80 z-10 pointer-events-none">
        powered by bravonet technologies
      </p>
    </div>
  );
}