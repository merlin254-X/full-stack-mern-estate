import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../component/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signInFailure(null));
    if (location.state?.signedUp) {
      setSuccessMsg('Account created. Sign in to continue.');
    }
  }, [dispatch, location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="p-6 max-w-lg mx-auto mt-10 bg-white shadow-md rounded-md">
      <h1 className="text-3xl text-center font-semibold">Sign In</h1>

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

      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded-md p-2 w-full"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border rounded-md p-2 w-full"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded-md w-full">
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <div className="mt-4">
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}