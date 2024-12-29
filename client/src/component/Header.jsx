import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sn sm:text-xl flex flex-wrap">
            <span className="text-slate-400">RealDM</span>
            <span className="text-slate-600">R-estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent pl-2 focus:outline-none w-24 sn:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <li>
            <Link to="/home" className="text-slate-700 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-slate-700 hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link to="/sign-in" className="text-slate-700 hover:underline">
              Sign In
            </Link>
          </li>
          </ul>
      </div>
    </header>
  );
}