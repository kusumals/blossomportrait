import React, { useRef, useState } from 'react';
import StickerLibrary from './StickerLibrary';
import PhotoEditor from './PhotoEditor';
import DraggablePhoto from './DraggablePhoto';

const COLORS = ['#FFF5E1','#FFB7C5','#B5EAD7','#C3B1E1','#FFDAB9','#B5D4FF','#FFFFFF','#FFF0F5','#E8F5E9','#FFF9C4','#E8D5C4','#D4A5A5','#A8D8D8','#F0E6D2','#E6D4C1','#C9E4DE','#F4E4C1','#D4B5D4','#C1D4E8','#E8C9B8','#D4E8D4','#E8D4C9','#E4D4C9','#D9C9E6','#C9E6D9'];

const CoverEditor = ({ cover, onUpdate }) => {
  const fileRef = useRef();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSrc, setEditingSrc] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const containerRef = useRef(null);

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

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditingSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const addSticker = (emoji) => {
    setSelectedSticker(emoji);
  };

  const addImageSticker = (src) => {
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
    
    onUpdate({ stickers: [...cover.stickers, newSticker] });
  };

  const removeSticker = (id) => {
    onUpdate({ stickers: cover.stickers.filter(s => s.id !== id) });
  };

  return (
    <>
    {editingSrc && (
      <PhotoEditor
        src={editingSrc}
        onSave={(edited) => { onUpdate({ photo: edited }); setEditingSrc(null); }}
        onCancel={() => setEditingSrc(null)}
      />
    )}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Cover Preview */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Cover Preview <span className="text-xs text-gray-400 font-normal">(click title to edit inline)</span></h3>
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden flex flex-col items-center p-4 sm:p-6 w-full max-w-[448px] mx-auto"
          style={{ backgroundColor: cover.color }}
          onClick={handleContainerClick}
        >
          {cover.photo ? (
            <div className="relative mb-4 flex-shrink-0 overflow-hidden w-full max-w-[400px] aspect-[4/3]">
              <DraggablePhoto
                src={cover.photo}
                photoX={cover.photoX ?? 0}
                photoY={cover.photoY ?? 0}
                photoScale={cover.photoScale ?? 1}
                onChange={onUpdate}
                height="300px"
              />
            </div>
          ) : (
            <div
              className="relative mb-4 flex-shrink-0 overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed border-white/50 w-full max-w-[400px] aspect-[4/3]"
              onClick={() => fileRef.current.click()}
            >
              <span className="text-white/70 text-xs sm:text-sm">📷 Click to add cover photo</span>
            </div>
          )}

          {/* Inline editable title with font support */}
          <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8 px-4 sm:px-6" style={{ backgroundColor: cover.color || '#FFB7C5' }}>
            {editingTitle ? (
              <input
                autoFocus
                type="text"
                value={cover.title}
                onChange={e => onUpdate({ title: e.target.value })}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
                className="w-full text-center text-xl sm:text-3xl font-bold text-gray-700 bg-white/70 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
                style={{
                  color: darkenColor(cover.color || '#FFB7C5', 80),
                  fontFamily: cover.titleFont || 'Dancing Script'
                }}
              />
            ) : (
              <h2
                onClick={() => setEditingTitle(true)}
                className="text-xl sm:text-3xl font-bold text-center break-words cursor-text hover:bg-white/30 rounded-lg px-2 py-1 transition-colors"
                style={{
                  color: darkenColor(cover.color || '#FFB7C5', 80),
                  fontFamily: cover.titleFont || 'Dancing Script'
                }}
                title="Click to edit title"
              >
                {cover.title || 'My Memory Book'}
                <span className="text-xs text-gray-400 ml-1">✏️</span>
              </h2>
            )}
            {cover.author && (
              <p
                className="text-base mt-2"
                style={{ color: darkenColor(cover.color || '#FFB7C5', 60) }}
              >
                by {cover.author}
              </p>
            )}
          </div>

          {/* Stickers */}
          {cover.stickers.map(s => (
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
                <img src={s.src} alt="sticker" className="w-12 h-12 object-contain" />
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
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">Double-click any sticker to remove it</p>
      </div>

      {/* Controls */}
      <div className="space-y-3 sm:space-y-4">
        <input type="file" ref={fileRef} accept="image/*" onChange={handlePhoto} className="hidden" />
        <button
          onClick={() => fileRef.current.click()}
          className="w-full py-2 px-3 sm:px-4 border-2 border-dashed border-pink-300 rounded-xl text-pink-500 hover:bg-pink-50 text-sm sm:text-base"
        >
          📷 {cover.photo ? 'Replace Cover Photo' : 'Add Cover Photo'}
        </button>

        {cover.photo && (
          <div className="flex justify-between items-center px-1">
            <button onClick={() => setEditingSrc(cover.photo)} className="text-xs text-pink-500 hover:underline">✏️ Edit photo</button>
            <button onClick={() => onUpdate({ photoX: 0, photoY: 0, photoScale: 1 })} className="text-xs text-gray-400 hover:text-gray-600">↺ Reset position</button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Book Title</label>
          <input
            type="text"
            value={cover.title}
            onChange={e => onUpdate({ title: e.target.value })}
            placeholder="My Memory Book"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Author Name</label>
          <input
            type="text"
            value={cover.author}
            onChange={e => onUpdate({ author: e.target.value })}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Cover Color</label>
          <div className="flex gap-2 flex-wrap mb-3">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => onUpdate({ color: c })}
                className={`w-9 h-9 rounded-full border-4 transition-transform hover:scale-110 ${cover.color === c ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Custom Color</label>
          <input
            type="color"
            value={cover.color || '#FFB7C5'}
            onChange={e => onUpdate({ color: e.target.value })}
            className="w-full h-10 border border-gray-200 rounded-lg cursor-pointer"
            title="Choose your own cover color"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Title Font</label>
          <select
            value={cover.titleFont || 'Dancing Script'}
            onChange={e => onUpdate({ titleFont: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            style={{ fontFamily: cover.titleFont || 'Dancing Script' }}
          >
            <option value="Dancing Script" style={{ fontFamily: 'Dancing Script' }}>Dancing Script</option>
            <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
            <option value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</option>
            <option value="Lobster" style={{ fontFamily: 'Lobster' }}>Lobster</option>
            <option value="Pacifico" style={{ fontFamily: 'Pacifico' }}>Pacifico</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Add Stickers ✨</label>
          <p className="text-xs text-gray-400 mb-2">Click a sticker, then click on the cover to place it</p>
          {selectedSticker && (
            <div className="mb-2 p-2 bg-pink-100 rounded-lg text-center text-pink-600 text-sm">
              🎯 Click on the cover above to place your sticker
              <button 
                onClick={() => setSelectedSticker(null)}
                className="ml-2 text-xs text-gray-500 underline"
              >
                Cancel
              </button>
            </div>
          )}
          <StickerLibrary onAdd={addSticker} onAddImage={addImageSticker} />
        </div>
      </div>
    </div>
    </>
  );
};

export default CoverEditor;