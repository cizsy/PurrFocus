import React, { useState, useEffect } from 'react';
import TaskList from './components/Tasks';
import Timer from './components/Timer';

function App() {
  const [view, setView] = useState('dashboard');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("purrfocus_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTasksName, setNewTasksName] = useState("");
  const [activeTaskId, setActiveTaskId] = useState(null); // Simpan ID saja
  const [showOverlay, setShowOverlay] = useState(false);

  // Ambil data task yang sedang aktif secara real-time dari list tasks
  const currentActiveTask = tasks.find(t => t.id === activeTaskId) || null;

  useEffect(() => {
    localStorage.setItem("purrfocus_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTasks = () => {
    if (newTasksName.trim() === "") return;
    const newTask = {
      id: Date.now(),
      title: newTasksName,
      status: "hunting",
      subtasks: []
    };
    setTasks([...tasks, newTask]);
    setNewTasksName("");
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newSubtasks = task.subtasks.map(sub => {
          if (sub.id === subtaskId) return { ...sub, completed: !sub.completed };
          return sub;
        });
        return { ...task, subtasks: newSubtasks };
      }
      return task;
    }));
  };

  const addSubtask = (taskId) => {
    const text = prompt("Masukkan tugas yang ingin kamu kejar (subtask):");
    if (text) {
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [...task.subtasks, { id: Date.now(), text, completed: false }]
          };
        }
        return task;
      }));
    }
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Yakin mau hapus task ini?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
      if (activeTaskId === taskId) setActiveTaskId(null);
    }
  };

  const editTask = (taskId) => {
    const currentTask = tasks.find(t => t.id === taskId);
    const newTitle = prompt("Ubah nama task:", currentTask.title);
    if (newTitle && newTitle.trim() !== "") {
      setTasks(tasks.map(t => (t.id === taskId ? { ...t, title: newTitle } : t)));
    }
  };

  const startFocusing = (task) => {
    setActiveTaskId(task.id);
    setView('pawmodoro');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#333469', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', position: 'relative' }}>
      <h1 style={{ textAlign: 'center' }}>PurrFocus 🐾</h1>

      {view === 'dashboard' ? (
        <>
          <div style={{ margin: '30px 0', textAlign: 'center' }}>
            <input
              type="text"
              placeholder="Mau berburu apa hari ini?"
              value={newTasksName}
              onChange={(e) => setNewTasksName(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '250px' }}
            />
            <button onClick={addTasks} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#ffcc00', fontWeight: 'bold' }}>
              Tambah task
            </button>
          </div>

          <TaskList
            tasks={tasks}
            toggleSubtask={toggleSubtask}
            addSubtask={addSubtask}
            deleteTask={deleteTask}
            editTask={editTask}
            onStartFocusing={startFocusing} 
          />
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => setView('dashboard')} 
            style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '10px', backgroundColor: '#ffcc00', color: 'black', border: 'none', fontWeight: 'bold' }}>
            ⬅ Dashboard
          </button>
          
          <Timer activeTask={currentActiveTask} />

          {/* --- OVERLAY SUBTASK MELAYANG --- */}
          {currentActiveTask && (
            <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
              {showOverlay && (
                <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', borderRadius: '15px', marginBottom: '15px', width: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'left', border: '2px solid #ffcc00' }}>
                  <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Daftar Mangsa 📋</h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {currentActiveTask.subtasks.map(sub => (
                      <div key={sub.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={sub.completed} 
                          onChange={() => toggleSubtask(currentActiveTask.id, sub.id)} 
                        />
                        <span style={{ marginLeft: '10px', textDecoration: sub.completed ? 'line-through' : 'none', color: sub.completed ? '#888' : 'black' }}>
                          {sub.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => addSubtask(currentActiveTask.id)}
                    style={{ marginTop: '10px', width: '100%', padding: '5px', cursor: 'pointer', borderRadius: '5px', border: '1px dashed #666', background: 'none' }}>
                    + Tambah Sub-rencana
                  </button>
                </div>
              )}
              <button 
                onClick={() => setShowOverlay(!showOverlay)}
                style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ffcc00', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'block', marginLeft: 'auto' }}>
                {showOverlay ? '✖' : '📋'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;