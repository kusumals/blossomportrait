import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import emailjs from '@emailjs/browser';
import html2canvas from 'html2canvas';

const UPI_ID = process.env.REACT_APP_UPI_ID || 'yourupi@upi';

const PACKAGES = [
  { id: 'soft',    label: 'Softcover',          price: '₹599',  amount: 599,  desc: '20 pages • Glossy finish • Perfect for everyday memories' },
  { id: 'hard',    label: 'Hardcover',           price: '₹899',  amount: 899,  desc: '20 pages • Premium binding • Built to last a lifetime' },
  { id: 'premium', label: '🎁 Premium Gift Box', price: '₹1299', amount: 1299, desc: 'Hardcover + beautiful gift box + satin ribbon — ideal for gifting' },
];

const WA_NUMBER = '919741448271';

const OrderForm = ({ book, onBack, onDownload }) => {
  const [pkg, setPkg]       = useState('soft');
  const [form, setForm]     = useState({ name: '', phone: '', address: '', pincode: '', utr: '' });
  const [payClicked, setPayClicked] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [downloading, setDownloading] = useState(false);

  const selectedPkg = PACKAGES.find(p => p.id === pkg);

  const openUPI = () => {
    const link = `upi://pay?pa=${UPI_ID}&pn=blossomsportrait&am=${selectedPkg.amount}&cu=INR&tn=MemoryBookOrder`;
    window.location.href = link;
    setTimeout(() => setPayClicked(true), 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await addDoc(collection(db, 'orders'), {
        name: form.name,
        phone: form.phone,
        address: form.address,
        pincode: form.pincode,
        package: selectedPkg.label,
        price: selectedPkg.price,
        bookTitle: book?.cover?.title || 'My Memory Book',
        utrNumber: form.utr,
        pageCount: book?.pages?.length || 0,
        status: 'paid_unverified',
        createdAt: serverTimestamp(),
      });

      await emailjs.send('service_6b6iwm5', 'template_a9x8q9p', {
        customer_name: form.name,
        customer_phone: form.phone,
        address: form.address,
        pincode: form.pincode,
        package: selectedPkg.label,
        price: selectedPkg.price,
        book_title: book?.cover?.title || 'My Memory Book',
        utr_number: form.utr,
        photo_links: 'Customer will send book via WhatsApp',
        time: new Date().toLocaleString('en-IN'),
      }, '24KZGJNRncneOizTf');

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
    setSaving(false);
  };

  // FIXED: Working download function
  const handleDownloadBook = async () => {
    setDownloading(true);
    
    try {
      // Try to find the book preview element first
      let element = document.getElementById('book-preview');
      
      // If not found, create a temporary preview from book data
      if (!element) {
        console.log('Creating temporary preview...');
        element = document.createElement('div');
        element.id = 'temp-preview';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        element.style.width = '800px';
        element.style.backgroundColor = book?.cover?.color || '#FFB7C5';
        element.style.padding = '40px';
        element.style.borderRadius = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        
        // Create cover preview
        element.innerHTML = `
          <div style="text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">📚</div>
            <h1 style="color: white; font-size: 36px; margin-bottom: 10px;">${book?.cover?.title || 'My Memory Book'}</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 18px;">${book?.cover?.author || 'Created with blossomsportrait'}</p>
            <div style="margin-top: 40px; padding: 20px; background: rgba(255,255,255,0.2); border-radius: 10px;">
              <p style="color: white; font-size: 14px;">✨ Memory Book ✨</p>
              <p style="color: white; font-size: 12px;">${book?.pages?.length || 0} pages of beautiful memories</p>
            </div>
          </div>
        `;
        
        document.body.appendChild(element);
      }
      
      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      // Remove temporary element if we created it
      if (!document.getElementById('book-preview') && element.id === 'temp-preview') {
        document.body.removeChild(element);
      }
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `memory-book-${form.name || 'mybook'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      console.log('Download successful!');
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Could not download automatically. Please go to Preview mode and download from there.');
    } finally {
      setDownloading(false);
    }
  };

  // Fixed WhatsApp link with proper message
  const getWhatsAppLink = () => {
    const waMessage = encodeURIComponent(
      `🌸 Hi! I just placed a Memory Book order!\n\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Package: ${selectedPkg.label} (${selectedPkg.price})\n` +
      `UTR Number: ${form.utr}\n\n` +
      `📸 *Important:* Please find attached my book design.\n\n` +
      `Once you receive the image, please confirm my order. Thank you! 💕`
    );
    return `https://wa.me/${WA_NUMBER}?text=${waMessage}`;
  };

  if (submitted) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <div className="text-7xl mb-5">🌸</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h2>
        <p className="text-gray-500 text-lg mb-2">
          Thank you, <strong className="text-pink-600">{form.name}</strong>! 💕
        </p>
        <p className="text-gray-500 mb-5">We'll verify your payment and call you at <strong>{form.phone}</strong> to confirm.</p>

        <div className="bg-pink-50 rounded-2xl p-4 text-left text-sm text-gray-600 mb-5 space-y-1">
          <p>📦 <strong>Package:</strong> {selectedPkg.label} — {selectedPkg.price}</p>
          <p>📍 <strong>Delivering to:</strong> {form.address}, {form.pincode}</p>
          <p>💳 <strong>UTR:</strong> {form.utr}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
          <p className="font-bold text-gray-700 mb-1">📲 One last step!</p>
          <p className="text-sm text-gray-500 mb-4">Download your book and send it to us on WhatsApp so we can print it exactly as you designed.</p>
          
          <div className="flex flex-col gap-3">
            {/* FIXED: Working Download Button */}
            <button
              onClick={handleDownloadBook}
              disabled={downloading}
              className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition disabled:opacity-50"
            >
              {downloading ? '⏳ Downloading...' : '⬇️ Step 1 — Download My Book'}
            </button>
            
            {/* FIXED: WhatsApp Link */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition block text-center"
            >
              💬 Step 2 — Send on WhatsApp
            </a>
          </div>
          
          <p className="text-xs text-gray-400 mt-3">
            💡 Tip: Download first → then open WhatsApp → attach the downloaded image from your gallery
          </p>
        </div>

        <button 
          onClick={onBack} 
          className="text-pink-500 hover:underline text-sm transition"
        >
          ← Back to your book
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <button onClick={onBack} className="text-pink-500 hover:underline mb-6 block text-sm">← Back to Preview</button>
      
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Get it printed 🖨️</h2>
        <p className="text-gray-400 text-sm mb-6">Delivered to your door in Bangalore • Online payment only</p>

        {/* Package selection */}
        <div className="space-y-3 mb-6">
          {PACKAGES.map(p => (
            <div
              key={p.id}
              onClick={() => setPkg(p.id)}
              className={`flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                pkg === p.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div>
                <div className="font-semibold text-gray-800">{p.label}</div>
                <div className="text-sm text-gray-500">{p.desc}</div>
              </div>
              <div className="text-lg font-bold text-pink-600">{p.price}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Your name" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
            <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="+91 XXXXX XXXXX" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Delivery Address (Bangalore only)</label>
            <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              placeholder="House/Flat no, Street, Area, Bangalore" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pincode</label>
            <input required value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="560001" />
          </div>

          {/* UPI Payment */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total to pay</span>
              <span className="text-2xl font-bold text-green-600">{selectedPkg.price}</span>
            </div>
            <button
              type="button"
              onClick={openUPI}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 text-base"
            >
              💳 Pay {selectedPkg.price} via UPI
            </button>
            {!payClicked && (
              <p className="text-xs text-center text-gray-400">Tap above to open your UPI app (GPay, PhonePe, Paytm…)</p>
            )}
            {payClicked && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter UTR / Transaction ID <span className="text-red-400">*</span></label>
                <input
                  required
                  value={form.utr}
                  onChange={e => setForm({ ...form, utr: e.target.value })}
                  className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="12-digit UTR number from your UPI app"
                />
                <p className="text-xs text-gray-400 mt-1">Find the UTR number in your UPI app under transaction history</p>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={saving || !payClicked || !form.utr}
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? '✨ Confirming your order...' : 'Confirm Order 🌸'}
          </button>
          <p className="text-center text-xs text-gray-400">Pay first via UPI → enter UTR → confirm order</p>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;