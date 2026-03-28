// src/pages/NotFound.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 — Page Not Found | ChessPremiumBD';
  }, []);

  return (
    <div className="min-h-screen bg-[#312e2b] chess-pattern flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#312e2b] via-[#262421]/60 to-[#312e2b] pointer-events-none" />

      {/* Chess board pieces decoration */}
      <div className="absolute opacity-5 text-[18rem] font-black text-[#81b64c] select-none pointer-events-none leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        ♟
      </div>

      <motion.div
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
          <div className="w-9 h-9 bg-[#81b64c]/10 border border-[#81b64c]/30 rounded-xl flex items-center justify-center group-hover:bg-[#81b64c]/20 transition-colors">
            <Crown className="w-5 h-5 text-[#81b64c] fill-current" />
          </div>
          <span className="text-lg font-black text-white">Chess<span className="text-[#81b64c]">PremiumBD</span></span>
        </Link>

        {/* 404 */}
        <div className="mb-6">
          <motion.p
            className="text-[8rem] lg:text-[10rem] font-black leading-none"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <span className="text-[#403d39]">4</span>
            <span className="text-[#81b64c]">0</span>
            <span className="text-[#403d39]">4</span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-black text-white mb-3">Checkmate! Page not found.</h1>
          <p className="text-[#c3c3c0] mb-8 leading-relaxed">
            Looks like this page made an illegal move. The page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#81b64c] hover:bg-[#95c660] text-[#1a1a1a] rounded-xl font-extrabold transition-all transform hover:-translate-y-0.5 shadow-[0_4px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#262421] border border-[#403d39] text-[#c3c3c0] rounded-xl font-bold hover:text-white hover:border-[#81b64c]/40 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { label: 'Home', to: '/' },
            { label: 'Buy Diamond', to: '/purchase' },
            { label: 'Members', to: '/members' },
            { label: 'How It Works', to: '/how-it-works' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-[#c3c3c0]/60 hover:text-[#81b64c] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
