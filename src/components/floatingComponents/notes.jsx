import React, { useState, useEffect, useRef } from 'react';

function FloatingNotes({ activeTask, onUpdateNotes, onClose }) {
  // --- Fitur Drag & Drop ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    // 🚨 LUBANG UX DITAMBAL: Pengecualian button DAN textarea agar nggak keseret pas ngetik!
    if (e.target.closest('button') || e.target.closest('textarea')) return;
    
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

  // 🚨 LUBANG CRASH DITAMBAL: Pengaman kalau user nggak pilih tugas
  if (!activeTask) {
    return (
      <div 
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className="absolute z-50 w-64 bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/60 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
      >
        <p className="text-3xl mb-2">🙀</p>
        <p className="text-xs font-bold text-slate-600">Pilih target mangsa dulu di Dashboard!</p>
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg text-[10px] font-black tracking-wider transition-colors"
        >
          Tutup
        </button>
      </div>
    );
  }

  return (
    <div 
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className="absolute z-50 w-72 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/60 flex flex-col gap-3"
    >
      {/* Header Drag Area */}
      <div 
        className="flex justify-between items-start cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
      >
        <div className="pointer-events-none">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Catatan Mangsa</h4>
          <h3 className="text-xs font-black text-slate-800 line-clamp-1 truncate w-44">
            📝 {activeTask.title}
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-xs"
          title="Tutup"
        >
          ✕
        </button>
      </div>

      {/* Text Area */}
      <textarea
        value={activeTask.notes || ""}
        onChange={(e) => onUpdateNotes(activeTask.id, e.target.value)}
        placeholder="Tulis ide, kendala, atau hal penting dari mangsa ini..."
        className="w-full h-[180px] p-4 text-[13px] font-medium text-slate-700 bg-white/50 border border-white/60 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-[#4a7ec2]/50 focus:bg-white transition-all resize-none custom-scrollbar placeholder:text-slate-400"
      />
    </div>
  );
}

export default FloatingNotes;