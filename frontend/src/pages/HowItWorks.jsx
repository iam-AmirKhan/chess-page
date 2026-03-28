// src/pages/HowItWorks.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown, CreditCard, FileText, Zap, ChevronDown, ChevronUp,
  MessageCircle, ShieldCheck, Clock, RotateCcw, HelpCircle
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const STEPS = [
  {
    num: '01',
    icon: CreditCard,
    color: '#e2136e',
    bg: 'bg-[#e2136e]/10',
    border: 'border-[#e2136e]/20',
    title: 'Send Money via bKash (Personal) — Recommended',
    desc: 'Open your bKash app and send money using the "Send Money" option (Personal). Send the exact amount to the number shown on the purchase page. Your Transaction ID (TrxID) will arrive via SMS.',
    details: [
      'Use "Send Money" → Personal in bKash/Nagad/Rocket',
      'Send the exact amount shown on purchase page',
      'You can also use Nagad or Rocket',
      'Note your TrxID from the confirmation SMS',
    ],
  },
  {
    num: '02',
    icon: FileText,
    color: '#81b64c',
    bg: 'bg-[#81b64c]/10',
    border: 'border-[#81b64c]/20',
    title: 'Fill the Purchase Form',
    desc: 'Visit our Purchase page and fill in the form: your Chess.com username, the email linked to your Chess.com account, your mobile number, and the TrxID from the payment SMS.',
    details: [
      'Go to chesspremiumbd.com/purchase',
      'Enter your Chess.com username exactly',
      'Use the email linked to your Chess.com account',
      'Paste the TrxID from payment confirmation',
    ],
  },
  {
    num: '03',
    icon: Zap,
    color: '#ffbf61',
    bg: 'bg-[#ffbf61]/10',
    border: 'border-[#ffbf61]/20',
    title: 'Get Activated in 5 Minutes',
    desc: 'We verify your payment and activate your Chess.com Diamond account — guaranteed within 5 minutes during business hours. For late-night orders, maximum wait is 24 hours.',
    details: [
      '5-minute instant delivery guaranteed ⚡',
      'We verify your TrxID with payment records',
      'Your Chess.com account gets Diamond instantly',
      'Contact WhatsApp if not activated in 24hrs',
    ],
  },
];

const FAQS = [
  {
    q: 'What is a shared Chess.com Diamond plan?',
    a: 'We purchase Chess.com Diamond subscriptions in bulk and share access across multiple accounts. This allows us to offer the subscription at a significantly lower price (৳1499 vs ৳2499).',
  },
  {
    q: 'Is it safe? Will my account get banned?',
    a: 'Shared plans carry minimal risk. We have been operating for over a year with 500+ happy customers and zero bans. However, please be aware this is not an official Chess.com plan.',
  },
  {
    q: 'How long does activation take?',
    a: 'We typically activate within 2-6 hours during business hours. The maximum wait time is 24 hours. If you have not received confirmation after 24 hours, contact us on WhatsApp.',
  },
  {
    q: 'What if I entered the wrong Chess.com username?',
    a: 'Contact us immediately via WhatsApp with your correct username and TrxID. We will update it before activation.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We do not offer refunds on shared plans once activated. If there is an issue with activation, we will resolve it or extend your plan.',
  },
  {
    q: 'How long is the Diamond subscription valid?',
    a: 'The standard plan is valid for 365 days (1 year) from the date of activation.',
  },
  {
    q: 'Can I renew after expiry?',
    a: 'Yes! Contact us before your plan expires and we will offer you a renewal at the same price of ৳1499.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#403d39] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 bg-[#262421] hover:bg-[#2a2825] transition-colors text-left group"
        aria-expanded={open}
      >
        <span className="font-bold text-white group-hover:text-[#81b64c] transition-colors pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#81b64c] shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#c3c3c0] shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-[#262421] text-sm text-[#c3c3c0] leading-relaxed border-t border-[#403d39] pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  const { settings } = useSiteSettings();

  const MFS_ALL = [
    { id: 'bkash', label: 'bKash', color: '#e2136e', icon: '/mfs/bkash.svg', numberKey: 'bkash_number', showKey: 'show_bkash' },
    { id: 'nagad', label: 'Nagad', color: '#f6821f', icon: '/mfs/nagad.svg', numberKey: 'nagad_number', showKey: 'show_nagad' },
    { id: 'rocket', label: 'Rocket', color: '#8B4EAB', icon: '/mfs/rocket.png', numberKey: 'rocket_number', showKey: 'show_rocket' },
  ];
  const MFS = MFS_ALL.filter(m => settings[m.showKey] !== false);

  useEffect(() => {
    document.title = 'How It Works — ChessPremiumBD';
  }, []);

  return (
    <div className="min-h-screen py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">

        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl lg:text-5xl font-black text-white mb-4">
            Get your <span className="text-[#81b64c]">premium account</span> <br className="hidden sm:block" />
            <span className="text-amber-400">follow this steps</span>
          </h1>
          <p className="text-[#c3c3c0] max-w-lg mx-auto text-sm lg:text-base leading-relaxed">
            Follow our simple 3-step process to upgrade your Chess.com account to Diamond.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#81b64c]/10 border border-[#81b64c]/20 rounded-full text-xs font-black text-[#81b64c] mt-6">
            <Zap className="w-3.5 h-3.5" />
            ⚡ 5-minute instant delivery guaranteed
          </div>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 mb-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`bg-[#262421] border ${step.border} rounded-2xl p-6 lg:p-8 relative overflow-hidden`}
            >
              {/* Big step number background */}
              <div
                className="absolute right-6 top-6 text-8xl font-black opacity-5 select-none"
                style={{ color: step.color }}
              >
                {step.num}
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-5">
                <div className={`w-14 h-14 ${step.bg} border ${step.border} rounded-xl flex items-center justify-center shrink-0`}>
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: step.color }}>Step {step.num}</span>
                  </div>
                  <h2 className="text-xl font-black text-white mb-2">{step.title}</h2>
                  <p className="text-[#c3c3c0] text-sm leading-relaxed mb-4">{step.desc}</p>
                  <ul className="space-y-1.5">
                    {step.details.map((d, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <span className="font-bold shrink-0 mt-0.5" style={{ color: step.color }}>♟</span>
                        <span className="text-[#c3c3c0]">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MFS Payment Box — 3 cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest mb-5">Payment Numbers</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {MFS.map(mfs => (
              <div
                key={mfs.id}
                className="rounded-2xl p-5 relative overflow-hidden border"
                style={{ background: mfs.color + '08', borderColor: mfs.color + '40' }}
              >
                <div className="absolute right-3 top-3 w-16 h-16 rounded-full blur-2xl" style={{ background: mfs.color + '20' }} />
                <div className="relative z-10 flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-lg overflow-hidden p-1.5 border border-white/10 shrink-0">
                    <img src={mfs.icon} alt={mfs.label} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="font-black text-white text-base">{mfs.label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: mfs.color }}>Personal Account</p>
                  </div>
                </div>
                <p className="relative z-10 font-mono font-black text-white text-lg tracking-widest">
                  {settings[mfs.numberKey] || '01XXXXXXXXX'}
                </p>
                <p className="relative z-10 text-xs text-[#c3c3c0] mt-1">
                  Send exactly <span className="font-bold" style={{ color: mfs.color }}>৳{settings.price?.toLocaleString() || '1499'}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/purchase"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#e2136e] hover:bg-[#c9115f] text-white rounded-xl font-bold text-sm transition-all"
            >
              Go to Purchase Form →
            </Link>
          </div>
        </motion.div>

        {/* Trust signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: ShieldCheck, color: 'text-[#81b64c]', bg: 'bg-[#81b64c]/10', label: '100% Safe', desc: 'Verified by 500+ players' },
            { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Fast Activation', desc: 'Within 5 minutes⚡' },
            { icon: RotateCcw, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Easy Renewal', desc: 'Contact us before expiry' },
          ].map(item => (
            <div key={item.label} className="bg-[#262421] border border-[#403d39] rounded-xl p-5 flex items-center gap-4">
              <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="font-black text-white">{item.label}</p>
                <p className="text-xs text-[#c3c3c0]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-[#81b64c]" />
            <h2 className="text-2xl font-black text-white">Frequently Asked <span className="text-[#81b64c]">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-[#c3c3c0] mb-5">Still have questions? Chat with us on WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/purchase"
              className="px-8 py-4 bg-[#81b64c] hover:bg-[#95c660] text-[#1a1a1a] rounded-xl font-extrabold transition-all transform hover:-translate-y-0.5 shadow-[0_4px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-0.5"
            >
              Buy Diamond — ৳{settings.price?.toLocaleString() || '1499'}
            </Link>
            <a
              href={settings.whatsapp_link || `https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=Hi%2C%20I%20have%20a%20question%20about%20ChessPremiumBD.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-xl font-bold transition-all hover:bg-[#25D366]/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
