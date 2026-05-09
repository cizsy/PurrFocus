import React, { useState, useEffect, useCallback, useRef } from "react";

function FloatingCalculator({ onClose }) {
  const [input, setInput] = useState("");
  
  // State & Ref untuk fitur Drag
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // --- Logika Kalkulator (Sama seperti sebelumnya) ---
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

      if (isNaN(finalResult) || !isFinite(finalResult)) throw new Error();

      setInput(finalResult.toString());
    } catch {
      setInput("Error");
      setTimeout(() => setInput(""), 1200);
    }
  }, [input]);

  // --- Fitur Dukungan Keyboard ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (/[0-9]/.test(key)) handleClick(key);
      else if (key === "+") handleClick("+");
      else if (key === "-") handleClick("-");
      else if (key === "*") handleClick("×");
      else if (key === "/") handleClick("÷");
      else if (key === "^") handleClick("^");
      else if (key === "(") handleClick("(");
      else if (key === ")") handleClick(")");
      else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleCalculate();
      } else if (key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (key === "Escape") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClick, handleCalculate, handleClear, handleDelete]);

  // --- Fitur Drag & Drop ---
  const handlePointerDown = (e) => {
    setIsDragging(true);
    // Simpan titik awal klik dikurangi posisi saat ini agar tidak loncat
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      // Update posisi berdasarkan pergerakan mouse/touch
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
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
    { label: "+", display: "+", type: "op" }
  ];

  return (
    <div 
      className="absolute bottom-25 left-13 z-60 pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out' // Smooth saat dilepas
      }}
    >
      <div className="w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300">
        
        {/* Header - Berfungsi sebagai DRAG HANDLE */}
        <div 
          className="flex justify-between items-center mb-3 px-1 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
        >
          <div>
            <h4 className="text-[8px] font-black uppercase tracking-wider text-slate-400 pointer-events-none">Quick Tools</h4>
            <h3 className="text-[11px] font-black text-slate-800 pointer-events-none">Kalkulator 🧮</h3>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Biar klik tombol close nggak memicu drag
              onClose();
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors text-[10px] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Display */}
        <div className="bg-slate-900 rounded-xl p-3 mb-3 shadow-inner flex flex-col justify-end h-17">
          <div className="text-2xl font-mono text-emerald-400 text-right overflow-x-auto whitespace-nowrap scrollbar-hide pb-0.5">
            {input || "0"}
          </div>
        </div>

        {/* Control Actions (Clear & Delete) */}
        <div className="flex gap-1.5 mb-2">
          <button
            onClick={handleClear}
            className="flex-1 py-2 rounded-lg bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 active:scale-95 transition-all"
          >
            AC
          </button>
          <button
            onClick={handleDelete}
            className="w-14 py-2 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all"
          >
            ⌫
          </button>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => btn.label === "=" ? handleCalculate() : handleClick(btn.label)}
              className={`h-9 rounded-lg font-bold text-sm transition-all active:scale-95 ${
                btn.type === 'op' 
                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                  : btn.type === 'sci'
                  ? 'bg-indigo-50 text-indigo-500 hover:bg-indigo-100 text-xs'
                  : btn.type === 'eq'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 hover:bg-emerald-600 text-lg'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {btn.display}
            </button>
          ))}
        </div>

        <p className="text-[7px] text-slate-300 text-center mt-3 font-bold uppercase tracking-[0.2em] select-none">
          Purrfocus Math Engine
        </p>
      </div>
    </div>
  );
}

export default FloatingCalculator;