// src/context/SiteSettingsContext.jsx
// Global site settings stored in localStorage — admin can change from dashboard
import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'chess_site_settings';
const VISIBILITY_KEY = 'chess_visibility';
const TOURNAMENTS_KEY = 'chess_tournaments';
const CHALLENGES_KEY = 'chess_challenges';

const DEFAULT_SETTINGS = {
  bkash_number: '01XXXXXXXXX',
  nagad_number: '01XXXXXXXXX',
  rocket_number: '01XXXXXXXXX',
  show_bkash: true,
  show_nagad: true,
  show_rocket: true,
  price: 1499,
  original_price: 2499,
  coupon_code: 'CHESS1000',
  coupon_discount: 1000,
  site_name: 'ChessPremiumBD',
  whatsapp_number: '8801XXXXXXXXX',
  whatsapp_link: 'https://wa.link/4l5rr7',
  facebook_page: 'https://www.facebook.com/chesspremiumbd',
  messenger_group: 'https://m.me/j/AbYDUMMYMESSENGERGROUPLINK',
  show_1v1_section: true,
  platform_cut_pct: 20,
  challenge_preset_amounts: [20, 50, 100, 200],
  // New feature toggles
  show_bot_section: true,
  bot_discount_code: 'BEATTHEBOT10',
  show_toaster: true,
  toaster_message: 'Someone from {city} just got Diamond! 🎉',
  show_sponsor: false,
};

const DEFAULT_VISIBILITY = {
  show_total_count: true,
  show_name: true,
  show_chess_username: true,
  show_phone: false,
  show_email: false,
  show_purchase_date: true,
  show_expiry_date: true,
  show_district: true,
};

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { ...DEFAULT_SETTINGS, ...stored };
    } catch { return DEFAULT_SETTINGS; }
  });

  const [visibility, setVisibility] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(VISIBILITY_KEY) || '{}');
      return { ...DEFAULT_VISIBILITY, ...stored };
    } catch { return DEFAULT_VISIBILITY; }
  });

  const [tournaments, setTournaments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(TOURNAMENTS_KEY) || '[]');
    } catch { return []; }
  });

  const [challenges, setChallenges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CHALLENGES_KEY) || '[]');
    } catch { return []; }
  });

  const updateSettings = (patch) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateVisibility = (patch) => {
    setVisibility(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem(VISIBILITY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addTournament = (tournament) => {
    const newT = { ...tournament, id: 't_' + Date.now(), created_at: new Date().toISOString() };
    setTournaments(prev => {
      const next = [newT, ...prev];
      localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateTournament = (id, patch) => {
    setTournaments(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...patch } : t);
      localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteTournament = (id) => {
    setTournaments(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addChallenge = (challenge) => {
    const newC = {
      ...challenge,
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      created_at: new Date().toISOString(),
      status: 'open', // open | accepted | cancelled
    };
    setChallenges(prev => {
      const next = [newC, ...prev];
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(next));
      return next;
    });
    return newC;
  };

  const updateChallenge = (id, patch) => {
    setChallenges(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...patch } : c);
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteChallenge = (id) => {
    setChallenges(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <SiteSettingsContext.Provider value={{
      settings, updateSettings,
      visibility, updateVisibility,
      tournaments, addTournament, updateTournament, deleteTournament,
      challenges, addChallenge, updateChallenge, deleteChallenge,
    }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
