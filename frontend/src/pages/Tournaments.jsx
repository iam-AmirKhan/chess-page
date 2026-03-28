// src/pages/Tournaments.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Calendar, Users, ExternalLink, Clock, Crown, Zap,
  Swords, Copy, Check, X, AlertCircle, Share2, ChevronRight
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { formatDistanceToNow, isPast, format, isAfter } from 'date-fns';
import BeatTheBot from '../components/BeatTheBot';

function getStatus(expiryDate) {
  if (!expiryDate) return 'expired';
  try {
    const expiry = new Date(expiryDate);
    return isAfter(expiry, new Date()) ? 'active' : 'expired';
  } catch { return 'expired'; }
}

// ── Dummy tournaments removed ───────────────────────────

const PRESET_AMOUNTS = [20, 50, 100, 200];

function CountdownBadge({ date }) {
  const d = new Date(date);
  if (isPast(d)) return <span className="text-xs text-red-400 font-bold bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full">Ended</span>;
  return (
    <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" />
      {formatDistanceToNow(d, { addSuffix: true })}
    </span>
  );
}

function TournamentCard({ t, index }) {
  const pct = Math.round((t.registered / t.max_players) * 100);
  const isFull = t.registered >= t.max_players;
  const accent = isFull ? '#ef4444' : '#81b64c';

  return (
    <motion.div
      key={t.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative bg-[#262421] border border-[#403d39] rounded-2xl overflow-hidden hover:border-[#81b64c]/40 hover:shadow-[0_0_30px_rgba(129,182,76,0.07)] transition-all group"
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}60, ${accent}, ${accent}60)` }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 bg-[#ffbf61]/10 border border-[#ffbf61]/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5 text-[#ffbf61]" />
          </div>
          <CountdownBadge date={t.date} />
        </div>

        <h3 className="font-black text-white mb-1 text-base group-hover:text-[#81b64c] transition-colors leading-snug">{t.title}</h3>
        <p className="text-xs text-[#c3c3c0] mb-4 leading-relaxed">{t.description}</p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-[#312e2b] rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#81b64c] shrink-0" />
            <span className="text-[11px] text-[#c3c3c0] font-semibold">{format(new Date(t.date), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#312e2b] rounded-lg px-2.5 py-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-[#c3c3c0] font-semibold">{t.game_type}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#312e2b] rounded-lg px-2.5 py-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-[11px] text-[#c3c3c0] font-semibold">{t.registered}/{t.max_players}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#ffbf61]/10 border border-[#ffbf61]/15 rounded-lg px-2.5 py-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#ffbf61] shrink-0" />
            <span className="text-[11px] text-[#ffbf61] font-bold truncate">{t.prize}</span>
          </div>
        </div>

        {t.rules && (
          <p className="text-[10px] text-[#c3c3c0]/50 mb-4 italic border-l-2 border-[#403d39] pl-2">📋 {t.rules}</p>
        )}

        {/* Registration bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-[#c3c3c0]/60 mb-1.5">
            <span>Registration</span>
            <span className={isFull ? 'text-red-400 font-bold' : ''}>{pct}% {isFull ? '— Full' : 'filled'}</span>
          </div>
          <div className="h-2 bg-[#312e2b] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: isFull
                  ? 'linear-gradient(90deg, #ef4444, #f87171)'
                  : `linear-gradient(90deg, #81b64c, #95c660)`,
              }}
            />
          </div>
        </div>

        <a
          href={t.join_link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-black text-sm transition-all ${
            isFull
              ? 'bg-[#312e2b] text-[#c3c3c0] border border-[#403d39] cursor-default'
              : 'bg-[#81b64c] text-black hover:bg-[#95c660] hover:shadow-[0_4px_15px_rgba(129,182,76,0.25)] hover:-translate-y-0.5'
          }`}
        >
          {isFull ? 'Tournament Full' : (<>Join Tournament <ExternalLink className="w-3.5 h-3.5" /></>)}
        </a>
      </div>
    </motion.div>
  );
}

// ── 1v1 Challenge Section ──────────────────────────────────────────────────────
function ChallengeSection({ settings }) {
  const { challenges, addChallenge, updateChallenge, deleteChallenge } = useSiteSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [betAmount, setBetAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [createdChallenge, setCreatedChallenge] = useState(null);
  const [copied, setCopied] = useState(false);
  const [acceptModal, setAcceptModal] = useState(null);
  const [creatorName, setCreatorName] = useState('');
  const [acceptorName, setAcceptorName] = useState('');

  const platformCut = settings.platform_cut_pct ?? 20;
  const presets = settings.challenge_preset_amounts || [20, 50, 100, 200];
  const finalAmount = customAmount ? Number(customAmount) : betAmount;
  const netWin = Math.round(finalAmount * (1 - platformCut / 100) * 2 - finalAmount);
  const platformFee = Math.round(finalAmount * 2 * platformCut / 100);

  // Check if we landed on a challenge link
  const challengeId = searchParams.get('challenge');
  const linkedChallenge = challengeId ? challenges.find(c => c.id === challengeId) : null;

  const handleCreateChallenge = () => {
    if (!creatorName.trim()) { alert('Enter your Chess.com username'); return; }
    if (finalAmount < 10) { alert('Minimum bet is ৳10'); return; }
    const ch = addChallenge({
      creator: creatorName.trim(),
      amount: finalAmount,
      platform_cut: platformCut,
    });
    setCreatedChallenge(ch);
  };

  const handleAccept = (challenge) => {
    setAcceptModal(challenge);
  };

  const confirmAccept = () => {
    if (!acceptorName.trim()) { alert('Enter your Chess.com username'); return; }
    if (acceptorName.trim().toLowerCase() === acceptModal.creator.toLowerCase()) {
      alert("You cannot accept your own challenge!");
      return;
    }
    updateChallenge(acceptModal.id, { status: 'accepted', acceptor: acceptorName.trim(), accepted_at: new Date().toISOString() });
    setAcceptModal(null);
    setAcceptorName('');
    searchParams.delete('challenge');
    setSearchParams(searchParams);
  };

  const copyLink = (id) => {
    const url = `${window.location.origin}/tournaments?challenge=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const openChallenges = challenges.filter(c => c.status === 'open');

  return (
    <div className="mt-14">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-[#ffbf61]/20 to-[#e2136e]/20 rounded-xl flex items-center justify-center border border-[#ffbf61]/20">
          <Swords className="w-5 h-5 text-[#ffbf61]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">1v1 <span className="text-[#ffbf61]">Bet Challenges</span></h2>
          <p className="text-xs text-[#c3c3c0]">Play someone head-to-head and bet · We take {platformCut}% of the prize pool</p>
        </div>
        <span className="ml-auto text-[10px] px-2.5 py-1 bg-[#ffbf61]/10 border border-[#ffbf61]/20 text-[#ffbf61] font-black rounded-full uppercase tracking-wider">Beta</span>
      </div>

      {/* Linked Challenge Banner */}
      {linkedChallenge && linkedChallenge.status === 'open' && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 bg-gradient-to-r from-[#1e3010] to-[#262421] border-2 border-[#81b64c]/60 rounded-2xl shadow-[0_0_30px_rgba(129,182,76,0.12)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#81b64c]/10 rounded-xl flex items-center justify-center border border-[#81b64c]/20">
              <Swords className="w-5 h-5 text-[#81b64c]" />
            </div>
            <div>
              <p className="font-black text-white">Challenge from <span className="text-[#81b64c]">{linkedChallenge.creator}</span>!</p>
              <p className="text-xs text-[#c3c3c0]">Bet amount: <span className="text-[#ffbf61] font-bold">৳{linkedChallenge.amount}</span> · Winner takes ৳{Math.round(linkedChallenge.amount * 2 * (1 - platformCut / 100))}</p>
            </div>
          </div>
          <button
            onClick={() => handleAccept(linkedChallenge)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#81b64c] text-black rounded-xl font-black text-sm hover:bg-[#95c660] transition-all hover:-translate-y-0.5"
          >
            <Swords className="w-4 h-4" /> Accept This Challenge
          </button>
        </motion.div>
      )}

      {linkedChallenge && linkedChallenge.status === 'accepted' && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl text-sm text-green-400 font-semibold">
          ✅ This challenge has already been accepted by <strong>{linkedChallenge.acceptor}</strong>.
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Create Challenge */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#262421] border border-[#403d39] rounded-2xl p-5">
            <h3 className="font-black text-white mb-4 flex items-center gap-2 text-sm">
              <Share2 className="w-4 h-4 text-[#ffbf61]" /> Create Open Challenge
            </h3>

            {/* Preset amounts */}
            <div className="mb-4">
              <label className="text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest block mb-1.5">Your Chess.com Username</label>
              <input type="text" value={creatorName} onChange={e => setCreatorName(e.target.value)} placeholder="e.g. GothamChess" className="w-full px-3 py-2 bg-[#312e2b] border border-[#403d39] text-white text-sm rounded-lg focus:ring-2 focus:ring-[#81b64c] outline-none transition-all placeholder:text-[#555] mb-4" />

              <label className="text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest block mb-2">Choose Bet Amount (৳)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {presets.map(amt => (
                  <button
                    key={amt}
                    onClick={() => { setBetAmount(amt); setCustomAmount(''); }}
                    className={`py-2 rounded-lg text-sm font-black transition-all border ${
                      betAmount === amt && !customAmount
                        ? 'bg-[#ffbf61] text-[#1a1a1a] border-[#ffbf61] shadow-[0_3px_0_rgba(180,140,40,0.5)]'
                        : 'bg-[#312e2b] text-[#c3c3c0] border-[#403d39] hover:border-[#ffbf61]/40 hover:text-white'
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={e => { setCustomAmount(e.target.value); setBetAmount(0); }}
                placeholder="or enter custom amount..."
                min={10}
                className="w-full px-3 py-2 bg-[#312e2b] border border-[#403d39] text-white text-sm rounded-lg focus:ring-2 focus:ring-[#ffbf61] outline-none transition-all placeholder:text-[#555]"
              />
            </div>

            {/* Breakdown */}
            <div className="mb-4 p-3 bg-[#1a1f26] rounded-xl border border-[#2a3340] space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#c3c3c0]">Your bet</span>
                <span className="text-white font-bold">৳{finalAmount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#c3c3c0]">Platform fee ({platformCut}%)</span>
                <span className="text-red-400">−৳{platformFee}</span>
              </div>
              <div className="border-t border-[#2a3340] pt-1.5 flex justify-between text-xs">
                <span className="text-[#c3c3c0] font-bold">If you win, you get</span>
                <span className="text-[#81b64c] font-black text-sm">৳{finalAmount + netWin}</span>
              </div>
            </div>

            {createdChallenge ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#1e3010] border border-[#81b64c]/30 rounded-xl">
                  <p className="text-xs font-black text-[#81b64c] mb-2">✅ Challenge Created! Share this link:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[11px] bg-[#312e2b] px-2 py-1.5 rounded-lg text-white break-all">
                      {window.location.origin}/tournaments?challenge={createdChallenge.id}
                    </code>
                    <button
                      onClick={() => copyLink(createdChallenge.id)}
                      className={`p-2 rounded-lg border transition-all shrink-0 ${copied ? 'bg-[#81b64c] border-[#81b64c] text-black' : 'bg-[#312e2b] border-[#403d39] text-[#c3c3c0] hover:text-white'}`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => { setCreatedChallenge(null); setCustomAmount(''); }}
                  className="w-full py-2 border border-[#403d39] text-[#c3c3c0] rounded-xl text-xs font-bold hover:text-white hover:border-[#555] transition-all"
                >
                  Create Another Challenge
                </button>
              </div>
            ) : (
              <button
                onClick={handleCreateChallenge}
                className="w-full py-3 bg-gradient-to-r from-[#ffbf61] to-[#e6a730] text-black rounded-xl font-black text-sm hover:shadow-[0_4px_15px_rgba(255,191,97,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" /> Generate Challenge Link
              </button>
            )}
          </div>
        </div>

        {/* Right: Open Challenges */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#81b64c] rounded-full animate-pulse" />
            <h3 className="font-black text-white text-sm">Open Challenges</h3>
            <span className="text-xs text-[#c3c3c0] font-bold bg-[#312e2b] border border-[#403d39] px-2 py-0.5 rounded-full">
              {openChallenges.length} waiting
            </span>
          </div>

          {openChallenges.length === 0 ? (
            <div className="bg-[#262421] border border-dashed border-[#403d39] rounded-2xl p-10 text-center">
              <Swords className="w-10 h-10 text-[#333] mx-auto mb-3" />
              <p className="text-[#666] font-bold text-sm">No open challenges yet</p>
              <p className="text-xs text-[#555] mt-1">Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openChallenges.map(ch => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#262421] border border-[#403d39] hover:border-[#ffbf61]/30 rounded-xl p-4 flex items-center justify-between gap-4 group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-[#ffbf61]/10 border border-[#ffbf61]/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Swords className="w-5 h-5 text-[#ffbf61]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-white text-sm truncate">
                        <a
                          href={`https://www.chess.com/member/${ch.creator}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#81b64c] transition-colors"
                        >
                          {ch.creator}
                        </a>
                        <span className="text-[#c3c3c0] font-normal"> challenges anyone</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#ffbf61] font-black text-sm">৳{ch.amount}</span>
                        <span className="text-[10px] text-[#666]">· {formatDistanceToNow(new Date(ch.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyLink(ch.id)}
                      className="p-2 bg-[#312e2b] border border-[#403d39] rounded-lg text-[#c3c3c0] hover:text-white transition-all"
                      title="Copy challenge link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAccept(ch)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#81b64c] text-black rounded-lg font-black text-xs hover:bg-[#95c660] transition-all"
                    >
                      Accept <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteChallenge(ch.id)}
                      className="p-2 bg-[#312e2b] border border-[#403d39] rounded-lg text-[#555] hover:text-red-400 transition-all"
                      title="Cancel challenge"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accept Modal */}
      <AnimatePresence>
        {acceptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setAcceptModal(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-[#1e2228] border border-[#323a44] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-[#81b64c]/10 border border-[#81b64c]/20 rounded-xl flex items-center justify-center">
                  <Swords className="w-6 h-6 text-[#81b64c]" />
                </div>
                <div>
                  <h3 className="font-black text-white">Accept Challenge</h3>
                  <p className="text-xs text-[#c3c3c0]">from <span className="text-[#81b64c]">{acceptModal.creator}</span></p>
                </div>
              </div>

              <div className="bg-[#252b33] border border-[#323a44] rounded-xl p-4 mb-5 space-y-3">
                <div>
                  <label className="text-[10px] font-black text-[#6a7a8e] uppercase tracking-widest block mb-1.5 align-middle">Your Chess.com Username</label>
                  <input type="text" value={acceptorName} onChange={e => setAcceptorName(e.target.value)} placeholder="e.g. Hikaru" className="w-full px-3 py-2 bg-[#1a1f26] border border-[#323a44] text-white text-sm rounded-lg focus:ring-1 focus:ring-[#81b64c] outline-none" />
                </div>
                <div className="border-t border-[#323a44] pt-2 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6a7a8e]">Bet amount</span>
                    <span className="text-white font-bold">৳{acceptModal.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6a7a8e]">Platform cut ({platformCut}%)</span>
                    <span className="text-red-400">−৳{Math.round(acceptModal.amount * 2 * platformCut / 100)}</span>
                  </div>
                  <div className="border-t border-[#323a44] pt-2 flex justify-between">
                    <span className="text-white font-bold text-sm">Winner takes</span>
                    <span className="text-[#81b64c] font-black">৳{Math.round(acceptModal.amount * 2 * (1 - platformCut / 100))}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmAccept}
                  className="flex-1 py-3 bg-[#81b64c] text-black rounded-xl font-black text-sm hover:bg-[#95c660] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!acceptorName.trim()}
                >
                  Confirm & Accept
                </button>
                <button
                  onClick={() => { setAcceptModal(null); setAcceptorName(''); }}
                  className="px-4 py-3 bg-[#252b33] border border-[#323a44] text-[#6a7a8e] rounded-xl font-bold text-sm hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Tournaments() {
  const { tournaments: adminTournaments, settings } = useSiteSettings();
  
  const allTournaments = [
    ...adminTournaments.filter(t => t.published),
  ];

  const upcoming = allTournaments.filter(t => !isPast(new Date(t.date)));
  const past = allTournaments.filter(t => isPast(new Date(t.date)));

  useEffect(() => {
    document.title = 'Tournaments — ChessPremiumBD';
  }, []);

  return (
    <div className="min-h-screen py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">

        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#262421] border border-[#403d39] text-[#c3c3c0] rounded-full text-xs font-black uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5 text-[#ffbf61]" />
            Tournaments
            <span className="ml-1.5 px-2 py-0.5 bg-[#ffbf61]/10 border border-[#ffbf61]/30 text-[#ffbf61] text-[8px] font-black rounded-md tracking-widest uppercase">BETA</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            <span className="text-[#ffbf61]">Chess</span> Tournaments
            <span className="ml-3 inline-flex items-center px-2 py-0.5 bg-[#ffbf61]/20 border border-[#ffbf61]/40 text-[#ffbf61] text-[10px] font-black rounded-lg uppercase tracking-[0.2em] align-middle shadow-[0_0_15px_rgba(255,191,97,0.15)]">BETA</span>
          </h1>
          <p className="text-[#c3c3c0] max-w-md mx-auto mb-5">
            Join exciting tournaments organized for ChessPremiumBD members. Compete, win prizes, and climb the rankings!
          </p>
          <Link to="/purchase" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#81b64c] text-black font-black rounded-xl text-sm hover:bg-[#95c660] transition-all hover:-translate-y-0.5 shadow-[0_4px_0_rgba(104,151,59,0.5)]">
            <Crown className="w-4 h-4" /> Get Diamond to Join
          </Link>
        </motion.div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-[#81b64c] rounded-full animate-pulse" />
              <h2 className="text-lg font-black text-white">Upcoming Tournaments</h2>
              <span className="ml-auto text-xs font-bold bg-[#81b64c]/10 text-[#81b64c] border border-[#81b64c]/20 px-2.5 py-1 rounded-full">
                {upcoming.length} events
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {upcoming.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
            </div>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-[#666]" />
              <h2 className="text-lg font-black text-white">Past Tournaments</h2>
            </div>
            <div className="bg-[#262421] border border-[#403d39] rounded-2xl overflow-hidden">
              {past.map((t, i) => (
                <div key={t.id} className={`flex items-center justify-between p-4 group hover:bg-[#2a2825] transition-colors ${i < past.length - 1 ? 'border-b border-[#403d39]' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#312e2b] rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-[#555]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#c3c3c0] text-sm group-hover:text-white transition-colors">{t.title}</p>
                      <p className="text-xs text-[#555]">{t.game_type} · {format(new Date(t.date), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  <a href={t.join_link} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#81b64c] hover:underline flex items-center gap-1 font-bold shrink-0">
                    Results <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {allTournaments.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-[#666] font-bold">No tournaments yet. Check back soon!</p>
          </div>
        )}

        {/* Diamond Restricted Section (No longer restricted but toggled by admin) */}
        {(settings.show_1v1_section || settings.show_bot_section !== false) && (
          <div className="border-t border-[#403d39] my-10 pt-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              {settings.show_1v1_section && <ChallengeSection settings={settings} />}
              {settings.show_bot_section !== false && <BeatTheBot />}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
