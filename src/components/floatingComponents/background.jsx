import React from 'react';

// PERBAIKAN 1: Import gambar tanpa kurung kurawal {}
// Pastikan path foldernya sudah benar ya!
import ghibli1 from '../../assets/totoro1.gif';
import garden1 from '../../assets/garden1.jpg';

function FloatingBackground({ onSelect, onClose }) {
  
  const backgroundPresets = [
    // 1. Tipe Gradient
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
    // 3. Tipe Image/GIF
    { 
      name: 'Ghibli', 
      type: 'style', 
      value: `url(${ghibli1})`,
      preview: ghibli1 // PERBAIKAN 2: Pakai variabel yang di-import
    },
    { 
      name: 'Garden', 
      type: 'style', 
      value: `url(${garden1})`,
      preview: garden1 // PERBAIKAN 2: Pakai variabel yang di-import
    },
  ];

  const handleSelection = (bg) => {
    if (bg.type === 'class') {
      onSelect(bg.value);
    } else {
      onSelect({ 
        backgroundImage: bg.value, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      });
    }
    // Menutup popup otomatis setelah memilih
    onClose(); 
  };

  return (
    // Overlay Hitam Transparan (Klik di sini akan menutup popup)
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
      onClick={onClose}
    >
      
      {/* Kartu Utama (Stop propagation agar klik di dalam kartu tidak menutup popup) */}
      <div 
        className="bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/20 p-10 w-[600px] max-w-[90%] transition-all transform scale-100 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#4a7ec2]/80">Suasana Berburu</h4>
            <h3 className="text-xl font-black text-slate-800 mt-1">Pilih Background 🖼️</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar p-1">
          {backgroundPresets.map((bg, index) => (
            <button
              key={index}
              onClick={() => handleSelection(bg)}
              className="group relative h-28 rounded-3xl border-4 border-transparent bg-slate-100 hover:border-[#4a7ec2] transition-all shadow-sm hover:shadow-xl overflow-hidden active:scale-95"
            >
              {/* Preview Box */}
              <div 
                className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                style={
                  bg.type === 'style' 
                    ? { backgroundImage: `url(${bg.preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: bg.preview }
                }
              />
              
              {/* Overlay Nama saat Hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-[10px] font-black uppercase tracking-widest text-center px-2 py-1 bg-black/40 rounded-lg backdrop-blur-md">
                  {bg.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-8 pointer-events-none">
          Tip: Pilih suasana yang bikin kamu fokus, Hunter! 🐈‍⬛
        </p>
      </div>
    </div>
  );
}

export default FloatingBackground;