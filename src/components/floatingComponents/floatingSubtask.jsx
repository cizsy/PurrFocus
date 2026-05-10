import React, { useState, useEffect, useRef } from 'react';

function FloatingSubtask({ 
  activeTask, 
  onToggleSubtask, 
  onAddSubtask, 
  onEditSubtask, 
  onDeleteSubtask, 
  onClose 
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // --- Fitur Drag & Drop ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    // Hanya aktifkan drag jika klik pada area header, bukan pada input/button
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

  const handleAdd = (e) => {
    if (e.key === 'Enter' && newText.trim()) {
      onAddSubtask(activeTask.id, newText);
      setNewText("");
      setIsAdding(false);
    }
    if (e.key === 'Escape') setIsAdding(false);
  };

  const handleEdit = (e, subId) => {
    if (e.key === 'Enter' && editText.trim()) {
      onEditSubtask(activeTask.id, subId, editText);
      setEditingId(null);
    }
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div 
      className="absolute bottom-24 left-10 z-[60] pointer-events-none"
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
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Target Aktif</h4>
            <h3 className="text-xs font-black text-slate-800 line-clamp-1 truncate w-44">
              🎯 {activeTask.title}
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

        {/* Scrollable Area */}
        <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-1 space-y-2">
          {activeTask.subtasks.length === 0 && !isAdding && (
            <p className="text-[10px] text-center text-slate-400 italic py-2">Belum ada sub-rencana. Tambahkan mangsa baru! 🐾</p>
          )}

          {activeTask.subtasks.map((sub) => (
            <div key={sub.id} className="group flex items-center gap-2 p-2.5 rounded-xl border bg-white/50 border-white/60 shadow-sm transition-all hover:bg-white hover:shadow-md">
              <input 
                type="checkbox" 
                checked={sub.completed} 
                onChange={() => onToggleSubtask(activeTask.id, sub.id)}
                className="w-3.5 h-3.5 rounded-full border-2 border-[#4a7ec2] checked:bg-[#4a7ec2] cursor-pointer"
              />
              
              {editingId === sub.id ? (
                <input
                  autoFocus
                  className="flex-1 text-[12px] font-bold text-slate-700 outline-none border-b border-[#4a7ec2] bg-transparent"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleEdit(e, sub.id)}
                  onBlur={() => setEditingId(null)}
                />
              ) : (
                <span 
                  className={`flex-1 text-[12px] font-bold cursor-pointer transition-colors ${sub.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                  onClick={() => {
                    setEditingId(sub.id);
                    setEditText(sub.text);
                  }}
                >
                  {sub.text}
                </span>
              )}

              <button 
                onClick={() => onDeleteSubtask(activeTask.id, sub.id)} 
                className="opacity-0 group-hover:opacity-100 p-1.5 text-[10px] hover:bg-red-100 rounded-lg transition-colors"
                title="Hapus"
              >
                🗑️
              </button>
            </div>
          ))}

          {/* Inline Input untuk Tambah Baru */}
          {isAdding && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-[#4a7ec2]/30 bg-[#4a7ec2]/10">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
              <input
                autoFocus
                placeholder="Nama mangsa..."
                className="flex-1 bg-transparent text-[12px] font-bold text-slate-700 outline-none placeholder:text-slate-400"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={handleAdd}
                onBlur={() => setIsAdding(false)}
              />
            </div>
          )}
        </div>

        {/* Tombol Tambah */}
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-[10px] font-black uppercase tracking-wider hover:border-[#4a7ec2] hover:text-[#4a7ec2] hover:bg-[#4a7ec2]/10 transition-all active:scale-95"
          >
            + Tambah Sub-rencana
          </button>
        )}
      </div>
    </div>
  );
}

export default FloatingSubtask;