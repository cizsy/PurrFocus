import { useState, useEffect } from 'react';

function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("purrfocus_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // 1. LOGIKA AUTO-RESET
  useEffect(() => {
    const today = new Date().toDateString();
    const expiredTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt).toDateString();
      return taskDate !== today;
    });

    if (expiredTasks.length > 0) {
      const history = JSON.parse(localStorage.getItem("purrfocus_history") || "[]");
      const newHistory = [...history, ...expiredTasks];
      localStorage.setItem("purrfocus_history", JSON.stringify(newHistory));
      
      const activeTasks = tasks.filter(t => new Date(t.createdAt).toDateString() === today);
      setTasks(activeTasks);
    }
  }, []);

  // 2. AUTO-SAVE
  useEffect(() => {
    localStorage.setItem("purrfocus_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 3. TAMBAH TASK (Sama, tapi pastikan deadline default konsisten)
  const addTask = (taskName, category = "Umum", deadline = null) => {
    if (!taskName || taskName.trim() === "") return false;
    const newTask = {
      id: Date.now(),
      title: taskName,
      status: "hunting",
      subtasks: [],
      createdAt: new Date().toISOString(),
      deadline: deadline || new Date().toISOString().split('T')[0], 
      category: category,
      notes: ""
    };
    setTasks(prev => [...prev, newTask]);
    return true;
  };

  // 4. UPDATE DETAIL (Fungsi serbaguna untuk judul, deadline, kategori)
  const updateTaskDetail = (taskId, updates) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    ));
  };

  // 5. HAPUS TASK (Confirm dibuang, biar UI yang handle kalau mau pake modal nantinya)
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    return true;
  };

  // 6. TOGGLE SUBTASK
  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        subtasks: task.subtasks.map(sub =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        )
      };
    }));
  };

  // 7. TAMBAH SUBTASK (Modern: Terima text langsung dari input UI)
  const addSubtask = (taskId, text) => {
    if (!text || text.trim() === "") return;
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        subtasks: [...task.subtasks, { id: Date.now(), text, completed: false }]
      };
    }));
  };

  // 8. EDIT SUBTASK (Modern: Terima text baru dari input UI)
  const editSubtask = (taskId, subtaskId, newText) => {
    if (!newText || newText.trim() === "") return;
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        subtasks: task.subtasks.map(sub => 
          sub.id === subtaskId ? { ...sub, text: newText } : sub
        )
      };
    }));
  };

  // 9. DELETE SUBTASK
  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return { ...task, subtasks: task.subtasks.filter(sub => sub.id !== subtaskId) };
    }));
  };

  const getTaskProgress = (task) => {
    const total = task.subtasks?.length || 0;
    const completed = task.subtasks?.filter(s => s.completed).length || 0;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTaskDetail,
    toggleSubtask,
    addSubtask,
    editSubtask,
    deleteSubtask,
    getTaskProgress,
    getActiveTask: (id) => tasks.find(t => t.id === id) || null
  };
}

export default useTasks;