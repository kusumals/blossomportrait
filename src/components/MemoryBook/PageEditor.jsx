import React, { useRef, useState } from 'react';
import StickerLibrary from './StickerLibrary';
import PhotoEditor from './PhotoEditor';

const COLORS = ['#FFF5E1','#FFB7C5','#B5EAD7','#C3B1E1','#FFDAB9','#B5D4FF','#FFFFFF','#FFF0F5','#E8F5E9','#FFF9C4','#E8D5C4','#D4A5A5','#A8D8D8','#F0E6D2','#E6D4C1','#C9E4DE','#F4E4C1','#D4B5D4','#C1D4E8','#E8C9B8','#D4E8D4','#E8D4C9','#E4D4C9','#D9C9E6','#C9E6D9'];
const BORDERS = [
  { label: 'None',   value: 'none' },
  { label: 'Solid',  value: '3px solid #d1a3b0' },
  { label: 'Dashed', value: '3px dashed #d1a3b0' },
  { label: 'Dotted', value: '3px dotted #d1a3b0' },
];

const PageEditor = ({ page, pageNumber, onUpdate }) => {
  const fileRef = useRef();
  const [editingSrc, setEditingSrc] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const containerRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditingSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => onUpdate({ photos: [] });

  const handleStickerSelect = (emoji) => {
    setSelectedSticker(emoji);
  };

  const handleImageStickerSelect = (src) => {
    setSelectedSticker({ type: 'image', src });
  };

  const handleContainerClick = (e) => {
    if (!selectedSticker || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSticker = {
      id: Date.now(),
      type: typeof selectedSticker === 'string' ? 'emoji' : 'image',
      emoji: typeof selectedSticker === 'string' ? selectedSticker : null,
      src: selectedSticker?.src,
      x: Math.min(rect.width - 20, Math.max(20, x)),
      y: Math.min(rect.height - 20, Math.max(20, y))
    };
    
    onUpdate({ stickers: [...(page.stickers || []), newSticker] });
  };

  const removeSticker = (stickerId) => {
    onUpdate({ stickers: (page.stickers || []).filter(s => s.id !== stickerId) });
  };

  return (
    <>
    {editingSrc && (
      <PhotoEditor
        src={editingSrc}
        onSave={(edited) => { onUpdate({ photos: [edited] }); setEditingSrc(null); }}
        onCancel={() => setEditingSrc(null)}
      />
    )}
    
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Editing Page {pageNumber}</h3>

      {/* Page Preview Container - Click to add stickers */}
      <div
        ref={containerRef}
        className="relative rounded-2xl p-4 sm:p-6 flex flex-col items-center shadow-sm w-full max-w-[448px] mx-auto"
        style={{
          backgroundColor: page.color || '#FFF5E1',
          border: page.border !== 'none' ? page.border : 'none',
          minHeight: '280px'
        }}
        onClick={handleContainerClick}
      >
        {/* Photo */}
        {page.photos && page.photos.length > 0 && page.photos[0] ? (
          <div className="relative mb-4 flex-shrink-0 overflow-hidden w-full max-w-[400px] aspect-[4/3]">
            <img 
              src={page.photos[0]} 
              alt="Page photo" 
              className="w-full h-full object-cover"
              style={{
                objectPosition: `${50 + (page.photoX || 0)}% ${50 + (page.photoY || 0)}%`,
                transform: `scale(${page.photoScale || 1})`,
                transformOrigin: 'center',
              }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); removePhoto(); }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center shadow z-10 hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            className="mb-4 flex-shrink-0 flex items-center justify-center cursor-pointer border-2 border-dashed border-pink-300 rounded-lg w-full max-w-[400px] aspect-[4/3]"
            onClick={() => fileRef.current.click()}
          >
            <span className="text-gray-400 text-sm">📷 Add Photo</span>
          </div>
        )}

        <input type="file" ref={fileRef} accept="image/*" onChange={handlePhoto} className="hidden" />

        {/* Text with alignment */}
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

        {/* Empty state */}
        {(!page.photos || page.photos.length === 0) && !page.text && (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
            <span className="text-4xl sm:text-5xl mb-2">✨</span>
            <p className="text-xs sm:text-sm" style={{ fontFamily: 'Comic Sans MS, cursive', fontWeight: 'bold' }}>Empty page</p>
          </div>
        )}

        {/* Stickers */}
        {(page.stickers || []).map(s => (
          <div
            key={s.id}
            className="absolute select-none"
            style={{ 
              left: s.x || 50, 
              top: s.y || 50, 
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            {s.type === 'image' ? (
              <img src={s.src} alt="sticker" className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-4xl">{s.emoji}</span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); removeSticker(s.id); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}

        {/* Page Number */}
        <div className="absolute bottom-3 right-4 text-xs text-gray-400">
          {pageNumber}
        </div>
      </div>

      {/* Photo Edit Controls */}
      {page.photos && page.photos.length > 0 && page.photos[0] && (
        <div className="flex justify-between items-center px-1">
          <div className="flex gap-3">
            <button 
              onClick={() => setEditingSrc(page.photos[0])} 
              className="text-xs text-pink-500 hover:underline"
            >
              ✏️ Edit photo
            </button>
            <button 
              onClick={() => fileRef.current.click()} 
              className="text-xs text-gray-400 hover:underline"
            >
              🔄 Replace
            </button>
          </div>
          <button 
            onClick={() => onUpdate({ photoX: 0, photoY: 0, photoScale: 1 })} 
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ↺ Reset position
          </button>
        </div>
      )}

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Write your memory ✍️</label>
        <textarea
          value={page.text || ''}
          onChange={e => onUpdate({ text: e.target.value })}
          placeholder="Write anything here — a memory, a caption, a date, a feeling..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
        />
      </div>

      {/* Alignment buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Text Alignment</label>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ textAlign: 'left' })}
            className={`flex-1 py-1 rounded text-sm font-medium transition ${
              (page.textAlign || 'center') === 'left' 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⬅️ Left
          </button>
          <button
            onClick={() => onUpdate({ textAlign: 'center' })}
            className={`flex-1 py-1 rounded text-sm font-medium transition ${
              (page.textAlign || 'center') === 'center' 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔘 Center
          </button>
          <button
            onClick={() => onUpdate({ textAlign: 'right' })}
            className={`flex-1 py-1 rounded text-sm font-medium transition ${
              (page.textAlign || 'center') === 'right' 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ➡️ Right
          </button>
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Background Color 🎨</label>
        <div className="flex gap-2 flex-wrap mb-3">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => onUpdate({ color: c })}
              className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                (page.color || '#FFF5E1') === c ? 'border-gray-600 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Custom Color</label>
        <input
          type="color"
          value={page.color || '#FFF5E1'}
          onChange={e => onUpdate({ color: e.target.value })}
          className="w-full h-10 border border-gray-200 rounded-lg cursor-pointer mb-4"
          title="Choose your own page color"
        />
      </div>

      {/* Text Font */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Text Font</label>
        <select
          value={page.textFont || 'Georgia'}
          onChange={e => onUpdate({ textFont: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 mb-4"
        >
          <option value="Georgia">Georgia (Classic)</option>
          <option value="Comic Sans MS">Comic Sans MS (Fun)</option>
          <option value="Lobster">Lobster (Bold)</option>
          <option value="Dancing Script">Dancing Script (Fancy)</option>
          <option value="Pacifico">Pacifico (Playful)</option>
        </select>
      </div>

      {/* Border Style */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Border Style 🖼️</label>
        <div className="flex gap-2 flex-wrap">
          {BORDERS.map(b => (
            <button
              key={b.label}
              onClick={() => onUpdate({ border: b.value })}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                (page.border || 'none') === b.value 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-pink-50'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sticker Library */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Add Stickers ✨</label>
        <p className="text-xs text-gray-400 mb-2">Click a sticker, then click on the page to place it</p>
        {selectedSticker && (
          <div className="mb-2 p-2 bg-pink-100 rounded-lg text-center text-pink-600 text-sm">
            🎯 Click on the page above to place your sticker
            <button 
              onClick={() => setSelectedSticker(null)}
              className="ml-2 text-xs text-gray-500 underline"
            >
              Cancel
            </button>
          </div>
        )}
        <StickerLibrary onAdd={handleStickerSelect} onAddImage={handleImageStickerSelect} />
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        💡 Tip: Click a sticker from library → Click anywhere on page to place it • Click × to remove
      </p>
    </div>
    </>
  );
};

export default PageEditor;