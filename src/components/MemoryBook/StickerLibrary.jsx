import React, { useRef } from 'react';

const STICKER_GROUPS = [
  { label: '🌸 Flowers', stickers: ['🌸','🌺','🌻','🌹','🌷','💐','🌼','🪷','🌾','🍀','🌿','🍃'] },
  { label: '🦋 Nature',  stickers: ['🦋','🐝','🌈','⭐','🌟','✨','💫','☀️','🌙','❄️','🍒','🍓'] },
  { label: '💕 Cute',    stickers: ['❤️','💕','💖','💗','💓','💞','🎀','🎁','🎈','👑','🦄','🧸'] },
  { label: '😸 Animals', stickers: ['🐱','🐶','🐰','🐻','🐼','🐨','🦊','🐸','🐧','🦋','🐠','🐣'] },
  { label: '🍰 Food',    stickers: ['🍰','🎂','🧁','🍭','🍬','🍫','🍩','🍪','☕','🧋','🍵','🥐'] },
  { label: '✏️ Fun',     stickers: ['📚','📖','🎵','🎶','🎨','🖌️','📸','🎬','🎠','🎡','🎢','🎪'] },
];

const StickerLibrary = ({ onAdd, onAddImage }) => {
  const fileRef = useRef();
  const [activeGroup, setActiveGroup] = React.useState(0);

  const handleImageSticker = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onAddImage && onAddImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">🎨 Stickers</h3>
        <button
          onClick={() => fileRef.current.click()}
          className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-lg hover:bg-pink-200"
          title="Upload a sticker image"
        >
          + Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSticker} />
      </div>

      {/* Group tabs */}
      <div className="flex gap-1 flex-wrap mb-3">
        {STICKER_GROUPS.map((g, i) => (
          <button
            key={i}
            onClick={() => setActiveGroup(i)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${activeGroup === i ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-pink-100'}`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Stickers grid */}
      <div className="grid grid-cols-6 gap-1">
        {STICKER_GROUPS[activeGroup].stickers.map((sticker) => (
          <button
            key={sticker}
            onClick={() => onAdd(sticker)}
            className="text-2xl p-1 rounded-lg hover:bg-pink-50 hover:scale-125 transition-transform"
          >
            {sticker}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickerLibrary;
