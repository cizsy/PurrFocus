import React, { useEffect, useState } from "react";
import { Image, RotateCcw, X } from "lucide-react";

import ghibli1 from "../../assets/bg/totoro1.gif";
import garden1 from "../../assets/bg/garden1.jpg";
import cat1 from "../../assets/bg/cat1.jpg";
import cat2 from "../../assets/bg/cat2.gif";
import dark2 from "../../assets/bg/dark2.gif";
import dark3 from "../../assets/bg/dark3.gif";
import desk from "../../assets/bg/desk.gif";
// import envi1 from "../../assets/bg/envi1.jpeg";
// import envi2 from "../../assets/bg/envi2.jpeg";
// import pond1 from "../../assets/bg/pond1.jpeg";

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

function FloatingBackground({ onSelect, onClose }) {
  const [themeName, setThemeName] = useState(getSavedThemeName);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  const surface = theme.cardBg || theme.panelBg;
  const softSurface = theme.cardSoft || "bg-white/40";
  const strongSurface = theme.cardStrong || "bg-white/60";
  const divider = theme.divider || "border-black/5";

  useEffect(() => {
    const handleThemeChange = (event) => {
      setThemeName(event.detail || getSavedThemeName());
    };

    window.addEventListener("purrfocus-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("purrfocus-theme-change", handleThemeChange);
    };
  }, []);

  const backgroundPresets = [
    {
      name: "Tema Aktif",
      type: "reset",
      value: null,
      preview: "theme",
    },
    {
      name: "Classic Blue",
      type: "class",
      value: "bg-gradient-to-br from-[#4a7ec2] to-[#2d5c94]",
      preview: "linear-gradient(to bottom right, #4a7ec2, #2d5c94)",
    },
    {
      name: "Forest Green",
      type: "class",
      value: "bg-gradient-to-br from-[#45a387] to-[#2b735c]",
      preview: "linear-gradient(to bottom right, #45a387, #2b735c)",
    },
    {
      name: "Midnight",
      type: "class",
      value: "bg-[#1a1a2e]",
      preview: "#1a1a2e",
    },
    {
      name: "Soft Rose",
      type: "class",
      value: "bg-[#b35d5d]",
      preview: "#b35d5d",
    },
    {
      name: "Cozy Room",
      type: "style",
      value: `url(${ghibli1})`,
      preview: ghibli1, 
    },
    {
      name: "Garden",
      type: "style",
      value: `url(${garden1})`,
      preview: garden1,
    },
    {
      name: "cat pond",
      type: "style",
      value: `url(${cat1})`,
      preview: cat1,
    },
    {
      name: "Cat desk",
      type: "style",
      value: `url(${cat2})`,
      preview: cat2,
    },
    {
      name: "Dark Sky",
      type: "style",
      value: `url(${dark2})`,
      preview: dark2,
    },
    {
      name: "Dark city",
      type: "style",
      value: `url(${dark3})`,
      preview: dark3,
    },
    {
      name: "Desk",
      type: "style",
      value: `url(${desk})`,
      preview: desk,
    },
  ];

  const handleSelection = (background) => {
    if (background.type === "reset") {
      onSelect(null);
      onClose();
      return;
    }

    if (background.type === "class") {
      onSelect(background.value);
      onClose();
      return;
    }

    onSelect({
      backgroundImage: background.value,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm pointer-events-auto"
      onClick={onClose}
    >
      <div
        className={`w-[640px] max-w-[95vw] rounded-[3rem] border ${theme.border} ${surface} p-7 md:p-8 shadow-2xl backdrop-blur-3xl`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className={`mb-7 flex items-start justify-between border-b ${divider} pb-5`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${softSurface}`}>
              <Image size={22} strokeWidth={2.7} />
            </div>

            <div>
              <p
                className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme.muted}`}
              >
                Suasana Fokus
              </p>

              <h3 className={`mt-1 text-xl font-black ${theme.text}`}>
                Pilih Background
              </h3>

              <p className={`mt-1 text-xs font-bold leading-relaxed ${theme.muted}`}>
                Pilih suasana visual yang paling enak buat sesi fokusmu.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
            title="Tutup"
          >
            <X size={17} strokeWidth={3} />
          </button>
        </div>

        {/* GRID */}
        <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto p-1 pr-2 custom-scrollbar sm:grid-cols-3">
          {backgroundPresets.map((background, index) => (
            <button
              key={index}
              onClick={() => handleSelection(background)}
              className={`group relative h-32 overflow-hidden rounded-[1.7rem] border ${theme.border} ${strongSurface} text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95`}
            >
              {background.type === "reset" ? (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${theme.mainBg}`}
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${surface} shadow-sm`}>
                    <RotateCcw size={24} strokeWidth={2.7} />
                  </div>
                </div>
              ) : (
                <div
                  className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-110"
                  style={
                    background.type === "style"
                      ? {
                          backgroundImage: `url(${background.preview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : { background: background.preview }
                  }
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent opacity-80" />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm font-black text-white drop-shadow">
                  {background.name}
                </p>

                <p className="mt-1 line-clamp-2 text-[10px] font-bold leading-relaxed text-white/75">
                  {background.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* FOOTER */}
        <p
          className={`mt-7 text-center text-[9px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
        >
          Background hanya berlaku untuk layar Pawmodoro saat ini.
        </p>
      </div>
    </div>
  );
}

export default FloatingBackground;