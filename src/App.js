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
            <div className="text-center pt-10 sm:pt-16 pb-8 sm:pb-10 px-2">
              <p className="text-pink-500 font-semibold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">✨ Bangalore's Memory Book Studio</p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-4 sm:mb-5">
                Turn your photos into<br />
                <span className="text-pink-500">a book you'll treasure forever</span>
              </h1>
              <p className="text-sm sm:text-lg text-gray-500 max-w-xl mx-auto mb-6 sm:mb-8">
                Design a beautiful memory book with your photos, your words, and your heart —
                then get it printed and delivered right to you.
              </p>
              <a href="#start" className="inline-block group relative">
                {/* Flower container - rotates on hover */}
                <div className="flower-container w-32 h-32 sm:w-40 sm:h-40 flex justify-center items-center cursor-pointer">
                  {/* Petals */}
                  <div className="petal absolute w-8 sm:w-10 h-14 sm:h-16 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full" style={{ transform: 'rotate(0deg) translateY(-50%)', animationDelay: '0.1s' }} />
                  <div className="petal absolute w-8 sm:w-10 h-14 sm:h-16 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full" style={{ transform: 'rotate(45deg) translateY(-50%)', animationDelay: '0.2s' }} />
                  <div className="petal absolute w-8 sm:w-10 h-14 sm:h-16 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full" style={{ transform: 'rotate(90deg) translateY(-50%)', animationDelay: '0.3s' }} />
                  <div className="petal absolute w-8 sm:w-10 h-14 sm:h-16 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full" style={{ transform: 'rotate(135deg) translateY(-50%)', animationDelay: '0.4s' }} />
                  <div className="petal absolute w-8 sm:w-10 h-14 sm:h-16 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full" style={{ transform: 'rotate(180deg) translateY(-50%)', animationDelay: '0.5s' }} />
                  <div className="petal absolute w-8 sm:w-10 h-14 sm:h-16 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full" style={{ transform: 'rotate(225deg) translateY(-50%)', animationDelay: '0.6s' }} />
                  <div className="petal absolute w-8 sm:w-10 h-14 sm:h-16 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full" style={{ transform: 'rotate(270deg) translateY(-50%)', animationDelay: '0.7s' }} />
                  <div className="petal absolute w-8 sm:w-10 h-14 sm:h-16 bg-gradient-to-b from-pink-200 to-pink-400 rounded-full" style={{ transform: 'rotate(315deg) translateY(-50%)', animationDelay: '0.8s' }} />
                  {/* Center */}
                  <div className="absolute w-7 sm:w-8 h-7 sm:h-8 bg-pink-100 rounded-full z-10" />
                </div>
                {/* Pink box with text - does NOT rotate */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 sm:-bottom-8 bg-pink-100 hover:bg-pink-200 px-3 py-1.5 rounded-full shadow-sm transition-colors">
                  <span className="text-pink-600 font-semibold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1">
                    🌸 Create Book
                  </span>
                </div>
                <style>{`
                  .group:hover .petal {
                    animation: changeColor 2s ease-in-out infinite alternate;
                  }
                  .group:hover .flower-container {
                    animation: rotateFlower 3s ease-in-out infinite;
                  }
                  @keyframes changeColor {
                    0% { background: linear-gradient(180deg, #fcdbdf, #fd688d); }
                    25% { background: linear-gradient(180deg, #fcd2e3, #fa6094); }
                    50% { background: linear-gradient(180deg, #fabefc, #c34ec7); }
                    75% { background: linear-gradient(180deg, #f7d6d6, #fd6a6a); }
                    100% { background: linear-gradient(180deg, #fcd3fc, #e844f7); }
                  }
                  @keyframes rotateFlower {
                    0% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.2) rotate(180deg); }
                    100% { transform: scale(1) rotate(360deg); }
                  }
                `}</style>
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8 sm:mb-14 px-2 sm:px-0">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-700 text-xs sm:text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed hidden sm:block">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Upload section */}
            <div id="start" className="max-w-xl mx-auto px-2 sm:px-0">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Let's start with a photo 💕</h2>
                <p className="text-gray-400 text-sm mt-1">Don't worry — you can add more photos on each page inside</p>
              </div>
              <PhotoUpload onImageUpload={setUploadedImage} />
              <div className="flex justify-center mt-4 sm:mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!uploadedImage}
                  className="bg-pink-600 text-white px-6 sm:px-10 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-lg font-semibold shadow-lg shadow-pink-200 transition-all hover:scale-105"
                >
                  Start Creating →
                </button>
              </div>
              {!uploadedImage && (
                <p className="text-center text-xs text-gray-400 mt-2 sm:mt-3">Upload a photo above to continue</p>
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
      <footer className="bg-white border-t mt-8 sm:mt-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl">🌸</span>
            <span className="font-bold text-pink-600 text-sm sm:text-base">blossomsportrait</span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">Handcrafted with love in Bangalore 💕</p>
          <p className="text-gray-400 text-xs sm:text-sm">Questions? WhatsApp us anytime</p>
          <p className="text-gray-300 text-xs mt-2 sm:mt-3">© 2026 blossomsportrait • Bangalore delivery only • Free digital downloads</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
