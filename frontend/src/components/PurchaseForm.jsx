// src/components/PurchaseForm.jsx
import React, { useState, useRef } from 'react';
import { Loader2, CheckCircle, Shield, Upload, X, Crown, Tag, MessageCircle, Zap, MapPin, Copy, Check } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const BD_DISTRICTS = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria',
  'Chandpur', 'Chapai Nawabganj', 'Chattogram', 'Chuadanga', 'Cox\'s Bazar', 'Cumilla',
  'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj',
  'Habiganj', 'Jamalpur', 'Jashore', 'Jhalokathi', 'Jhenaidah', 'Joypurhat',
  'Khagrachari', 'Khulna', 'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur',
  'Lalmonirhat', 'Madaripur', 'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar',
  'Munshiganj', 'Mymensingh', 'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi',
  'Natore', 'Netrokona', 'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali',
  'Pirojpur', 'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur',
  'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon',
];

const MFS_OPTIONS = [
  {
    id: 'bkash',
    label: 'bKash',
    recommended: true,
    color: '#e2136e',
    bg: 'bg-[#e2136e]/10',
    border: 'border-[#e2136e]/30',
    borderActive: 'border-[#e2136e]',
    ring: 'ring-[#e2136e]/40',
    numberKey: 'bkash_number',
    showKey: 'show_bkash',
    logo: (
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 p-1 shadow-sm overflow-hidden border border-white/5">
        <img src="/mfs/bkash.svg" alt="bKash" className="w-full h-full object-contain" />
      </div>
    ),
  },
  {
    id: 'nagad',
    label: 'Nagad',
    recommended: false,
    color: '#f6821f',
    bg: 'bg-[#f6821f]/10',
    border: 'border-[#f6821f]/30',
    borderActive: 'border-[#f6821f]',
    ring: 'ring-[#f6821f]/40',
    numberKey: 'nagad_number',
    showKey: 'show_nagad',
    logo: (
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 p-1 shadow-sm overflow-hidden border border-white/5">
        <img src="/mfs/nagad.svg" alt="Nagad" className="w-full h-full object-contain" />
      </div>
    ),
  },
  {
    id: 'rocket',
    label: 'Rocket',
    recommended: false,
    color: '#8B4EAB',
    bg: 'bg-[#8B4EAB]/10',
    border: 'border-[#8B4EAB]/30',
    borderActive: 'border-[#8B4EAB]',
    ring: 'ring-[#8B4EAB]/40',
    numberKey: 'rocket_number',
    showKey: 'show_rocket',
    logo: (
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 p-1 shadow-sm overflow-hidden border border-white/5">
        <img src="/mfs/rocket.png" alt="Rocket" className="w-full h-full object-contain" />
      </div>
    ),
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={handleCopy}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${copied
        ? 'bg-[#81b64c] border-[#81b64c] text-black'
        : 'bg-[#1a1a1a]/40 border-[#403d39] text-[#c3c3c0] hover:text-white hover:border-[#555]'
        }`}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function Field({ label, required = true, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#c3c3c0] uppercase tracking-wider">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {!required && <span className="text-[#666] normal-case font-normal tracking-normal ml-1">(optional)</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#c3c3c0]/60">{hint}</p>}
      {error && <p className="text-[11px] text-red-400 font-semibold">{error}</p>}
    </div>
  );
}

const INPUT = `w-full px-4 py-3 rounded-lg bg-[#312e2b] border border-[#403d39] text-white text-sm focus:ring-2 focus:ring-[#81b64c] focus:border-transparent outline-none transition-all placeholder:text-[#666]`;
const INPUT_ERR = `w-full px-4 py-3 rounded-lg bg-[#312e2b] border border-red-500/50 text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-[#666] ring-1 ring-red-500/20`;

const INITIAL = { name: '', chess_username: '', email: '', mobile: '', trx_id: '', notes: '', district: '', payment_method: 'bkash' };

export default function PurchaseForm() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState(INITIAL);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const price = settings.price;
  const originalPrice = settings.original_price;
  const couponCode = settings.coupon_code;
  const couponDiscount = settings.coupon_discount;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=Hi%2C%20I%20completed%20payment%20of%20৳${price}%20for%20Chess.com%20Diamond.`;

  // Filter MFS options to only those enabled in settings
  const availableMFS = MFS_OPTIONS.filter(m => settings[m.showKey] !== false);

  const selectedMFS = availableMFS.find(m => m.id === form.payment_method) || availableMFS[0] || MFS_OPTIONS[0];
  const mfsNumber = settings[selectedMFS.numberKey] || '01XXXXXXXXX';

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrors(prev => ({ ...prev, screenshot: 'Max 5MB' })); return; }
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, screenshot: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.chess_username.trim()) errs.chess_username = 'Chess.com username is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.mobile.trim() || !/^01[0-9]{9}$/.test(form.mobile.replace(/\s|-/g, '')))
      errs.mobile = 'Valid BD mobile (01XXXXXXXXX)';
    if (!form.trx_id.trim()) errs.trx_id = 'Transaction ID is required';
    // district is optional — no validation needed
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus('submitting');

    await new Promise(res => setTimeout(res, 700));

    const order = {
      id: 'form_' + Date.now(),
      ...form,
      package: `Diamond - ৳${price} BDT`,
      coupon_code: couponCode,
      original_price: originalPrice,
      coupon_discount: couponDiscount,
      final_price: price,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('pending_orders') || '[]');
      localStorage.setItem('pending_orders', JSON.stringify([order, ...existing]));
    } catch { }

    // Also try Firestore if available
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      if (db) {
        await addDoc(collection(db, 'pending_orders'), {
          ...form, package: `Diamond - ৳${price} BDT`,
          coupon_code: couponCode, original_price: originalPrice,
          coupon_discount: couponDiscount, final_price: price,
          status: 'pending', submitted_at: serverTimestamp(),
        });
      }
    } catch { }

    setStatus('success');
    setForm(INITIAL);
    setScreenshot(null); setScreenshotPreview(null); setErrors({});
  };

  if (status === 'success') {
    return (
      <div className="bg-[#262421] p-10 rounded-xl border border-[#81b64c]/30 text-center shadow-2xl">
        <div className="w-20 h-20 bg-[#81b64c]/10 border border-[#81b64c]/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-[#81b64c]" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Submitted! 🎉</h3>
        <p className="text-[#c3c3c0] mb-2 leading-relaxed text-sm">
          Your request is received. We'll verify and activate your Diamond account{' '}
          <span className="text-[#81b64c] font-bold">usually within 5 minutes</span>.
        </p>
        <p className="text-xs text-[#c3c3c0]/60 mb-6">Any issues are resolved within 24 hours.</p>
        <a href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=Hi%2C%20I%20just%20submitted%20my%20Diamond%20purchase%20request%20on%20ChessPremiumBD.`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-lg font-bold text-sm hover:bg-[#20BA5A] transition-all mb-4">
          <MessageCircle className="w-4 h-4" /> WhatsApp Us to Confirm
        </a>
        <br />
        <button onClick={() => setStatus('idle')} className="text-xs text-[#c3c3c0]/50 hover:text-[#c3c3c0] transition-colors mt-2">
          Submit another →
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#262421] p-6 lg:p-8 rounded-xl shadow-2xl border border-[#403d39]" id="purchase-form">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#81b64c]/10 border border-[#81b64c]/20 rounded-xl flex items-center justify-center">
          <Crown className="w-5 h-5 text-[#81b64c] fill-current" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">Purchase Portal</h3>
          <p className="text-xs text-[#c3c3c0]">
            Diamond — <span className="line-through text-[#666]">৳{originalPrice.toLocaleString()}</span>{' '}
            <span className="text-[#81b64c] font-black">৳{price.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Coupon Banner */}
      <div className="mb-6 flex items-center justify-between p-3.5 bg-[#1e3010] border border-[#81b64c]/30 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Tag className="w-4 h-4 text-[#81b64c]" />
          <div>
            <p className="text-[10px] font-black text-[#81b64c] uppercase tracking-wider">Coupon Applied ✓</p>
            <code className="text-xs text-white font-mono font-bold">{couponCode}</code>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[#666] line-through text-xs block">৳{originalPrice.toLocaleString()}</span>
          <span className="text-[#81b64c] font-black text-xl">৳{price.toLocaleString()}</span>
        </div>
      </div>

      {/* MFS Payment Method Selector */}
      <div className="mb-6">
        <p className="text-xs font-black text-[#c3c3c0] uppercase tracking-wider mb-3">Select Payment Method *</p>
        <div className={`grid gap-2 mb-3`} style={{ gridTemplateColumns: `repeat(${availableMFS.length}, 1fr)` }}>
          {availableMFS.map(mfs => (
            <button
              key={mfs.id}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, payment_method: mfs.id }))}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all relative ${form.payment_method === mfs.id
                ? `${mfs.borderActive} ${mfs.bg} ring-2 ${mfs.ring}`
                : 'border-[#403d39] bg-[#312e2b] hover:border-[#555]'
                }`}
            >
              {mfs.recommended && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black bg-[#81b64c] text-black px-2 py-0.5 rounded-full whitespace-nowrap">✓ Recommended</span>
              )}
              {mfs.logo}
              <span className="text-xs font-black text-white">{mfs.label}</span>
            </button>
          ))}
        </div>
        {/* Show selected MFS number with step instructions */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: selectedMFS.color + '40', background: selectedMFS.color + '06' }}>
          {/* Number row with copy */}
          <div className="flex items-center gap-3 p-3 border-b" style={{ borderColor: selectedMFS.color + '25' }}>
            {selectedMFS.logo}
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: selectedMFS.color }}>Send to {selectedMFS.label} Number</p>
              <p className="font-mono font-black text-white text-base tracking-widest">{mfsNumber}</p>
            </div>
            <CopyButton text={mfsNumber} />
          </div>
          {/* Step instructions */}
          <div className="p-3 space-y-1.5">
            {[
              { n: 1, text: `Open ${selectedMFS.label} → "Send Money" → Personal` },
              { n: 2, text: `Send to: ${mfsNumber}` },
              { n: 3, text: `Amount: ৳${price.toLocaleString()} exactly` },
              { n: 4, text: 'Save your TrxID from the confirmation SMS for the form below.' },
            ].map(step => (
              <div key={step.n} className="flex items-start gap-2 text-xs">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                  style={{ background: selectedMFS.color + '25', color: selectedMFS.color }}>{step.n}</span>
                <span className={step.n === 4 ? 'text-[#c3c3c0] font-semibold' : 'text-[#c3c3c0]'}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activation badge */}
      <div className="mb-5 flex items-center gap-2 px-3 py-2 bg-[#81b64c]/5 border border-[#81b64c]/20 rounded-lg">
        <Zap className="w-4 h-4 text-[#81b64c] shrink-0" />
        <p className="text-xs text-[#81b64c] font-semibold">⚡ Activation usually within 5 minutes · Issues fixed in 24hrs</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" error={errors.name}>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
              placeholder="Rahim Ahmed"
              className={errors.name ? INPUT_ERR : INPUT} />
          </Field>
          <Field label="Chess.com Username" error={errors.chess_username} hint="Your exact Chess.com profile username">
            <input id="chess_username" name="chess_username" type="text" value={form.chess_username} onChange={handleChange}
              placeholder="RahimChess99"
              className={errors.chess_username ? INPUT_ERR : INPUT} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email Address" error={errors.email} hint="Use the email address linked to your Chess.com account">
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@gmail.com"
              className={errors.email ? INPUT_ERR : INPUT} />
          </Field>
          <Field label="Mobile Number" error={errors.mobile} hint={`The ${selectedMFS.label} number you sent from`}>
            <input id="mobile" name="mobile" type="tel" value={form.mobile} onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className={errors.mobile ? INPUT_ERR : INPUT} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={`${selectedMFS.label} Transaction ID`} error={errors.trx_id} hint="From your payment confirmation SMS">
            <input id="trx_id" name="trx_id" type="text" value={form.trx_id} onChange={handleChange}
              placeholder="e.g. 8H3A9KT..."
              className={`${errors.trx_id ? INPUT_ERR : INPUT} font-mono uppercase`} />
          </Field>
          <Field label="District" required={false}>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#c3c3c0]/40 pointer-events-none" />
              <select
                id="district" name="district" value={form.district} onChange={handleChange}
                className={`pl-9 ${errors.district ? INPUT_ERR : INPUT}`}
              >
                <option value="">Select your district (optional)</option>
                {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </Field>
        </div>

        {/* Screenshot (optional) */}
        <Field label="Payment Screenshot" required={false} hint="Optional — speeds up verification (max 5MB)" error={errors.screenshot}>
          {screenshotPreview ? (
            <div className="relative">
              <img src={screenshotPreview} alt="Preview" className="w-full h-36 object-cover rounded-xl border border-[#403d39]" />
              <button type="button"
                onClick={() => { setScreenshot(null); setScreenshotPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="absolute top-2 right-2 w-7 h-7 bg-[#262421] border border-[#403d39] rounded-full flex items-center justify-center hover:border-red-500/40 transition-colors">
                <X className="w-3.5 h-3.5 text-[#c3c3c0]" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full h-20 border-2 border-dashed border-[#403d39] hover:border-[#81b64c]/40 rounded-xl flex flex-col items-center justify-center gap-1.5 text-[#c3c3c0]/50 hover:text-[#c3c3c0] transition-colors">
              <Upload className="w-4 h-4" />
              <span className="text-xs font-semibold">Click to upload screenshot</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </Field>

        <Field label="Notes" required={false}>
          <textarea id="notes" name="notes" value={form.notes} onChange={handleChange}
            placeholder="Any extra info (optional)..." rows={2}
            className={`${INPUT} resize-none`} />
        </Field>

        <button type="submit" id="purchase-submit-btn" disabled={status === 'submitting'}
          className="w-full py-4 rounded-xl font-black text-[#1a1a1a] bg-[#81b64c] hover:bg-[#95c660] transition-all transform hover:-translate-y-0.5 shadow-[0_5px_0_rgba(104,151,59,1)] active:shadow-none active:translate-y-1 flex justify-center items-center text-base uppercase tracking-tight disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2">
          {status === 'submitting'
            ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</>
            : 'Submit Purchase Request'}
        </button>

        <div className="flex items-center justify-center gap-2 text-[#c3c3c0]/40 text-xs">
          <Shield className="w-3.5 h-3.5" />
          All data is encrypted and secure
        </div>
      </form>
    </div>
  );
}
