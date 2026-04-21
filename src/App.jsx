import { useState, useEffect } from 'react';
import Tasklist from './components/tasks';


function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("purrfocus_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTasksName, setNewTasksName] = useState("");

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
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newSubtasks = task.subtasks.map(sub => {
          if (sub.id === subtaskId) return { ...sub, completed: !sub.completed };
          return sub;
        });
        return { ...task, subtasks: newSubtasks };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const addSubtask = (taskId) => {
    const text = prompt("Masukkan tugas yang ingin kamu kejar (subtask):");
    if (text) {
      const newTasks = tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [...task.subtasks, { id: Date.now(), text, completed: false }]
          };
        }
        return task;
      });
      setTasks(newTasks);
    }
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Yakin mau hapus task ini?")) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  // FITUR EDIT (Yang kamu minta tadi)
  const editTask = (taskId) => {
    const currentTask = tasks.find(t => t.id === taskId);
    const newTitle = prompt("Ubah nama task:", currentTask.title);
    if (newTitle && newTitle.trim() !== "") {
      setTasks(tasks.map(t => (t.id === taskId ? { ...t, title: newTitle } : t)));
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#333469', minHeight: '100vh', color: 'white' }}>
      <h1>PurrFocus 🐾</h1>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Mau berburu apa hari ini?" 
          value={newTasksName}
          onChange={(e) => setNewTasksName(e.target.value)}
        />
        <button onClick={addTasks}>Tambah task</button>
      </div>

      <Tasklist
        tasks={tasks}
        toggleSubtask={toggleSubtask}
        addSubtask={addSubtask}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    </div>
  );
}

export default App;