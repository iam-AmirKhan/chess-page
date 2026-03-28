import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, Shield } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PurchaseForm() {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    phone: '',
    plan: 'Yearly',
    paymentMethod: 'Bkash',
    transactionId: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await axios.post(`${API_URL}/buy`, formData);
      setStatus('success');
      setFormData({ name: '', city: '', phone: '', plan: 'Yearly', paymentMethod: 'Bkash', transactionId: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage('Failed to submit. Please try again or contact support.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#262421] p-10 rounded-lg border border-[#81b64c]/30 text-center shadow-2xl">
        <div className="w-20 h-20 bg-[#81b64c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
           <CheckCircle className="w-12 h-12 text-[#81b64c]" />
        </div>
        <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Purchase Submitted!</h3>
        <p className="text-[#c3c3c0] mb-8 text-lg font-medium leading-relaxed">
          Your transaction is currently pending verification. Usually takes <span className="text-[#81b64c]">5-10 minutes</span>.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="px-10 py-4 bg-[#81b64c] text-[#262421] rounded-lg font-black hover:bg-[#95c660] transition-all transform hover:-translate-y-1 shadow-[0_5px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-1 text-lg"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#262421] p-8 lg:p-10 rounded-lg shadow-2xl border border-[#403d39]" id="purchase-form">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-[#81b64c] rounded-full"></div>
        <h3 className="text-3xl font-black text-white tracking-tight">Purchase Portal</h3>
      </div>

      {status === 'error' && (
        <div className="mb-8 p-5 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#c3c3c0] uppercase tracking-widest text-[10px]">Full Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} 
                   className="w-full px-5 py-4 rounded-lg bg-[#312e2b] border border-[#403d39] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all placeholder:text-[#c3c3c0]/40 font-medium" 
                   placeholder="e.g. Rahim S." />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#c3c3c0] uppercase tracking-widest text-[10px]">Current City</label>
            <input required type="text" name="city" value={formData.city} onChange={handleChange} 
                   className="w-full px-5 py-4 rounded-lg bg-[#312e2b] border border-[#403d39] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all placeholder:text-[#c3c3c0]/40 font-medium" 
                   placeholder="e.g. Dhaka" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#c3c3c0] uppercase tracking-widest text-[10px]">Active Mobile Number</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                 className="w-full px-5 py-4 rounded-lg bg-[#312e2b] border border-[#403d39] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all placeholder:text-[#c3c3c0]/40 font-medium" 
                 placeholder="017XXXXXXXX" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#c3c3c0] uppercase tracking-widest text-[10px]">Selected Plan</label>
            <select name="plan" value={formData.plan} onChange={handleChange} 
                    className="w-full px-5 py-4 rounded-lg bg-[#312e2b] border border-[#403d39] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all font-bold appearance-none cursor-pointer">
              <option value="Yearly">Gold Premium (Yearly)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#c3c3c0] uppercase tracking-widest text-[10px]">Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} 
                    className="w-full px-5 py-4 rounded-lg bg-[#312e2b] border border-[#403d39] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all font-bold appearance-none cursor-pointer">
              <option value="Bkash">Bkash</option>
              <option value="Nagad">Nagad</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
           <label className="block text-sm font-bold text-[#c3c3c0] uppercase tracking-widest text-[10px]">Mobile Banking Transaction ID</label>
           <input required type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} 
                  className="w-full px-5 py-4 rounded-lg bg-[#312e2b] border border-[#403d39] text-white focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all font-mono uppercase font-bold placeholder:text-[#c3c3c0]/40" 
                  placeholder="Enter TrxID" />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full py-5 rounded-lg font-black text-[#262421] bg-[#81b64c] hover:bg-[#95c660] transition-all transform hover:-translate-y-1 shadow-[0_5px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-1 flex justify-center items-center text-xl uppercase tracking-tighter"
          >
            {status === 'submitting' ? <Loader2 className="w-8 h-8 animate-spin" /> : "Verify & Complete Order"}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[#c3c3c0] text-xs font-bold uppercase tracking-widest pt-2">
           <Shield className="w-4 h-4" />
           Encrypted Secure Transaction
        </div>
      </form>
    </div>
  );
}
