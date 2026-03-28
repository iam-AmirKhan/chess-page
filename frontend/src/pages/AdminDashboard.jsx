// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { addDays, format } from 'date-fns';
import {
  LayoutDashboard, Clock, Users, UserX, List, Settings,
  LogOut, Search, Check, X, Trash2, Crown, TrendingUp,
  ChevronRight, CalendarClock, Menu, Eye, EyeOff, Trophy,
  Save, Plus, ExternalLink, Edit2, ToggleLeft, ToggleRight,
  MessageCircle, Phone, Tag, DollarSign, Globe, Swords, MapPin,
  Bell, Star, Mail, Copy, LifeBuoy, Download, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ─────────────────────────────────
const CARD = 'bg-[#1a1f26] border border-[#2a3340] shadow-sm';
const INPUT_CLS = 'w-full px-4 py-2 bg-[#0d1117] border border-[#2a3340] rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-[#3a4452]';

// ── Helpers ──────────────────────────────────
function fmt(d) {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy'); } catch { return '—'; }
}
function getStatus(expiry) {
  if (!expiry) return 'expired';
  return new Date(expiry) > new Date() ? 'active' : 'expired';
}

// ── Dummy seed data removed ───────────────────────────

// ── Nav items ────────────────────────────
const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'active', label: 'Active Members', icon: Users },
  { id: 'expired', label: 'Expired Members', icon: UserX },
  { id: 'all', label: 'All Members', icon: List },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  { id: 'accounts', label: 'Family Plans', icon: Mail },
  { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy },
  { id: 'reviews', label: 'User Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function Badge({ status }) {
  const s = {
    active: 'bg-[#81b64c]/10 text-[#81b64c] border-[#81b64c]/20',
    approved: 'bg-[#81b64c]/10 text-[#81b64c] border-[#81b64c]/20',
    expired: 'bg-red-500/10 text-red-400 border-red-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${s[status] || s.pending}`}>{status}</span>;
}

function Toggle({ checked, onChange, label }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-3 w-full">
      <div className={`w-10 h-5 rounded-full flex items-center transition-all ${checked ? 'bg-[#81b64c]' : 'bg-[#3a3a3a]'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'ml-[22px]' : 'ml-0.5'}`} />
      </div>
      <span className={`text-sm ${checked ? 'text-white font-semibold' : 'text-[#888]'}`}>{label}</span>
    </button>
  );
}

// ── Tournament Form ──────────────────────
const EMPTY_T = {
  title: '', description: '', game_type: 'Blitz (3+2)', prize: '',
  date: '', max_players: 32, join_link: '', rules: '', published: false,
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const {
    settings, updateSettings,
    visibility, updateVisibility,
    tournaments, addTournament, updateTournament, deleteTournament,
    challenges, deleteChallenge,
  } = useSiteSettings();

  const [section, setSection] = useState('overview');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [pending, setPending] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pending_orders') || '[]');
      return stored;
    } catch { return []; }
  });
  const [members, setMembers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('chess_members') || '[]');
      return stored;
    } catch {}
    return [];
  });
  
  const DUMMY_PASSWORD = 'admin123';

  const confirmWithPassword = (onConfirm, message) => {
    if (!window.confirm(message)) return;
    const pass = window.prompt("Security Check: Enter Admin Password to confirm this destructive action:");
    if (pass === DUMMY_PASSWORD) {
      onConfirm();
    } else if (pass !== null) {
      alert("Incorrect password! Action cancelled.");
    }
  };

  const updateMembers = (updater) => {
    setMembers(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('chess_members', JSON.stringify(next));
      return next;
    });
  };

  const updatePending = (updater) => {
    setPending(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('pending_orders', JSON.stringify(next));
      return next;
    });
  };

  // Member edit form
  const [editingUserId, setEditingUserId] = useState(null);
  const [memberForm, setMemberForm] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  // Family Plans
  const [familyPlans, setFamilyPlans] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('chess_family_plans'));
      if (stored && stored.length > 0) return stored;
    } catch {}
    return [];
  });
  const updateFamilyPlans = (updater) => {
    setFamilyPlans(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('chess_family_plans', JSON.stringify(next));
      return next;
    });
  };
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planForm, setPlanForm] = useState({ id: '', alias: '', password: '', parent_username: '', capacity: 6, renewal_date: new Date().toISOString(), note: '' });
  const [showPwd, setShowPwd] = useState({});

  // Tickets
  const [tickets, setTickets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chess_tickets') || '[]');
    } catch { return []; }
  });
  const updateTickets = (updater) => {
    setTickets(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('chess_tickets', JSON.stringify(next));
      return next;
    });
  };
  
  // Reviews
  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chess_reviews') || '[]');
    } catch { return []; }
  });
  const updateReviews = (updater) => {
    setReviews(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('chess_reviews', JSON.stringify(next));
      return next;
    });
  };

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState(null);
  const [isAddingReview, setIsAddingReview] = useState(false);

  // ── CSV UTILS ────────────────────────────────────────────────────────
  const exportToCSV = (data, filename) => {
    if (!data.length) return alert('No data to export');
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(','));
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleImportCSV = (e, onComplete) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const result = lines.slice(1).filter(l => l.trim()).map(line => {
        const values = line.split(',').map(v => v.replace(/^"|"$/g, ''));
        return headers.reduce((obj, h, i) => {
          obj[h] = values[i];
          return obj;
        }, {});
      });
      onComplete(result);
      alert(`Imported ${result.length} items successfully!`);
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Tournament form
  const [showTournamentForm, setShowTournamentForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [tournamentForm, setTournamentForm] = useState(EMPTY_T);

  useEffect(() => { document.title = 'Admin Dashboard — ChessPremiumBD'; }, []);

  // Sync settings form when settings change
  useEffect(() => {
    setSettingsForm(prev => ({ ...settings, ...prev }));
  }, []); // eslint-disable-line

  // Poll localStorage for new submissions
  useEffect(() => {
    const poll = setInterval(() => {
      try {
        const stored = JSON.parse(localStorage.getItem('pending_orders') || '[]');
        if (stored.length > 0) {
          setPending(prev => {
            const currentIds = new Set(prev.map(p => p.id));
            const newOnes = stored.filter(s => !currentIds.has(s.id));
            if (newOnes.length > 0) {
              return [...newOnes, ...prev]; // Prepend new results
            }
            return prev;
          });
        }
      } catch {}
    }, 2000);
    return () => clearInterval(poll);
  }, []); // Only start on mount

  const stats = useMemo(() => {
    const active = members.filter(m => getStatus(m.expiry_date) === 'active').length;
    const expired = members.filter(m => getStatus(m.expiry_date) === 'expired').length;
    const pCount = pending.filter(p => p.status === 'pending').length;
    const tCount = tickets.filter(t => t.status === 'open').length;
    return { 
      total: members.length, 
      active, 
      expired, 
      pending: pCount, 
      tickets: tCount,
      reviews: reviews.filter(r => r.status === 'pending').length,
      allTimeRevenue: members.length * settings.price,
      activeRevenue: active * settings.price
    };
  }, [pending, members, settings.price, tickets, reviews]);

  const approvePending = (order) => {
    if (!window.confirm(`Approve ${order.name}?`)) return;
    const expiry = addDays(new Date(), 365).toISOString();
    updateMembers(prev => [{
      id: 'm' + Date.now(), name: order.name, chess_username: order.chess_username,
      email: order.email, mobile: order.mobile, trx_id: order.trx_id,
      district: order.district || '',
      purchase_date: new Date().toISOString(), expiry_date: expiry,
    }, ...prev]);
    updatePending(prev => prev.filter(p => p.id !== order.id));
  };
  const rejectPending = (id) => {
    if (!window.confirm('Reject this request?')) return;
    updatePending(prev => prev.filter(p => p.id !== id));
  };
  const deletePending = (id) => {
    if (!window.confirm('Delete permanently?')) return;
    updatePending(prev => prev.filter(p => p.id !== id));
  };
  const extendMember = (member) => {
    const input = window.prompt(`Extend ${member.name}'s membership by how many days?`, '365');
    if (input === null) return;
    const days = parseInt(input);
    if (isNaN(days) || days <= 0) {
      alert('Please enter a valid positive number of days.');
      return;
    }
    const base = new Date(member.expiry_date) > new Date() ? new Date(member.expiry_date) : new Date();
    updateMembers(prev => prev.map(m => m.id === member.id ? { ...m, expiry_date: addDays(base, days).toISOString() } : m));
  };
  const deactivateMember = (id) => {
    if (!window.confirm('Deactivate this member?')) return;
    updateMembers(prev => prev.map(m => m.id === id ? { ...m, expiry_date: '2000-01-01' } : m));
  };
  const deleteMember = (id) => {
    if (!window.confirm('Delete permanently?')) return;
    updateMembers(prev => prev.filter(m => m.id !== id));
  };

  const saveSettings = () => {
    updateSettings({
      ...settingsForm,
      price: Number(settingsForm.price),
      original_price: Number(settingsForm.original_price),
      coupon_discount: Number(settingsForm.coupon_discount),
      platform_cut_pct: Number(settingsForm.platform_cut_pct ?? 20),
      show_1v1_section: settingsForm.show_1v1_section ?? true,
      show_bkash: settingsForm.show_bkash !== false,
      show_nagad: settingsForm.show_nagad !== false,
      show_rocket: settingsForm.show_rocket !== false,
      show_bot_section: settingsForm.show_bot_section !== false,
      bot_discount_code: settingsForm.bot_discount_code || 'BEATTHEBOT10',
      show_toaster: settingsForm.show_toaster !== false,
      toaster_message: settingsForm.toaster_message || 'Someone from {city} just got Diamond! 🎉',
      show_sponsor: settingsForm.show_sponsor === true,
      whatsapp_link: settingsForm.whatsapp_link || 'https://wa.link/4l5rr7',
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveTournament = () => {
    if (!tournamentForm.title || !tournamentForm.date) { alert('Title and date are required'); return; }
    if (editingTournament) {
      updateTournament(editingTournament.id, tournamentForm);
    } else {
      addTournament({ ...tournamentForm, max_players: Number(tournamentForm.max_players), registered: 0 });
    }
    setShowTournamentForm(false);
    setEditingTournament(null);
    setTournamentForm(EMPTY_T);
  };

  // ── Fixed search: includes trx_id for all member sections ──
  const filteredMembers = useMemo(() => {
    let list = members.map(m => ({ ...m, computedStatus: getStatus(m.expiry_date) }));
    if (section === 'active') list = list.filter(m => m.computedStatus === 'active');
    if (section === 'expired') list = list.filter(m => m.computedStatus === 'expired');
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(m =>
        (m.name || '').toLowerCase().includes(s) ||
        (m.chess_username || '').toLowerCase().includes(s) ||
        (m.trx_id || '').toLowerCase().includes(s) ||
        (m.district || '').toLowerCase().includes(s) ||
        (m.email || '').toLowerCase().includes(s) ||
        (m.mobile || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [members, section, search]);

  // ── Fixed pending search: includes trx_id ──
  const filteredPending = useMemo(() => {
    if (!search.trim()) return pending;
    const s = search.toLowerCase();
    return pending.filter(p =>
      (p.name || '').toLowerCase().includes(s) ||
      (p.chess_username || '').toLowerCase().includes(s) ||
      (p.trx_id || '').toLowerCase().includes(s) ||
      (p.district || '').toLowerCase().includes(s) ||
      (p.mobile || '').toLowerCase().includes(s)
    );
  }, [pending, search]);

  const MAIN_BG = 'bg-[#1e2228]';

  return (
    <div className={`min-h-screen ${MAIN_BG} flex text-white`}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-56 bg-[#1a1f26] border-r border-[#2a3340] flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:flex-shrink-0`}>
        <div className="p-4 border-b border-[#2a3340]">
          <Link to="/" className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#81b64c]" />
            <span className="font-black text-sm">Chess<span className="text-[#81b64c]">PremiumBD</span></span>
          </Link>
          <p className="text-[10px] text-[#4a5668] mt-1 font-bold uppercase tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                section === item.id ? 'bg-[#81b64c]/15 text-[#81b64c]' : 'text-[#6a7a8e] hover:text-white hover:bg-[#252b33]'
              }`}>
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {item.id === 'pending' && stats.pending > 0 && (
                <span className="ml-auto bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {stats.pending}
                </span>
              )}
              {item.id === 'tickets' && stats.tickets > 0 && (
                <span className="ml-auto bg-[#81b64c] text-black text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {stats.tickets}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-[#2a3340]">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#6a7a8e] hover:text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="bg-[#1a1f26] border-b border-[#2a3340] h-12 flex items-center px-4 gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg text-[#6a7a8e] hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-white flex-1">{NAV.find(n => n.id === section)?.label}</h1>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4a5668]" />
            <input
              type="text"
              placeholder="Search name, username, TrxID, district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#252b33] border border-[#323a44] rounded-lg text-xs text-white focus:ring-1 focus:ring-[#81b64c] outline-none placeholder:text-[#4a5668] w-56"
            />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">

          {/* ── OVERVIEW ── */}
          {section === 'overview' && (
            <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Members', value: stats.total, color: 'text-white', sub: 'all time data', icon: Users, bg: 'bg-[#252b33]' },
                  { label: 'Active', value: stats.active, color: 'text-[#81b64c]', sub: 'currently valid', icon: Check, bg: 'bg-[#81b64c]/10 border-[#81b64c]/20' },
                  { label: 'Expired', value: stats.expired, color: 'text-red-400', sub: 'needs renewal', icon: UserX, bg: 'bg-red-500/10 border-red-500/20' },
                  { label: 'Pending', value: stats.pending, color: 'text-amber-400', sub: 'awaiting review', icon: Clock, bg: 'bg-amber-500/10 border-amber-500/20' },
                ].map(s => (
                  <div key={s.label} className={`${CARD} ${s.bg || ''} rounded-2xl p-5 relative overflow-hidden group transition-all hover:border-[#4a5668]`}>
                    <s.icon className={`absolute -right-4 -bottom-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 ${s.color}`} />
                    <p className={`text-3xl font-black ${s.color} relative z-10`}>{s.value}</p>
                    <p className="text-sm text-[#c3c3c0] font-bold mt-1 relative z-10">{s.label}</p>
                    <p className="text-[10px] text-[#6a7a8e] mt-0.5 tracking-wider uppercase font-semibold relative z-10">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${CARD} rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#81b64c]/10 to-transparent rounded-bl-[100px] pointer-events-none transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <p className="text-xs text-[#81b64c] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> Monthly Active Revenue</p>
                    <p className="text-4xl font-black text-white tracking-tight">৳{stats.activeRevenue.toLocaleString()}</p>
                    <p className="text-sm text-[#6a7a8e] mt-2 font-medium bg-[#1a1f26] px-2.5 py-1 rounded inline-block border border-[#2a3340]">{stats.active} members × ৳{settings.price.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-16 h-16 text-[#81b64c]/20 relative z-10 hidden sm:block" />
                </div>

                <div className={`${CARD} rounded-2xl p-6 flex items-center justify-between relative overflow-hidden`}>
                  <div className="relative z-10">
                    <p className="text-xs text-[#6a7a8e] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">All-Time Est. Revenue</p>
                    <p className="text-4xl font-black text-[#c3c3c0] tracking-tight">৳{stats.allTimeRevenue.toLocaleString()}</p>
                    <p className="text-sm text-[#6a7a8e] mt-2 font-medium bg-[#1a1f26] px-2.5 py-1 rounded inline-block border border-[#2a3340]">{stats.total} total members × ৳{settings.price.toLocaleString()}</p>
                  </div>
                  <LayoutDashboard className="w-16 h-16 text-[#2a3340] relative z-10 hidden sm:block" />
                </div>
              </div>

              {stats.pending > 0 && (
                <div className={`${CARD} border-amber-500/20 rounded-xl p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-amber-400" />
                      {stats.pending} Pending
                    </h3>
                    <button onClick={() => setSection('pending')} className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pending.filter(p => p.status === 'pending').slice(0, 3).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-[#1a1f26] rounded-lg border border-[#2a3340]">
                        <div>
                          <p className="text-sm font-bold text-white">{p.name}</p>
                          <p className="text-xs text-[#6a7a8e] font-mono">{p.chess_username} · <span className="text-amber-300">{p.trx_id}</span></p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approvePending(p)} className="p-1.5 bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20 rounded-lg hover:bg-[#81b64c] hover:text-black transition-all">
                            <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                          </button>
                          <button onClick={() => rejectPending(p.id)} className="p-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400 hover:text-white transition-all">
                            <X className="w-3.5 h-3.5 stroke-[2.5px]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`${CARD} rounded-xl p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-sm">Recent Members</h3>
                  <button onClick={() => setSection('all')} className="text-xs font-bold text-[#81b64c] flex items-center gap-1">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {members.slice(0, 4).map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-[#1a1f26] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#81b64c]/10 rounded-lg flex items-center justify-center text-[#81b64c] font-black text-sm">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{m.name}</p>
                          <p className="text-xs text-[#4a5668] font-mono">{m.chess_username}{m.district ? ` · ${m.district}` : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge status={getStatus(m.expiry_date)} />
                        <button onClick={() => extendMember(m)} title="Extend Expiry" className="p-1 px-2.5 bg-[#ffbf61]/10 text-[#ffbf61] border border-[#ffbf61]/20 rounded-lg hover:bg-[#ffbf61] hover:text-black transition-all text-[10px] font-black uppercase">
                          Extend
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PENDING ── */}
          {section === 'pending' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6a7a8e]">{filteredPending.filter(p => p.status === 'pending').length} pending review</span>
                {search && <span className="text-xs text-amber-400 font-bold">· Filtering by "{search}"</span>}
              </div>
              <div className={`${CARD} rounded-xl overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-[#1a1f26] border-b border-[#2a3340]">
                      <tr>
                        {['Submitted', 'Name', 'Username', 'Mobile', 'District', 'MFS', 'TrxID', 'Notes', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-[10px] font-bold text-[#4a5668] uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a3340]">
                      {filteredPending.length === 0 && (
                        <tr><td colSpan={9} className="px-4 py-12 text-center text-[#4a5668] text-sm">No results found</td></tr>
                      )}
                      {filteredPending.map(order => (
                        <tr key={order.id} className="hover:bg-[#252b33] transition-colors">
                          <td className="px-4 py-3 text-xs text-[#6a7a8e]">{fmt(order.submitted_at)}</td>
                          <td className="px-4 py-3 font-semibold text-white">{order.name}</td>
                          <td className="px-4 py-3 font-mono text-[#81b64c] text-xs">
                            <a href={`https://www.chess.com/member/${order.chess_username}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {order.chess_username}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-[#6a7a8e]">{order.mobile}</td>
                          <td className="px-4 py-3 text-xs text-[#c3c3c0]">
                            {order.district ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#81b64c]" />{order.district}</span> : '—'}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {order.payment_method ? (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                order.payment_method === 'bkash' || order.payment_method === 'bKash'
                                  ? 'bg-[#e2136e]/10 text-[#e2136e] border-[#e2136e]/20'
                                  : order.payment_method === 'nagad' || order.payment_method === 'Nagad'
                                  ? 'bg-[#f6821f]/10 text-[#f6821f] border-[#f6821f]/20'
                                  : 'bg-[#8B4EAB]/10 text-[#8B4EAB] border-[#8B4EAB]/20'
                              }`}>{order.payment_method}</span>
                            ) : '—'}
                          </td>
                          <td className="px-4 py-3"><code className="text-xs bg-[#1a1f26] border border-[#2a3340] px-2 py-1 rounded font-mono text-amber-300">{order.trx_id}</code></td>
                          <td className="px-4 py-3 text-[10px] text-[#81b64c] max-w-[120px] truncate cursor-pointer hover:underline font-bold" onClick={() => { if (order.notes) setSelectedNote({ name: order.name, text: order.notes }); }} title="Click to read full note">
                            {order.notes ? 'View Note' : <span className="text-[#c3c3c0] font-normal no-underline cursor-default">—</span>}
                          </td>
                          <td className="px-4 py-3"><Badge status={order.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {order.status === 'pending' && (
                                <>
                                  <button onClick={() => approvePending(order)} title="Approve" className="p-1.5 bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20 rounded-lg hover:bg-[#81b64c] hover:text-black transition-all">
                                    <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                                  </button>
                                  <button onClick={() => rejectPending(order.id)} title="Reject" className="p-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400 hover:text-white transition-all">
                                    <X className="w-3.5 h-3.5 stroke-[2.5px]" />
                                  </button>
                                </>
                              )}
                              <button onClick={() => deletePending(order.id)} title="Delete" className="p-1.5 bg-[#1a1f26] text-[#4a5668] border border-[#2a3340] rounded-lg hover:text-red-400 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MEMBERS TABLE ── */}
          {['active', 'expired', 'all'].includes(section) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#81b64c]" />
                    Active Members ({members.length})
                  </h2>
                  <p className="text-sm text-[#6a7a8e]">Verified recurring and one-time Diamond users.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                   <button onClick={() => exportToCSV(members, 'chess_members')} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#312e2b] border border-[#403d39] text-[#c3c3c0] rounded-lg text-xs font-bold hover:text-white transition-all">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#312e2b] border border-[#403d39] text-[#c3c3c0] rounded-lg text-xs font-bold hover:text-white transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Import
                    <input type="file" accept=".csv" className="hidden" onChange={e => handleImportCSV(e, data => updateMembers([...members, ...data]))} />
                  </label>
                   <button onClick={() => confirmWithPassword(() => updateMembers([]), 'Delete EVERY active member record? This cannot be undone.')} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                </div>
              </div>

              {/* Edit Member Form */}
              {editingUserId && memberForm && (
                <div className={`${CARD} rounded-xl p-5 space-y-4 mb-4 border-[#81b64c]/30`}>
                  <h3 className="font-black text-white flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-[#81b64c]" /> Edit User Data: {memberForm.name}
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5">Name</label>
                      <input type="text" className={INPUT_CLS} value={memberForm.name} onChange={e => setMemberForm(p => ({...p, name: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5">Chess.com Username</label>
                      <input type="text" className={INPUT_CLS} value={memberForm.chess_username} onChange={e => setMemberForm(p => ({...p, chess_username: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5">Email</label>
                      <input type="email" className={INPUT_CLS} value={memberForm.email} onChange={e => setMemberForm(p => ({...p, email: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5">Mobile</label>
                      <input type="text" className={INPUT_CLS} value={memberForm.mobile} onChange={e => setMemberForm(p => ({...p, mobile: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5">District</label>
                      <input type="text" className={INPUT_CLS} value={memberForm.district || ''} onChange={e => setMemberForm(p => ({...p, district: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5">TrxID (Receipt)</label>
                      <input type="text" className={INPUT_CLS} value={memberForm.trx_id || ''} onChange={e => setMemberForm(p => ({...p, trx_id: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5">Purchase Date</label>
                      <input type="date" className={INPUT_CLS} value={memberForm.purchase_date?.slice(0,10) || ''} onChange={e => setMemberForm(p => ({...p, purchase_date: e.target.value ? new Date(e.target.value).toISOString() : p.purchase_date}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5">Expiry Date</label>
                      <input type="date" className={INPUT_CLS} value={memberForm.expiry_date?.slice(0,10) || ''} onChange={e => setMemberForm(p => ({...p, expiry_date: e.target.value ? new Date(e.target.value).toISOString() : p.expiry_date}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1.5 text-amber-400">Assigned Plan</label>
                      <select className={INPUT_CLS} value={memberForm.plan_id || ''} onChange={e => setMemberForm(p => ({...p, plan_id: e.target.value}))}>
                        <option value="">None / Floating</option>
                        {familyPlans.map(plan => (
                          <option key={plan.id} value={plan.id}>{plan.alias}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { updateMembers(prev => prev.map(m => m.id === editingUserId ? memberForm : m)); setEditingUserId(null); }} className="flex items-center gap-2 px-6 py-2.5 bg-[#81b64c] text-black rounded-xl font-black text-sm hover:bg-[#95c660] transition-all"><Save className="w-4 h-4"/> Save User Data</button>
                    <button onClick={() => setEditingUserId(null)} className="px-5 py-2.5 bg-[#1a1f26] border border-[#2a3340] text-[#6a7a8e] rounded-xl font-bold text-sm hover:text-white transition-all">Cancel</button>
                  </div>
                </div>
              )}

              <div className={`${CARD} rounded-xl overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-[#1a1f26] border-b border-[#2a3340]">
                      <tr>
                        {['Name', 'Username', 'Email', 'Mobile', 'District', 'TrxID', 'Expiry', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-[10px] font-bold text-[#4a5668] uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a3340]">
                      {filteredMembers.length === 0 && (
                        <tr><td colSpan={9} className="px-4 py-12 text-center text-[#4a5668] text-sm">No members found</td></tr>
                      )}
                      {filteredMembers.map(m => (
                        <tr key={m.id} className="hover:bg-[#252b33] transition-colors">
                          <td className="px-4 py-3 font-semibold text-white">{m.name}</td>
                          <td className="px-4 py-3">
                            <a href={`https://www.chess.com/member/${m.chess_username}`} target="_blank" rel="noopener noreferrer"
                              className="font-mono text-[#81b64c] text-xs hover:underline flex items-center gap-1 group">
                              {m.chess_username}
                              <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#6a7a8e]">{m.email}</td>
                          <td className="px-4 py-3 text-xs font-mono text-[#6a7a8e]">{m.mobile}</td>
                          <td className="px-4 py-3 text-xs text-[#c3c3c0]">
                            {m.district ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#81b64c]" />{m.district}</span> : '—'}
                          </td>
                          <td className="px-4 py-3"><code className="text-xs bg-[#1a1f26] border border-[#2a3340] px-2 py-1 rounded font-mono text-amber-300">{m.trx_id || '—'}</code></td>
                          <td className="px-4 py-3 text-xs text-[#6a7a8e]">{fmt(m.expiry_date)}</td>
                          <td className="px-4 py-3"><Badge status={m.computedStatus} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => { setEditingUserId(m.id); setMemberForm(m); }} title="Edit Data" className="p-1.5 bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20 rounded-lg hover:bg-[#81b64c] hover:text-black transition-all">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => extendMember(m)} title="Extend Expiry" className="p-1.5 bg-[#ffbf61]/10 text-[#ffbf61] border border-[#ffbf61]/20 rounded-lg hover:bg-[#ffbf61] hover:text-black transition-all">
                                <CalendarClock className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deactivateMember(m.id)} title="Deactivate" className="p-1.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-lg hover:bg-amber-400/30 transition-all">
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteMember(m.id)} title="Delete" className="p-1.5 bg-[#1a1f26] text-[#4a5668] border border-[#2a3340] rounded-lg hover:text-red-400 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TOURNAMENTS ADMIN ── */}
          {section === 'tournaments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6a7a8e]">{tournaments.length} custom tournaments</span>
                <button onClick={() => { setShowTournamentForm(true); setEditingTournament(null); setTournamentForm(EMPTY_T); }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#81b64c] text-black rounded-lg font-black text-sm hover:bg-[#95c660] transition-all">
                  <Plus className="w-4 h-4" /> Create Tournament
                </button>
              </div>

              {/* Tournament Form */}
              {showTournamentForm && (
                <div className={`${CARD} rounded-xl p-5 space-y-4`}>
                  <h3 className="font-black text-white">{editingTournament ? 'Edit Tournament' : 'New Tournament'}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1">Title *</label>
                      <input type="text" value={tournamentForm.title} onChange={e => setTournamentForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="ChessPremiumBD Spring Open 2026" className={INPUT_CLS} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1">Description</label>
                      <textarea rows={2} value={tournamentForm.description} onChange={e => setTournamentForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Tournament description..." className={`${INPUT_CLS} resize-none`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1">Game Type</label>
                      <select value={tournamentForm.game_type} onChange={e => setTournamentForm(p => ({ ...p, game_type: e.target.value }))} className={INPUT_CLS}>
                        <option>Bullet (1+0)</option>
                        <option>Bullet (2+1)</option>
                        <option>Blitz (3+2)</option>
                        <option>Blitz (5+0)</option>
                        <option>Rapid (10+5)</option>
                        <option>Rapid (15+10)</option>
                        <option>Classical (30+0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1">Prize</label>
                      <input type="text" value={tournamentForm.prize} onChange={e => setTournamentForm(p => ({ ...p, prize: e.target.value }))}
                        placeholder="৳5,000 Prize Pool" className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1">Date & Time *</label>
                      <input type="datetime-local" value={tournamentForm.date} onChange={e => setTournamentForm(p => ({ ...p, date: e.target.value }))} className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1">Max Players</label>
                      <input type="number" value={tournamentForm.max_players} onChange={e => setTournamentForm(p => ({ ...p, max_players: e.target.value }))}
                        min={2} className={INPUT_CLS} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1">Join Link (Chess.com)</label>
                      <input type="url" value={tournamentForm.join_link} onChange={e => setTournamentForm(p => ({ ...p, join_link: e.target.value }))}
                        placeholder="https://chess.com/tournament/..." className={INPUT_CLS} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1">Rules</label>
                      <input type="text" value={tournamentForm.rules} onChange={e => setTournamentForm(p => ({ ...p, rules: e.target.value }))}
                        placeholder="Diamond members only, FIDE rules..." className={INPUT_CLS} />
                    </div>
                    <div className="sm:col-span-2">
                      <Toggle checked={tournamentForm.published} onChange={v => setTournamentForm(p => ({ ...p, published: v }))} label="Publish immediately (visible on public Tournaments page)" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSaveTournament} className="flex items-center gap-2 px-5 py-2.5 bg-[#81b64c] text-black rounded-lg font-black text-sm hover:bg-[#95c660] transition-all">
                      <Save className="w-4 h-4" /> {editingTournament ? 'Update' : 'Publish'}
                    </button>
                    <button onClick={() => { setShowTournamentForm(false); setEditingTournament(null); }} className="px-5 py-2.5 bg-[#1a1f26] border border-[#2a3340] text-[#6a7a8e] rounded-lg font-bold text-sm hover:text-white transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* 1v1 Challenge Settings (Moved here) */}
              <div className={`${CARD} rounded-xl p-5 border border-[#ffbf61]/10 bg-[#ffbf61]/5 mt-4 mb-6`}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Swords className="w-4 h-4 text-[#ffbf61]" /> 1v1 Betting Settings
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Toggle
                      checked={settingsForm.show_1v1_section ?? true}
                      onChange={v => setSettingsForm(p => ({ ...p, show_1v1_section: v }))}
                      label="Enable 1v1 Section"
                    />
                    <div className="pt-1">
                      <label className="text-[10px] font-black text-[#6a7a8e] uppercase tracking-widest block mb-1.5">Platform Cut (%)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={0} max={50} step={1}
                          value={settingsForm.platform_cut_pct ?? 20}
                          onChange={e => setSettingsForm(p => ({ ...p, platform_cut_pct: Number(e.target.value) }))}
                          className={`${INPUT_CLS} max-w-[100px]`}
                        />
                        <span className="text-xs text-[#4a5668]">You keep {settingsForm.platform_cut_pct ?? 20}% of total prize pool.</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#6a7a8e] leading-relaxed bg-[#1a1f26] p-4 rounded-lg border border-[#2a3340]">
                    <p className="font-bold text-[#c3c3c0] mb-2 uppercase tracking-tight">How it works:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Users pay the bet amount first to create a link.</li>
                      <li>Platform collects 20% (default) from the total pool.</li>
                      <li>If bet is ৳100, pool is ৳200. You keep ৳40. Winner gets ৳160.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tournament list */}
              {tournaments.length === 0 ? (
                <div className={`${CARD} rounded-xl p-12 text-center`}>
                  <Trophy className="w-10 h-10 text-[#2a3340] mx-auto mb-3" />
                  <p className="text-[#6a7a8e] text-sm">No tournaments yet. Create one above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tournaments.map(t => (
                    <div key={t.id} className={`${CARD} rounded-xl p-4 flex items-start justify-between gap-4`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-white">{t.title}</p>
                          <Badge status={t.published ? 'active' : 'expired'} />
                        </div>
                        <p className="text-xs text-[#6a7a8e]">{t.game_type} · {fmt(t.date)} · {t.prize}</p>
                        {t.join_link && (
                          <a href={t.join_link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#81b64c] hover:underline flex items-center gap-0.5 mt-1">
                            Join Link <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { updateTournament(t.id, { published: !t.published }); }} title={t.published ? 'Unpublish' : 'Publish'}
                          className="p-1.5 bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20 rounded-lg hover:bg-[#81b64c] hover:text-black transition-all">
                          {t.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => { setEditingTournament(t); setTournamentForm(t); setShowTournamentForm(true); }} title="Edit"
                          className="p-1.5 bg-[#1a1f26] text-[#6a7a8e] border border-[#2a3340] rounded-lg hover:text-white transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { if (window.confirm('Delete tournament?')) deleteTournament(t.id); }} title="Delete"
                          className="p-1.5 bg-[#1a1f26] text-[#4a5668] border border-[#2a3340] rounded-lg hover:text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 1v1 Challenges Admin */}
              <div className={`${CARD} rounded-xl p-5 mt-4`}>
                <h3 className="font-black text-white mb-1 flex items-center gap-2 text-sm">
                  <Swords className="w-4 h-4 text-[#ffbf61]" /> 1v1 Open Challenges
                </h3>
                <p className="text-xs text-[#6a7a8e] mb-4">Challenges created by users. You can remove any.</p>
                {challenges.length === 0 ? (
                  <p className="text-xs text-[#4a5668]">No challenges yet.</p>
                ) : (
                  <div className="space-y-2">
                    {challenges.map(ch => (
                      <div key={ch.id} className="flex items-center justify-between p-3 bg-[#1a1f26] rounded-lg border border-[#2a3340]">
                        <div>
                          <p className="text-sm font-bold text-white">{ch.creator} <span className="text-[#c3c3c0] font-normal">challenges</span></p>
                          <p className="text-xs text-[#6a7a8e]">৳{ch.amount} · {ch.status === 'accepted' ? `Accepted by ${ch.acceptor}` : 'Open'}</p>
                        </div>
                        <button onClick={() => { if (window.confirm('Remove challenge?')) deleteChallenge(ch.id); }} className="p-1.5 bg-[#1a1f26] text-[#4a5668] border border-[#2a3340] rounded-lg hover:text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── ACCOUNTS (FAMILY PLANS) ── */}
          {section === 'accounts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Family Plan Tracking
                  </h2>
                  <p className="text-sm text-[#6a7a8e]">Internal management of shared Diamond accounts.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => exportToCSV(familyPlans, 'family_plans')} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#312e2b] border border-[#403d39] text-[#c3c3c0] rounded-lg text-xs font-bold hover:text-white transition-all">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#312e2b] border border-[#403d39] text-[#c3c3c0] rounded-lg text-xs font-bold hover:text-white transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Import
                    <input type="file" accept=".csv" className="hidden" onChange={e => handleImportCSV(e, data => updateFamilyPlans([...familyPlans, ...data]))} />
                  </label>
                  <button onClick={() => setShowPlanForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#81b64c] text-black font-black rounded-xl text-sm hover:shadow-lg transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Add New Plan
                  </button>
                </div>
              </div>

              {showPlanForm && (
                <div className={`${CARD} rounded-xl p-5 border border-blue-500/30 mb-6 shadow-xl`}>
                  <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
                    {planForm.id ? 'Edit Family Plan' : 'Create New Tracked Plan'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Gmail Alias / Email *</label>
                      <input type="email" value={planForm.alias} onChange={e => setPlanForm(p => ({ ...p, alias: e.target.value.toLowerCase() }))} placeholder="owner+plan01@gmail.com" className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Gmail Password *</label>
                      <input type="text" value={planForm.password} onChange={e => setPlanForm(p => ({ ...p, password: e.target.value }))} placeholder="SecurePass123" className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Parent Chess Username</label>
                      <input type="text" value={planForm.parent_username} onChange={e => setPlanForm(p => ({ ...p, parent_username: e.target.value }))} placeholder="Master_Account" className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Max Capacity (Slots)</label>
                      <input type="number" value={planForm.capacity} onChange={e => setPlanForm(p => ({ ...p, capacity: Number(e.target.value) }))} min={1} max={10} className={INPUT_CLS} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Next Renewal Date *</label>
                      <input type="date" className={INPUT_CLS} value={planForm.renewal_date?.slice(0, 10) || ''} onChange={e => setPlanForm(p => ({ ...p, renewal_date: e.target.value ? new Date(e.target.value).toISOString() : p.renewal_date }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Internal Notes (e.g. tracking info)</label>
                      <textarea value={planForm.note || ''} onChange={e => setPlanForm(p => ({ ...p, note: e.target.value }))} placeholder="Add any extra details here..." rows={2} className={`${INPUT_CLS} resize-none`} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => {
                      if (!planForm.alias.trim() || !planForm.password) return alert('Alias and Password required.');
                      if (planForm.id) {
                        updateFamilyPlans(prev => prev.map(p => p.id === planForm.id ? planForm : p));
                      } else {
                        updateFamilyPlans(prev => [...prev, { ...planForm, id: 'plan_' + Date.now() }]);
                      }
                      setShowPlanForm(false);
                    }} className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl font-black text-sm hover:bg-blue-600 transition-all">
                      <Save className="w-4 h-4" /> Save Plan
                    </button>
                    <button onClick={() => setShowPlanForm(false)} className="px-5 py-2.5 bg-[#1a1f26] border border-[#2a3340] text-[#6a7a8e] rounded-xl font-bold text-sm hover:text-white transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {familyPlans.length === 0 && !showPlanForm ? (
                <div className={`${CARD} rounded-2xl p-16 text-center border-dashed border-[#2a3340]`}>
                  <Mail className="w-12 h-12 text-[#333] mx-auto mb-4" />
                  <p className="text-white font-bold mb-1">No Tracked Plans</p>
                  <p className="text-[#6a7a8e] text-sm">Start storing your Gmail aliases and passwords securely.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {familyPlans.map(plan => {
                    const assignedMembers = members.filter(m => m.plan_id === plan.id);
                    const filled = assignedMembers.length;
                    const max = plan.capacity || 6;
                    const isFull = filled >= max;
                    
                    // Renewal calculation
                    const daysToRenewal = Math.ceil((new Date(plan.renewal_date) - new Date()) / (1000 * 60 * 60 * 24));
                    const renewalUrgent = daysToRenewal <= 7 && daysToRenewal >= 0;

                    return (
                      <div key={plan.id} className={`${CARD} rounded-2xl flex flex-col justify-between overflow-hidden group border ${isFull ? 'border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'border-[#2a3340] hover:border-blue-500/30'}`}>
                        <div className={`h-1.5 w-full ${isFull ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (filled / max) * 100)}%` }} />
                        <div className="p-5 flex-1">
                          
                          {/* Header row */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-[#81b64c] font-black text-xs uppercase tracking-widest mb-0.5">{plan.parent_username || 'No Parent ID Set'}</p>
                              <p className="text-white font-mono text-sm break-all">{plan.alias}</p>
                            </div>
                            <div className={`px-2 py-0.5 rounded-md text-xs font-black ${isFull ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {filled}/{max}
                            </div>
                          </div>

                          {/* Data chunk */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-xs bg-[#1a1f26] border border-[#2a3340] p-2 rounded-lg">
                              <span className="text-[#6a7a8e] font-bold">Password</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-mono text-white ${!showPwd[plan.id] ? 'blur-[4px] select-none' : ''}`}>
                                  {!showPwd[plan.id] ? plan.password.replace(/./g, '•') : plan.password}
                                </span>
                                <button onClick={() => setShowPwd(p => ({ ...p, [plan.id]: !p[plan.id] }))} className="text-[#6a7a8e] hover:text-white transition-colors" title="Toggle">
                                  {showPwd[plan.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button onClick={() => navigator.clipboard.writeText(plan.password)} className="text-[#6a7a8e] hover:text-white transition-colors" title="Copy">
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className={`flex items-center justify-between text-xs p-2 rounded-lg border ${renewalUrgent ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-[#1a1f26] border-[#2a3340] text-[#6a7a8e]'}`}>
                              <span className="font-bold flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" /> Renewal</span>
                              <span className="font-bold">{fmt(plan.renewal_date)} {renewalUrgent && '(Soon!)'}</span>
                            </div>
                            {plan.note && (
                              <div className="px-2 py-1.5 bg-[#1a1f26] border border-[#2a3340] rounded-lg">
                                <p className="text-[10px] text-[#81b64c] font-medium italic truncate">Note: {plan.note}</p>
                              </div>
                            )}
                          </div>

                          {/* Associated Members */}
                          <div className="border border-[#2a3340] rounded-xl p-3 bg-[#1a1f26] min-h-[100px]">
                            <p className="text-[10px] text-[#6a7a8e] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5"><Users className="w-3 h-3"/> Assigned Users</p>
                            {assignedMembers.length === 0 ? (
                              <p className="text-xs text-[#555] italic">No slots filled yet.</p>
                            ) : (
                              <ul className="space-y-1.5 text-xs text-[#c3c3c0]">
                                {assignedMembers.map(m => (
                                  <li key={m.id} className="flex justify-between items-center group/item hover:bg-white/5 p-1 rounded transition-colors">
                                    <span className={getStatus(m.expiry_date) === 'expired' ? 'text-red-400/80 line-through' : ''}>{m.chess_username}</span>
                                    <div className="flex items-center gap-3">
                                      <button onClick={() => extendMember(m)} className="text-[10px] text-[#ffbf61] hover:underline opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        Extend
                                      </button>
                                      <span className="text-[10px] text-[#6a7a8e] opacity-40 group-hover/item:opacity-100 transition-opacity">
                                        {fmt(m.expiry_date)}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 border-t border-[#2a3340]">
                          <button onClick={() => { setPlanForm(plan); setShowPlanForm(true); }} className="py-2.5 text-xs font-bold text-[#6a7a8e] hover:bg-[#20252b] hover:text-white transition-colors flex items-center justify-center gap-1.5">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => { if(window.confirm('Delete this plan entirely?')) updateFamilyPlans(p => p.filter(x => x.id !== plan.id)); }} className="py-2.5 text-xs font-bold text-red-500/60 hover:bg-red-500/10 hover:text-red-400 transition-colors border-l border-[#2a3340] flex items-center justify-center gap-1.5">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
          
          {/* ── REVIEWS ── */}
          {section === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#ffbf61]" />
                    User Reviews Moderation
                  </h2>
                  <p className="text-sm text-[#6a7a8e]">Approve or edit reviews before they appear on the homepage.</p>
                </div>
                <button 
                  onClick={() => {
                    setReviewForm({ author: '', text: '', stars: 5, status: 'approved', created_at: new Date().toISOString(), id: 'rev_' + Date.now() });
                    setIsAddingReview(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ffbf61] text-black font-black rounded-xl text-sm hover:bg-amber-400 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Custom Review
                </button>
              </div>

              {(isAddingReview || editingReviewId) && reviewForm && (
                <div className={`${CARD} rounded-xl p-5 space-y-4 mb-6 border-[#ffbf61]/30 shadow-xl overflow-hidden relative`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Star className="w-24 h-24 text-[#ffbf61] rotate-12" />
                  </div>
                  <h3 className="font-black text-white text-sm relative z-10">{isAddingReview ? 'Create Custom Review' : 'Edit Review Content'}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Author Name</label>
                      <input type="text" className={INPUT_CLS} value={reviewForm.author} onChange={e => setReviewForm(p => ({...p, author: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Stars (1-5)</label>
                      <input type="number" min={1} max={5} className={INPUT_CLS} value={reviewForm.stars} onChange={e => setReviewForm(p => ({...p, stars: Number(e.target.value)}))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#6a7a8e] uppercase tracking-widest block mb-1">Review Text</label>
                      <textarea rows={3} className={`${INPUT_CLS} resize-none`} value={reviewForm.text} onChange={e => setReviewForm(p => ({...p, text: e.target.value}))} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 relative z-10">
                    <button 
                      onClick={() => {
                        if (isAddingReview) {
                          updateReviews([reviewForm, ...reviews]);
                        } else {
                          updateReviews(prev => prev.map(r => r.id === editingReviewId ? reviewForm : r));
                        }
                        setEditingReviewId(null);
                        setReviewForm(null);
                        setIsAddingReview(false);
                      }}
                      className="px-6 py-2 bg-[#ffbf61] text-black rounded-lg font-black text-xs hover:bg-amber-400 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> {isAddingReview ? 'Add Review' : 'Save Changes'}
                    </button>
                    <button onClick={() => { setEditingReviewId(null); setReviewForm(null); setIsAddingReview(false); }} className="px-5 py-2 bg-[#1a1f26] border border-[#2a3340] text-white rounded-lg font-bold text-xs hover:bg-[#2a3340] transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {reviews.length === 0 ? (
                  <div className={`${CARD} rounded-2xl p-20 text-center col-span-full`}>
                    <Star className="w-12 h-12 text-[#2a3340] mx-auto mb-4" />
                    <p className="text-[#6a7a8e] font-bold">No user reviews yet.</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className={`${CARD} rounded-2xl p-5 border-l-4 ${review.status === 'approved' ? 'border-l-[#81b64c]' : 'border-l-amber-500 animate-pulse-subtle'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-white">{review.author}</h4>
                            <div className="flex text-[#ffbf61] gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.stars ? 'fill-current' : 'opacity-20'}`} />
                              ))}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              review.status === 'approved' ? 'bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {review.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#4a5668] font-bold uppercase">{fmt(review.created_at)}</p>
                        </div>
                      </div>
                      <div className="bg-[#1a1f26] border border-[#2a3340] rounded-xl p-4 mb-4">
                        <p className="text-sm text-[#c3c3c0] leading-relaxed italic">"{review.text}"</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#2a3340]">
                        <p className="text-[10px] text-[#4a5668] font-mono lowercase">ID: {review.id.slice(-8)}</p>
                        <div className="flex gap-2">
                          {review.status !== 'approved' && (
                            <button 
                              onClick={() => updateReviews(prev => prev.map(r => r.id === review.id ? {...r, status: 'approved'} : r))}
                              className="px-4 py-1.5 bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20 rounded-lg text-[10px] font-black uppercase hover:bg-[#81b64c] hover:text-black transition-all"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => { setEditingReviewId(review.id); setReviewForm({...review}); }}
                            className="p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => { if(window.confirm('Delete review?')) updateReviews(prev => prev.filter(r => r.id !== review.id)); }}
                            className="p-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400 hover:text-white transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ── TICKETS ── */}
          {section === 'tickets' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="text-xs text-[#6a7a8e]">{tickets.filter(t => t.status === 'open').length} open tickets</span>
                  <span className="text-xs text-[#6a7a8e]">{tickets.filter(t => t.status === 'closed').length} resolved</span>
                </div>
                <button onClick={() => confirmWithPassword(() => updateTickets([]), 'Clear all tickets?')} className="text-[10px] font-black uppercase text-red-400/60 hover:text-red-400 tracking-widest flex items-center gap-1">
                   <Trash2 className="w-3 h-3" /> Clear List
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {tickets.length === 0 ? (
                  <div className={`${CARD} rounded-2xl p-20 text-center col-span-full`}>
                    <LifeBuoy className="w-12 h-12 text-[#2a3340] mx-auto mb-4" />
                    <p className="text-[#6a7a8e] font-bold">No tickets yet.</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} className={`${CARD} rounded-2xl p-5 relative overflow-hidden group border-l-4 ${ticket.status === 'open' ? 'border-l-amber-500' : 'border-l-[#4a5668]'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-white">{ticket.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              ticket.status === 'open' 
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                : 'bg-[#4a5668]/10 text-[#6a7a8e] border border-[#2a3340]'
                            }`}>
                              {ticket.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {ticket.issue_type}
                            </span>
                            {ticket.urgency && (
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                ticket.urgency === 'urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                ticket.urgency === 'moderate' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                ticket.urgency === 'normal' ? 'bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20' :
                                'bg-[#4a5668]/10 text-[#c3c3c0] border border-[#4a5668]/20'
                              }`}>
                                {ticket.urgency}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6a7a8e] font-mono">
                            {ticket.chess_username} · <span className="text-[#81b64c] font-bold">{ticket.trx_id}</span>
                            {ticket.email && <span className="ml-2 opacity-60">· {ticket.email}</span>}
                          </p>
                        </div>
                        <p className="text-[10px] text-[#4a5668] font-bold uppercase">{fmt(ticket.created_at)}</p>
                      </div>

                      <div className="bg-[#1a1f26] border border-[#2a3340] rounded-xl p-4 mb-4">
                        <p className="text-sm text-[#c3c3c0] leading-relaxed whitespace-pre-wrap">
                          {ticket.message}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#2a3340]">
                        <p className="text-[10px] text-[#4a5668] font-mono">{ticket.id}</p>
                        <div className="flex gap-2">
                          {ticket.status === 'open' ? (
                            <button 
                              onClick={() => updateTickets(prev => prev.map(t => t.id === ticket.id ? {...t, status: 'closed'} : t))}
                              className="px-4 py-1.5 bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20 rounded-lg text-xs font-bold hover:bg-[#81b64c] hover:text-black transition-all"
                            >
                              Resolve Ticket
                            </button>
                          ) : (
                            <button 
                              onClick={() => updateTickets(prev => prev.map(t => t.id === ticket.id ? {...t, status: 'open'} : t))}
                              className="px-4 py-1.5 bg-[#4a5668]/10 text-[#6a7a8e] border border-[#2a3340] rounded-lg text-xs font-bold hover:text-white transition-all"
                            >
                              Reopen
                            </button>
                          )}
                          <button 
                            onClick={() => { if(window.confirm('Delete this ticket?')) updateTickets(prev => prev.filter(t => t.id !== ticket.id)); }}
                            className="p-1.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ── SETTINGS ── */}
          {section === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">

              {/* Business Settings */}
              <div className={`${CARD} rounded-xl p-5`}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-[#81b64c]" /> Business Settings
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Diamond Price (৳)</label>
                    <input type="number" value={settingsForm.price} onChange={e => setSettingsForm(p => ({ ...p, price: e.target.value }))} className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Original Price (৳)</label>
                    <input type="number" value={settingsForm.original_price} onChange={e => setSettingsForm(p => ({ ...p, original_price: e.target.value }))} className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Coupon Code</label>
                    <input type="text" value={settingsForm.coupon_code} onChange={e => setSettingsForm(p => ({ ...p, coupon_code: e.target.value.toUpperCase() }))} className={`${INPUT_CLS} font-mono uppercase`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Coupon Discount (৳)</label>
                    <input type="number" value={settingsForm.coupon_discount} onChange={e => setSettingsForm(p => ({ ...p, coupon_discount: e.target.value }))} className={INPUT_CLS} />
                  </div>
                </div>
              </div>

              {/* Contact Settings */}
              <div className={`${CARD} rounded-xl p-5`}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-[#e2136e]" /> Payment Numbers & Methods
                </h3>
                <div className="space-y-5">
                  {/* bKash */}
                  <div className="p-3 rounded-xl border border-[#e2136e]/20 bg-[#e2136e]/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#6a7a8e] uppercase tracking-wider">
                        <div className="w-5 h-5 bg-white rounded flex items-center justify-center shrink-0 p-0.5 overflow-hidden">
                          <img src="/mfs/bkash.svg" alt="bKash" className="w-full h-full object-contain" />
                        </div>
                        bKash
                      </label>
                      <Toggle
                        checked={settingsForm.show_bkash !== false}
                        onChange={v => setSettingsForm(p => ({ ...p, show_bkash: v }))}
                        label={settingsForm.show_bkash !== false ? "Enabled" : "Hidden"}
                      />
                    </div>
                    <input type="text" value={settingsForm.bkash_number || ''} onChange={e => setSettingsForm(p => ({ ...p, bkash_number: e.target.value }))} className={`${INPUT_CLS} font-mono`} placeholder="01XXXXXXXXX" />
                  </div>
                  {/* Nagad */}
                  <div className="p-3 rounded-xl border border-[#f6821f]/20 bg-[#f6821f]/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#6a7a8e] uppercase tracking-wider">
                        <div className="w-5 h-5 bg-white rounded flex items-center justify-center shrink-0 p-0.5 overflow-hidden">
                          <img src="/mfs/nagad.svg" alt="Nagad" className="w-full h-full object-contain" />
                        </div>
                        Nagad
                      </label>
                      <Toggle
                        checked={settingsForm.show_nagad !== false}
                        onChange={v => setSettingsForm(p => ({ ...p, show_nagad: v }))}
                        label={settingsForm.show_nagad !== false ? "Enabled" : "Hidden"}
                      />
                    </div>
                    <input type="text" value={settingsForm.nagad_number || ''} onChange={e => setSettingsForm(p => ({ ...p, nagad_number: e.target.value }))} className={`${INPUT_CLS} font-mono`} placeholder="01XXXXXXXXX" />
                  </div>
                  {/* Rocket */}
                  <div className="p-3 rounded-xl border border-[#8B4EAB]/20 bg-[#8B4EAB]/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#6a7a8e] uppercase tracking-wider">
                        <div className="w-5 h-5 bg-white rounded flex items-center justify-center shrink-0 p-0.5 overflow-hidden">
                          <img src="/mfs/rocket.png" alt="Rocket" className="w-full h-full object-contain" />
                        </div>
                        Rocket
                      </label>
                      <Toggle
                        checked={settingsForm.show_rocket !== false}
                        onChange={v => setSettingsForm(p => ({ ...p, show_rocket: v }))}
                        label={settingsForm.show_rocket !== false ? "Enabled" : "Hidden"}
                      />
                    </div>
                    <input type="text" value={settingsForm.rocket_number || ''} onChange={e => setSettingsForm(p => ({ ...p, rocket_number: e.target.value }))} className={`${INPUT_CLS} font-mono`} placeholder="01XXXXXXXXX" />
                  </div>
                  {/* WhatsApp */}
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">WhatsApp Number (with country code)</label>
                    <input type="text" value={settingsForm.whatsapp_number} onChange={e => setSettingsForm(p => ({ ...p, whatsapp_number: e.target.value }))} className={`${INPUT_CLS} font-mono`} placeholder="8801XXXXXXXXX" />
                  </div>
                </div>
              </div>



              {/* Beat the Bot / AI Chess Settings */}
              <div className={`${CARD} rounded-xl p-5`}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
                  <span className="text-sm">♟️</span> Beat the Bot Section
                  <span className="text-[10px] px-2 py-0.5 bg-[#ffbf61]/10 border border-[#ffbf61]/20 text-[#ffbf61] rounded-full font-black">BETA</span>
                </h3>
                <div className="space-y-4">
                  <Toggle
                    checked={settingsForm.show_bot_section !== false}
                    onChange={v => setSettingsForm(p => ({ ...p, show_bot_section: v }))}
                    label="Show 'Beat the Bot' chess section on Tournaments page"
                  />
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Win Discount Code</label>
                    <input
                      type="text"
                      value={settingsForm.bot_discount_code || ''}
                      onChange={e => setSettingsForm(p => ({ ...p, bot_discount_code: e.target.value.toUpperCase() }))}
                      className={`${INPUT_CLS} font-mono uppercase`}
                      placeholder="BEATTHEBOT10"
                    />
                    <p className="text-[11px] text-[#4a5668] mt-1">This code is shown to users who beat the bot. They can use it on the purchase page.</p>
                  </div>
                </div>
              </div>

              {/* Display & Growth Settings */}
              <div className={`${CARD} rounded-xl p-5`}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
                  <span className="text-sm">📈</span> Display & Growth Settings
                </h3>
                <div className="space-y-4">
                  <Toggle
                    checked={settingsForm.show_visitors !== false}
                    onChange={v => setSettingsForm(p => ({ ...p, show_visitors: v }))}
                    label="Show Total Visitors section on Homepage"
                  />
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Starting Visitor Count (Initial Value)</label>
                    <input
                      type="number"
                      value={settingsForm.visitor_count || 0}
                      onChange={e => setSettingsForm(p => ({ ...p, visitor_count: parseInt(e.target.value) || 0 }))}
                      className={`${INPUT_CLS} font-mono`}
                      placeholder="1250"
                    />
                    <p className="text-[10px] text-[#6a7a8e] mt-1.5 leading-relaxed">
                      * This value increments by 1 for every unique session visitor on the homepage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Toaster Notification Settings */}
              <div className={`${CARD} rounded-xl p-5`}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
                  <Bell className="w-4 h-4 text-amber-400" /> Purchase Toasters
                </h3>
                <div className="space-y-4">
                  <Toggle
                    checked={settingsForm.show_toaster !== false}
                    onChange={v => setSettingsForm(p => ({ ...p, show_toaster: v }))}
                    label="Show 'Recent Purchase' notification toasters on homepage"
                  />
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Toaster Message</label>
                    <input
                      type="text"
                      value={settingsForm.toaster_message || ''}
                      onChange={e => setSettingsForm(p => ({ ...p, toaster_message: e.target.value }))}
                      className={INPUT_CLS}
                      placeholder="Someone from {city} just got Diamond! 🎉"
                    />
                    <p className="text-[11px] text-[#4a5668] mt-1">Use <code className="text-[#81b64c]">{'{{city}}'}</code> as placeholder for a random city name.</p>
                  </div>
                </div>
              </div>

              {/* Sponsor Mode */}
              <div className={`${CARD} rounded-xl p-5`}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-[#ffbf61]" /> Sponsor Mode
                </h3>
                <div className="space-y-3">
                  <Toggle
                    checked={settingsForm.show_sponsor !== false && settingsForm.show_sponsor === true}
                    onChange={v => setSettingsForm(p => ({ ...p, show_sponsor: v }))}
                    label="Show Sponsored Section on homepage"
                  />
                  <p className="text-xs text-[#4a5668]">When enabled, a sponsored banner/section will appear on the homepage. Contact your sponsor to customize the content.</p>
                </div>
              </div>

              {/* Social Settings */}
              <div className={`${CARD} rounded-xl p-5`}>
                <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-blue-400" /> Social Links
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Facebook Page URL</label>
                    <input type="url" value={settingsForm.facebook_page} onChange={e => setSettingsForm(p => ({ ...p, facebook_page: e.target.value }))} className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#6a7a8e] uppercase tracking-wider block mb-1.5">Messenger Group Link</label>
                    <input type="url" value={settingsForm.messenger_group} onChange={e => setSettingsForm(p => ({ ...p, messenger_group: e.target.value }))} className={INPUT_CLS} />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button onClick={saveSettings}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${settingsSaved ? 'bg-[#81b64c] text-black' : 'bg-[#81b64c] hover:bg-[#95c660] text-black'}`}>
                <Save className="w-4 h-4" />
                {settingsSaved ? '✓ Settings Saved!' : 'Save Settings'}
              </button>

              {settingsSaved && (
                <p className="text-xs text-[#81b64c] font-semibold">
                  ✓ Changes applied site-wide — payment numbers and prices are now updated on all pages.
                </p>
              )}

              {/* Visibility Controls */}
              <div className={`${CARD} rounded-xl p-5`}>
                <h3 className="font-black text-white mb-1 flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-amber-400" /> Member List Visibility Controls
                </h3>
                <p className="text-xs text-[#6a7a8e] mb-4">Control what visitors see on the public Member List page.</p>
                <div className="space-y-3">
                  <Toggle checked={visibility.show_total_count} onChange={v => updateVisibility({ show_total_count: v })} label="Show total member count" />
                  <Toggle checked={visibility.show_name} onChange={v => updateVisibility({ show_name: v })} label="Show member names" />
                  <Toggle checked={visibility.show_chess_username} onChange={v => updateVisibility({ show_chess_username: v })} label="Show Chess.com usernames (clickable)" />
                  <Toggle checked={visibility.show_district} onChange={v => updateVisibility({ show_district: v })} label="Show district column" />
                  <Toggle checked={visibility.show_email} onChange={v => updateVisibility({ show_email: v })} label="Show email addresses (masked)" />
                  <Toggle checked={visibility.show_phone} onChange={v => updateVisibility({ show_phone: v })} label="Show phone numbers (masked)" />
                  <Toggle checked={visibility.show_purchase_date} onChange={v => updateVisibility({ show_purchase_date: v })} label="Show purchase date column" />
                  <Toggle checked={visibility.show_expiry_date} onChange={v => updateVisibility({ show_expiry_date: v })} label="Show expiry date column" />
                </div>
                <p className="text-[10px] text-[#4a5668] mt-4">Changes apply instantly — no save needed.</p>
              </div>

              {/* Danger Zone */}
              <div className={`${CARD} border-red-500/20 rounded-xl p-5`}>
                <h3 className="font-black text-white text-sm mb-3">Danger Zone</h3>
                <button onClick={logout} className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-400/10 transition-all text-sm font-semibold">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedNote(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#1e2228] border border-[#323a44] rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="font-black text-white mb-3 text-lg border-b border-[#323a44] pb-2">
                Purchase Note <span className="text-[#81b64c] text-sm font-bold ml-2">from {selectedNote.name}</span>
              </h3>
              <p className="text-[#c3c3c0] text-sm whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                {selectedNote.text}
              </p>
              <button onClick={() => setSelectedNote(null)} className="mt-5 w-full py-2.5 bg-[#252b33] hover:bg-[#323a44] text-white rounded-xl font-bold transition-all text-sm">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
