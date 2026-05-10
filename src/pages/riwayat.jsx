import React, { useState, useEffect } from 'react';

function Riwayat({ focusLogs = [] }) {
  const [historyTasks, setHistoryTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('misi'); // 'misi' atau 'fokus'
  const [filter, setFilter] = useState('semua'); // 'semua', 'selesai', 'gagal'

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("purrfocus_history") || "[]");
    const activeTasks = JSON.parse(localStorage.getItem("purrfocus_tasks") || "[]");

    // Kita hanya ingin menampilkan tugas hari ini yang SUDAH selesai atau minimal punya progres
    const todaysFinishedTasks = activeTasks.filter(t => {
      const total = t.subtasks?.length || 0;
      const done = t.subtasks?.filter(s => s.completed).length || 0;
      return total > 0 && done === total; // Contoh: Hanya muncul jika 100% kelar
    });

    const combined = [...savedHistory, ...todaysFinishedTasks];
    
    // Gunakan ID unik untuk filter duplikat jika perlu
    const uniqueHistory = Array.from(new Map(combined.map(item => [item.id, item])).values());

    const sorted = uniqueHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setHistoryTasks(sorted);
  }, []);

  // --- LOGIKA GROUPING BERDASARKAN TANGGAL ---
  const groupTasksByDate = (tasks) => {
    return tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(task);
      return acc;
    }, {});
  };

  const groupLogsByDate = (logs) => {
    return [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).reduce((acc, log) => {
      const date = new Date(log.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    }, {});
  };

  // --- FILTERING TUGAS ---
  const filteredTasks = historyTasks.filter(task => {
    const isCompleted = task.subtasks?.length > 0 && task.subtasks.every(s => s.completed);
    if (filter === 'selesai') return isCompleted;
    if (filter === 'gagal') return !isCompleted;
    return true;
  });

  const groupedTasks = groupTasksByDate(filteredTasks);
  const groupedLogs = groupLogsByDate(focusLogs);

  // --- STATISTIK SINGKAT ---
  const totalMisi = historyTasks.length;
  const misiBerhasil = historyTasks.filter(t => t.subtasks?.length > 0 && t.subtasks.every(s => s.completed)).length;
  const totalMenitFokus = focusLogs.reduce((acc, log) => acc + log.duration, 0);

  return (
    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 min-h-full space-y-6">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Catatan Hunter 📜</h1>
            <p className="text-slate-400 font-medium text-sm max-w-md">
              Jejak langkahmu tak pernah hilang. Lihat kembali apa yang sudah kamu capai di masa lalu.
            </p>
          </div>
          
          <div className="flex gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="text-center px-4 border-r border-white/10">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Misi</p>
              <p className="text-2xl font-black">{totalMisi}</p>
            </div>
            <div className="text-center px-4 border-r border-white/10">
              <p className="text-[10px] font-black uppercase text-green-400 tracking-widest">Purrfect</p>
              <p className="text-2xl font-black text-green-400">{misiBerhasil}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Jam Fokus</p>
              <p className="text-2xl font-black text-blue-400">{Math.floor(totalMenitFokus / 60)}<span className="text-sm">j</span> {totalMenitFokus % 60}<span className="text-sm">m</span></p>
            </div>
          </div>
        </div>
        <span className="absolute -right-10 -bottom-10 text-[150px] opacity-5 grayscale rotate-12 pointer-events-none">🐾</span>
      </div>

      {/* 2. TAB NAVIGASI */}
      <div className="flex justify-between items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex gap-2">
          <TabButton active={activeTab === 'misi'} onClick={() => setActiveTab('misi')} icon="🎯" label="Riwayat Misi" />
          <TabButton active={activeTab === 'fokus'} onClick={() => setActiveTab('fokus')} icon="⏱️" label="Jejak Fokus" />
        </div>
        
        {/* Filter Dropdown (Hanya muncul di tab misi) */}
        {activeTab === 'misi' && (
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 px-4 py-2.5 rounded-xl outline-none cursor-pointer hover:bg-slate-100 transition-all"
          >
            <option value="semua">Semua Misi</option>
            <option value="selesai">Hanya Selesai 🌟</option>
            <option value="gagal">Terbengkalai 🍂</option>
          </select>
        )}
      </div>

      {/* 3. KONTEN UTAMA */}
      <div className="pb-10">
        
        {/* --- KONTEN: RIWAYAT MISI --- */}
        {activeTab === 'misi' && (
          Object.keys(groupedTasks).length === 0 ? (
            <EmptyState icon="😾" message="Belum ada riwayat misi yang tercatat." />
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedTasks).map(date => (
                <div key={date} className="relative">
                  <div className="sticky top-0 bg-slate-50/90 backdrop-blur-md py-2 z-10 mb-4 flex items-center gap-3">
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">{date}</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedTasks[date].map(task => {
                      const total = task.subtasks?.length || 0;
                      const done = task.subtasks?.filter(s => s.completed).length || 0;
                      const isCompleted = total > 0 && total === done;
                      const percent = total === 0 ? 0 : Math.round((done / total) * 100);

                      return (
                        <div key={task.id} className="bg-white border border-slate-100 p-5 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-3">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                              {isCompleted ? '🌟 Purrfect' : '🍂 Terbengkalai'}
                            </span>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{task.category || 'Umum'}</span>
                          </div>
                          
                          <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{task.title}</h3>
                          <p className="text-[11px] text-slate-400 font-medium mb-4">Misi berisi {total} langkah.</p>
                          
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                            <div className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-orange-400'}`} style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="text-right text-[10px] font-black text-slate-400">{percent}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* --- KONTEN: JEJAK FOKUS --- */}
        {activeTab === 'fokus' && (
          Object.keys(groupedLogs).length === 0 ? (
            <EmptyState icon="😿" message="Belum ada sesi fokus yang tercatat." />
          ) : (
            <div className="space-y-8 max-w-3xl mx-auto">
              {Object.keys(groupedLogs).map(date => {
                const totalDurasiHariIni = groupedLogs[date].reduce((a, b) => a + b.duration, 0);
                
                return (
                  <div key={date} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                      <h3 className="font-black text-slate-700">{date}</h3>
                      <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1.5 rounded-xl">
                        Total: {Math.floor(totalDurasiHariIni / 60)}j {totalDurasiHariIni % 60}m
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {groupedLogs[date].map((log, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                            🐟
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-700">Sesi Berburu Selesai</h4>
                            <p className="text-xs font-medium text-slate-400">
                              {new Date(log.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-blue-600">+{log.duration}<span className="text-xs">m</span></p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-orange-400">+{(log.duration >= 25 ? 50 : log.duration)} XP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// --- KOMPONEN BANTUAN ---
function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
        active 
          ? 'bg-slate-800 text-white shadow-md' 
          : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="text-7xl mb-4 grayscale opacity-20">{icon}</div>
      <h3 className="text-lg font-bold text-slate-400 mb-1">Kosong Melompong</h3>
      <p className="text-sm text-slate-400 opacity-60 max-w-xs">{message}</p>
    </div>
  );
}

export default Riwayat;