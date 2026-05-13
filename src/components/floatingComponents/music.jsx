import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Music, X } from "lucide-react";

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

function FloatingMusic({ onClose }) {
  const [videoId, setVideoId] = useState("vvThzcBfnyc");
  const [tempLink, setTempLink] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const [themeName, setThemeName] = useState(getSavedThemeName);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  const surface = theme.cardBg || theme.panelBg;
  const softSurface = theme.cardSoft || "bg-white/40";
  const divider = theme.divider || "border-black/5";

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
      event.target.closest("iframe")
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

  const extractYoutubeId = (input) => {
    const trimmed = input.trim();

    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtube\.com\/shorts\/)([^"&?/\\s]{11})/
    );

    if (match && match[1]) return match[1];

    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

    return null;
  };

  const handleUpdateLink = (event) => {
    event.preventDefault();

    if (!tempLink.trim()) return;

    const nextVideoId = extractYoutubeId(tempLink);

    if (!nextVideoId) {
      toast.error("Link YouTube tidak valid.");
      return;
    }

    setVideoId(nextVideoId);
    setTempLink("");
    toast.success("Musik berhasil diganti.");
  };

  return (
    <div
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={`absolute z-50 flex w-80 flex-col rounded-[2rem] border ${theme.border} ${surface} p-4 shadow-2xl backdrop-blur-xl transition-all`}
    >
      {/* HEADER */}
      <div
        className={`flex cursor-grab items-center justify-between border-b ${divider} pb-3 active:cursor-grabbing`}
        onPointerDown={handlePointerDown}
      >
        <div className="pointer-events-none flex items-center gap-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${softSurface}`}>
            <Music size={18} strokeWidth={2.7} />
          </div>

          <div>
            <p className={`text-[9px] font-black uppercase tracking-[0.25em] ${theme.muted}`}>
              Musik Fokus
            </p>
            <h3 className={`text-sm font-black ${theme.text}`}>
              Purr Sound
            </h3>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setIsMinimized((prev) => !prev)}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${softSurface} ${theme.muted} transition-all hover:scale-105 active:scale-95`}
            title={isMinimized ? "Perbesar" : "Perkecil"}
          >
            {isMinimized ? (
              <ChevronDown size={15} strokeWidth={3} />
            ) : (
              <ChevronUp size={15} strokeWidth={3} />
            )}
          </button>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
            title="Tutup"
          >
            <X size={15} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isMinimized
            ? "h-0 opacity-0 pointer-events-none"
            : "mt-4 opacity-100"
        }`}
      >
        <form onSubmit={handleUpdateLink} className="mb-3 flex gap-2">
          <input
            type="text"
            placeholder="Tempel link YouTube..."
            value={tempLink}
            onChange={(event) => setTempLink(event.target.value)}
            className={`min-w-0 flex-1 rounded-xl border ${theme.border} ${softSurface} px-3 py-2 text-[11px] font-bold outline-none transition-all placeholder:opacity-50 focus:ring-2 ${
              theme.ring || "ring-black/10"
            } ${theme.text}`}
          />

          <button
            type="submit"
            className={`rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 ${theme.button}`}
          >
            GO
          </button>
        </form>

        <div className="relative aspect-video overflow-hidden rounded-[1.2rem] border border-black/10 bg-black shadow-inner">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
            title="YouTube music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        </div>

        <p className={`mt-3 text-center text-[9px] font-black uppercase tracking-[0.2em] ${theme.muted}`}>
          Klik play untuk memutar musik
        </p>
      </div>
    </div>
  );
}

export default FloatingMusic;