import React, { useCallback, useEffect, useRef, useState } from "react";
import { Calculator, Delete, X } from "lucide-react";

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

function FloatingCalculator({ onClose }) {
  const [input, setInput] = useState("");

  const [themeName, setThemeName] = useState(getSavedThemeName);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  const surface = theme.cardBg || theme.panelBg;
  const softSurface = theme.cardSoft || "bg-white/40";
  const strongSurface = theme.cardStrong || "bg-white/60";
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

  const handleClick = useCallback((value) => {
    setInput((prev) => {
      if (prev === "Error") return value;
      if (prev === "" && ["÷", "×", "-", "+", "^"].includes(value)) return prev;
      return prev + value;
    });
  }, []);

  const handleClear = useCallback(() => setInput(""), []);

  const handleDelete = useCallback(() => {
    setInput((prev) => (prev === "Error" ? "" : prev.slice(0, -1)));
  }, []);

  const handleCalculate = useCallback(() => {
    try {
      if (!input) return;

      let expression = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**")
        .replace(/√\(/g, "Math.sqrt(");

      const openParens = (expression.match(/\(/g) || []).length;
      const closeParens = (expression.match(/\)/g) || []).length;

      if (openParens > closeParens) {
        expression += ")".repeat(openParens - closeParens);
      }

      const result = new Function(`return ${expression}`)();
      const finalResult = Math.round(result * 1e10) / 1e10;

      if (Number.isNaN(finalResult) || !Number.isFinite(finalResult)) {
        throw new Error();
      }

      setInput(finalResult.toString());
    } catch {
      setInput("Error");
      setTimeout(() => setInput(""), 1200);
    }
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      const tagName = event.target.tagName;

      if (tagName === "INPUT" || tagName === "TEXTAREA") return;

      if (/[0-9]/.test(key)) handleClick(key);
      else if (key === "+") handleClick("+");
      else if (key === "-") handleClick("-");
      else if (key === "*") handleClick("×");
      else if (key === "/") handleClick("÷");
      else if (key === "^") handleClick("^");
      else if (key === "(") handleClick("(");
      else if (key === ")") handleClick(")");
      else if (key === ".") handleClick(".");
      else if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleCalculate();
      } else if (key === "Backspace") {
        event.preventDefault();
        handleDelete();
      } else if (key === "Escape") {
        event.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick, handleCalculate, handleClear, handleDelete]);

  const handlePointerDown = (event) => {
    if (event.target.closest("button")) return;

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

  const buttons = [
    { label: "^", display: "xⁿ", type: "sci" },
    { label: "√(", display: "√", type: "sci" },
    { label: "(", display: "(", type: "sci" },
    { label: ")", display: ")", type: "sci" },

    { label: "7", display: "7", type: "num" },
    { label: "8", display: "8", type: "num" },
    { label: "9", display: "9", type: "num" },
    { label: "÷", display: "÷", type: "op" },

    { label: "4", display: "4", type: "num" },
    { label: "5", display: "5", type: "num" },
    { label: "6", display: "6", type: "num" },
    { label: "×", display: "×", type: "op" },

    { label: "1", display: "1", type: "num" },
    { label: "2", display: "2", type: "num" },
    { label: "3", display: "3", type: "num" },
    { label: "-", display: "-", type: "op" },

    { label: "0", display: "0", type: "num" },
    { label: ".", display: ".", type: "num" },
    { label: "=", display: "=", type: "eq" },
    { label: "+", display: "+", type: "op" },
  ];

  return (
    <div
      className="absolute bottom-25 left-13 z-[60] pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
    >
      <div
        className={`w-64 rounded-[2rem] border ${theme.border} ${surface} p-4 shadow-2xl backdrop-blur-xl pointer-events-auto`}
      >
        {/* HEADER */}
        <div
          className={`mb-3 flex cursor-grab items-center justify-between border-b ${divider} pb-3 select-none active:cursor-grabbing`}
          onPointerDown={handlePointerDown}
        >
          <div className="pointer-events-none flex items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-2xl ${softSurface}`}
            >
              <Calculator size={18} strokeWidth={2.7} />
            </div>

            <div>
              <p
                className={`text-[8px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
              >
                Quick Tools
              </p>
              <h3 className={`text-sm font-black ${theme.text}`}>
                Kalkulator
              </h3>
            </div>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
            title="Tutup"
          >
            <X size={15} strokeWidth={3} />
          </button>
        </div>

        {/* DISPLAY */}
        <div
          className={`mb-3 flex h-20 flex-col justify-end rounded-[1.3rem] border ${theme.border} ${softSurface} p-3 shadow-inner`}
        >
          <div
            className={`overflow-x-auto whitespace-nowrap pb-0.5 text-right font-mono text-2xl font-black scrollbar-hide ${
              input === "Error" ? "text-red-500" : theme.text
            }`}
          >
            {input || "0"}
          </div>
        </div>

        {/* CLEAR + DELETE */}
        <div className="mb-2 flex gap-1.5">
          <button
            onClick={handleClear}
            className="flex-1 rounded-xl bg-red-500/10 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
          >
            AC
          </button>

          <button
            onClick={handleDelete}
            className={`flex w-14 items-center justify-center rounded-xl py-2 transition-all active:scale-95 ${strongSurface} ${theme.muted}`}
            title="Hapus satu karakter"
          >
            <Delete size={15} strokeWidth={2.7} />
          </button>
        </div>

        {/* BUTTON GRID */}
        <div className="grid grid-cols-4 gap-1.5">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() =>
                button.label === "="
                  ? handleCalculate()
                  : handleClick(button.label)
              }
              className={`h-10 rounded-xl text-sm font-black transition-all active:scale-95 ${
                button.type === "eq"
                  ? theme.button
                  : button.type === "op"
                  ? `${softSurface} ${theme.text} hover:opacity-80`
                  : button.type === "sci"
                  ? `${strongSurface} ${theme.muted} text-xs hover:opacity-80`
                  : `${strongSurface} ${theme.text} hover:opacity-80`
              }`}
            >
              {button.display}
            </button>
          ))}
        </div>

        <p
          className={`mt-3 text-center text-[7px] font-black uppercase tracking-[0.22em] select-none ${theme.muted}`}
        >
          PurrFocus Math Engine
        </p>
      </div>
    </div>
  );
}

export default FloatingCalculator;