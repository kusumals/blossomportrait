import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const BookPreview = ({ book, onBack, onOrder }) => {
  const previewRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = previewRef.current;
      if (!element) { alert('Preview not found'); setDownloading(false); return; }
      const canvas = await html2canvas(element, {
        scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `memory-book-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const cover = book?.cover || {};
  const pages = book?.pages || [];

  const darkenColor = (hex, amount = 80) => {
    const h = (hex || '#FFB7C5').replace('#', '');
    const num = parseInt(h.length === 3
      ? h.split('').map(c => c + c).join('')
      : h, 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return `rgb(${r},${g},${b})`;
  };

  const getBorderStyle = (border) => {
    switch (border) {
      case 'solid':  return '3px solid #d1a3b0';
      case 'dashed': return '3px dashed #d1a3b0';
      case 'dotted': return '3px dotted #d1a3b0';
      default:       return 'none';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button onClick={onBack} className="text-pink-500 hover:underline text-sm">
          ← Back to Edit
        </button>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="group relative overflow-hidden bg-gradient-to-r from-pink-300 to-rose-300 text-pink-900 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-pink-300/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              {downloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button
            onClick={onOrder}
            className="group relative overflow-hidden bg-gradient-to-r from-pink-400 to-rose-400 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-pink-400/40 hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Order Book</span>
              <span className="text-xs bg-white/30 px-1.5 py-0.5 rounded-full font-medium">₹599</span>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Printable area */}
      <div ref={previewRef} id="book-preview" className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-[448px] mx-auto">

        {/* ─── COVER ─── */}
        <div className="mb-2">
          <div className="px-4 py-2 bg-gray-50 border-b">
            <span className="font-semibold text-gray-600 text-sm">Cover</span>
          </div>

          <div
            className="relative overflow-hidden flex flex-col items-center p-4 sm:p-6 w-full max-w-[448px] mx-auto"
            style={{ backgroundColor: cover.color || '#FFB7C5' }}
          >
            {cover.photo ? (
              <div className="relative mb-4 flex-shrink-0 overflow-hidden w-full max-w-[400px] aspect-[4/3]">
                <img
                  src={cover.photo}
                  alt="Cover"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    transform: `translate(${cover.photoX || 0}px, ${cover.photoY || 0}px) scale(${cover.photoScale || 1})`,
                    transformOrigin: 'center center',
                  }}
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div className="relative mb-4 flex-shrink-0 overflow-hidden flex items-center justify-center text-4xl sm:text-5xl w-full max-w-[400px] aspect-[4/3] opacity-40">
                📷
              </div>
            )}

            <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8 px-4 sm:px-6" style={{ backgroundColor: cover.color || '#FFB7C5' }}>
              <h1
                className="text-2xl sm:text-3xl font-bold text-center break-words"
                style={{ 
                  color: darkenColor(cover.color || '#FFB7C5', 80),
                  fontFamily: cover.titleFont || 'Dancing Script, cursive'
                }}
              >
                {cover.title || 'My Memory Book'}
              </h1>
              {cover.author && (
                <p
                  className="text-base mt-2"
                  style={{ color: darkenColor(cover.color || '#FFB7C5', 60), fontFamily: 'Pacifico, cursive' }}
                >
                  by {cover.author}
                </p>
              )}
            </div>

            {(cover.stickers || []).map((sticker, idx) => (
              <div
                key={sticker.id || idx}
                className="absolute text-4xl pointer-events-none select-none"
                style={{
                  left: sticker.x || 50,
                  top: sticker.y || 50,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
                {sticker.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* ─── PAGES ─── */}
        {pages.map((page, index) => (
          <div key={page.id} className="mb-2">
            <div
              className="relative rounded-2xl p-4 sm:p-6 flex flex-col items-center shadow-sm w-full max-w-[448px] mx-auto"
              style={{
                minHeight: 280,
                backgroundColor: page.color || '#FFF5E1',
                border: getBorderStyle(page.border),
              }}
            >
              {page.photos && page.photos.length > 0 && (
                <div className="relative mb-4 flex-shrink-0 overflow-hidden w-full max-w-[400px] aspect-[4/3]">
                  <img
                    src={page.photos[0]}
                    alt={`Page ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                      transform: `translate(${page.photoX || 0}px, ${page.photoY || 0}px) scale(${page.photoScale || 1})`,
                      transformOrigin: 'center center',
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              {page.text && (
                <div className="w-full max-w-md px-2">
                  <div 
                    className="text-gray-700 bg-white/50 p-3 sm:p-4 rounded-lg text-sm sm:text-base" 
                    style={{ 
                      fontFamily: page.textFont || 'Georgia, serif', 
                      fontSize: '14px', 
                      lineHeight: '1.6',
                      textAlign: page.textAlign || 'center'
                    }}
                  >
                    {page.text.split('\n').map((line, i) => (
                      <p key={i} style={{ minHeight: '1.4em' }}>
                        {line || '\u00A0'}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {(!page.photos || page.photos.length === 0) && !page.text && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <span className="text-5xl mb-2">✨</span>
                  <p className="text-sm" style={{ fontFamily: 'Comic Sans MS, cursive', fontWeight: 'bold' }}>Empty page</p>
                </div>
              )}

              {(page.stickers || []).map((sticker, sIdx) => (
                <div
                  key={sticker.id || sIdx}
                  className="absolute text-3xl pointer-events-none select-none"
                  style={{
                    left: sticker.x || 50,
                    top: sticker.y || 50,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}
                >
                  {sticker.emoji}
                </div>
              ))}

              <div className="absolute bottom-3 right-4 text-xs text-gray-400">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6 text-gray-400 text-sm" style={{ fontFamily: 'Lobster, cursive', fontSize: '16px' }}>
        ✨ Your memory book ✨
      </div>
    </div>
  );
};

export default BookPreview;