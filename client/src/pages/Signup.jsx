import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handler for input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto mt-10 bg-white shadow-md rounded-md">
      <h1 className="text-3xl text-center font-semibold">Sign Up</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}  {/* Error message display */}
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="username" // Name attribute for tracking
            placeholder="Username"
            className="border rounded-md p-2 w-full"
            value={formData.username}            
            onChange={handleChange} // Corrected handler name here
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email" // Name attribute for tracking
            placeholder="Email"
            className="border rounded-md p-2 w-full"
            value={formData.email}
            onChange={handleChange} // Corrected handler name here
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password" // Name attribute for tracking
            placeholder="Password"
            className="border rounded-md p-2 w-full"
            value={formData.password}
            onChange={handleChange} // Corrected handler name here
          />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded-md w-full">
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
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