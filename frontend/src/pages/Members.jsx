// src/pages/Members.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { isAfter, format } from 'date-fns';
import { motion } from 'framer-motion';
import { Search, Crown, Users, ExternalLink, MapPin } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

function maskEmail(e) {
  if (!e || !e.includes('@')) return 'us***@***.com';
  const [local, domain] = e.split('@');
  return local.slice(0, 2) + '***@' + domain;
}
function maskPhone(p) {
  if (!p || p.length < 8) return '01*****';
  return p.slice(0, 4) + '*****' + p.slice(-2);
}
function getStatus(expiryDate) {
  if (!expiryDate) return 'expired';
  const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
  return isAfter(expiry, new Date()) ? 'active' : 'expired';
}
function fmtDate(d) {
  if (!d) return '—';
  try { return format(d.toDate ? d.toDate() : new Date(d), 'dd MMM yyyy'); } catch { return '—'; }
}

// ── Dummy seed data removed ───────────────────────────

const PAGE_SIZE = 12;

function ChessUsernameLink({ username }) {
  if (!username) return null;
  return (
    <a
      href={`https://www.chess.com/member/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-[#81b64c] font-bold text-xs hover:text-[#95c660] hover:underline transition-colors group"
      title={`View ${username} on Chess.com`}
    >
      {username}
      <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

export default function Members() {
  const { visibility } = useSiteSettings();
  const [members, setMembers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('chess_members'));
      if (stored && stored.length > 0) return stored;
    } catch {}
    return [];
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => { document.title = 'Member List — ChessPremiumBD'; }, []);

  // Sync with Admin Dashboard changes instantly across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'chess_members' && e.newValue) {
        try { setMembers(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filtered = useMemo(() => {
    let list = members.map(m => ({ ...m, computedStatus: getStatus(m.expiry_date) }));
    if (filter !== 'all') list = list.filter(m => m.computedStatus === filter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(m =>
        (visibility.show_chess_username && (m.chess_username || '').toLowerCase().includes(s)) ||
        (visibility.show_name && (m.name || '').toLowerCase().includes(s)) ||
        (visibility.show_district && (m.district || '').toLowerCase().includes(s))
      );
    }
    return list;
  }, [members, filter, search, visibility]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => ({
    total: members.length,
    active: members.filter(m => getStatus(m.expiry_date) === 'active').length,
    expired: members.filter(m => getStatus(m.expiry_date) === 'expired').length,
  }), [members]);

  return (
    <div className="min-h-screen py-12 lg:py-16 bg-[#312e2b]">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">

        {/* Header */}
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#262421] border border-[#403d39] text-[#c3c3c0] rounded-full text-xs font-black uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5 text-[#81b64c]" />
            Verified Members
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">
            Our <span className="text-[#81b64c]">Member List</span>
          </h1>
          <p className="text-[#c3c3c0] max-w-sm mx-auto text-sm">
            Real players who upgraded through ChessPremiumBD.
            {!visibility.show_email && !visibility.show_phone && ' Contact info is hidden for privacy.'}
          </p>
        </motion.div>

        {/* Stats */}
        {visibility.show_total_count && (
          <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm mx-auto">
            {[
              { label: 'Total', val: counts.total, color: 'text-white' },
              { label: 'Active', val: counts.active, color: 'text-[#81b64c]' },
              { label: 'Expired', val: counts.expired, color: 'text-red-400' },
            ].map(item => (
              <div key={item.label} className="bg-[#262421] border border-[#403d39] rounded-xl p-4 text-center">
                <p className={`text-2xl font-black ${item.color}`}>{item.val}</p>
                <p className="text-[10px] text-[#c3c3c0] font-bold uppercase tracking-wider mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#c3c3c0]/40" />
            <input type="text" placeholder="Search by name, username or district..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#262421] border border-[#403d39] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#81b64c] outline-none transition-all placeholder:text-[#c3c3c0]/40"
            />
          </div>
          <div className="flex gap-1 bg-[#262421] border border-[#403d39] rounded-lg p-1">
            {['all', 'active', 'expired'].map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-[#81b64c] text-[#1a1a1a]' : 'text-[#c3c3c0] hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#262421] rounded-xl border border-[#403d39] overflow-hidden shadow-xl">
          {paginated.length === 0 ? (
            <div className="p-16 text-center">
              <Crown className="w-10 h-10 mx-auto mb-3 opacity-20 text-[#81b64c]" />
              <p className="text-[#c3c3c0] font-bold text-sm">No members found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#2a2825] border-b border-[#403d39]">
                    <tr>
                      <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">#</th>
                      {visibility.show_name && <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">Name</th>}
                      {visibility.show_chess_username && <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">Chess.com</th>}
                      {visibility.show_district && <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">District</th>}
                      {visibility.show_email && <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">Email</th>}
                      {visibility.show_phone && <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">Mobile</th>}
                      {visibility.show_purchase_date && <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">Purchased</th>}
                      {visibility.show_expiry_date && <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">Expires</th>}
                      <th className="px-5 py-4 text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#403d39]">
                    {paginated.map((m, i) => (
                      <motion.tr key={m.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="hover:bg-[#312e2b] transition-colors">
                        <td className="px-5 py-4 text-[#c3c3c0]/50 text-xs font-bold">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        {visibility.show_name && <td className="px-5 py-4 font-bold text-white">{m.name}</td>}
                        {visibility.show_chess_username && (
                          <td className="px-5 py-4">
                            <ChessUsernameLink username={m.chess_username} />
                          </td>
                        )}
                        {visibility.show_district && (
                          <td className="px-5 py-4">
                            {m.district ? (
                              <span className="inline-flex items-center gap-1 text-xs text-[#c3c3c0]">
                                <MapPin className="w-3 h-3 text-[#81b64c]" />{m.district}
                              </span>
                            ) : '—'}
                          </td>
                        )}
                        {visibility.show_email && <td className="px-5 py-4 text-[#c3c3c0] text-xs">{maskEmail(m.email)}</td>}
                        {visibility.show_phone && <td className="px-5 py-4 text-[#c3c3c0] text-xs font-mono">{maskPhone(m.mobile)}</td>}
                        {visibility.show_purchase_date && <td className="px-5 py-4 text-[#c3c3c0] text-xs">{fmtDate(m.purchase_date)}</td>}
                        {visibility.show_expiry_date && <td className="px-5 py-4 text-[#c3c3c0] text-xs">{fmtDate(m.expiry_date)}</td>}
                        <td className="px-5 py-4">
                          {m.computedStatus === 'active'
                            ? <span className="badge-active">Active</span>
                            : <span className="badge-expired">Expired</span>}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-[#403d39]">
                {paginated.map(m => (
                  <div key={m.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-[#312e2b] border border-[#403d39] rounded-lg flex items-center justify-center text-[#81b64c] font-black text-sm">
                          {m.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          {visibility.show_name && <p className="font-bold text-white text-sm">{m.name}</p>}
                          {visibility.show_chess_username && <ChessUsernameLink username={m.chess_username} />}
                        </div>
                      </div>
                      {m.computedStatus === 'active'
                        ? <span className="badge-active">Active</span>
                        : <span className="badge-expired">Expired</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-[#c3c3c0]">
                      {visibility.show_district && m.district && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#81b64c]" />
                          <span className="text-white">{m.district}</span>
                        </div>
                      )}
                      {visibility.show_email && <div>Email: <span className="text-white">{maskEmail(m.email)}</span></div>}
                      {visibility.show_phone && <div>Mobile: <span className="text-white font-mono">{maskPhone(m.mobile)}</span></div>}
                      {visibility.show_expiry_date && <div>Expires: <span className="text-white">{fmtDate(m.expiry_date)}</span></div>}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-[#403d39] flex items-center justify-between">
                  <p className="text-xs text-[#c3c3c0] font-bold">
                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${p === page ? 'bg-[#81b64c] text-[#1a1a1a]' : 'bg-[#312e2b] text-[#c3c3c0] hover:text-white border border-[#403d39]'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Community Section ── */}
        <div className="mt-16 mb-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">
            Join Our <span className="text-[#81b64c]">Community</span>
          </h2>
          <p className="text-[#c3c3c0] max-w-md mx-auto text-sm mb-8">
            Connect with hundreds of chess players, get tips, stay updated on offers, and get support.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Messenger Group */}
            <a href="https://m.me/j/AbYDUMMYMESSENGERGROUPLINK" target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-[#403d39] bg-[#262421] hover:border-blue-500/40 transition-all">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                <svg viewBox="0 0 56 56" className="w-8 h-8 fill-white"><path d="M28 2C13.641 2 2 12.95 2 26.5c0 7.377 3.344 13.965 8.627 18.47V56l10.173-5.585C23.434 51.314 25.68 51.62 28 51.62c14.359 0 26-10.95 26-24.62S42.359 2 28 2zm2.577 33.12l-6.621-7.062-12.924 7.062 14.22-15.12 6.784 7.062 12.757-7.062-14.216 15.12z"/></svg>
              </div>
              <div className="text-center">
                <p className="font-black text-white group-hover:text-blue-400 transition-colors">Messenger Group</p>
                <p className="text-xs text-[#c3c3c0] mt-1">Join the conversation</p>
              </div>
            </a>

            {/* Facebook Page */}
            <a href="https://www.facebook.com/chesspremiumbd" target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-[#403d39] bg-[#262421] hover:border-[#1877f2]/40 transition-all">
              <div className="w-14 h-14 bg-[#1877f2] rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <div className="text-center">
                <p className="font-black text-white group-hover:text-[#1877f2] transition-colors">Facebook Page</p>
                <p className="text-xs text-[#c3c3c0] mt-1">Follow for updates</p>
              </div>
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-[#c3c3c0]/40 mt-10">
          Contact info hidden to protect member privacy.
        </p>
      </div>
    </div>
  );
}
