import React, { useState } from 'react';

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

  if (!activeTask) return null;

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
    <div className="absolute bottom-24 left-10 z-[60] pointer-events-none">
      <div className="w-[300px] bg-white rounded-[2rem] shadow-2xl border border-blue-100 p-5 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Target Aktif</h4>
            <h3 className="text-xs font-black text-slate-800 line-clamp-1 truncate w-44">
              🎯 {activeTask.title}
            </h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors text-xs">✕</button>
        </div>

        {/* Scrollable Area */}
        <div className="max-h-[200px] overflow-y-auto custom-scrollbar pr-1 space-y-2">
          {activeTask.subtasks.map((sub) => (
            <div key={sub.id} className="group flex items-center gap-2 p-2.5 rounded-xl border bg-white border-slate-100 shadow-sm transition-all">
              <input 
                type="checkbox" 
                checked={sub.completed} 
                onChange={() => onToggleSubtask(activeTask.id, sub.id)}
                className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 checked:bg-blue-500 cursor-pointer"
              />
              
              {editingId === sub.id ? (
                <input
                  autoFocus
                  className="flex-1 text-[12px] font-bold text-slate-700 outline-none border-b border-blue-400"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleEdit(e, sub.id)}
                  onBlur={() => setEditingId(null)}
                />
              ) : (
                <span 
                  className={`flex-1 text-[12px] font-bold cursor-pointer ${sub.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                  onClick={() => {
                    setEditingId(sub.id);
                    setEditText(sub.text);
                  }}
                >
                  {sub.text}
                </span>
              )}

              <button onClick={() => onDeleteSubtask(activeTask.id, sub.id)} className="opacity-0 group-hover:opacity-100 p-1 text-[10px] hover:bg-red-50 rounded">🗑️</button>
            </div>
          ))}

          {/* Inline Input untuk Tambah Baru */}
          {isAdding && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-200 bg-blue-50/30">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
              <input
                autoFocus
                placeholder="Nama mangsa..."
                className="flex-1 bg-transparent text-[12px] font-bold text-slate-700 outline-none"
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
            className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all"
          >
            + Tambah Sub-rencana
          </button>
        )}
      </div>
    </div>
  );
}

export default FloatingSubtask;