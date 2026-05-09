import React, { useState, useEffect, useRef } from 'react';

function FloatingMusic({ onClose }) {
  const [videoId, setVideoId] = useState('vvThzcBfnyc'); // Default 
  const [tempLink, setTempLink] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // --- Fitur Drag & Drop (Konsisten dengan Kalkulator) ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    };

    const handlePointerUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  // --- Logic Extract YouTube URL ---
  const handleUpdateLink = (e) => {
    e.preventDefault();
    if (!tempLink) return;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = tempLink.match(regExp);
    
    if (match && match[2].length === 11) {
      setVideoId(match[2]);
      setTempLink('');
    } else {
      alert("Link YouTube tidak valid ya! 🐾");
    }
  };

  return (
    <div 
      className="absolute bottom-24 left-8 z-[100] pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
      }}
    >
      <div 
        className={`pointer-events-auto bg-white/90 backdrop-blur-2xl shadow-2xl transition-all duration-500 ease-in-out border border-white/40 overflow-hidden ${
          isMinimized ? 'w-14 h-14 rounded-full flex items-center justify-center' : 'w-80 rounded-[2rem] p-5'
        }`}
      >
        
        {/* HEADER (Drag Handle) */}
        <div 
          className={`flex justify-between items-center cursor-grab active:cursor-grabbing select-none ${isMinimized ? 'w-full h-full justify-center' : ''}`}
          onPointerDown={handlePointerDown}
        >
          {isMinimized ? (
            // Tampilan saat Minimized (Cuma tombol Expand)
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }} 
              className="w-full h-full flex items-center justify-center text-2xl hover:scale-110 transition-transform"
              title="Buka Radio"
            >
              🎵
            </button>
          ) : (
            // Tampilan saat Maximized
            <>
              <div className="flex items-center gap-2 pointer-events-none">
                <span className="text-xl">🎵</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Purr Radio</h3>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} 
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-[10px]"
                >
                  ➖
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }} 
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-[10px]"
                >
                  ✕
                </button>
              </div>
            </>
          )}
        </div>

        {/* KONTEN UTAMA (Disembunyikan secara visual jika minimized, tapi tidak di-unmount) */}
        <div className={`transition-all duration-500 ${isMinimized ? 'opacity-0 h-0 w-0 pointer-events-none' : 'opacity-100 mt-4'}`}>
          
          <form onSubmit={handleUpdateLink} className="flex gap-2 mb-4">
            <input 
              type="text"
              placeholder="Tempel link YouTube di sini..."
              value={tempLink}
              onChange={(e) => setTempLink(e.target.value)}
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#4a7ec2]/50 transition-all"
            />
            <button type="submit" className="bg-[#4a7ec2] hover:bg-[#2d5c94] text-white text-[10px] px-4 py-2.5 rounded-xl font-black uppercase tracking-wider transition-colors active:scale-95">
              GO
            </button>
          </form>

          {/* Iframe Container - Selalu render, hanya berubah ukuran */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-inner border border-slate-800">
             <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}`}
                title="YouTube music"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                className="absolute inset-0"
             ></iframe>
          </div>
          
        </div>

      </div>
    </div>
  );
}

export default FloatingMusic;