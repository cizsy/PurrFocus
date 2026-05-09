import React from 'react';

function FloatingNotes({ activeTask, onUpdateNotes, onClose }) {
  if (!activeTask) return null;

  return (
    /* Posisi di atas ikon notes (geser kiri dikit dari subtask) */
    <div className="absolute bottom-24 left-28 z-[60] pointer-events-none">
      <div className="w-[300px] bg-white rounded-[2rem] shadow-2xl border border-blue-100 p-5 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Catatan Mangsa</h4>
            <h3 className="text-xs font-black text-slate-800 line-clamp-1 truncate w-44">
              📝 {activeTask.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={activeTask.notes || ""}
          onChange={(e) => onUpdateNotes(activeTask.id, e.target.value)}
          placeholder="Tulis ide, kendala, atau hal penting dari mangsa ini..."
          className="w-full h-[180px] p-4 text-[13px] font-medium text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all resize-none custom-scrollbar"
        />
        
        <p className="text-[9px] text-slate-400 text-center mt-3 uppercase tracking-widest font-bold">
          Menyimpan otomatis 💾
        </p>
      </div>
    </div>
  );
}

export default FloatingNotes;