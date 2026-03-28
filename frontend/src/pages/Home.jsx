// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Crown, ShieldCheck, Zap, Bell, ChevronRight, MessageCircle,
  Star, CheckCircle2, ArrowRight, Tag, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../context/SiteSettingsContext';

const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Comilla', 'Gazipur'];

const DIAMOND_FEATURES = [
  { emoji: '⭐', label: 'Unlimited Game Review' },
  { emoji: '💡', label: 'Unlimited Move Explanations' },
  { emoji: '🔍', label: 'Unlimited Insights' },
  { emoji: '🧩', label: 'Unlimited Puzzles' },
  { emoji: '🎓', label: 'Unlimited Lessons' },
  { emoji: '👤', label: 'Unlimited Coach Games' },
  { emoji: '🤖', label: 'Unlock All Bots' },
  { emoji: '🚫', label: 'No Ads Experience' },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Verified Reseller', color: 'text-[#81b64c]' },
  { icon: Zap, label: 'Instant Activation', color: 'text-amber-400' },
  { icon: Star, label: '500+ Happy Players', color: 'text-blue-400' },
];

// Dummy recent members for live feed
const DUMMY_RECENT = [
  { id: '1', name: 'Rahim Ahmed', chess_username: 'rahimchess99', approved_at: new Date(Date.now() - 1000 * 60 * 30) },
  { id: '2', name: 'Karim Hossain', chess_username: 'karimonfire', approved_at: new Date(Date.now() - 1000 * 60 * 90) },
  { id: '3', name: 'Fatema Begum', chess_username: 'fatema_chess', approved_at: new Date(Date.now() - 1000 * 60 * 180) },
  { id: '4', name: 'Sabbir Rahman', chess_username: 'sabbir_bd', approved_at: new Date(Date.now() - 1000 * 60 * 360) },
  { id: '5', name: 'Nasrin Akter', chess_username: 'nasrin_moves', approved_at: new Date(Date.now() - 1000 * 60 * 720) },
  { id: '6', name: 'Jamal Uddin', chess_username: 'jamal_king', approved_at: new Date(Date.now() - 1000 * 60 * 1440) },
];

function maskName(fullName) {
  if (!fullName) return 'User';
  const parts = fullName.trim().split(' ');
  if (parts.length > 1) return `${parts[0]} ${parts[1].charAt(0)}.`;
  const name = parts[0];
  if (name.length <= 3) return name + '***';
  return name.slice(0, 3) + '*'.repeat(name.length - 3);
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Home() {
  const [recentMembers, setRecentMembers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('chess_members'));
      if (stored && stored.length > 0) {
        return stored
          .filter(m => m.purchase_date)
          .sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))
          .slice(0, 6)
          .map(m => ({
            id: m.id,
            name: m.name,
            chess_username: m.chess_username,
            approved_at: m.purchase_date,
          }));
      }
    } catch {}
    return DUMMY_RECENT;
  });
  const [showNotif, setShowNotif] = useState(false);
  const [notifCity, setNotifCity] = useState('Dhaka');
  const { settings } = useSiteSettings();

  useEffect(() => {
    document.title = 'ChessPremiumBD — Chess.com Diamond at Half Price in Bangladesh';
  }, []);

  // Make Recent Members list incredibly reactive
  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('chess_members'));
        if (stored && stored.length > 0) {
          setRecentMembers(
            stored.filter(m => m.purchase_date)
                  .sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))
                  .slice(0, 6)
                  .map(m => ({ id: m.id, name: m.name, chess_username: m.chess_username, approved_at: m.purchase_date }))
          );
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const cycle = setInterval(() => {
      setNotifCity(CITIES[Math.floor(Math.random() * CITIES.length)]);
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 5000);
    }, 18000);
    const first = setTimeout(() => {
      setNotifCity(CITIES[0]);
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 5000);
    }, 4000);
    return () => { clearInterval(cycle); clearTimeout(first); };
  }, []);

  // Toaster: respects show_toaster setting
  const toasterMsg = settings.toaster_message || 'Someone from {city} just got Diamond! 🎉';

  const scrollToPurchase = () => {
    document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="selection:bg-[#81b64c] selection:text-[#262421]">

      {/* ── WhatsApp Float ─────────────────── */}
      <a
        href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=Hi%2C%20I%20want%20Chess.com%20Diamond.`}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-float"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-8 right-6 z-50 bg-[#25D366] hover:bg-[#20ba56] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 font-bold transition-all transform hover:-translate-y-1 group active:scale-95"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-sm">Chat with us</span>
      </a>

      {/* ── Notification Popup ──────────────── */}
      {showNotif && settings.show_toaster !== false && (
        <div className="fixed bottom-24 right-6 bg-[#262421] border border-[#403d39] shadow-2xl p-4 flex items-center gap-3 z-40 w-72 rounded-lg pointer-events-none animate-notif-slide">
          <div className="w-10 h-10 bg-[#81b64c]/10 text-[#81b64c] rounded-full flex items-center justify-center shrink-0 border border-[#81b64c]/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">New Member! 🎉</p>
            <p className="text-xs text-[#c3c3c0]">
              {toasterMsg.replace('{city}', notifCity)}
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden chess-pattern">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#312e2b] via-[#312e2b] to-[#1e1c1a] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#81b64c]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Copy */}
            <motion.div
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4d3a24] text-[#ffbf61] rounded-full text-xs font-black uppercase tracking-wider border border-[#ffbf61]/20">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Bangladesh's #1 Chess Premium Reseller
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
                Get Chess.com{' '}
                <span className="text-[#81b64c] relative">
                  Diamond
                  <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                    <path d="M0 2 Q50 0 100 2" stroke="#81b64c" strokeWidth="2" fill="none" strokeOpacity="0.4" />
                  </svg>
                </span>
                <br />at Half the Price
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-[#c3c3c0] leading-relaxed max-w-lg">
                Unlock unlimited engine analysis, tactics, video courses, and lessons.
                Pay via <span className="text-[#e2136e] font-bold">bKash</span> · <span className="text-[#f6821f] font-bold">Nagad</span> · <span className="text-[#9b59b6] font-bold">Rocket</span> — Activated within <span className="text-[#81b64c] font-bold">24 hours</span>.
                Trusted by <span className="text-white font-bold">500+ players</span> across Bangladesh.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                {TRUST_BADGES.map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-sm font-bold text-[#c3c3c0]">
                    <b.icon className={`w-4 h-4 ${b.color}`} />
                    {b.label}
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link
                  to="/purchase"
                  id="hero-buy-btn"
                  className="px-8 py-4 rounded-lg font-extrabold text-[#1a1a1a] bg-[#81b64c] hover:bg-[#95c660] transition-all transform hover:-translate-y-0.5 shadow-[0_5px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-1 text-lg flex items-center justify-center gap-2 group"
                >
                  Get Diamond Now
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-8 py-4 rounded-lg font-extrabold text-[#c3c3c0] border border-[#403d39] hover:border-[#81b64c]/40 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  How It Works
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Pricing Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="bg-[#262421] p-8 rounded-2xl border border-[#403d39] shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Glow blob */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#81b64c]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-[#81b64c]/15 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ffbf61]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    <div>
                      <p className="font-black text-white text-lg leading-none">Diamond</p>
                      <p className="text-xs text-[#c3c3c0]">Chess.com Premium</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ffbf61]/15 border border-[#ffbf61]/30 text-[#ffbf61] rounded-full text-[10px] font-black uppercase tracking-wider">
                    ⭐ Most Popular
                  </span>
                </div>

                {/* Features grid */}
                <div className="relative z-10 grid grid-cols-2 gap-y-2 gap-x-3 mb-5">
                  {DIAMOND_FEATURES.map((f) => (
                    <div key={f.label} className="flex items-center gap-2">
                      <span className="text-base shrink-0">{f.emoji}</span>
                      <span className="text-xs font-semibold text-[#c3c3c0] leading-tight">{f.label}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#403d39] to-transparent relative z-10" />

                {/* Price */}
                <div className="relative z-10 mb-1">
                  <div className="flex items-baseline gap-3 mb-0.5">
                    <span className="text-[#c3c3c0] line-through text-lg font-bold">৳{settings.original_price.toLocaleString()} / year</span>
                  </div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-5xl font-black text-[#81b64c] tracking-tighter">৳{settings.price.toLocaleString()}</span>
                    <span className="text-[#c3c3c0] text-base font-semibold">/ year</span>
                    <span className="inline-flex items-center justify-center text-[10px] font-black text-[#ffbf61] uppercase tracking-wider bg-[#ffbf61]/10 border border-[#ffbf61]/20 px-2 py-1 rounded-full whitespace-nowrap">
                      {Math.round((1 - settings.price / settings.original_price) * 100)}% OFF
                    </span>
                  </div>
                  <p className="text-sm text-[#c3c3c0]">One-time payment via bKash · <span className="text-[#81b64c] font-bold">Recommended</span></p>

                  {/* Coupon Badge */}
                  <div className="mt-2.5 inline-flex items-center gap-2 bg-[#81b64c]/10 border border-[#81b64c]/25 rounded-full px-3 py-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#81b64c]" />
                    <span className="text-xs font-black text-[#81b64c] tracking-wide">Coupon <code className="bg-[#81b64c]/20 px-1.5 py-0.5 rounded text-white">{settings.coupon_code}</code> auto-applied ✓</span>
                  </div>
                </div>

                {/* Payment Methods row */}
                <div className="relative z-10 mt-4 mb-5 flex flex-wrap gap-2">
                  {[
                    { show: settings.show_bkash !== false, id: 'bkash', color: '#e2136e', logo: <img src="mfs/bkash.svg" alt="bKash" className="w-full h-full object-contain" />, label: 'bKash', recommended: true },
                    { show: settings.show_nagad !== false, id: 'nagad', color: '#ffebd9ff', logo: <img src="mfs/nagad.svg" alt="Nagad" className="w-full h-full object-contain" />, label: <span style={{ color: "#f6821f" }}> Nagad </span>, recommended: false },
                    { show: settings.show_rocket !== false, id: 'rocket', color: '#8B4EAB', logo: <img src="mfs/rocket.png" alt="Rocket" className="w-full h-full object-contain" />, label: 'Rocket', recommended: false },
                  ].filter(m => m.show).map(mfs => (
                    <div key={mfs.id}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold"
                      style={{ background: mfs.color + '12', borderColor: mfs.color + '35', color: mfs.color }}
                    >
                      <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black shrink-0"
                        style={{ background: mfs.color }}>{mfs.logo}</div>
                      {mfs.label}
                      {mfs.recommended && <span className="text-[#81b64c] text-[9px] font-black ml-0.5">✓ Recommended</span>}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to="/purchase"
                  id="pricing-buy-btn"
                  className="relative z-10 w-full flex items-center justify-center gap-2 py-4 bg-[#81b64c] hover:bg-[#95c660] text-[#1a1a1a] rounded-xl font-extrabold text-base transition-all transform hover:-translate-y-0.5 shadow-[0_5px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-1 group"
                >
                  Buy Now — Only ৳{settings.price.toLocaleString()}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="relative z-10 text-center text-xs text-[#c3c3c0]/60 mt-3">
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-[#81b64c]" />
                  Activated within 24h · No refunds on shared plans
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="bg-[#262421] border-y border-[#403d39] py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, val: '24h', desc: 'Activation Time', color: 'text-[#ffbf61]', bg: 'bg-[#4d3a24]/50' },
              { icon: ShieldCheck, val: '100%', desc: 'Trusted & Safe', color: 'text-[#81b64c]', bg: 'bg-[#81b64c]/10' },
              { icon: Star, val: '500+', desc: 'Happy Players', color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { icon: Crown, val: '40%', desc: 'Price Discount', color: 'text-[#81b64c]', bg: 'bg-[#81b64c]/10' },
            ].map((item) => (
              <motion.div
                key={item.desc}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-5 rounded-xl bg-[#312e2b] border border-[#403d39] hover:border-[#81b64c]/30 transition-colors group"
              >
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <p className={`text-2xl font-black ${item.color}`}>{item.val}</p>
                <p className="text-xs text-[#c3c3c0] font-bold mt-1 uppercase tracking-wider">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS (mini)
      ══════════════════════════════════════ */}
      <section className="py-16 lg:py-20" id="how-it-works-home">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              How It <span className="text-[#81b64c]">Works</span>
            </h2>
            <p className="text-[#c3c3c0] max-w-md mx-auto">Get your Chess.com Diamond in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Send Money via bKash', desc: 'Send ৳1499 to our bKash number 01XXXXXXXXX. Save the Transaction ID (TrxID).', color: '#e2136e' },
              { step: '02', title: 'Fill the Form', desc: 'Submit your Chess.com username, mobile, email, and the bKash TrxID through our form.', color: '#81b64c' },
              { step: '03', title: 'Get Activated!', desc: 'We verify your payment and upgrade your account within 24 hours. Start playing!', color: '#ffbf61' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative p-6 bg-[#262421] rounded-xl border border-[#403d39] hover:border-[#81b64c]/30 transition-colors group"
              >
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-3 z-10">
                    <ArrowRight className="w-5 h-5 text-[#403d39]" />
                  </div>
                )}
                <div className="text-5xl font-black mb-4" style={{ color: item.color, opacity: 0.15 }}>{item.step}</div>
                <div className="absolute top-6 left-6 text-xs font-black uppercase tracking-widest" style={{ color: item.color }}>{item.step}</div>
                <h3 className="text-lg font-black text-white mb-2 mt-2">{item.title}</h3>
                <p className="text-sm text-[#c3c3c0] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#81b64c] hover:text-[#95c660] transition-colors"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          RECENT MEMBERS
      ══════════════════════════════════════ */}
      <section className="bg-[#262421] border-t border-[#403d39] py-16" id="purchase-section">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">
              Recent <span className="text-[#81b64c]">Members</span>
            </h2>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c3c3c0] uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#81b64c] rounded-full animate-pulse" />
              Live — verified purchases
            </div>
          </div>

          {recentMembers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {recentMembers.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 bg-[#312e2b] rounded-xl border border-[#403d39] hover:border-[#81b64c]/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-[#262421] text-[#81b64c] font-black rounded-lg flex items-center justify-center text-lg border border-[#403d39] shrink-0">
                    {m.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white group-hover:text-[#81b64c] transition-colors truncate">{maskName(m.name)}</p>
                    <p className="text-xs text-[#c3c3c0] font-mono">{m.chess_username}</p>
                    <p className="text-[10px] text-[#c3c3c0]/60 font-bold uppercase tracking-wide mt-0.5">
                      💎 Diamond · {
                        m.approved_at
                          ? formatDistanceToNow(
                            m.approved_at.toDate ? m.approved_at.toDate() : new Date(m.approved_at),
                            { addSuffix: true }
                          )
                          : 'Recently'
                      }
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#c3c3c0]">
              <div className="w-16 h-16 bg-[#312e2b] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#403d39]">
                <Crown className="w-8 h-8 text-[#81b64c]" />
              </div>
              <p className="font-bold">Be the first to join!</p>
              <p className="text-sm mt-1">500+ players already trust us.</p>
            </div>
          )}

          <div className="text-center mt-10 space-y-4">
            <Link
              to="/purchase"
              id="bottom-buy-btn"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#81b64c] hover:bg-[#95c660] text-[#1a1a1a] rounded-xl font-extrabold text-lg transition-all transform hover:-translate-y-0.5 shadow-[0_5px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-1 group"
            >
              Get Diamond — ৳{settings.price.toLocaleString()}
              <Crown className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            </Link>
            <p className="text-xs text-[#c3c3c0]/60">Or <Link to="/members" className="text-[#81b64c] hover:underline">view all members →</Link></p>
          </div>
        </div>
      </section>

      {/* ══════════════════════
          COMMUNITY SECTION
      ══════════════════════ */}
      <section className="py-16 border-t border-[#403d39] bg-[#1e1c1a]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">
              Join Our <span className="text-[#81b64c]">Community</span>
            </h2>
            <p className="text-[#c3c3c0] max-w-md mx-auto text-sm">
              Connect with hundreds of chess players, get tips, stay updated on offers, and get support.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Facebook Messenger Group */}
            <a
              href="https://m.me/j/AbYDUMMYMESSENGERGROUPLINK"
              target="_blank"
              rel="noopener noreferrer"
              id="messenger-community-btn"
              className="group relative overflow-hidden flex flex-col items-center gap-4 p-7 rounded-2xl border border-[#403d39] bg-[#262421] hover:border-blue-500/40 hover:bg-[#272b35] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0084ff, #a560ff)' }}>
                {/* Messenger M logo */}
                <svg viewBox="0 0 56 56" className="w-9 h-9 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28 2C13.641 2 2 12.95 2 26.5c0 7.377 3.344 13.965 8.627 18.47V56l10.173-5.585C23.434 51.314 25.68 51.62 28 51.62c14.359 0 26-10.95 26-24.62S42.359 2 28 2zm2.577 33.12l-6.621-7.062-12.924 7.062 14.22-15.12 6.784 7.062 12.757-7.062-14.216 15.12z" />
                </svg>
              </div>
              <div className="relative z-10 text-center">
                <p className="font-black text-white text-lg group-hover:text-blue-400 transition-colors">Messenger Group</p>
                <p className="text-sm text-[#c3c3c0] mt-1">Join our chess community on Facebook Messenger</p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 rounded-full">
                  <Users className="w-3.5 h-3.5" /> Join Group →
                </span>
              </div>
            </a>

            {/* Facebook Page */}
            <a
              href="https://www.facebook.com/chesspremiumbd"
              target="_blank"
              rel="noopener noreferrer"
              id="facebook-page-btn"
              className="group relative overflow-hidden flex flex-col items-center gap-4 p-7 rounded-2xl border border-[#403d39] bg-[#262421] hover:border-[#1877f2]/40 hover:bg-[#22283a] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1877f2]/5 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-16 h-16 bg-[#1877f2] rounded-2xl flex items-center justify-center shadow-lg">
                {/* Facebook f logo */}
                <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="relative z-10 text-center">
                <p className="font-black text-white text-lg group-hover:text-[#1877f2] transition-colors">Facebook Page</p>
                <p className="text-sm text-[#c3c3c0] mt-1">Follow us for updates, offers &amp; chess tips</p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#1877f2] bg-[#1877f2]/10 border border-[#1877f2]/20 px-3 py-1 rounded-full">
                  Follow Page →
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── Sponsor Section (Admin-controlled) ── */}
      {settings.show_sponsor === true && (
        <section className="py-12 bg-gradient-to-r from-[#1e1c1a] to-[#262421] border-t border-b border-[#403d39]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <p className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-4">Sponsored</p>
            <div className="inline-flex items-center gap-4 p-5 bg-[#312e2b] border border-[#403d39] rounded-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ffbf61]/20 to-[#81b64c]/20 border border-[#ffbf61]/30 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-[#ffbf61]" />
              </div>
              <div className="text-left">
                <p className="font-black text-white">Your Brand Here</p>
                <p className="text-xs text-[#c3c3c0]">Contact us to sponsor ChessPremiumBD and reach 500+ chess players.</p>
              </div>
              <a href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=Hi%2C%20I%20am%20interested%20in%20sponsoring%20ChessPremiumBD.`}
                target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-[#ffbf61] text-black rounded-lg font-black text-xs hover:bg-amber-400 transition-all whitespace-nowrap">
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
