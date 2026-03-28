import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Check, X, LogIn, RefreshCcw, LayoutDashboard, Search } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Access Denied: Incorrect Password');
    }
  };

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/buyers`);
      setBuyers(data);
    } catch (error) {
      console.error('Error fetching buyers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBuyers();
    }
  }, [isAuthenticated]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/buyers/${id}`, { status });
      setBuyers((prev) => prev.map(b => b._id === id ? { ...b, status } : b));
    } catch (error) {
      alert('Operation failed');
    }
  };

  const deleteBuyer = async (id) => {
    if (!window.confirm("Confirm deletion of this record?")) return;
    try {
      await axios.delete(`${API_URL}/buyers/${id}`);
      setBuyers((prev) => prev.filter(b => b._id !== id));
    } catch (error) {
      alert('Deletion failed');
    }
  };

  const filteredBuyers = buyers.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#312e2b] flex items-center justify-center p-6 text-white">
        <form onSubmit={handleLogin} className="bg-[#262421] p-10 rounded-lg border border-[#403d39] w-full max-w-sm shadow-2xl space-y-8 animate-fade-in transition-all">
          <div className="w-20 h-20 bg-[#312e2b] text-[#81b64c] rounded-lg flex items-center justify-center mx-auto border border-[#403d39] shadow-inner">
            <LogIn className="w-10 h-10" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Admin Login</h2>
            <p className="text-[#c3c3c0] text-xs font-bold uppercase tracking-widest">ChessPlus Premium Management</p>
          </div>
          <div className="space-y-4">
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                className="w-full px-5 py-4 rounded-lg bg-[#312e2b] border border-[#403d39] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all font-bold placeholder:text-[#c3c3c0]/30"
            />
            <button type="submit" className="w-full py-4 bg-[#81b64c] rounded-lg text-[#262421] font-black hover:bg-[#95c660] transition-all transform hover:-translate-y-1 shadow-[0_5px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-1 text-lg">
                Enter Dashboard
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#312e2b] p-6 lg:p-12 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-fade-in">
        
        {/* Header Stats / Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#262421] p-8 rounded-lg border border-[#403d39] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#81b64c]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#81b64c]/10 transition-colors"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-[#312e2b] rounded-lg border border-[#403d39] text-[#81b64c]">
               <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-4xl font-black tracking-tight text-white text-left">Dashboard</h1>
                <p className="text-[#c3c3c0] font-bold text-xs uppercase tracking-widest mt-1">Manage {buyers.length} total orders</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            <div className="relative w-full sm:w-64 text-left">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c3c3c0]" />
                <input 
                    type="text" 
                    placeholder="Search by name or TrxID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#312e2b] border border-[#403d39] rounded-lg text-sm text-white focus:ring-2 focus:ring-[#81b64c] outline-none transition-all placeholder:text-[#c3c3c0]/40 font-bold"
                />
            </div>
            <button onClick={fetchBuyers} className="flex items-center gap-2 px-6 py-3 bg-[#312e2b] text-[#c3c3c0] border border-[#403d39] font-black rounded-lg hover:text-[#81b64c] hover:border-[#81b64c]/50 transition-all group">
                <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#262421] rounded-lg border border-[#403d39] shadow-2xl overflow-hidden animate-slide-up">
          <div className="overflow-x-auto text-left">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#2a2825] border-b border-[#403d39] uppercase tracking-widest text-[#c3c3c0] font-bold text-[10px]">
                <tr>
                  <th className="p-5">Order Date</th>
                  <th className="p-5">Member / City</th>
                  <th className="p-5">Mobile</th>
                  <th className="p-5">Payment / TrxID</th>
                  <th className="p-5">Verification</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#403d39] font-medium bg-[#262421]">
                {filteredBuyers.map((buyer) => (
                  <tr key={buyer._id} className="hover:bg-[#312e2b] group transition-all duration-150">
                    <td className="p-5 text-[#c3c3c0] font-bold">
                      {format(new Date(buyer.createdAt), 'MMM dd, HH:mm')}
                    </td>
                    <td className="p-5">
                      <div className="font-black text-white text-base group-hover:text-[#81b64c] transition-colors">{buyer.name}</div>
                      <div className="text-[#c3c3c0] text-xs uppercase tracking-tighter mt-1">{buyer.city}</div>
                    </td>
                    <td className="p-5">
                      <div className="font-mono text-white font-black text-xs px-2 py-1 bg-[#312e2b] rounded border border-[#403d39] inline-block tracking-tighter">{buyer.phone}</div>
                    </td>
                    <td className="p-5">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-white font-black text-[10px] mb-2 uppercase tracking-tight shadow-sm ${
                        buyer.paymentMethod === 'Bkash' ? 'bg-[#e2136e]' : 'bg-[#ed1c24]'
                      }`}>
                        {buyer.paymentMethod}
                      </div>
                      <div className="font-mono text-xs text-[#c3c3c0] font-bold tracking-widest">{buyer.transactionId}</div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all ${
                        buyer.status === 'approved' ? 'bg-[#314a22]/20 text-[#81b64c] border-[#81b64c]/30' :
                        buyer.status === 'rejected' ? 'bg-[#5a2a2a]/20 text-[#ff6b6b] border-[#ff6b6b]/30' :
                        'bg-[#4f3d1b]/20 text-[#dcae3d] border-[#dcae3d]/30'
                      }`}>
                        {buyer.status}
                      </span>
                    </td>
                    <td className="p-5 space-x-3 text-right">
                      {buyer.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(buyer._id, 'approved')} className="p-2.5 bg-[#2a3c1c] text-[#81b64c] rounded-lg border border-[#81b64c]/20 hover:bg-[#81b64c] hover:text-[#262421] transition-all transform hover:scale-110 active:scale-95" title="Approve Upgrade">
                            <Check className="w-5 h-5 stroke-[3px]" />
                          </button>
                          <button onClick={() => updateStatus(buyer._id, 'rejected')} className="p-2.5 bg-[#4a1c1c] text-[#ff6b6b] rounded-lg border border-[#ff6b6b]/20 hover:bg-[#ff6b6b] hover:text-white transition-all transform hover:scale-110 active:scale-95" title="Reject Payment">
                            <X className="w-5 h-5 stroke-[3px]" />
                          </button>
                        </>
                      )}
                      <button onClick={() => deleteBuyer(buyer._id)} className="p-2.5 bg-[#312e2b] text-[#c3c3c0] border border-[#403d39] rounded-lg hover:bg-red-500 hover:text-white hover:border-red-600 transition-all transform hover:scale-110 active:scale-95" title="Discard Order">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBuyers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-16 text-center text-[#c3c3c0] font-black uppercase tracking-[0.2em] bg-[#312e2b]/50">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
