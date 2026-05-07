import React, { useState } from 'react';
import useStats from '../hooks/useStats'; // Import hook statistik
import logoLight from '../assets/logoLight.png'; 
import profil from '../assets/profil.jpg';

function Dashboard({ 
  tasks = [], 
  onAddTask, 
  onStartFocusing,
  onDeleteTask, 
  onEditTask 
}) {
  const [newTasksName, setNewTasksName] = useState("");
  
  // Mengambil data statistik dari hook khusus
  const { 
    focusTimeToday, 
    sessionCount, 
    completedTasks, 
    focusScore, 
    currentStreak,
    weeklyDistribution 
  } = useStats(tasks);

  const getProgress = (task) => {
    const total = task.subtasks?.length || 0;
    const done = task.subtasks?.filter(s => s.completed).length || 0;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  };

  const handleAddTask = () => {
    if (newTasksName.trim() === "") return;
    onAddTask(newTasksName);
    setNewTasksName("");
  };

  return (
    <div className="flex h-screen bg-[#b8c9f2] text-slate-800 font-sans overflow-hidden p-4">
      
      {/* 🐾 SIDEBAR */}
      <div className="w-64 flex flex-col p-4 pr-6">
        <div className="mb-10 ml-2">
          <img src={logoLight} alt="PurrFocus Logo" className="w-48 object-contain" />
        </div>
        
        <ul className="space-y-2 flex-1">
          <li><button className="flex items-center gap-3 font-bold text-lg bg-white/40 w-full p-3 rounded-2xl text-blue-900 shadow-sm transition-all">🏠 Beranda</button></li>
          <li><button className="flex items-center gap-3 font-bold text-lg opacity-60 hover:opacity-100 hover:bg-white/20 w-full p-3 rounded-2xl transition-all">📊 Statistik</button></li>
          <li><button className="flex items-center gap-3 font-bold text-lg opacity-60 hover:opacity-100 hover:bg-white/20 w-full p-3 rounded-2xl transition-all">⚙️ Pengaturan</button></li>
        </ul>

        <button 
          onClick={() => tasks.length > 0 && onStartFocusing(tasks[0])}
          className={`btn border-none text-white shadow-lg rounded-2xl h-14 text-lg font-bold transition-all ${tasks.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400 cursor-not-allowed'}`}
          disabled={tasks.length === 0}
        >
          Mulai Fokus
        </button>
      </div>

      {/* 🚀 MAIN CONTENT */}
      <div className="flex-1 bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border-4 border-white/50">
        
        <nav className="px-10 py-6 flex justify-between items-center bg-white border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Selamat pagi, Hunter! 👋</h2>
            <p className="text-sm text-slate-400 font-medium">Kamu punya {tasks.length - completedTasks} target tersisa hari ini.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-700 leading-none">John Doe</p>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Pro Member</p>
            </div>
            <img src={profil} alt="Profil" className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-100 shadow-md" />
          </div>
        </nav>

        <div className="p-10 pt-8 grid grid-cols-12 gap-8 overflow-y-auto custom-scrollbar">
          
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* 📊 DYNAMIC STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="⏱️" label="Fokus" value={focusTimeToday} color="blue" />
              <StatCard icon="⚔️" label="Sesi" value={sessionCount} color="orange" />
              <StatCard icon="✅" label="Selesai" value={completedTasks} color="green" />
              <StatCard icon="🎯" label="Skor" value={`${focusScore}%`} color="purple" />
            </div>

            {/* TASK LIST */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black">Daftar Berburu 🐾</h3>
                <div className="flex gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input 
                    className="bg-transparent px-3 py-1 text-sm outline-none w-40 focus:w-48 transition-all" 
                    placeholder="Lacak target baru..."
                    value={newTasksName}
                    onChange={(e) => setNewTasksName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <button onClick={handleAddTask} className="btn btn-sm bg-blue-600 hover:bg-blue-700 border-none text-white px-4 rounded-lg">+ Tambah</button>
                </div>
              </div>

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-10 opacity-20 font-bold italic text-xl">Belum ada target buruan...</div>
                ) : tasks.map(task => {
                  const { percent } = getProgress(task);
                  return (
                    <div key={task.id} className="flex items-center gap-5 p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className={`font-bold text-lg ${percent === 100 ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {task.title}
                          </h4>
                          <div className="hidden group-hover:flex gap-1">
                            <button onClick={() => onEditTask(task.id)} className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200">Edit</button>
                            <button onClick={() => onDeleteTask(task.id)} className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200">Hapus</button>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 h-2 mt-3 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onStartFocusing(task)} 
                        className="btn bg-white hover:bg-blue-600 hover:text-white text-blue-600 border-2 border-blue-600 rounded-2xl px-6 font-bold transition-all shadow-md"
                      >
                        Mulai
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIDE INFO */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-[2.5rem] p-8 text-center text-white shadow-xl shadow-orange-200">
              <span className="text-5xl">🔥</span>
              <p className="text-7xl font-black my-2">{currentStreak}</p>
              <p className="font-bold uppercase text-xs opacity-80 tracking-widest">Day Streak</p>
            </div>
            
            {/* Weekly Activity Chart (Simple) */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h3 className="font-bold mb-6 text-xs uppercase text-slate-500 tracking-widest">Aktivitas Mingguan</h3>
              <div className="flex items-end justify-between h-20 gap-2 mb-6">
                {weeklyDistribution.map((val, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-blue-500 rounded-t-md hover:bg-blue-400 transition-all"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['🐾', '🔥', '⏰', '⭐', '🚀', '💎'].map((emoji, i) => (
                  <div key={i} className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer border border-white/5">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable StatCard Component
function StatCard({ icon, label, value, color }) {
  const themes = {
    blue: "bg-blue-50 border-blue-100 text-blue-900",
    orange: "bg-orange-50 border-orange-100 text-orange-900",
    green: "bg-green-50 border-green-100 text-green-900",
    purple: "bg-purple-50 border-purple-100 text-purple-900",
  };

  return (
    <div className={`p-5 rounded-[2rem] border ${themes[color]} transition-all hover:shadow-md`}>
      <div className="text-xl mb-1">{icon}</div>
      <p className="text-2xl font-black leading-tight">{value}</p>
      <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">{label}</p>
    </div>
  );
}

export default Dashboard;