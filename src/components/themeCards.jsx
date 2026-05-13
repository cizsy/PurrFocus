import React from "react";

function ThemeCard({ active, title, desc, colors, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border transition-all ${
        active
          ? "border-slate-800 bg-slate-50 shadow-md scale-[1.02]"
          : "border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-sm"
      }`}
    >
      <div className="flex gap-2 mb-4">
        {colors.map((color, index) => (
          <span
            key={index}
            className="w-7 h-7 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <h3 className="font-black text-slate-800 text-sm">
        {title}
      </h3>

      <p className="text-[11px] font-medium text-slate-400 mt-1 leading-relaxed">
        {desc}
      </p>

      {active && (
        <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-800">
          Aktif
        </p>
      )}
    </button>
  );
}

export default ThemeCard;