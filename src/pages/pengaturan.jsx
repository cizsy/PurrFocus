import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function Pengaturan() {
  // State sementara untuk visual (nanti bisa dihubungkan ke LocalStorage/Context jika butuh)
  const [volume, setVolume] = useState(80);
  const [notifications, setNotifications] = useState(true);
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan! 🐾");
  };

  const handleWipeData = () => {
    if (window.confirm("🙀 Yakin mau menghapus SEMUA data (Tugas, Riwayat, Statistik)? Ini tidak bisa dibatalkan lho!")) {
      localStorage.clear();
      toast.success("Semua data berhasil dihapus. Memulai lembaran baru... 🍂");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 min-h-full space-y-6 relative">
      <Toaster position="top-center" />
      
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Pengaturan ⚙️</h1>
          <p className="text-slate-400 font-medium text-sm max-w-md">
            Sesuaikan PurrFocus agar pas dengan gaya berburumu. Atur semuanya di sini.
          </p>
        </div>
        <span className="absolute -right-4 -top-8 text-[120px] opacity-5 grayscale rotate-12 pointer-events-none">🛠️</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        
        {/* 2. KARTU AUDIO & NOTIFIKASI */}
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <span className="text-2xl">🔊</span>
            <h2 className="text-lg font-black text-slate-800">Audio & Notifikasi</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">Notifikasi Pop-up</p>
                <p className="text-[11px] font-medium text-slate-400">Munculkan toast saat sesi selesai</p>
              </div>
              <Toggle active={notifications} onClick={() => setNotifications(!notifications)} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-slate-700">Volume Suara Alarm</p>
                <p className="text-xs font-black text-blue-500">{volume}%</p>
              </div>
              <input 
                type="range" min="0" max="100" value={volume} 
                onChange={(e) => setVolume(e.target.value)}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 3. KARTU PREFERENSI FOKUS */}
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <span className="text-2xl">⏳</span>
            <h2 className="text-lg font-black text-slate-800">Preferensi Fokus</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">Otomatis Mulai Istirahat</p>
                <p className="text-[11px] font-medium text-slate-400">Langsung pindah ke mode ikan setelah fokus</p>
              </div>
              <Toggle active={autoStartBreak} onClick={() => setAutoStartBreak(!autoStartBreak)} />
            </div>

            <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
              <div>
                <p className="font-bold text-slate-700">Mode Gelap (Dark Mode)</p>
                <p className="text-[11px] font-medium text-slate-400">Fitur sedang dirakit oleh kucing bengkel</p>
              </div>
              <Toggle active={darkMode} onClick={() => {}} disabled />
            </div>
          </div>
        </div>

        {/* 4. DANGER ZONE (HAPUS DATA) */}
        <div className="bg-red-50/50 border border-red-100 p-6 rounded-[2rem] shadow-sm lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div>
              <h2 className="text-lg font-black text-red-600">Zona Berbahaya</h2>
              <p className="text-[11px] font-medium text-red-400/80 max-w-md">
                Menghapus seluruh data tugas, riwayat, dan statistik secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          <button 
            onClick={handleWipeData}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Hapus Semua Data
          </button>
        </div>
      </div>

      {/* TOMBOL SIMPAN MENGAMBANG */}
      <div className="fixed bottom-10 right-10 z-50">
        <button 
          onClick={handleSave}
          className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-full font-black shadow-2xl hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>💾</span> Simpan Perubahan
        </button>
      </div>

    </div>
  );
}

// Komponen Toggle Switch Kecil
function Toggle({ active, onClick, disabled = false }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        active ? 'bg-blue-500' : 'bg-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div 
        className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${
          active ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  );
}

export default Pengaturan;