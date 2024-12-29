import React from 'react'
import { Link} from 'react-router-dom';

export default function Signup() {
  return (
    <div className="p-6 max-w-lg mx-auto mt-10 bg-white shadow-md rounded-md">
      <h1 className="text-3xl text-center font-semibold">Sign Up</h1>
      <form className="mt-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="border rounded-md p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 nt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
        <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>      
    </div>
  )
}