import React from 'react';
import logoLight from '../assets/logoLight.png';
import profil from '../assets/profil.jpg';

function Layout({ children, activePage, setPage, totalActiveTasks }) {
  return (
    <div className="flex h-screen bg-[#b8c9f2] text-slate-800 font-sans overflow-hidden p-4">
      
      {/* 🐾 SIDEBAR */}
      <div className="w-64 flex flex-col p-4 pr-6">
        <div className="mb-10 ml-2">
          <img src={logoLight} alt="PurrFocus Logo" className="w-48 object-contain" />
        </div>
        
        <ul className="space-y-2 flex-1">
            <li>
            <button 
                onClick={() => setPage('dashboard')}
                className={`flex items-center gap-3 font-bold text-lg w-full p-3 rounded-2xl transition-all ${activePage === 'dashboard' ? 'bg-white/40 text-blue-900 shadow-sm' : 'opacity-60 hover:opacity-100 hover:bg-white/20'}`}
            >
                🏠 Beranda
            </button>
            </li>
            <li>
            <button 
                onClick={() => setPage('tujuan')}
                className={`flex items-center gap-3 font-bold text-lg w-full p-3 rounded-2xl transition-all ${activePage === 'tujuan' ? 'bg-white/40 text-blue-900 shadow-sm' : 'opacity-60 hover:opacity-100 hover:bg-white/20'}`}
            >
                🎯 Tujuan Saya
            </button>
            </li>
            <li>
            <button 
                onClick={() => setPage('statistik')}
                className={`flex items-center gap-3 font-bold text-lg w-full p-3 rounded-2xl transition-all ${activePage === 'tujuan' ? 'bg-white/40 text-blue-900 shadow-sm' : 'opacity-60 hover:opacity-100 hover:bg-white/20'}`}
            >
                📊 Statistik
            </button>
            </li>

          {/* Tambah button lain jika perlu */}
        </ul>
      </div>

      {/* 🚀 MAIN CONTENT */}
      <div className="flex-1 bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border-4 border-white/50">
        
        {/* NAVBAR */}
        <nav className="px-10 py-6 flex justify-between items-center bg-white border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                {activePage === 'dashboard' ? 'Selamat pagi, Meong! 👋' : 'Pusat Perencanaan 🗺️'}
            </h2>
            <p className="text-sm text-slate-400 font-medium">Kamu punya {totalActiveTasks} target aktif hari ini.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-700 leading-none">John Doe</p>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Pro Member</p>
            </div>
            <img src={profil} alt="Profil" className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-100 shadow-md" />
          </div>
        </nav>

        {/* AREA KONTEN (Dashboard / Tujuan Saya) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;