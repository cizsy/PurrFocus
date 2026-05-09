import React, { useState, useEffect, useRef } from 'react';

function FloatingNotes({ activeTask, onUpdateNotes, onClose }) {
  // --- Fitur Drag & Drop ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    // Jangan aktifkan drag jika user mengklik tombol close
    if (e.target.closest('button')) return;
    
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

  if (!activeTask) return null;

  return (
    <div 
      className="absolute bottom-24 left-28 z-[60] pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
      }}
    >
      <div className="w-[300px] bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/40 p-5 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
        
        {/* Header (Bisa di-Drag) */}
        <div 
          className="flex justify-between items-center mb-4 cursor-grab active:cursor-grabbing select-none"
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

        {/* Text Area - Efek inner shadow dan semi-transparan */}
        <textarea
          value={activeTask.notes || ""}
          onChange={(e) => onUpdateNotes(activeTask.id, e.target.value)}
          placeholder="Tulis ide, kendala, atau hal penting dari mangsa ini..."
          className="w-full h-[180px] p-4 text-[13px] font-medium text-slate-700 bg-white/50 border border-white/60 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-[#4a7ec2]/50 focus:bg-white transition-all resize-none custom-scrollbar placeholder:text-slate-400"
        />
        
        <p className="text-[9px] text-slate-400 text-center mt-3 uppercase tracking-widest font-black pointer-events-none">
          Menyimpan otomatis 💾
        </p>
      </div>
    </div>
  );
}

export default FloatingNotes;