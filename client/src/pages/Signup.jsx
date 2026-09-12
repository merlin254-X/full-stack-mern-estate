import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OAuth from '../component/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setSuccessMsg('Account created. Taking you to sign in…');
      setTimeout(() => navigate('/sign-in', { state: { signedUp: true } }), 800);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto mt-10 bg-white shadow-md rounded-md">
      <h1 className="text-3xl text-center font-semibold">Sign Up</h1>

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
            type="text"
            name="username"
            placeholder="Username"
            className="border rounded-md p-2 w-full"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <div className="mt-4">
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
}