import { useState } from 'react'
import { useEffect } from 'react';

function App() {
  // 1. Ubah jadi 'tasks' (jamak) biar konsisten sama bawahnya
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("purrfocus_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
  localStorage.setItem("purrfocus_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [newTasksName, setNewTasksName] = useState("");

  const addTasks = () => {
    if (newTasksName.trim() === "") return;

    const newTasks = {
      id: Date.now(),
      title: newTasksName,
      status: "hunting",
      subtasks: []
    };

    setTasks([...tasks, newTasks]);
    setNewTasksName("");
  }

  const toggleSubtask = (taskId, subtaskId) => {
    const newTasks = tasks.map(task => { // Sekarang 'tasks' sudah dikenal
      if (task.id === taskId) {
        const newSubtasks = task.subtasks.map(sub => {
          if (sub.id === subtaskId) {
            return { ...sub, completed: !sub.completed };
          }
          return sub;
        });
        return { ...task, subtasks: newSubtasks};
      }
      return task;
    });

    setTasks(newTasks);
  }



  return (
    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#333469' }}>
      <h1>PurrFocus 🐾</h1>

      <div>
        <input type="text" 
        placeholder="Mau berburu (fokus) apa hari ini?" 
        value={newTasksName}
        onChange={(e) => setNewTasksName(e.target.value)}/>
        <button onClick={addTasks}> Tambah task</button>
      </div>

      {tasks.map((t) => (
        <div key={t.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{t.title}</h3>
          {(() => 
            {
              const totalSubtasks = t.subtasks.length;
              const completedSubtasks = t.subtasks.filter(s => s.completed).length;
              const percentage = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100);

              return (
                <p>Status Kenyang: {percentage}% ({completedSubtasks}/{totalSubtasks})</p>
              );
            })()
          }
          <ul>
            {t.subtasks.map((sub) => (
              <li key={sub.id}>
                <input 
                  type="checkbox" 
                  checked={sub.completed} 
                  onChange={() => toggleSubtask(t.id, sub.id)} 
                /> 
                {sub.text} 
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App