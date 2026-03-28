// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, MessageCircle, ArrowRight, ShieldCheck, Users, Mail } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const { settings } = useSiteSettings();
  const whatsappUrl = settings.whatsapp_link || `https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=Hi%2C%20I%20want%20Chess.com%20Diamond.`;

  const enabledMFS = [
    { show: settings.show_bkash !== false, color: '#e2136e', icon: '/mfs/bkash.svg', label: 'bKash', numberKey: 'bkash_number' },
    { show: settings.show_nagad !== false, color: '#f6821f', icon: '/mfs/nagad.svg', label: 'Nagad', numberKey: 'nagad_number' },
    { show: settings.show_rocket !== false, color: '#8B4EAB', icon: '/mfs/rocket.png', label: 'Rocket', numberKey: 'rocket_number' },
  ].filter(m => m.show);

  return (
    <footer className="bg-[#1a1a1a] border-t border-[#403d39] pt-16 pb-8 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-[#81b64c]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#81b64c]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand & Intro (Cols 1-5) */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-2.5 inline-flex group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#81b64c] to-[#95c660] rounded-xl flex items-center justify-center shadow-lg shadow-[#81b64c]/20">
                <Crown className="w-6 h-6 text-[#1a1a1a] fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Chess<span className="text-[#81b64c]">PremiumBD</span>
              </span>
            </Link>
            <p className="text-sm text-[#c3c3c0] leading-relaxed max-w-sm">
              Bangladesh's most trusted, fastest, and reliable premium Chess.com reseller. Level up your chess game with Diamond features at an unbeatable price.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#c3c3c0]">
              <ShieldCheck className="w-4 h-4 text-[#81b64c]" />
              Secure payments via verified local methods
            </div>

            {/* MFS Payment bubbles */}
            {enabledMFS.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {enabledMFS.map(mfs => (
                  <div key={mfs.label} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#262421] border border-[#403d39] rounded-lg text-xs font-bold transition-colors hover:border-[#555] group/mfs">
                    <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center shrink-0 p-0.5 overflow-hidden">
                      <img src={mfs.icon} alt={mfs.label} className="w-full h-full object-contain" />
                    </div>
                    <span style={{ color: mfs.color }}>{mfs.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links (Cols 6-8) */}
          <div className="md:col-span-3">
            <h3 className="font-black text-white text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Buy Diamond', to: '/purchase' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'Tournaments', to: '/tournaments' },
                { label: 'Member List', to: '/members' },
                { label: 'Submit a Ticket', to: '/support' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-[#c3c3c0] hover:text-[#81b64c] transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#81b64c]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us & Support (Cols 9-12) */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <h3 className="font-black text-white text-sm uppercase tracking-wider mb-5">Community & Support</h3>
              <div className="space-y-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#262421] border border-[#403d39] hover:border-[#25D366]/40 rounded-xl transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] transition-colors">
                    <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white mb-0.5">WhatsApp Support</p>
                    <p className="text-[10px] text-[#c3c3c0]">Instant replies & activation</p>
                  </div>
                </a>

                <a href={settings.facebook_page} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#262421] border border-[#403d39] hover:border-[#1877f2]/40 rounded-xl transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-[#1877f2]/10 flex items-center justify-center group-hover:bg-[#1877f2] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1877f2] group-hover:fill-white transition-colors"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white mb-0.5">Facebook Page</p>
                    <p className="text-[10px] text-[#c3c3c0]">Follow for updates & offers</p>
                  </div>
                </a>

                <a href={settings.messenger_group} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#262421] border border-[#403d39] hover:border-[#00B2FF]/40 rounded-xl transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-[#00B2FF]/10 flex items-center justify-center group-hover:bg-[#00B2FF] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#00B2FF] group-hover:fill-white transition-colors"><path d="M12 2.04c-5.5 0-10 4.25-10 9.5 0 3 1.45 5.67 3.73 7.37.19.14.3.36.3.6v2.54c0 .48.51.78.93.55l2.84-1.55c.21-.11.45-.14.67-.09 1.14.28 2.34.43 3.53.43 5.5 0 10-4.25 10-9.5S17.5 2.04 12 2.04zm4.8 7.35l-3.23 4.18c-.4.53-1.15.53-1.55 0l-1.92-2.5-3.6 2.5a.3.3 0 01-.45-.37l3.23-4.18c.4-.53 1.15-.53 1.55 0l1.92 2.5 3.6-2.5a.3.3 0 01.45.37z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white mb-0.5">Messenger Group</p>
                    <p className="text-[10px] text-[#c3c3c0]">Chat with other members</p>
                  </div>
                </a>

                <a href="mailto:chesspremiumbd@gmail.com"
                  className="flex items-center gap-3 p-3 bg-[#262421] border border-[#403d39] hover:border-amber-400/40 rounded-xl transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                    <Mail className="w-4 h-4 text-amber-400 group-hover:text-black" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white mb-0.5">Email Support</p>
                    <p className="text-[10px] text-[#c3c3c0]">chesspremiumbd@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#403d39] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#c3c3c0] font-medium">
            © {new Date().getFullYear()} ChessPremiumBD. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-[#555]">
            <Link to="/admin/login" className="hover:text-[#c3c3c0] transition-colors uppercase tracking-widest text-[9px]">Admin Portal</Link>
            <span>Developed in Bangladesh 🇧🇩</span>
          </div>
        </div>
      </div>
      {/* ── WhatsApp Float (Site-wide) ─────────────────── */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-float"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-8 right-6 z-50 bg-[#25D366] hover:bg-[#20ba56] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 font-bold transition-all transform hover:-translate-y-1 group active:scale-95"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-sm">Chat with us</span>
      </a>
    </footer>
  );
}
