import React, { useState, useRef, useEffect } from 'react';

const FILTERS = [
  { name: 'Normal',    value: 'none' },
  { name: 'Warm',      value: 'sepia(40%) saturate(150%) hue-rotate(-15deg)' },
  { name: 'Cool',      value: 'saturate(80%) hue-rotate(30deg) brightness(105%)' },
  { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Sepia',     value: 'sepia(100%)' },
  { name: 'Vintage',   value: 'sepia(50%) contrast(85%) brightness(90%) saturate(120%)' },
  { name: 'Fade',      value: 'brightness(115%) saturate(70%) contrast(88%)' },
  { name: 'Vivid',     value: 'saturate(170%) contrast(110%)' },
  { name: 'Dramatic',  value: 'contrast(140%) saturate(80%) brightness(88%)' },
  { name: 'Soft',      value: 'brightness(108%) contrast(90%) saturate(90%)' },
];

const HANDLE_SIZE = 14;

const PhotoEditor = ({ src, onSave, onCancel }) => {
  const imgRef    = useRef();
  const canvasRef = useRef();
  const boxRef    = useRef();

  const [filter,     setFilter]     = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast,   setContrast]   = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [tab,        setTab]        = useState('filters'); // 'filters' | 'crop' | 'adjust'
  const [imgLoaded,  setImgLoaded]  = useState(false);

  // Crop box: {x,y,w,h} in px relative to the displayed image
  const [box, setBox] = useState(null);

  const combinedFilter = [
    filter !== 'none' ? filter : '',
    `brightness(${brightness}%)`,
    `contrast(${contrast}%)`,
    `saturate(${saturation}%)`,
  ].filter(Boolean).join(' ');

  // Init crop box when tab switches to crop
  useEffect(() => {
    if (tab === 'crop' && imgLoaded && imgRef.current) {
      const { offsetWidth: w, offsetHeight: h } = imgRef.current;
      const pad = Math.min(w, h) * 0.1;
      setBox({ x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 });
    }
  }, [tab, imgLoaded]);

  // ── drag handle logic ──────────────────────────────────────────────────────
  const startDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX ?? e.touches?.[0].clientX;
    const sy = e.clientY ?? e.touches?.[0].clientY;
    const snap = { ...box };
    const imgW = imgRef.current.offsetWidth;
    const imgH = imgRef.current.offsetHeight;
    const MIN  = 40;

    const onMove = (me) => {
      const cx = (me.clientX ?? me.touches?.[0].clientX) - sx;
      const cy = (me.clientY ?? me.touches?.[0].clientY) - sy;
      setBox(() => {
        let { x, y, w, h } = snap;
        if (type === 'move') {
          x = Math.max(0, Math.min(imgW - w, snap.x + cx));
          y = Math.max(0, Math.min(imgH - h, snap.y + cy));
        }
        if (type.includes('l')) { const nx = Math.min(snap.x + cx, snap.x + snap.w - MIN); x = Math.max(0, nx); w = snap.w + (snap.x - x); }
        if (type.includes('r')) { w = Math.max(MIN, Math.min(snap.w + cx, imgW - snap.x)); }
        if (type.includes('t')) { const ny = Math.min(snap.y + cy, snap.y + snap.h - MIN); y = Math.max(0, ny); h = snap.h + (snap.y - y); }
        if (type.includes('b')) { h = Math.max(MIN, Math.min(snap.h + cy, imgH - snap.y)); }
        return { x, y, w, h };
      });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend',  onUp);
  };

  // ── apply & export ─────────────────────────────────────────────────────────
  const handleSave = () => {
    const img  = imgRef.current;
    const cvs  = canvasRef.current;
    const ctx  = cvs.getContext('2d');
    const dw   = img.offsetWidth;
    const dh   = img.offsetHeight;
    const iw   = img.naturalWidth;
    const ih   = img.naturalHeight;
    const sx   = iw / dw;
    const sy   = ih / dh;

    let cropX = 0, cropY = 0, cropW = iw, cropH = ih;
    if (tab === 'crop' && box) {
      cropX = box.x * sx;
      cropY = box.y * sy;
      cropW = box.w * sx;
      cropH = box.h * sy;
    }

    cvs.width  = cropW;
    cvs.height = cropH;
    ctx.filter = combinedFilter;
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    onSave(cvs.toDataURL('image/jpeg', 0.92));
  };

  const HS = HANDLE_SIZE;
  const hx = (rx) => box ? box.x + rx * box.w - HS / 2 : 0;
  const hy = (ry) => box ? box.y + ry * box.h - HS / 2 : 0;

  const handles = box ? [
    { type: 'tl', rx: 0,   ry: 0,   cursor: 'nw-resize' },
    { type: 't',  rx: 0.5, ry: 0,   cursor: 'n-resize'  },
    { type: 'tr', rx: 1,   ry: 0,   cursor: 'ne-resize' },
    { type: 'r',  rx: 1,   ry: 0.5, cursor: 'e-resize'  },
    { type: 'br', rx: 1,   ry: 1,   cursor: 'se-resize' },
    { type: 'b',  rx: 0.5, ry: 1,   cursor: 's-resize'  },
    { type: 'bl', rx: 0,   ry: 1,   cursor: 'sw-resize' },
    { type: 'l',  rx: 0,   ry: 0.5, cursor: 'w-resize'  },
  ] : [];

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[95vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-base font-bold text-gray-800">✏️ Edit Photo</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[['filters','🎨 Filters'],['crop','✂️ Crop'],['adjust','⚙️ Adjust']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === t ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Image area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Preview */}
          <div ref={boxRef} className="relative w-full select-none overflow-hidden rounded-xl bg-gray-100">
            <img
              ref={imgRef}
              src={src}
              alt="edit"
              crossOrigin="anonymous"
              className="w-full block rounded-xl"
              style={{ filter: combinedFilter }}
              draggable={false}
              onLoad={() => setImgLoaded(true)}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Crop overlay */}
            {tab === 'crop' && box && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Dark mask */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  <defs>
                    <mask id="cropMask">
                      <rect width="100%" height="100%" fill="white" />
                      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="black" />
                    </mask>
                  </defs>
                  <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#cropMask)" />
                </svg>

                {/* Crop box border */}
                <div
                  className="absolute border-2 border-white"
                  style={{ left: box.x, top: box.y, width: box.w, height: box.h, pointerEvents: 'auto', cursor: 'move' }}
                  onMouseDown={(e) => startDrag(e, 'move')}
                  onTouchStart={(e) => startDrag(e, 'move')}
                >
                  {/* Rule-of-thirds grid */}
                  {[1,2].map(i => (
                    <React.Fragment key={i}>
                      <div className="absolute top-0 bottom-0 border-l border-white/30" style={{ left: `${i*33.33}%` }} />
                      <div className="absolute left-0 right-0 border-t border-white/30" style={{ top: `${i*33.33}%` }} />
                    </React.Fragment>
                  ))}
                </div>

                {/* Handles */}
                {handles.map(h => (
                  <div
                    key={h.type}
                    className="absolute bg-white rounded-full shadow-md border-2 border-pink-500 z-10"
                    style={{
                      left: hx(h.rx), top: hy(h.ry),
                      width: HS, height: HS,
                      cursor: h.cursor,
                      pointerEvents: 'auto',
                    }}
                    onMouseDown={(e) => startDrag(e, h.type)}
                    onTouchStart={(e) => startDrag(e, h.type)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── FILTERS tab ── */}
          {tab === 'filters' && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map(f => (
                <button key={f.name} onClick={() => setFilter(f.value)} className="flex-shrink-0 text-center">
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden mb-1"
                    style={{ border: filter === f.value ? '2px solid #ec4899' : '2px solid #e5e7eb' }}
                  >
                    <img src={src} alt={f.name} style={{ width:'100%', height:'100%', objectFit:'cover', filter: f.value !== 'none' ? f.value : '' }} />
                  </div>
                  <span className="text-xs text-gray-600">{f.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* ── CROP tab ── */}
          {tab === 'crop' && (
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">Drag the <strong>handles</strong> to resize • Drag <strong>inside</strong> the box to move</p>
              <button
                onClick={() => {
                  const { offsetWidth: w, offsetHeight: h } = imgRef.current;
                  const p = Math.min(w,h)*0.1;
                  setBox({ x:p, y:p, w:w-p*2, h:h-p*2 });
                }}
                className="text-xs text-pink-500 hover:underline"
              >↺ Reset crop</button>
            </div>
          )}

          {/* ── ADJUST tab ── */}
          {tab === 'adjust' && (
            <div className="space-y-4">
              {[
                { label: '☀️ Brightness', value: brightness, set: setBrightness, min: 50,  max: 150 },
                { label: '◑ Contrast',   value: contrast,   set: setContrast,   min: 50,  max: 150 },
                { label: '🎨 Saturation', value: saturation, set: setSaturation, min: 0,   max: 200 },
              ].map(({ label, value, set, min, max }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{label}</span>
                    <button onClick={() => set(100)} className="hover:text-pink-500">↺ Reset</button>
                  </div>
                  <input
                    type="range" min={min} max={max} value={value}
                    onChange={e => set(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 p-4 border-t">
          <button onClick={onCancel} className="flex-1 py-2 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700">
            ✅ Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
