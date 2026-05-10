import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

function FloatingMusic({ onClose }) {
  const [videoId, setVideoId] = useState('vvThzcBfnyc'); // Default Lofi Girl
  const [tempLink, setTempLink] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // --- Fitur Drag & Drop ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    // LUBANG UX DITUTUP: Mencegah drag saat user sedang mengeklik tombol atau input teks
    if (e.target.closest('button') || e.target.closest('input')) return;
    
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

  // LUBANG BUG DITUTUP: Mengekstrak ID dari URL utuh
  const handleUpdateLink = (e) => {
    e.preventDefault();
    if (!tempLink.trim()) return;

    // Regex canggih untuk mengambil ID dari berbagai format link YouTube
    const match = tempLink.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    
    if (match && match[1]) {
      setVideoId(match[1]); // Jika link utuh, ambil ID-nya
      setTempLink(''); // Kosongkan input
      toast.success("Musik berhasil diganti! 🎵");
    } else if (tempLink.length === 11) {
      setVideoId(tempLink); // Jika user memang cuma paste 11 digit ID
      setTempLink('');
      toast.success("Musik berhasil diganti! 🎵");
    } else {
      toast.error("Link YouTube tidak valid! 🙀");
    }
  };

  return (
    <div 
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className="absolute z-50 w-80 bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/60 flex flex-col transition-all"
    >
      {/* Header Drag Area */}
      <div 
        className="flex justify-between items-center cursor-grab active:cursor-grabbing mb-2"
        onPointerDown={handlePointerDown}
      >
        <div className="pointer-events-none flex items-center gap-2">
          <span className="text-lg drop-shadow-sm">🎵</span>
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Lofi Player</h4>
          </div>
        </div>
        <div className="flex gap-1">
           <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-xs"
            title={isMinimized ? "Perbesar" : "Perkecil"}
          >
            {isMinimized ? '🔽' : '🔼'}
          </button>
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-xs"
            title="Tutup"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={`transition-all duration-300 overflow-hidden ${isMinimized ? 'opacity-0 h-0 w-0 pointer-events-none' : 'opacity-100 mt-2'}`}>
        
        <form onSubmit={handleUpdateLink} className="flex gap-2 mb-3">
          <input 
            type="text"
            placeholder="Tempel link YouTube di sini..."
            value={tempLink}
            onChange={(e) => setTempLink(e.target.value)}
            className="flex-1 bg-white/50 border border-white/60 rounded-xl px-3 py-2 text-[11px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-[#4a7ec2]/50 focus:bg-white transition-all placeholder:text-slate-400"
          />
          <button type="submit" className="bg-[#4a7ec2] hover:bg-[#2d5c94] text-white text-[9px] px-3 py-2 rounded-xl font-black uppercase tracking-wider transition-colors active:scale-95 shadow-sm">
            GO
          </button>
        </form>

        {/* Iframe Container */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video shadow-inner border border-slate-200/50">
           <iframe
              width="100%"
              height="100%"
              // LUBANG ATURAN BROWSER DITUTUP: Set autoplay=0 agar tidak error
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
              title="YouTube music"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
           ></iframe>
        </div>
        <p className="text-[8px] font-bold text-slate-400 mt-2 text-center uppercase tracking-widest">
          Klik tombol Play untuk memutar musik 🎧
        </p>
      </div>
    </div>
  );
}

export default FloatingMusic;