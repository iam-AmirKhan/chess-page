// src/components/BeatTheBot.jsx
// "Beat the Admin" chess challenge — play against a ~1550 ELO bot
// Uses chess.js for game logic + react-chessboard for the board UI
// Engine: rule-based AI with material + positional evaluation (no WASM needed)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, RefreshCw, Trophy, Swords, Crown, X, Zap } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Link } from 'react-router-dom';

// ── Simple engine: minimax depth-2 with material + piece-square tables ──────
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Piece-square tables for positional play (from black's perspective)
const PST = {
  p: [
    0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0,
  ],
  n: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
  ],
  b: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
  ],
  r: [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0,
  ],
  q: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
     0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20,
  ],
  k: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20,
  ],
};

function squareIndex(sq) {
  const file = sq.charCodeAt(0) - 97;
  const rank = 8 - parseInt(sq[1]);
  return rank * 8 + file;
}

function evalBoard(chess) {
  if (chess.isCheckmate()) return chess.turn() === 'b' ? Infinity : -Infinity;
  if (chess.isDraw()) return 0;

  let score = 0;
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = board[r][c];
      if (!sq) continue;
      const pst = PST[sq.type] || [];
      const pstIdx = sq.color === 'b' ? r * 8 + c : (7 - r) * 8 + c;
      const pieceVal = PIECE_VALUES[sq.type] + (pst[pstIdx] || 0);
      score += sq.color === 'b' ? pieceVal : -pieceVal;
    }
  }
  return score;
}

function minimax(chess, depth, alpha, beta, isMax) {
  if (depth === 0 || chess.isGameOver()) return evalBoard(chess);
  const moves = chess.moves();
  if (isMax) {
    let best = -Infinity;
    for (const m of moves) {
      chess.move(m);
      best = Math.max(best, minimax(chess, depth - 1, alpha, beta, false));
      chess.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      chess.move(m);
      best = Math.min(best, minimax(chess, depth - 1, alpha, beta, true));
      chess.undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

// Add ~1550 randomness: pick best move or a random suboptimal move ~30% of time
function getBotMove(chess) {
  const moves = chess.moves();
  if (moves.length === 0) return null;

  // Random blunder chance (simulates ~1550 elo)
  if (Math.random() < 0.30) {
    const randomIdx = Math.floor(Math.random() * moves.length);
    return moves[randomIdx];
  }

  let bestMove = null;
  let bestScore = -Infinity;
  for (const m of moves) {
    chess.move(m);
    const score = -minimax(chess, 2, -Infinity, Infinity, false);
    chess.undo();
    if (score > bestScore) {
      bestScore = score;
      bestMove = m;
    }
  }
  return bestMove;
}

// ── Win Modal ──────────────────────────────────────────────────────────────
function WinModal({ discountCode, onClose, onReset }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="bg-[#1e2228] border border-[#81b64c]/40 rounded-2xl p-8 max-w-sm w-full shadow-[0_0_60px_rgba(129,182,76,0.2)] text-center relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="w-20 h-20 bg-[#81b64c]/10 border-2 border-[#81b64c]/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <Trophy className="w-10 h-10 text-[#81b64c]" />
        </div>
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-black text-white mb-1">You Beat the Bot!</h2>
        <p className="text-[#c3c3c0] text-sm mb-6">
          Impressive! You've defeated our ~1550 ELO bot. Here's your exclusive discount:
        </p>

        <div className="bg-[#252b33] border-2 border-[#81b64c]/40 rounded-xl p-4 mb-5">
          <p className="text-[10px] font-black text-[#81b64c] uppercase tracking-widest mb-2">Your Discount Code</p>
          <div className="flex items-center justify-between gap-3">
            <code className="text-2xl font-black text-white tracking-widest">{discountCode}</code>
            <button onClick={copy}
              className={`p-2 rounded-lg border transition-all ${copied ? 'bg-[#81b64c] border-[#81b64c] text-black' : 'bg-[#1a1f26] border-[#323a44] text-[#c3c3c0] hover:text-white'}`}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-[#555] mt-2">Use this code on the purchase page</p>
        </div>

        <div className="flex gap-3">
          <Link to="/purchase"
            className="flex-1 py-3 bg-[#81b64c] text-black rounded-xl font-black text-sm hover:bg-[#95c660] transition-all">
            Claim Discount
          </Link>
          <button onClick={() => { onReset(); onClose(); }}
            className="px-4 py-3 bg-[#252b33] border border-[#323a44] text-[#c3c3c0] rounded-xl text-sm font-bold hover:text-white transition-all">
            Play Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Lose Modal ─────────────────────────────────────────────────────────────
function LoseModal({ onClose, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        className="bg-[#1e2228] border border-red-500/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="text-5xl mb-4">♟️</div>
        <h2 className="text-2xl font-black text-white mb-1">The Bot Wins!</h2>
        <p className="text-[#c3c3c0] text-sm mb-6">Don't give up — you can try again! Beat the bot to unlock your discount.</p>
        <button onClick={() => { onReset(); onClose(); }}
          className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-black hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Beat The Bot Component ────────────────────────────────────────────
export default function BeatTheBot() {
  const { settings } = useSiteSettings();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState('start');
  const [gameOver, setGameOver] = useState(null); // null | 'win' | 'lose' | 'draw'
  const [showModal, setShowModal] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [capturedByPlayer, setCapturedByPlayer] = useState([]);
  const [capturedByBot, setCapturedByBot] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const thinking_timer = useRef(null);

  const discountCode = settings.bot_discount_code || 'BEATTHEBOT10';

  const resetGame = useCallback(() => {
    if (thinking_timer.current) clearTimeout(thinking_timer.current);
    const g = new Chess();
    setGame(g);
    setFen(g.fen());
    setGameOver(null);
    setShowModal(false);
    setThinking(false);
    setCapturedByPlayer([]);
    setCapturedByBot([]);
    setMoveCount(0);
  }, []);

  const checkGameOver = useCallback((g) => {
    if (g.isCheckmate()) {
      const winner = g.turn() === 'b' ? 'win' : 'lose'; // human=white, bot=black
      setGameOver(winner);
      setShowModal(true);
      return true;
    }
    if (g.isDraw() || g.isStalemate() || g.isThreefoldRepetition()) {
      setGameOver('draw');
      setShowModal(true);
      return true;
    }
    return false;
  }, []);

  const onDrop = useCallback((srcSq, tgtSq) => {
    if (thinking || gameOver) return false;

    try {
      const g = new Chess(game.fen());
      const move = g.move({
        from: srcSq,
        to: tgtSq,
        promotion: 'q' // always promote to queen for simplicity
      });

      if (move === null) return false;

      // Track captures
      if (move.captured) {
        setCapturedByPlayer(prev => [...prev, move.captured]);
      }

      // Update state
      setGame(g);
      setFen(g.fen());
      setMoveCount(c => c + 1);
      
      // Check if user won
      if (checkGameOver(g)) return true;

      // Bot's turn
      setThinking(true);
      thinking_timer.current = setTimeout(() => {
        const g2 = new Chess(g.fen());
        const botMove = getBotMove(g2);
        
        if (botMove) {
          const m2 = g2.move(botMove);
          if (m2?.captured) {
            setCapturedByBot(prev => [...prev, m2.captured]);
          }
          setGame(g2);
          setFen(g2.fen());
          setMoveCount(c => c + 1);
          checkGameOver(g2);
        }
        setThinking(false);
      }, 600 + Math.random() * 400);

      return true;
    } catch (e) {
      console.error("Move error:", e);
      return false;
    }
  }, [game, thinking, gameOver, checkGameOver]);

  useEffect(() => () => { if (thinking_timer.current) clearTimeout(thinking_timer.current); }, []);

  const pieceEmoji = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' };

  return (
    <div className="mt-14">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-[#ffbf61]/20 to-[#81b64c]/20 border border-[#ffbf61]/20 rounded-xl flex items-center justify-center">
          <Swords className="w-5 h-5 text-[#ffbf61]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Beat the <span className="text-[#ffbf61]">Admin Bot</span>
            <span className="text-[10px] px-2 py-0.5 bg-[#ffbf61]/10 border border-[#ffbf61]/20 text-[#ffbf61] font-black rounded-full uppercase tracking-wider">BETA</span>
          </h2>
          <p className="text-xs text-[#c3c3c0]">
            Win against our ~1550 ELO bot → Unlock discount code <code className="text-[#81b64c] font-mono">{discountCode}</code>
          </p>
        </div>
        <button onClick={resetGame}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-[#262421] border border-[#403d39] text-[#c3c3c0] hover:text-white rounded-lg text-xs font-bold transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> New Game
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Board */}
        <div className="lg:col-span-3">
          <div className="relative">
            {/* Thinking overlay */}
            {thinking && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm pointer-events-none">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1e2228]/90 rounded-full border border-[#403d39] text-xs font-bold text-[#c3c3c0]">
                  <div className="w-3 h-3 border-2 border-[#81b64c] border-t-transparent rounded-full animate-spin" />
                  Bot is thinking...
                </div>
              </div>
            )}
            <div className="rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <Chessboard
                id="beat-the-bot"
                position={fen}
                onPieceDrop={onDrop}
                boardOrientation="white"
                customBoardStyle={{ borderRadius: '12px' }}
                customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
                areArrowsAllowed
              />
            </div>
          </div>

          {/* Captured pieces */}
          <div className="mt-3 flex justify-between text-sm text-[#c3c3c0]">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">You captured:</span>
              {capturedByPlayer.length === 0 ? <span className="text-[#555] text-xs">nothing yet</span>
                : capturedByPlayer.map((p, i) => <span key={i} className="text-base">{pieceEmoji[p] || '♙'}</span>)}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">Bot captured:</span>
              {capturedByBot.length === 0 ? <span className="text-[#555] text-xs">nothing yet</span>
                : capturedByBot.map((p, i) => <span key={i} className="text-base">{pieceEmoji[p] || '♟'}</span>)}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status card */}
          <div className="bg-[#262421] border border-[#403d39] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${thinking ? 'bg-amber-400 animate-pulse' : gameOver ? 'bg-red-400' : 'bg-[#81b64c] animate-pulse'}`} />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  {thinking ? 'Bot Thinking' : gameOver ? 'Game Over' : 'In Progress'}
                </span>
              </div>
              <span className="text-xs text-[#555] font-bold">Move {moveCount}</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-[#312e2b] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-white rounded border-2 border-[#403d39] flex items-center justify-center">
                    <span className="text-[#1a1a1a] font-black text-xs">♔</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">You (White)</p>
                    <p className="text-[10px] text-[#555]">Human player</p>
                  </div>
                </div>
                {!thinking && !gameOver && game.turn() === 'w' && (
                  <span className="text-[10px] text-[#81b64c] font-black bg-[#81b64c]/10 border border-[#81b64c]/20 px-2 py-0.5 rounded-full">Your turn</span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-[#312e2b] rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-[#1a1a1a] rounded border-2 border-[#403d39] flex items-center justify-center">
                    <span className="text-white font-black text-xs">♚</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Admin Bot (Black)</p>
                    <p className="text-[10px] text-[#555]">~1550 ELO</p>
                  </div>
                </div>
                {thinking && (
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* Reward card */}
          <div className="bg-gradient-to-br from-[#1e3010] to-[#1e2228] border border-[#81b64c]/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-[#ffbf61]" />
              <p className="text-xs font-black text-white uppercase tracking-wider">Win Reward</p>
            </div>
            <p className="text-sm text-[#c3c3c0] mb-3">Beat the bot on any move to unlock your exclusive discount code for Diamond membership.</p>
            <div className="flex items-center gap-2 p-2.5 bg-[#1a1a1a] rounded-lg border border-[#81b64c]/20">
              <Zap className="w-4 h-4 text-[#81b64c] shrink-0" />
              <div>
                <p className="text-[10px] text-[#555]">Unlock code</p>
                <code className="text-sm font-black text-[#81b64c]">{discountCode}</code>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#262421] border border-[#403d39] rounded-xl p-4">
            <p className="text-[10px] font-black text-[#c3c3c0] uppercase tracking-widest mb-2.5">Tips</p>
            <ul className="space-y-1.5 text-xs text-[#c3c3c0]">
              <li className="flex items-start gap-1.5"><span className="text-[#81b64c] mt-0.5">•</span> You play White, bot plays Black</li>
              <li className="flex items-start gap-1.5"><span className="text-[#81b64c] mt-0.5">•</span> Bot plays at ~1550 ELO — beatable but challenging!</li>
              <li className="flex items-start gap-1.5"><span className="text-[#81b64c] mt-0.5">•</span> Control the center early (e4, d4)</li>
              <li className="flex items-start gap-1.5"><span className="text-[#81b64c] mt-0.5">•</span> Develop your knights and bishops first</li>
              <li className="flex items-start gap-1.5"><span className="text-[#81b64c] mt-0.5">•</span> Castle early for king safety</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && gameOver === 'win' && (
          <WinModal discountCode={discountCode} onClose={() => setShowModal(false)} onReset={resetGame} />
        )}
        {showModal && gameOver === 'lose' && (
          <LoseModal onClose={() => setShowModal(false)} onReset={resetGame} />
        )}
        {showModal && gameOver === 'draw' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              className="bg-[#1e2228] border border-amber-500/30 rounded-2xl p-8 max-w-sm w-full text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h2 className="text-xl font-black text-white mb-2">It's a Draw!</h2>
              <p className="text-[#c3c3c0] text-sm mb-5">Close match! You need to WIN to unlock the discount code.</p>
              <button onClick={() => { resetGame(); }} className="w-full py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl font-black hover:bg-amber-500/20 transition-all">
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
