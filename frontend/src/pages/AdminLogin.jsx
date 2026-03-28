// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

// ── Dummy admin credentials (for demo/preview) ──────────────
const DUMMY_EMAIL = 'admin@chess.com';
const DUMMY_PASSWORD = 'admin123';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Admin Login — ChessPremiumBD';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    setError('');

    // Simulate a short loading delay
    await new Promise(res => setTimeout(res, 700));

    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      // Store session flag
      sessionStorage.setItem('chess_admin', 'true');
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Incorrect email or password. Try: admin@chess.com / admin123');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#81b64c]/10 border border-[#81b64c]/30 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#81b64c] fill-current" />
            </div>
            <span className="text-lg font-black text-white">Chess<span className="text-[#81b64c]">PremiumBD</span></span>
          </Link>
          <p className="text-xs text-[#666] mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-[#222] border border-[#333] rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#81b64c]/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#81b64c]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Sign In</h1>
              <p className="text-xs text-[#666]">Authorized access only</p>
            </div>
          </div>

          {/* Demo hint */}
          <div className="mb-5 p-3 bg-[#81b64c]/10 border border-[#81b64c]/20 rounded-lg text-xs text-[#81b64c] font-medium">
            <span className="font-black">Demo:</span> admin@chess.com · admin123
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-[10px] font-bold text-[#999] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@chess.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all placeholder:text-[#555] text-sm"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-[10px] font-bold text-[#999] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all placeholder:text-[#555] text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#999] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full py-3 bg-[#81b64c] text-[#1a1a1a] rounded-lg font-black text-sm hover:bg-[#95c660] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <><Lock className="w-4 h-4" /> Enter Dashboard</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-[#555] hover:text-[#999] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
