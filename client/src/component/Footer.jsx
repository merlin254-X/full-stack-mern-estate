import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          {/* ── BRAND & ABOUT ── */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white mb-4 block">
              Real<span className="text-blue-600">Estate</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your trusted partner in finding the perfect home. We make buying, selling, and renting properties easy and transparent.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaLinkedin size={20} /></a>
            </div>
          </div>

          {/* ── QUICK LINKS ── */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/search" className="hover:text-blue-400 transition-colors">Search Properties</Link></li>
              <li><Link to="/search?offer=true" className="hover:text-blue-400 transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* ── LEGAL ── */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Legal</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* ── CONTACT INFO ── */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-slate-300">A:</span> 
                Atlanta, GA
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">P:</span> 
                +250788845062
              </li>
              <li className="flex flex-col gap-1 mt-1">
                <span className="font-semibold text-slate-300">E:</span> 
                <a href="mailto:info@bravonet.tech" className="hover:text-blue-400 transition-colors">info@bravonet.tech</a>
                <a href="mailto:muhozalionel@gmail.com" className="hover:text-blue-400 transition-colors">muhozalionel@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM COPYRIGHT ── */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Real Estate. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Powered by <span className="font-bold text-blue-600 tracking-wider">ARTEMIS LAB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}