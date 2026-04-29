// hooks/useTasks.js
import { useState, useEffect } from 'react';

function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("purrfocus_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save ke localStorage
  useEffect(() => {
    localStorage.setItem("purrfocus_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Tambah task baru
  const addTask = (taskName) => {
    if (taskName.trim() === "") return false;
    const newTask = {
      id: Date.now(),
      title: taskName,
      status: "hunting",
      subtasks: []
    };
    setTasks(prev => [...prev, newTask]);
    return true;
  };

  // Hapus task
  const deleteTask = (taskId) => {
    if (!window.confirm("Yakin mau hapus task ini?")) return false;
    setTasks(prev => prev.filter(task => task.id !== taskId));
    return true;
  };

  // Edit task title
  const editTask = (taskId) => {
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) return;
    
    const newTitle = prompt("Ubah nama task:", currentTask.title);
    if (newTitle && newTitle.trim() !== "") {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, title: newTitle } : t
      ));
    }
  };

  // Toggle subtask completed
  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      
      const newSubtasks = task.subtasks.map(sub =>
        sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
      );
      return { ...task, subtasks: newSubtasks };
    }));
  };

  // Tambah subtask baru
  const addSubtask = (taskId) => {
    const text = prompt("Masukkan tugas yang ingin kamu kejar (subtask):");
    if (!text) return;
    
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      
      return {
        ...task,
        subtasks: [...task.subtasks, { 
          id: Date.now(), 
          text, 
          completed: false 
        }]
      };
    }));
  };

  // Dapatkan task aktif berdasarkan ID
  const getActiveTask = (activeTaskId) => {
    return tasks.find(t => t.id === activeTaskId) || null;
  };

  // Hitung progress task
  const getTaskProgress = (task) => {
    const total = task.subtasks.length;
    const completed = task.subtasks.filter(s => s.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  return {
    tasks,           // data tasks
    addTask,         // fungsi tambah task
    deleteTask,      // fungsi hapus task
    editTask,        // fungsi edit task
    toggleSubtask,   // fungsi toggle subtask
    addSubtask,      // fungsi tambah subtask
    getActiveTask,   // fungsi ambil task aktif
    getTaskProgress  // fungsi hitung progress
  };
}

export default useTasks;