import React from 'react';
import useStats from '../hooks/useStats';

function Statistik({ tasks, focusLogs }) {
  const { 
    focusTimeToday, 
    completedTasks, 
    focusScore, 
    weeklyDistribution, 
    categoryDistribution,
  } = useStats(tasks, focusLogs);

  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-white">
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900 p-5 rounded-[1.5rem] text-white shadow-lg shadow-slate-200">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Total Fokus</p>
          <h2 className="text-2xl font-black">{focusTimeToday}</h2>
        </div>
        <div className="bg-blue-50 p-5 rounded-[1.5rem] border border-blue-100">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Target Selesai</p>
          <h2 className="text-2xl font-black text-blue-900">{completedTasks} <span className="text-xs font-bold opacity-40 text-blue-400">Tasks</span></h2>
        </div>
        <div className="bg-orange-50 p-5 rounded-[1.5rem] border border-orange-100">
          <p className="text-[9px] font-black uppercase tracking-widest text-orange-400 mb-1">Fokus Score</p>
          <h2 className="text-2xl font-black text-orange-900">{focusScore}%</h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* BAR CHART: AKTIVITAS MINGGUAN */}
        <div className="col-span-12 lg:col-span-7 bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Aktivitas Mingguan 📊</h3>
          <div className="flex items-end justify-between h-32 px-2 gap-2">
            {weeklyDistribution.map((val, i) => {
              const height = Math.min((val / 120) * 100, 100); 
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="w-full max-w-[20px] bg-blue-500 rounded-t-md transition-all duration-1000 hover:bg-slate-800 relative group cursor-pointer"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {val}m
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* KATEGORI UTAMA (Yang Tadi Hilang) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">Kategori Utama 🐾</h3>
          <div className="space-y-4">
            {categoryDistribution.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-600">{cat.label}</span>
                  <span className="text-slate-400">{cat.value}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`${cat.color} h-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${cat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIWAYAT SESI */}
        <div className="col-span-12 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Jejak Buruan Terakhir 📜</h3>
          <div className="grid gap-3">
            {focusLogs.length === 0 ? (
              <div className="text-center py-10 opacity-30 font-bold italic">Belum ada jejak hari ini...</div>
            ) : (
              [...focusLogs].reverse().slice(0, 5).map((log, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="text-xl">🐱</div>
                    <div>
                      <p className="text-xs font-black text-slate-700">Sesi Fokus Berhasil</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-600 font-black text-xs bg-blue-50 px-3 py-1 rounded-full">
                    +{log.duration}m
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MEDALS / ACHIEVEMENTS */}
      <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">Pencapaian Hunter 🏆</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Badge icon="🌅" title="Early Cat" desc="Fokus < jam 7 pagi" unlocked={true} />
          <Badge icon="🔥" title="On Fire" desc="Streak 3 hari" unlocked={true} />
          <Badge icon="🎯" title="Sniper" desc="5 subtask beres" unlocked={false} />
          <Badge icon="👑" title="Legend" desc="100 jam fokus" unlocked={false} />
        </div>
      </div>

    </div>
  );
}

function Badge({ icon, title, desc, unlocked }) {
  return (
    <div className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${unlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-200/50 border-transparent opacity-30 grayscale'}`}>
      <span className="text-2xl mb-1">{icon}</span>
      <h4 className="text-[9px] font-black uppercase text-slate-700">{title}</h4>
      <p className="text-[8px] font-bold text-slate-400 leading-tight mt-0.5">{desc}</p>
    </div>
  );
}

export default Statistik;