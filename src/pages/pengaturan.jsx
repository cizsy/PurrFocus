import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function Pengaturan() {
  const [settings, setSettings] = useState({
    volume: 80,
    notifications: true,
    autoStartBreak: false,
    dailyTarget: 120,
    maxSessions: 4, // Default 4 sesi
    darkMode: false
  });

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('purrfocus_settings'));
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...savedSettings }));
    }
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('purrfocus_settings', JSON.stringify(settings));
    toast.success("Pengaturan berhasil disimpan! 🐾");
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleWipeData = () => {
    if (window.confirm("🙀 Yakin mau menghapus SEMUA data? Ini tidak bisa dibatalkan lho!")) {
      localStorage.clear();
      toast.success("Semua data berhasil dihapus. Memulai lembaran baru... 🍂");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 min-h-full space-y-6 relative">
      <Toaster position="top-center" />
      
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
        
        {/* KARTU AUDIO */}
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
              <Toggle active={settings.notifications} onClick={() => handleChange('notifications', !settings.notifications)} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-slate-700">Volume Suara Alarm</p>
                <p className="text-xs font-black text-blue-500">{settings.volume}%</p>
              </div>
              <input 
                type="range" min="0" max="100" value={settings.volume} 
                onChange={(e) => handleChange('volume', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* KARTU PREFERENSI FOKUS */}
        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <span className="text-2xl">⏳</span>
            <h2 className="text-lg font-black text-slate-800">Preferensi Fokus</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">Target Fokus Harian</p>
                <p className="text-[11px] font-medium text-slate-400">Durasi untuk mencapai 100% skor harian</p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={settings.dailyTarget}
                  onChange={(e) => handleChange('dailyTarget', Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-16 bg-slate-50 border border-slate-200 text-slate-700 font-black text-center rounded-lg py-1.5 outline-none focus:border-blue-500 transition-all"
                />
                <span className="text-xs font-bold text-slate-400">Mnt</span>
              </div>
            </div>

            {/* FITUR BARU: JUMLAH SESI PER SIKLUS */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">Jumlah Sesi per Siklus</p>
                <p className="text-[11px] font-medium text-slate-400">Berapa sesi fokus sebelum Istirahat Panjang</p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={settings.maxSessions}
                  min="1"
                  max="10"
                  onChange={(e) => handleChange('maxSessions', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-slate-50 border border-slate-200 text-slate-700 font-black text-center rounded-lg py-1.5 outline-none focus:border-blue-500 transition-all"
                />
                <span className="text-xs font-bold text-slate-400">Sesi</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">Otomatis Mulai Istirahat</p>
                <p className="text-[11px] font-medium text-slate-400">Langsung pindah ke mode ikan setelah fokus</p>
              </div>
              <Toggle active={settings.autoStartBreak} onClick={() => handleChange('autoStartBreak', !settings.autoStartBreak)} />
            </div>

            <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
              <div>
                <p className="font-bold text-slate-700">Mode Gelap (Dark Mode)</p>
                <p className="text-[11px] font-medium text-slate-400">Fitur sedang dirakit oleh kucing bengkel</p>
              </div>
              <Toggle active={settings.darkMode} onClick={() => {}} disabled />
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
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