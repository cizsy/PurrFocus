import React, { useState } from 'react';
import useStats from '../hooks/useStats'; 

function Dashboard({ tasks = [], onAddTask, onStartFocusing, onDeleteTask, onEditTask }) {
  const [newTasksName, setNewTasksName] = useState("");
  const { focusTimeToday, sessionCount, completedTasks, focusScore, currentStreak } = useStats(tasks);

  const getProgress = (task) => {
    const total = task.subtasks?.length || 0;
    const done = task.subtasks?.filter(s => s.completed).length || 0;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  };

  const activeTasks = tasks.filter(task => getProgress(task).percent < 100);

  return (
    // Margin dirapatkan dari p-10 ke p-6
    <div className="p-6 grid grid-cols-12 gap-6 bg-white min-h-full">
      
      {/* 📊 STATS GRID - Sekarang ada 5 kartu (Streak masuk sini) */}
      <div className="col-span-12 grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon="⏱️" label="Fokus" value={focusTimeToday} color="blue" />
        <StatCard icon="⚔️" label="Sesi" value={sessionCount} color="orange" />
        <StatCard icon="✅" label="Selesai" value={completedTasks} color="green" />
        <StatCard icon="🎯" label="Skor" value={`${focusScore}%`} color="purple" />
        {/* Streak versi ramping */}
        <StatCard icon="🔥" label="Streak" value={currentStreak} color="red" />
      </div>

      {/* ⚔️ DAFTAR BERBURU - Dibuat lebih lebar */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 shadow-sm min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800">Target Aktif 🐾</h3>
            <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <input 
                className="bg-transparent px-4 py-1 text-sm outline-none w-48 focus:w-64 transition-all" 
                placeholder="Lacak target baru..."
                value={newTasksName}
                onChange={(e) => setNewTasksName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAddTask(newTasksName) && setNewTasksName("")}
              />
              <button onClick={() => {onAddTask(newTasksName); setNewTasksName("")}} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                + Tambah
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {activeTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <span className="text-6xl mb-4">🐱💤</span>
                <p className="font-bold italic">Semua target sudah beres. Saatnya tidur siang!</p>
              </div>
            ) : activeTasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-lg transition-all group">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-bold text-slate-700">{task.title}</h4>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">{getProgress(task).percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${getProgress(task).percent}%` }}></div>
                  </div>
                </div>
                <button 
                  onClick={() => onStartFocusing(task)} 
                  className="bg-slate-800 hover:bg-blue-600 text-white rounded-xl px-5 py-2 text-sm font-bold transition-all shadow-md active:scale-95"
                >
                  Mulai
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📅 SIDE CONTENT - Kalender & Info Tambahan */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
  
  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Jadwal Buruan 📅</h3>
    
    <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 mb-3">
      <span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
    </div>
    
    <div className="grid grid-cols-7 gap-2">
      {[...Array(31)].map((_, i) => {
        const day = i + 1;
        const isToday = day === new Date().getDate();
        
        // Cek apakah ada task yang deadlinenya jatuh di tanggal ini (bulan ini)
        const hasDeadline = tasks.some(task => {
          if (!task.deadline) return false;
          const deadlineDate = new Date(task.deadline).getDate();
          const deadlineMonth = new Date(task.deadline).getMonth();
          return deadlineDate === day && deadlineMonth === new Date().getMonth();
        });

        return (
          <div key={i} className="relative group">
            <div className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-default
              ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}
              ${hasDeadline && !isToday ? 'border-2 border-orange-400 text-orange-600' : ''}
            `}>
              {day}
            </div>
            {/* Dot indikator kecil di bawah angka kalau ada deadline */}
            {hasDeadline && (
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-orange-500'}`}></span>
            )}
          </div>
        );
      })}
    </div>

    {/* Info Box di bawah Kalender */}
    <div className="mt-6 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Deadline Terdekat</p>
      </div>
      
      {tasks.filter(t => t.deadline).length > 0 ? (
        tasks
        .filter(t => t.deadline)
        .slice(0, 2) // Ambil 2 deadline terdekat
        .map(t => (
          <div key={t.id} className="mb-2 last:mb-0">
            <p className="text-xs font-bold text-slate-700 truncate">{t.title}</p>
            <p className="text-[10px] text-slate-400">{new Date(t.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
          </div>
          ))
          ) : (
          <p className="text-[10px] italic text-slate-400">Belum ada deadline yang diset.</p>
          )}
        </div>
      </div>

        {/* Widget Quote / Mood */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-2">Mood Kucing</p>
            <p className="text-sm italic font-medium">"Fokus itu seperti mengejar laser, Hunter. Jangan berkedip atau kamu kehilangan jejaknya."</p>
            <p className="text-[10px] mt-4 font-bold text-blue-400">— Master Meow</p>
          </div>
          <span className="absolute -right-4 -bottom-4 text-7xl opacity-10 grayscale">🐾</span>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const themes = {
    blue: "bg-blue-50 border-blue-100 text-blue-900",
    orange: "bg-orange-50 border-orange-100 text-orange-900",
    green: "bg-green-50 border-green-100 text-green-900",
    purple: "bg-purple-50 border-purple-100 text-purple-900",
    red: "bg-red-50 border-red-100 text-red-900", // Tema baru buat streak
  };
  return (
    <div className={`p-4 rounded-2xl border ${themes[color]} transition-all hover:shadow-md flex flex-col items-center text-center justify-center`}>
      <div className="text-xl mb-1">{icon}</div>
      <p className="text-xl font-black leading-tight">{value}</p>
      <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">{label}</p>
    </div>
  );
}

export default Dashboard;