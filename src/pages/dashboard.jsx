import React, { useState } from 'react';

function Dashboard({ 
  tasks, onAddTask, onDeleteTask, onEditTask, onToggleSubtask, 
  onAddSubtask, onStartFocusing, onEditSubtask, onDeleteSubtask 
}) {
  const [newTasksName, setNewTasksName] = useState("");

  const getProgress = (task) => {
    const total = task.subtasks?.length || 0;
    const done = task.subtasks?.filter(s => s.completed).length || 0;
    const percent = total === 0 ? 0 : (done / total) * 100;
    return { total, done, percent };
  };

  return (
    // Background utama mengikuti warna biru muda di gambar
    <div className="flex h-screen bg-[#b8c9f2] text-slate-800 font-sans overflow-hidden">
      
      {/* 🐾 SIDEBAR */}
      <div className="w-64 bg-[#b8c9f2] flex flex-col p-6 border-r border-blue-300">
        <div className="flex items-center gap-2 mb-10">
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-800 flex items-center">
            Purr focus <span className="ml-1 text-xs">🐾</span>
          </h1>
        </div>

        <ul className="space-y-4 flex-1">
          <li><button className="flex items-center gap-3 font-bold text-lg bg-blue-400/30 w-full p-2 rounded-lg text-blue-900 shadow-sm">🏠 Beranda</button></li>
          <li><button className="flex items-center gap-3 font-bold text-lg opacity-70 hover:opacity-100 transition p-2">📊 Statistik</button></li>
          <li><button className="flex items-center gap-3 font-bold text-lg opacity-70 hover:opacity-100 transition p-2">📅 Kalender</button></li>
          <li><button className="flex items-center gap-3 font-bold text-lg opacity-70 hover:opacity-100 transition p-2">📋 Riwayat</button></li>
          <li><button className="flex items-center gap-3 font-bold text-lg opacity-70 hover:opacity-100 transition p-2">🎯 Tujuan Saya</button></li>
          <li><button className="flex items-center gap-3 font-bold text-lg opacity-70 hover:opacity-100 transition p-2">⚙️ Pengaturan</button></li>
        </ul>

        <button 
          onClick={() => tasks.length > 0 && onStartFocusing(tasks[0])}
          className="btn btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white shadow-lg rounded-xl mt-4"
        >
          Start Focus
        </button>
      </div>

      {/* 🚀 MAIN CONTENT */}
      <div className="flex-1 bg-white m-4 rounded-3xl shadow-inner flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <div className="p-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">Selamat pagi John!</h2>
            <p className="text-slate-500">Rabu, 29 April 2026 • {tasks.length} task menunggu</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold">John Doe</span>
            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        <div className="px-8 pb-8 grid grid-cols-12 gap-6 overflow-auto">
          
          {/* STATS AREA */}
          <div className="col-span-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <p className="text-4xl font-bold">4j 37m</p>
                <p className="text-xs text-slate-400 mt-1 uppercase">Fokus hari ini</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <p className="text-4xl font-bold">4</p>
                <p className="text-xs text-slate-400 mt-1 uppercase">Sesi selesai</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <p className="text-4xl font-bold">8</p>
                <p className="text-xs text-slate-400 mt-1 uppercase">Task selesai</p>
              </div>
            </div>

            {/* TASK LIST CONTAINER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Task list</h3>
                <div className="join">
                   <input 
                    className="input input-sm input-bordered join-item" 
                    placeholder="Tambah task..."
                    value={newTasksName}
                    onChange={(e) => setNewTasksName(e.target.value)}
                  />
                  <button onClick={() => {onAddTask(newTasksName); setNewTasksName("")}} className="btn btn-sm btn-outline join-item">+ Tambah task</button>
                </div>
              </div>

              <div className="space-y-4">
                {tasks.map(task => {
                  const { done, total, percent } = getProgress(task);
                  return (
                    <div key={task.id} className="flex items-center gap-4 p-4 bg-white border-2 border-slate-50 rounded-xl hover:border-blue-100 transition-all shadow-sm">
                      <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-700">{task.title}</h4>
                        <p className="text-xs text-slate-400 italic">Subtask aktif: {task.subtasks?.find(s => !s.completed)?.text || "Siap dikerjakan!"}</p>
                        <progress className="progress progress-primary w-full h-1 mt-2" value={percent} max="100"></progress>
                      </div>
                      <div className="badge badge-info badge-outline font-bold px-4">{percent === 100 ? 'Done' : 'Hunting'}</div>
                      <button onClick={() => onStartFocusing(task)} className="btn btn-sm btn-primary px-6 rounded-lg text-white">Mulai</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (STREAK & ACHIEVEMENTS) */}
          <div className="col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center">
              <span className="text-4xl">🔥</span>
              <p className="text-6xl font-black text-orange-500 my-2">5</p>
              <p className="text-sm text-blue-500 font-medium">Hari streak berturut - turut</p>
              <div className="flex justify-center gap-2 mt-4">
                {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 5 ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">Pencapaian 🏆</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-100 p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square">
                  <span className="text-xl">🐾</span>
                  <p className="text-[10px] font-bold mt-1">Berburu pertama</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square">
                  <span className="text-xl">🔥</span>
                  <p className="text-[10px] font-bold mt-1">5 hari streak</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square">
                  <span className="text-xl">⏰</span>
                  <p className="text-[10px] font-bold mt-1">10 Jam fokus</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;