import React, { useEffect, useRef, useState } from "react";
import { X, NotebookPen } from "lucide-react";

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

function FloatingNotes({ activeTask, onUpdateNotes, onClose }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [themeName, setThemeName] = useState(getSavedThemeName);

  const dragStartRef = useRef({ x: 0, y: 0 });

  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];
  const surface = theme.cardBg || theme.panelBg;
  const softSurface = theme.cardSoft || "bg-white/40";
  const divider = theme.divider || "border-black/5";

  const catColor = theme.isDark ? "white" : "black";
  const catSad = catAssets?.[catColor]?.sad || catAssets?.black?.sad;
  const catAngry = catAssets?.[catColor]?.angry || catAssets?.black?.angry;

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
      event.target.closest("textarea") ||
      event.target.closest("input")
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

  if (!activeTask) {
    return (
      <div
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onPointerDown={handlePointerDown}
        className={`absolute z-50 w-72 rounded-[2rem] border ${theme.border} ${surface} p-5 text-center shadow-2xl backdrop-blur-xl cursor-grab active:cursor-grabbing`}
      >
        {catAngry || catSad ? (
          <img
            src={catAngry || catSad}
            alt=""
            className="mx-auto mb-3 h-24 w-24 object-contain"
          />
        ) : (
          <p className="mb-3 text-4xl">🙀</p>
        )}

        <h3 className={`text-sm font-black ${theme.text}`}>
          Belum ada target aktif
        </h3>

        <p className={`mt-2 text-xs font-bold leading-relaxed ${theme.muted}`}>
          Pilih target dulu sebelum menulis catatan fokus.
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

  return (
    <div
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={`absolute z-50 flex w-80 flex-col gap-3 rounded-[2rem] border ${theme.border} ${surface} p-4 shadow-2xl backdrop-blur-xl`}
    >
      {/* DRAG HEADER */}
      <div
        className={`flex cursor-grab items-start justify-between border-b ${divider} pb-3 active:cursor-grabbing`}
        onPointerDown={handlePointerDown}
      >
        <div className="pointer-events-none min-w-0">
          <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${theme.muted}`}>
            Catatan Fokus
          </p>

          <div className="mt-1 flex items-center gap-2">
            <NotebookPen size={15} strokeWidth={2.7} className={theme.muted} />

            <h3 className={`w-52 truncate text-sm font-black ${theme.text}`}>
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

      <textarea
        value={activeTask.notes || ""}
        onChange={(event) => onUpdateNotes(activeTask.id, event.target.value)}
        placeholder="Tulis ide, kendala, atau hal penting dari sesi ini..."
        className={`h-[190px] w-full resize-none rounded-[1.3rem] border ${theme.border} ${softSurface} p-4 text-[13px] font-medium leading-relaxed outline-none transition-all focus:ring-2 ${theme.ring || "ring-black/10"} custom-scrollbar placeholder:opacity-50 ${theme.text}`}
      />

      <p className={`text-[10px] font-bold leading-relaxed ${theme.muted}`}>
        Catatan tersimpan otomatis saat kamu mengetik.
      </p>
    </div>
  );
}

export default FloatingNotes;