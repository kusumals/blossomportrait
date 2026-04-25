import React, { useRef, useEffect } from 'react';

const DraggablePhoto = ({ src, photoX = 0, photoY = 0, photoScale = 1, onChange, height = '192px' }) => {
  const containerRef = useRef();
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastDist = useRef(null);
  // keep latest values accessible inside event listeners without re-binding
  const state = useRef({ photoX, photoY, photoScale });
  state.current = { photoX, photoY, photoScale };

  // ── mouse ──────────────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    onChange({ photoX: state.current.photoX + dx, photoY: state.current.photoY + dy });
  };

  const onMouseUp = () => { dragging.current = false; };

  // ── touch (pan + pinch zoom) ───────────────────────────────────────────────
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      dragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastDist.current = null;
    } else if (e.touches.length === 2) {
      dragging.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist.current = Math.hypot(dx, dy);
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      onChange({ photoX: state.current.photoX + dx, photoY: state.current.photoY + dy });
    } else if (e.touches.length === 2 && lastDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = (dist - lastDist.current) * 0.003;
      lastDist.current = dist;
      const next = Math.max(1, Math.min(3, state.current.photoScale + delta));
      onChange({ photoScale: next });
    }
  };

  const onTouchEnd = () => {
    dragging.current = false;
    lastDist.current = null;
  };

  // ── scroll wheel zoom ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const next = Math.max(1, Math.min(3, state.current.photoScale + delta));
      onChange({ photoScale: next });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onChange]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl bg-gray-100 select-none cursor-grab active:cursor-grabbing"
      style={{ height }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={src}
        alt="photo"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          transform: `translate(${photoX}px, ${photoY}px) scale(${photoScale})`,
          transformOrigin: 'center center',
        }}
      />
      {/* hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full pointer-events-none whitespace-nowrap">
        Drag to move • Pinch / scroll to zoom
      </div>
    </div>
  );
};

export default DraggablePhoto;
