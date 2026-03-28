// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Menu, X } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Tournaments', to: '/tournaments' },
  { label: 'Members', to: '/members' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#262421]/95 backdrop-blur-md shadow-2xl border-b border-[#403d39]'
        : 'bg-[#262421] border-b border-[#403d39]'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="ChessPremiumBD Home">
          <div className="w-9 h-9 bg-[#81b64c]/10 border border-[#81b64c]/30 rounded-lg flex items-center justify-center group-hover:bg-[#81b64c]/20 transition-colors">
            <Crown className="w-5 h-5 text-[#81b64c] fill-current" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Chess<span className="text-[#81b64c]">PremiumBD</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive(link.to)
                  ? 'text-[#81b64c] bg-[#81b64c]/10'
                  : 'text-[#c3c3c0] hover:text-white hover:bg-[#312e2b]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/purchase"
            className="px-5 py-2.5 bg-[#81b64c] hover:bg-[#95c660] text-[#1a1a1a] rounded-lg font-extrabold text-sm transition-all transform hover:-translate-y-0.5 shadow-[0_3px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-0.5"
          >
            Buy Diamond ৳{settings.price.toLocaleString()}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-[#c3c3c0] hover:text-white hover:bg-[#312e2b] transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#262421] border-t border-[#403d39]">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive(link.to)
                    ? 'text-[#81b64c] bg-[#81b64c]/10'
                    : 'text-[#c3c3c0] hover:text-white hover:bg-[#312e2b]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1 space-y-2">
              <Link
                to="/purchase"
                className="block w-full px-4 py-3 bg-[#81b64c] text-[#1a1a1a] rounded-lg font-extrabold text-sm text-center"
              >
                Buy Diamond ৳{settings.price.toLocaleString()}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
