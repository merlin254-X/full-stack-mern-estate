import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector }  from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
 const { loading, error } = useSelector((state) => state.user);  
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));        
        return;
      }
      dispatch(signInSuccess(data));      
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));      
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto mt-10 bg-white shadow-md rounded-md">
      <h1 className="text-3xl text-center font-semibold">Sign In</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error message display */}
      <form className="mt-4" onSubmit={handleSubmit}>
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
          {loading ? 'Loading...' : 'Sign In'}s
        </button>
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