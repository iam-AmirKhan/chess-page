import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Crown, ShieldCheck, Zap, Bell, ChevronRight, MessageSquare } from 'lucide-react';
import PurchaseForm from '../components/PurchaseForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [buyers, setBuyers] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCity, setNotificationCity] = useState('');

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/approved-buyers`);
        setBuyers(data);
      } catch (error) {
        console.error('Error fetching buyers', error);
      }
    };
    fetchBuyers();

    const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
    const notifInterval = setInterval(() => {
      setNotificationCity(cities[Math.floor(Math.random() * cities.length)]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 20000);

    return () => clearInterval(notifInterval);
  }, []);

  const scrollToForm = () => {
    document.getElementById('purchase-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#312e2b] text-white font-sans selection:bg-[#81b64c] selection:text-[#262421]">
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://api.whatsapp.com/send?phone=8801312027483&text=Hi%2C%20I%20want%20to%20buy%20your%20chess%20premium%20plan.%20Can%20you%20guide%20me%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-10 z-50 bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold transition-all transform hover:-translate-y-2 group active:scale-95"
      >
        <MessageSquare className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline">Chat with us</span>
      </a>

      {/* Dynamic Pop-up Notification */}
      {showNotification && (
        <div className="fixed bottom-28 right-10 bg-[#262421] border border-[#403d39] shadow-2xl p-4 flex items-center gap-4 z-40 w-72 rounded pointer-events-none animate-fade-in transition-all">
          <div className="w-10 h-10 bg-[#312e2b] text-[#81b64c] rounded-full flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">New Upgrade!</p>
            <p className="text-xs text-[#c3c3c0]">Someone from {notificationCity} just bought Premium.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#262421] border-b border-[#403d39] sticky top-0 z-40 h-16 flex items-center shadow-sm">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white cursor-default">
            <Crown className="w-7 h-7 text-[#81b64c] fill-current" />
            <span>ChessPlus</span>
          </div>
          <a href="/admin" className="text-sm font-bold text-[#c3c3c0] hover:text-white transition-colors duration-200">Admin Login</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-8 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4d3a24] text-[#ffbf61] rounded text-sm font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-current" />
            Special: 40% Off Yearly Premium
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1]">
            Elevate your game with <span className="text-[#81b64c]">Premium.</span>
          </h1>
          <p className="text-xl text-[#c3c3c0] font-medium leading-relaxed">
            Unlock infinite engine analysis, limitless tactics, and high-quality course videos. Join hundreds of players advancing their rating today on our shared platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={scrollToForm}
              className="px-8 py-5 rounded-lg font-extrabold text-[#262421] bg-[#81b64c] hover:bg-[#95c660] transition-all transform hover:-translate-y-0.5 shadow-[0_5px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-1 text-xl flex justify-center items-center gap-2 group"
            >
              Get Premium Now
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center gap-6 pt-4 text-sm font-bold text-[#c3c3c0]">
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#81b64c]" /> Safe & Secure Payments (Bkash/Nagad)</div>
          </div>
        </div>

        {/* Pricing & Instructions */}
        <div className="w-full max-w-md bg-[#262421] p-8 rounded-lg border border-[#403d39] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#81b64c]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#81b64c]/10 transition-colors"></div>
          
          <div className="mb-8 relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Yearly Membership</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-[#81b64c] tracking-tighter">৳899</span>
              <span className="text-[#c3c3c0] line-through text-xl font-bold">৳1499</span>
            </div>
            <p className="text-[#c3c3c0] text-sm mt-3 font-medium">Billed securely via mobile banking. Lifetime access included.</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-lg bg-[#312e2b] border border-[#403d39] flex items-center gap-4 hover:border-[#81b64c]/30 transition-colors">
              <div className="w-12 h-12 rounded bg-[#e2136e] text-white flex items-center justify-center font-bold text-xl shadow-inner">B</div>
              <div>
                <p className="text-xs font-bold text-[#c3c3c0] uppercase">Bkash Personal</p>
                <p className="font-mono font-bold text-xl text-white tracking-widest">01700-123456</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#312e2b] border border-[#403d39] flex items-center gap-4 hover:border-[#81b64c]/30 transition-colors">
              <div className="w-12 h-12 rounded bg-[#ed1c24] text-white flex items-center justify-center font-bold text-xl shadow-inner">N</div>
              <div>
                <p className="text-xs font-bold text-[#c3c3c0] uppercase">Nagad Personal</p>
                <p className="font-mono font-bold text-xl text-white tracking-widest">01900-654321</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Form Row */}
      <section className="bg-[#262421] border-t border-[#403d39] py-16">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Recent Members Feed */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
               Recent Members
               <span className="text-xs bg-[#312e2b] text-[#81b64c] px-2 py-1 rounded-full uppercase border border-[#403d39]">Live</span>
            </h2>
            <div className="space-y-3">
              {buyers.length === 0 ? (
                <div className="p-10 text-center text-[#c3c3c0] bg-[#312e2b] rounded-lg border border-dashed border-[#403d39]">
                  <p className="font-medium">Waiting for the next grandmaster...</p>
                </div>
              ) : (
                buyers.map((buyer) => (
                  <div key={buyer._id} className="flex items-center justify-between p-5 bg-[#312e2b] rounded-lg border border-[#403d39] hover:bg-[#383531] hover:border-[#81b64c]/40 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#262421] text-[#c3c3c0] font-bold rounded flex items-center justify-center border border-[#403d39] group-hover:text-[#81b64c] group-hover:border-[#81b64c]/50 transition-colors">
                        {buyer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#81b64c] transition-colors">{maskName(buyer.name)}</p>
                        <p className="text-xs font-semibold text-[#c3c3c0]">{buyer.city}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#81b64c]">💎 Premium</p>
                      <p className="text-[10px] font-bold text-[#c3c3c0] uppercase tracking-wider mt-1">
                        {formatDistanceToNow(new Date(buyer.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div id="purchase-form-container">
            <PurchaseForm />
          </div>

        </div>
      </section>

      <footer className="py-12 text-center text-[#c3c3c0] text-sm border-t border-[#403d39] min-h-[120px] bg-[#312e2b] flex flex-col items-center justify-center gap-2">
        <p className="font-bold">&copy; {new Date().getFullYear()} ChessPlus Premium. All rights reserved.</p>
        <p className="text-xs font-medium uppercase tracking-[0.2em]">Play like a Grandmaster.</p>
      </footer>
    </div>
  );
}

function maskName(fullName) {
  if (!fullName) return 'User';
  const parts = fullName.split(' ');
  if (parts.length > 1) {
    return `${parts[0]} ${parts[1].charAt(0)}.`;
  }
  return parts[0];
}
