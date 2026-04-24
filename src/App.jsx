import React, { useState, useEffect } from 'react';
import TaskList from './components/Tasks'; // Pastikan nama file sesuai
import Timer from './components/Timer';

function App() {
  const [view, setView] = useState('dashboard');


  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("purrfocus_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTasksName, setNewTasksName] = useState("");
  const [activeTask, setActiveTask] = useState(null);

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
      if (activeTask?.id === taskId) setActiveTask(null);
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
    setActiveTask(task);
    setView('pawmodoro')
  };

  const backToDashboard = () => {
    setView('dashboard');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#333469', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>PurrFocus 🐾</h1>

      {/* Logika Pergantian Halaman: Jika view === 'dashboard', tampilkan input & list. Jika tidak, tampilkan Timer */}
      {view === 'dashboard' ? (
        <>
          {/* --- HALAMAN DASHBOARD --- */}
          <div style={{ margin: '30px 0', textAlign: 'center' }}>
            <input
              type="text"
              placeholder="Mau berburu apa hari ini?"
              value={newTasksName}
              onChange={(e) => setNewTasksName(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '250px' }}
            />
            <button onClick={addTasks} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer', borderRadius: '5px' }}>
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
        <>
          {/* --- HALAMAN PAWMODORO (FOKUS) --- */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={backToDashboard} 
              style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '10px', backgroundColor: '#ffcc00', color: 'black', border: 'none', fontWeight: 'bold' }}>
              ⬅ Kembali ke Dashboard
            </button>
            
            <Timer activeTask={activeTask} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;