// src/pages/Purchase.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Info, MessageCircle, Zap, Clock } from 'lucide-react';
import PurchaseForm from '../components/PurchaseForm';
import { useSiteSettings } from '../context/SiteSettingsContext';

// Chess.com Diamond features from screenshot
const DIAMOND_FEATURES = [
  { emoji: '⭐', label: 'Unlimited Game Review', color: '#4CAF50' },
  { emoji: '💡', label: 'Unlimited Move Explanations', color: '#FF9800' },
  { emoji: '🔍', label: 'Unlimited Insights', color: '#2196F3' },
  { emoji: '🧩', label: 'Unlimited Puzzles', color: '#E91E63' },
  { emoji: '🎓', label: 'Unlimited Lessons', color: '#3F51B5' },
  { emoji: '👤', label: 'Unlimited Coach Games', color: '#795548' },
  { emoji: '🤖', label: 'Unlock All Bots', color: '#607D8B' },
  { emoji: '🚫', label: 'No Ads Experience', color: '#F44336' },
];

export default function Purchase() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    document.title = 'Buy Diamond — ChessPremiumBD';
  }, []);

  const whatsappUrl = settings.whatsapp_link || `https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=Hi%2C%20I%20need%20help%20with%20Chess.com%20Diamond.`;

  return (
    <div className="min-h-screen py-10 lg:py-14">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Page Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4d3a24] text-[#ffbf61] rounded-full text-xs font-black uppercase tracking-wider border border-[#ffbf61]/20 mb-4">
            <Crown className="w-3.5 h-3.5 fill-current" />
            Diamond — ৳{settings.price.toLocaleString()} Only
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">
            Complete Your <span className="text-[#81b64c]">Purchase</span>
          </h1>
          <p className="text-[#c3c3c0] max-w-lg mx-auto text-sm leading-relaxed">
            Send ৳{settings.price.toLocaleString()} to our bKash number, fill the form below, and get activated in{' '}
            <span className="text-[#81b64c] font-bold">under 5 minutes</span>.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">

          {/* ── Left Panel ── */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Step 1 — bKash */}
            <div className="bg-[#262421] rounded-xl border border-[#403d39] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#e2136e] rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0">1</div>
                <h3 className="font-black text-white">Send Money via bKash</h3>
              </div>
              <div className="bg-[#312e2b] rounded-xl p-4 border border-[#403d39]">
                <p className="text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest mb-3">bKash Personal Number</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 p-1 shadow-sm overflow-hidden border border-white/5">
                    <img src="/mfs/bkash.svg" alt="bKash" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <p className="font-mono font-black text-white text-xl tracking-widest">{settings.bkash_number}</p>
                    <p className="text-xs text-[#c3c3c0] mt-0.5">Send exactly <span className="text-[#81b64c] font-bold">৳{settings.price.toLocaleString()}</span></p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs text-[#c3c3c0]">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#ffbf61]" />
                Save your <span className="font-bold text-white mx-1">Transaction ID (TrxID)</span> — you'll need it below.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#262421] rounded-xl border border-[#403d39] p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[#81b64c] rounded-lg flex items-center justify-center text-[#1a1a1a] text-xs font-black shrink-0">2</div>
                <h3 className="font-black text-white">Fill the Form</h3>
              </div>
              <p className="text-sm text-[#c3c3c0]">Enter your Chess.com username, mobile number, and bKash TrxID.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#262421] rounded-xl border border-[#403d39] p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-[#ffbf61] rounded-lg flex items-center justify-center text-[#1a1a1a] text-xs font-black shrink-0">3</div>
                <h3 className="font-black text-white">Get Activated</h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="w-4 h-4 text-[#81b64c] shrink-0" />
                <p className="text-sm text-[#81b64c] font-bold">Usually under 5 minutes!</p>
              </div>
              <p className="text-xs text-[#c3c3c0] mt-1 pl-6">We verify your payment and activate your Chess.com Diamond account instantly.</p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-3.5 h-3.5 text-[#ffbf61] shrink-0" />
                <p className="text-xs text-[#c3c3c0]">Any issue? Fixed within <span className="font-bold text-[#ffbf61]">24 hours</span>.</p>
              </div>
            </div>

            {/* Chess.com Diamond Features — matching the screenshot */}
            <div className="bg-[#262421] rounded-xl border border-[#403d39] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-b from-[#1a2a3a] to-[#1e2535] p-5 text-center border-b border-[#403d39]">
                {/* Diamond gem */}
                <div className="text-5xl mb-2">💎</div>
                <p className="font-black text-[#4db8ff] text-lg">Diamond</p>
                <span className="inline-block mt-1 px-3 py-0.5 bg-[#4db8ff] text-[#1a1a1a] text-[10px] font-black rounded-sm uppercase tracking-wider">
                  Most Popular
                </span>
              </div>

              {/* Feature list — exactly like chess.com screenshot */}
              <div className="p-4 space-y-3">
                {DIAMOND_FEATURES.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center shrink-0">{f.emoji}</span>
                    <span className="text-sm font-semibold text-[#c3c3c0]">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="px-4 pb-4 text-center">
                <p className="text-[#c3c3c0]/50 line-through text-sm">৳{settings.original_price.toLocaleString()} / year</p>
                <p className="text-[#4db8ff] font-black text-2xl">৳{settings.price.toLocaleString()} / year</p>
                <p className="text-[#c3c3c0] text-xs mt-0.5">One-time payment via bKash</p>
              </div>
            </div>

            {/* WhatsApp Support */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl hover:bg-[#25D366]/20 transition-all group"
            >
              <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-black text-white text-sm group-hover:text-[#25D366] transition-colors">WhatsApp Support</p>
                <p className="text-xs text-[#c3c3c0]">Chat with us — we reply instantly</p>
              </div>
            </a>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <PurchaseForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
