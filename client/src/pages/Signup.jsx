import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  // State to track form inputs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handler for input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Update the specific field      
    });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Show Loading Indicator
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!data.success) {
        setError(data.message);  // Set error message
        setLoading(false);        // Stop loading
        return;
      }
      
      setLoading(false); // Stop loading
      console.log(data);  // Log response
      navigate('/sign-in');
    } catch (err) {
      setError('An error occurred while signing up.');  // Display a general error message
      
      setLoading(false); // Stop loading
      console.error('Error:', err);  // Log error to the console
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
            onChange={handleInputChange} // Attach onChange event
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email" // Name attribute for tracking
            placeholder="Email"
            className="border rounded-md p-2 w-full"            
            onChange={handleInputChange} // Attach onChange event
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password" // Name attribute for tracking
            placeholder="Password"
            className="border rounded-md p-2 w-full"            
            onChange={handleInputChange} // Attach onChange event
          />
        </div>
        <button type="submit" disabled={Loading} className="bg-blue-500 text-white p-2 rounded-md w-full">
          {Loading ? 'Loading...' : 'Sign Up'}
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