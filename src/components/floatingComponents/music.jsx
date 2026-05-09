import React from 'react';

// --- AREA IMPORT ASSET (IMAGE/GIF) ---
// Semisal kamu punya folder assets/bg, contoh import-nya begini:
// import bgPantai dari '../../assets/bg/pantai.jpg';
// import bgLofi dari '../../assets/bg/lofi-cozy.gif'; // GIF tinggal import aja

// Kita buat placeholder dulu pakai URL internet biar komponen ini langsung jalan
const bgGhibli = "https://i.pinimg.com/originals/1a/1a/2e/1a1a2e73bd88c234a66a152e9352e850.gif";
const bgCyberpunk = "https://i.getcrooked.com/2021/04/cyberpunk-night-rain.gif";
const bgRain = "https://media.tenor.com/t4pE5bFpZ5AAAAAC/anime-rain.gif";

function FloatingBackground({ onSelect, onClose }) {
  
  // -- DAFTAR PILIHAN BACKGROUND (Solid, Gradient, Image, GIF) --
  // Ada 2 tipe input: 'class' (buat Tailwind) atau 'style' (buat Image/GIF import)
  const backgroundPresets = [
    // 1. Tipe Gradient (Bawaan PurrFocus)
    { 
      name: 'Classic Blue', 
      type: 'class', 
      value: 'bg-gradient-to-br from-[#4a7ec2] to-[#2d5c94]',
      preview: 'linear-gradient(to bottom right, #4a7ec2, #2d5c94)'
    },
    { 
      name: 'Forest Green', 
      type: 'class', 
      value: 'bg-gradient-to-br from-[#45a387] to-[#2b735c]',
      preview: 'linear-gradient(to bottom right, #45a387, #2b735c)'
    },
    // 2. Tipe Solid Color Aesthetic
    { 
      name: 'Midnight', 
      type: 'class', 
      value: 'bg-[#1a1a2e]',
      preview: '#1a1a2e'
    },
    { 
      name: 'Soft Rose', 
      type: 'class', 
      value: 'bg-[#b35d5d]',
      preview: '#b35d5d'
    },
    // 3. Tipe Image/GIF (Memakai Inline Style backgroundImage)
    { 
      name: 'Ghibli Room', 
      type: 'style', 
      // Kalau pakai import lokal, kodenya jadi: value: `url(${bgGhibli})`
      value: `url(${bgGhibli})`,
      preview: bgGhibli // Gambar preview di grid
    },
    { 
      name: 'Cyber Rain', 
      type: 'style', 
      value: `url(${bgCyberpunk})`,
      preview: bgCyberpunk
    },
    { 
      name: 'Anime Rain', 
      type: 'style', 
      value: `url(${bgRain})`,
      preview: bgRain
    },
  ];

  const handleSelection = (bg) => {
    if (bg.type === 'class') {
      // Kalau Tailwind, kirim string class-nya
      onSelect(bg.value);
    } else {
      // Kalau Image/GIF, kirim object style CSS
      // Kita tambahkan setting agar gambar menutupi layar dengan pas
      onSelect({ 
        backgroundImage: bg.value, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      });
    }
    // Opsional: Langsung tutup picker setelah milih
    // onClose(); 
  };

  return (
    // Overlay Hitam Transparan & Blur (Posisikan di tengah layar z-index tinggi)
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
      
      {/* Kartu Utama */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 w-[600px] max-w-[90%] transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Suasana Berburu</h4>
            <h3 className="text-xl font-black text-slate-800">Pilih Background 🖼️</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Grid Area (Scrollable kalau kebanyakan) */}
        <div className="grid grid-cols-3 gap-5 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
          {backgroundPresets.map((bg, index) => (
            <button
              key={index}
              onClick={() => handleSelection(bg)}
              className="group relative h-28 rounded-3xl border-4 border-slate-100 hover:border-blue-300 transition-all shadow-md overflow-hidden active:scale-95"
            >
              {/* Preview Box */}
              <div 
                className="absolute inset-0 w-full h-full"
                style={
                  bg.type === 'style' 
                    ? { backgroundImage: `url(${bg.preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: bg.preview }
                }
              />
              
              {/* Overlay Nama saat Hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-black uppercase tracking-widest text-center p-2">
                  {bg.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-300 text-[9px] font-bold uppercase tracking-widest mt-8">
          Tip: Pilih suasana yang bikin kamu fokus, Hunter! 🐈‍⬛
        </p>
      </div>
    </div>
  );
}

export default FloatingBackground;