import React, { useState } from 'react';
import PhotoUpload from './components/PhotoUpload/PhotoUpload';
import MemoryBook from './components/MemoryBook/MemoryBook';
import './App.css';

const FEATURES = [
  { icon: '📸', title: 'Add Your Photos', desc: 'Upload your favourite memories and make each page special' },
  { icon: '🎨', title: 'Edit & Beautify', desc: 'Crop, filter, add stickers — make it truly yours' },
  { icon: '✍️', title: 'Write Your Story', desc: 'Add captions, dates, feelings — every word matters' },
  { icon: '🖨️', title: 'Print & Cherish', desc: 'We deliver a beautifully printed book to your door in Bangalore' },
];

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(1)}>
              <span className="text-3xl">🌸</span>
              <div>
                <span className="font-bold text-lg text-pink-600 tracking-tight">blossoms</span>
                <span className="font-bold text-lg text-gray-700 tracking-tight">portrait</span>
              </div>
            </div>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="text-sm text-pink-500 hover:text-pink-700 font-medium"
              >
                ← Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">

        {step === 1 && (
          <>
            {/* Hero */}
            <div className="text-center pt-16 pb-10">
              <p className="text-pink-500 font-semibold text-sm tracking-widest uppercase mb-3">✨ Bangalore's Memory Book Studio</p>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-5">
                Turn your photos into<br />
                <span className="text-pink-500">a book you'll treasure forever</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
                Design a beautiful memory book with your photos, your words, and your heart —
                then get it printed and delivered right to you.
              </p>
              <a href="#start" className="inline-block bg-pink-600 text-white px-8 py-3 rounded-2xl text-lg font-semibold hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all hover:scale-105">
                Create My Memory Book 🌸
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-700 text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Upload section */}
            <div id="start" className="max-w-xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Let's start with a photo 💕</h2>
                <p className="text-gray-400 text-sm mt-1">Don't worry — you can add more photos on each page inside</p>
              </div>
              <PhotoUpload onImageUpload={setUploadedImage} />
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!uploadedImage}
                  className="bg-pink-600 text-white px-10 py-3 rounded-2xl hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-lg font-semibold shadow-lg shadow-pink-200 transition-all hover:scale-105"
                >
                  Start Creating →
                </button>
              </div>
              {!uploadedImage && (
                <p className="text-center text-xs text-gray-400 mt-3">Upload a photo above to continue</p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="pt-8">
            <MemoryBook initialImage={uploadedImage} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-10">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="font-bold text-pink-600">blossomsportrait</span>
          </div>
          <p className="text-gray-400 text-sm">Handcrafted with love in Bangalore 💕</p>
          <p className="text-gray-400 text-sm">Questions? WhatsApp us anytime</p>
          <p className="text-xs text-gray-300 mt-3">© 2026 blossomsportrait • Bangalore delivery only • Free digital downloads</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
