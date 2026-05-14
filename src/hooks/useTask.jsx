import { useState, useEffect } from 'react';

function useTasks() {
  // fungsi untuk mengambil data tasks dari localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("purrfocus_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // fungsi untuk mengambil data focusLogs dari localStorage
  const [focusLogs, setFocusLogs] = useState(() => {
    const saved = localStorage.getItem("purrfocus_logs");
    return saved ? JSON.parse(saved) : [];
  });

  // fungsi untuk membuat format tanggal lokal: YYYY-MM-DD
  const getLocalDateString = (date = new Date()) => {
    const localDate = new Date(date);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // fungsi untuk membandingkan apakah dua tanggal berada pada hari lokal yang sama
  const isSameLocalDate = (dateA, dateB = new Date()) => {
    return getLocalDateString(dateA) === getLocalDateString(dateB);
  };

  // fungsi untuk membandingkan tasks apakah sudah melewati hari atau masih aktif
  useEffect(() => {
    const expiredTasks = tasks.filter((task) => {
      return !isSameLocalDate(task.createdAt);
    });

    if (expiredTasks.length > 0) {
      const history = JSON.parse(localStorage.getItem("purrfocus_history") || "[]");
      const newHistory = [...history, ...expiredTasks];

      localStorage.setItem("purrfocus_history", JSON.stringify(newHistory));

      const activeTasks = tasks.filter((task) => {
        return isSameLocalDate(task.createdAt);
      });

      setTasks(activeTasks);
    }
  }, []);

  // menyimpan perubahan tasks ke localStorage
  useEffect(() => {
    localStorage.setItem("purrfocus_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // menyimpan perubahan focusLogs ke localStorage
  useEffect(() => {
    localStorage.setItem("purrfocus_logs", JSON.stringify(focusLogs));
  }, [focusLogs]);

  const addFocusLog = (taskId, duration) => {
    const newLog = {
      id: Date.now(),
      taskId,
      duration,
      taskTitle: tasks.find((task) => task.id === taskId)?.title || "Unknown Task",
      date: getLocalDateString(),
      type: "focus",
    };

    setFocusLogs((prev) => [...prev, newLog]);
  };

  const addTask = (taskName, category = "Umum", deadline = null) => {
    if (!taskName || taskName.trim() === "") return false;

    const newTask = {
      id: Date.now(),
      title: taskName,
      status: "hunting",
      subtasks: [],
      createdAt: getLocalDateString(),
      deadline: deadline || getLocalDateString(),
      category,
      notes: "",
    };

    setTasks((prev) => [...prev, newTask]);
    return true;
  };

  const updateTaskDetail = (taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    return true;
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        return {
          ...task,
          subtasks: task.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          ),
        };
      })
    );
  };

  const addSubtask = (taskId, text) => {
    if (!text || text.trim() === "") return;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        return {
          ...task,
          subtasks: [
            ...task.subtasks,
            {
              id: Date.now(),
              text,
              completed: false,
            },
          ],
        };
      })
    );
  };

  const editSubtask = (taskId, subtaskId, newText) => {
    if (!newText || newText.trim() === "") return;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        return {
          ...task,
          subtasks: task.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, text: newText }
              : subtask
          ),
        };
      })
    );
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        return {
          ...task,
          subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
        };
      })
    );
  };

  const getTaskProgress = (task) => {
    const total = task.subtasks?.length || 0;
    const completed = task.subtasks?.filter((subtask) => subtask.completed).length || 0;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      percentage,
    };
  };

  const updateTaskNotes = (taskId, newNotes) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, notes: newNotes } : task
      )
    );
  };

  const getActiveTask = (id) => {
    return tasks.find((task) => task.id === id) || null;
  };

  return {
    tasks,
    focusLogs,
    addFocusLog,
    addTask,
    deleteTask,
    updateTaskDetail,
    toggleSubtask,
    addSubtask,
    editSubtask,
    deleteSubtask,
    getTaskProgress,
    updateTaskNotes,
    getActiveTask,
  };
}

export default useTasks;