import React from 'react';
import logoLight from '../assets/logoLight.png';
import profil from '../assets/profil.jpg';

function Layout({ children, activePage, setPage, totalActiveTasks }) {
  
  const navItem = (id, label, icon) => {
    const isActive = activePage === id;
    return (
      <li>
        <button 
          onClick={() => setPage(id)}
          className={`flex items-center gap-3 font-bold text-base w-full p-3.5 rounded-2xl transition-all duration-300 group
            ${isActive 
              ? 'bg-white text-blue-900 shadow-lg shadow-blue-900/10 scale-[1.02]' 
              : 'text-blue-900/60 hover:bg-white/30 hover:text-blue-900'}`}
        >
          <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
            {icon}
          </span>
          {label}
          {isActive && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />}
        </button>
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-[#b8c9f2] text-slate-800 font-sans overflow-hidden p-4">
      
      {/* 🐾 SIDEBAR */}
      <div className="w-60 flex flex-col p-4">
        <div className="mb-5 px-2">
          <img src={logoLight} alt="PurrFocus Logo" className="w-40 object-contain" />
        </div>
        
        <ul className="space-y-2 flex-1">
          {navItem('dashboard', 'Beranda', '🏠')}
          {navItem('tujuan', 'Tujuan Saya', '🎯')}
          {navItem('statistik', 'Statistik', '📊')}
          {navItem('riwayat', 'Riwayat', '📚')}
          {navItem('pengaturan', 'Pengaturan', '⚙️')}

          {/* --- TOMBOL MULAI FOKUS (The Return) --- */}
          <li className="pt-4">
            <button 
              onClick={() => setPage('pawmodoro')}
              className="flex items-center justify-center gap-3 font-black text-white bg-blue-800 w-full p-4 rounded-3xl transition-all hover:bg-blue-400 hover:shadow-xl hover:shadow-indigo-400 active:scale-95 group"
            >
              <span className="text-xl group-hover:animate-bounce">⏱️</span>
              MULAI FOKUS
            </button>
          </li>
        </ul>
      </div>

      {/* 🚀 MAIN CONTENT */}
      <div className="flex-1 bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border-4 border-white/60">
        <nav className="px-10 py-7 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">
                {activePage === 'dashboard' && 'Selamat pagi, Meong! 👋'}
                {activePage === 'tujuan' && 'Pusat Perencanaan 🗺️'}
                {activePage === 'statistik' && 'Arsip Buruan 📈'}
                {activePage === 'riwayat' && 'Riwayat Fokus 📚'}
                {activePage === 'pengaturan' && 'Konfigurasi ⚙️'}
            </h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              {totalActiveTasks} target aktif terdeteksi hari ini
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-2 pr-4 rounded-xl border border-slate-100">
            <img src={profil} alt="Profil" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
            <div className="text-left">
              <p className="text-[16px] font-black text-slate-700 leading-none">John Doe</p>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mt-1">Elite Hunter</p>
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;