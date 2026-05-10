import React, { useState } from 'react';

function Tujuan({ 
  tasks, 
  onAddTask, 
  updateTaskDetail, 
  onDeleteTask, 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask, 
  onEditSubtask,
  onStartFocusing // <--- 1. TAMBAH PROP INI
}) {
  const [newTasksName, setNewTasksName] = useState("");
  const [newSubtexts, setNewSubtexts] = useState({});
  const [editingSub, setEditingSub] = useState({ taskId: null, subId: null });
  const [tempText, setTempText] = useState("");

  const handleAddMainTask = () => {
    if (!newTasksName || newTasksName.trim() === "") return;
    onAddTask(newTasksName);
    setNewTasksName("");
  };

  const handleAddSub = (taskId) => {
    const text = newSubtexts[taskId];
    if (text && text.trim() !== "") {
      onAddSubtask(taskId, text);
      setNewSubtexts({ ...newSubtexts, [taskId]: "" });
    }
  };

  const saveEdit = (taskId, subId) => {
    if (tempText.trim() !== "") {
      onEditSubtask(taskId, subId, tempText);
    }
    setEditingSub({ taskId: null, subId: null });
  };

  return (
    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar bg-white">
      {/* INPUT UTAMA */}
      <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-white border border-slate-200 focus:border-blue-400 px-4 py-2 rounded-xl outline-none font-bold text-slate-700 text-xs transition-all"
            placeholder="Tambahkan target baru..."
            value={newTasksName}
            onChange={(e) => setNewTasksName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMainTask()}
          />
          <button onClick={handleAddMainTask} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
            + Tambah
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map(task => {
          const total = task.subtasks?.length || 0;
          const done = task.subtasks?.filter(s => s.completed).length || 0;
          const percent = total === 0 ? 0 : Math.round((done / total) * 100);

          return (
            <div key={task.id} className="bg-white border border-slate-100 p-4 rounded-[1.5rem] shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
              <div className="absolute top-0 left-0 h-0.5 bg-blue-500 transition-all duration-1000" style={{ width: `${percent}%` }}></div>

              {/* HEADER TASK */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">{percent}%</span>
                    <select 
                      className="text-[8px] font-bold uppercase text-slate-400 bg-transparent outline-none cursor-pointer"
                      value={task.category || "Umum"}
                      onChange={(e) => updateTaskDetail(task.id, { category: e.target.value })}
                    >
                      <option value="Umum">Umum</option>
                      <option value="Kerja">Kerja</option>
                      <option value="Belajar">Belajar</option>
                      <option value="Hobby">Hobby</option>
                    </select>
                  </div>
                  <input 
                    className="text-base font-black bg-transparent outline-none focus:text-blue-600 w-full"
                    value={task.title}
                    onChange={(e) => updateTaskDetail(task.id, { title: e.target.value })}
                  />
                </div>

                {/* AREA KANAN HEADER - ADA TOMBOL MULAI FOKUS */}
                <div className="flex items-center gap-2 border-l pl-3 border-slate-50">
                  <input 
                    type="date"
                    className="text-[10px] font-bold text-slate-400 outline-none bg-transparent"
                    value={task.deadline || ""}
                    onChange={(e) => updateTaskDetail(task.id, { deadline: e.target.value })}
                  />
                  <button onClick={() => onDeleteTask(task.id)} className="text-slate-200 hover:text-red-500 transition-all text-xs">🗑️</button>
                  
                  {/* TOMBOL BARU: MULAI FOKUS */}
                  <button 
                    onClick={() => onStartFocusing(task)} 
                    className="bg-slate-800 hover:bg-blue-600 text-white rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    Fokus
                  </button>
                </div>
              </div>

              {/* LIST SUBTASKS */}
              <div className="bg-slate-50 rounded-xl p-2 border border-slate-50">
                <div className="space-y-1 mb-2">
                  {task.subtasks.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between bg-white p-1.5 px-3 rounded-lg border border-slate-100 group/item">
                      <div className="flex items-center gap-2 flex-1">
                        <input 
                          type="checkbox" 
                          checked={sub.completed}
                          onChange={() => onToggleSubtask(task.id, sub.id)}
                          className="checkbox checkbox-xs checkbox-primary"
                        />
                        {editingSub.subId === sub.id ? (
                          <input 
                            autoFocus
                            className="text-[11px] font-bold text-blue-600 bg-blue-50 outline-none px-1 rounded flex-1"
                            value={tempText}
                            onChange={(e) => setTempText(e.target.value)}
                            onBlur={() => saveEdit(task.id, sub.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id, sub.id)}
                          />
                        ) : (
                          <span 
                            onClick={() => {
                              setEditingSub({ taskId: task.id, subId: sub.id });
                              setTempText(sub.text);
                            }}
                            className={`text-[11px] font-bold cursor-text flex-1 ${sub.completed ? 'line-through text-slate-300' : 'text-slate-600'}`}
                          >
                            {sub.text}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => onDeleteSubtask(task.id, sub.id)}
                        className="opacity-0 group-hover/item:opacity-100 text-[8px] text-red-300 hover:text-red-500 font-bold"
                      >
                        HAPUS
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input Subtask Baru */}
                <div className="flex gap-1 items-center px-1">
                  <input 
                    className="flex-1 bg-transparent px-2 py-1 text-[11px] outline-none border-b border-slate-200 focus:border-blue-400 font-medium"
                    placeholder="Tambah langkah..."
                    value={newSubtexts[task.id] || ""}
                    onChange={(e) => setNewSubtexts({...newSubtexts, [task.id]: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSub(task.id)}
                  />
                  <button onClick={() => handleAddSub(task.id)} className="text-blue-600 font-black text-lg px-2">+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tujuan;