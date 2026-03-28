// src/pages/Support.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, Send, CheckCircle, AlertCircle, 
  User, Mail, Fingerprint, MessageSquare, Tag
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const ISSUE_TYPES = [
  { id: 'payment', label: 'Payment Problem' },
  { id: 'activation', label: 'Diamond Not Active' },
  { id: 'technical', label: 'Technical Issue' },
  { id: 'other', label: 'Other' },
];

export default function Support() {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    chess_username: '',
    trx_id: '',
    issue_type: 'payment',
    urgency: 'normal',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Support & Tickets — ChessPremiumBD';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.chess_username || !formData.trx_id || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const ticket = {
        ...formData,
        id: 'T' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase(),
        status: 'open',
        created_at: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('chess_tickets') || '[]');
      localStorage.setItem('chess_tickets', JSON.stringify([ticket, ...existing]));
      
      setStatus('success');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  const inputCls = "w-full px-4 py-3 bg-[#1a1c1e] border border-[#2a2d30] rounded-xl text-white outline-none focus:ring-2 focus:ring-[#81b64c]/50 focus:border-[#81b64c] transition-all placeholder:text-[#555] text-sm";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-[#81b64c]/10 rounded-2xl mb-4 border border-[#81b64c]/20"
          >
            <LifeBuoy className="w-8 h-8 text-[#81b64c]" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">Submit a <span className="text-[#81b64c]">Ticket</span></h1>
          <p className="text-[#c3c3c0] text-sm">Need help with your purchase? Send us a ticket and we'll resolve it.</p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1c1e] border border-[#81b64c]/30 rounded-3xl p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-[#81b64c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#81b64c]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Ticket Submitted!</h2>
              <p className="text-[#c3c3c0] mb-8 leading-relaxed">
                Thank you, <span className="text-white font-bold">{formData.name}</span>. Your ticket has been received. 
                Our team will review your transaction (<span className="text-[#81b64c] font-mono">{formData.trx_id}</span>) 
                and update your status shortly.
              </p>
              <button 
                onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', chess_username: '', trx_id: '', issue_type: 'payment', message: '' }); }}
                className="px-8 py-3 bg-[#26282b] text-white rounded-xl font-bold hover:bg-[#313438] transition-all"
              >
                Submit Internal Another
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-[#1a1c1e] border border-[#2a2d30] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5"
            >
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#6a6e73] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Full Name *
                  </label>
                  <input 
                    type="text" required
                    className={inputCls} placeholder="Rahim Ahmed"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#6a6e73] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email (Optional)
                  </label>
                  <input 
                    type="email"
                    className={inputCls} placeholder="rahim@example.com"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#666] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> Chess.com Username *
                  </label>
                  <input 
                    type="text" required
                    className={inputCls} placeholder="rahim_chess"
                    value={formData.chess_username} onChange={e => setFormData({...formData, chess_username: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#81b64c] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3" /> Transaction ID (TrxID) *
                  </label>
                  <input 
                    type="text" required
                    className={`${inputCls} border-[#81b64c]/20 focus:border-[#81b64c]`} placeholder="8H3A9KT3DF"
                    value={formData.trx_id} onChange={e => setFormData({...formData, trx_id: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#6a6e73] uppercase tracking-widest ml-1">Issue Type</label>
                  <select 
                    className={inputCls}
                    value={formData.issue_type} onChange={e => setFormData({...formData, issue_type: e.target.value})}
                  >
                    {ISSUE_TYPES.map(type => (
                      <option key={type.id} value={type.id} className="bg-[#1a1c1e]">{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#6a6e73] uppercase tracking-widest ml-1">Urgency</label>
                  <select 
                    className={inputCls}
                    value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}
                  >
                    <option value="normal" className="bg-[#1a1c1e]">Normal</option>
                    <option value="moderate" className="bg-[#1a1c1e]">Moderate</option>
                    <option value="urgent" className="bg-[#1a1c1e]">Urgent</option>
                    <option value="other" className="bg-[#1a1c1e]">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#6a6e73] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" /> Message / Issue Details *
                </label>
                <textarea 
                  required rows={4}
                  className={`${inputCls} resize-none`} placeholder="Tell us what happened..."
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 bg-[#81b64c] text-black rounded-xl font-black text-sm hover:bg-[#95c660] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <><Send className="w-4 h-4" /> Submit Support Ticket</>
                )}
              </button>
              
              <p className="text-center text-[10px] text-[#555] font-bold uppercase tracking-tighter">
                Most tickets are resolved within 2-4 hours. Thank you for your patience.
              </p>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
