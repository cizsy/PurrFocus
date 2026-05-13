import React, { useEffect, useRef, useState } from "react";
import { Check, Plus, Target, Trash2, X } from "lucide-react";

import { catAssets } from "../catAssets";
import { purrThemes, DEFAULT_THEME } from "../purrThemes";

const getSavedThemeName = () => {
  try {
    const savedSettings = JSON.parse(
      localStorage.getItem("purrfocus_settings") || "{}"
    );

    return savedSettings.theme || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

function FloatingSubtask({
  activeTask,
  onToggleSubtask,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onClose,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [themeName, setThemeName] = useState(getSavedThemeName);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  const surface = theme.cardBg || theme.panelBg;
  const softSurface = theme.cardSoft || "bg-white/40";
  const strongSurface = theme.cardStrong || "bg-white/60";
  const divider = theme.divider || "border-black/5";

  const catColor = theme.isDark ? "white" : "black";
  const catAngry = catAssets?.[catColor]?.angry || catAssets?.black?.angry;
  const catSad = catAssets?.[catColor]?.sad || catAssets?.black?.sad;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleThemeChange = (event) => {
      setThemeName(event.detail || getSavedThemeName());
    };

    window.addEventListener("purrfocus-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("purrfocus-theme-change", handleThemeChange);
    };
  }, []);

  const handlePointerDown = (event) => {
    if (
      event.target.closest("button") ||
      event.target.closest("input") ||
      event.target.closest("textarea")
    ) {
      return;
    }

    setIsDragging(true);

    dragStartRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!isDragging) return;

      setPosition({
        x: event.clientX - dragStartRef.current.x,
        y: event.clientY - dragStartRef.current.y,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const handleAdd = (event) => {
    if (event.key === "Enter" && newText.trim()) {
      onAddSubtask(activeTask.id, newText.trim());
      setNewText("");
      setIsAdding(false);
    }

    if (event.key === "Escape") {
      setIsAdding(false);
      setNewText("");
    }
  };

  const handleEdit = (event, subId) => {
    if (event.key === "Enter" && editText.trim()) {
      onEditSubtask(activeTask.id, subId, editText.trim());
      setEditingId(null);
      setEditText("");
    }

    if (event.key === "Escape") {
      setEditingId(null);
      setEditText("");
    }
  };

  if (!activeTask) {
    return (
      <div
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className={`absolute z-50 flex w-72 flex-col items-center justify-center rounded-[2rem] border ${theme.border} ${surface} p-5 text-center shadow-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing`}
        onPointerDown={handlePointerDown}
      >
        {catAngry || catSad ? (
          <img
            src={catAngry || catSad}
            alt=""
            className="mb-3 h-24 w-24 object-contain"
          />
        ) : (
          <p className="mb-3 text-4xl">🙀</p>
        )}

        <h3 className={`text-sm font-black ${theme.text}`}>
          Belum ada target aktif
        </h3>

        <p className={`mt-2 text-xs font-bold leading-relaxed ${theme.muted}`}>
          Pilih target dulu sebelum melihat subtask.
        </p>

        <button
          onClick={onClose}
          className={`mt-5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${theme.button}`}
        >
          Tutup
        </button>
      </div>
    );
  }

  const subtasks = activeTask.subtasks || [];

  return (
    <div
      className="absolute bottom-24 left-10 z-[60] pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
    >
      <div
        className={`w-[320px] rounded-[2rem] border ${theme.border} ${surface} p-5 shadow-2xl backdrop-blur-xl pointer-events-auto`}
      >
        {/* HEADER */}
        <div
          className={`mb-4 flex cursor-grab items-center justify-between border-b ${divider} pb-3 select-none active:cursor-grabbing`}
          onPointerDown={handlePointerDown}
        >
          <div className="pointer-events-none min-w-0">
            <p
              className={`text-[9px] font-black uppercase tracking-[0.25em] ${theme.muted}`}
            >
              Target Aktif
            </p>

            <div className="mt-1 flex items-center gap-2">
              <Target size={15} strokeWidth={2.7} className={theme.muted} />

              <h3 className={`w-48 truncate text-sm font-black ${theme.text}`}>
                {activeTask.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
            title="Tutup"
          >
            <X size={15} strokeWidth={3} />
          </button>
        </div>

        {/* LIST */}
        <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
          {subtasks.length === 0 && !isAdding && (
            <div
              className={`rounded-[1.3rem] ${softSurface} px-4 py-5 text-center`}
            >
              {catSad && (
                <img
                  src={catSad}
                  alt=""
                  className="mx-auto mb-2 h-16 w-16 object-contain opacity-90"
                />
              )}

              <p className={`text-xs font-bold leading-relaxed ${theme.muted}`}>
                Belum ada subtask. Tambahkan langkah kecil biar target ini lebih
                gampang dikerjakan.
              </p>
            </div>
          )}

          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className={`group flex items-center gap-2 rounded-xl border ${theme.border} ${strongSurface} p-2.5 shadow-sm transition-all hover:shadow-md`}
            >
              <button
                type="button"
                onClick={() => onToggleSubtask(activeTask.id, subtask.id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                  subtask.completed
                    ? "border-transparent bg-black/70 text-white"
                    : "border-black/20 bg-white/20"
                }`}
                title={subtask.completed ? "Tandai belum selesai" : "Tandai selesai"}
              >
                {subtask.completed && <Check size={13} strokeWidth={3} />}
              </button>

              {editingId === subtask.id ? (
                <input
                  autoFocus
                  className={`min-w-0 flex-1 border-b ${divider} bg-transparent text-[12px] font-bold outline-none ${theme.text}`}
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                  onKeyDown={(event) => handleEdit(event, subtask.id)}
                  onBlur={() => {
                    setEditingId(null);
                    setEditText("");
                  }}
                />
              ) : (
                <span
                  className={`min-w-0 flex-1 cursor-text truncate text-[12px] font-bold transition-colors ${
                    subtask.completed
                      ? `line-through opacity-45 ${theme.muted}`
                      : theme.text
                  }`}
                  onClick={() => {
                    setEditingId(subtask.id);
                    setEditText(subtask.text);
                  }}
                >
                  {subtask.text}
                </span>
              )}

              <button
                onClick={() => onDeleteSubtask(activeTask.id, subtask.id)}
                className="opacity-0 transition-all group-hover:opacity-100 text-red-400 hover:text-red-600"
                title="Hapus subtask"
              >
                <Trash2 size={14} strokeWidth={2.6} />
              </button>
            </div>
          ))}

          {isAdding && (
            <div
              className={`flex items-center gap-2 rounded-xl border ${theme.border} ${softSurface} p-2.5`}
            >
              <div className="h-5 w-5 shrink-0 rounded-md border border-black/20 bg-white/20" />

              <input
                autoFocus
                placeholder="Tulis langkah kecil..."
                className={`min-w-0 flex-1 bg-transparent text-[12px] font-bold outline-none placeholder:opacity-50 ${theme.text}`}
                value={newText}
                onChange={(event) => setNewText(event.target.value)}
                onKeyDown={handleAdd}
                onBlur={() => {
                  setIsAdding(false);
                  setNewText("");
                }}
              />
            </div>
          )}
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed ${theme.border} py-2.5 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${theme.muted} hover:opacity-80`}
          >
            <Plus size={15} strokeWidth={3} />
            Tambah Subtask
          </button>
        )}
      </div>
    </div>
  );
}

export default FloatingSubtask;