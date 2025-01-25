import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const term = params.get('searchTerm');
    if (term) {
      setSearchTerm(term);
    }
  }, []);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-sn sm:text-xl flex flex-wrap">
            <span className="text-slate-400">LuxeLiving</span>
            <span className="text-slate-600">-Estates</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form  onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent pl-2 focus:outline-none w-24 sm:w-64" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button>
          <FaSearch className="text-slate-600" />
          </button>
         
        </form>

        {/* Navigation Links */}
        <ul className="flex gap-4 items-center">
          <li>
            <Link to="/" className="text-slate-700 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-slate-700 hover:underline">
              About
            </Link>
          </li>

          {/* User Profile or Sign In */}
          <li>
            {currentUser ? (
              <Link to="/profile">
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
            ) : (
              <Link to="/sign-in" className="text-slate-700 hover:underline">
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}