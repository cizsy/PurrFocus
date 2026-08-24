import { useState, useEffect, useCallback } from 'react';
import { tasksAPI, focusLogsAPI } from '../services/api';

function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [focusLogs, setFocusLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // fungsi untuk membuat format tanggal lokal: YYYY-MM-DD
  const getLocalDateString = (date = new Date()) => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // fungsi untuk membandingkan apakah dua tanggal berada pada hari lokal yang sama
  const isSameLocalDate = (dateA, dateB = new Date()) => {
    return getLocalDateString(dateA) === getLocalDateString(dateB);
  };

  // ─── Load data dari backend ─────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tasksData, logsData] = await Promise.all([
        tasksAPI.getAll(false),
        focusLogsAPI.getAll(),
      ]);

      // Arsipkan tasks yang sudah lewat hari
      const expiredTaskIds = tasksData
        .filter((task) => !isSameLocalDate(task.created_at))
        .map((task) => task.id);

      if (expiredTaskIds.length > 0) {
        await Promise.all(expiredTaskIds.map((id) => tasksAPI.archive(id)));
        const freshTasks = tasksData.filter((task) => isSameLocalDate(task.created_at));
        setTasks(freshTasks);
      } else {
        setTasks(tasksData);
      }

      setFocusLogs(logsData);
    } catch (err) {
      console.error('[useTasks] Gagal memuat data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Focus Log ──────────────────────────────────────────────────────────────
  const addFocusLog = useCallback(async (taskId, duration) => {
    const task = tasks.find((t) => t.id === taskId);
    try {
      const newLog = await focusLogsAPI.create({
        taskId,
        duration,
        taskTitle: task?.title || 'Unknown Task',
        date: getLocalDateString(),
        type: 'focus',
      });
      setFocusLogs((prev) => [...prev, newLog]);
    } catch (err) {
      console.error('[useTasks] Gagal menyimpan focus log:', err);
    }
  }, [tasks]);

  // ─── Task CRUD ──────────────────────────────────────────────────────────────
  const addTask = useCallback(async (taskName, category = 'Umum', deadline = null) => {
    if (!taskName || taskName.trim() === '') return false;
    try {
      const today = getLocalDateString();
      const newTask = await tasksAPI.create({
        title: taskName.trim(),
        category,
        deadline: deadline || today,
        createdAt: today,
      });
      setTasks((prev) => [...prev, newTask]);
      return true;
    } catch (err) {
      console.error('[useTasks] Gagal menambah task:', err);
      return false;
    }
  }, []);

  const updateTaskDetail = useCallback(async (taskId, updates) => {
    try {
      const updated = await tasksAPI.update(taskId, updates);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error('[useTasks] Gagal update task:', err);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      await tasksAPI.remove(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      return true;
    } catch (err) {
      console.error('[useTasks] Gagal hapus task:', err);
      return false;
    }
  }, []);

  // editTask — alias untuk updateTaskDetail (backward compat)
  const editTask = updateTaskDetail;

  // ─── Subtask CRUD ───────────────────────────────────────────────────────────
  const addSubtask = useCallback(async (taskId, text) => {
    if (!text || text.trim() === '') return;
    try {
      const newSubtask = await tasksAPI.addSubtask(taskId, text.trim());
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
            : task
        )
      );
    } catch (err) {
      console.error('[useTasks] Gagal menambah subtask:', err);
    }
  }, []);

  const toggleSubtask = useCallback(async (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    const subtask = task?.subtasks?.find((s) => s.id === subtaskId);
    if (!subtask) return;

    const newCompleted = !subtask.completed;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: newCompleted } : s
          ),
        };
      })
    );

    try {
      await tasksAPI.updateSubtask(taskId, subtaskId, { completed: newCompleted });
    } catch (err) {
      console.error('[useTasks] Gagal toggle subtask:', err);
      // Rollback on error
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: subtask.completed } : s
            ),
          };
        })
      );
    }
  }, [tasks]);

  const editSubtask = useCallback(async (taskId, subtaskId, newText) => {
    if (!newText || newText.trim() === '') return;
    try {
      await tasksAPI.updateSubtask(taskId, subtaskId, { text: newText.trim() });
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, text: newText.trim() } : s
            ),
          };
        })
      );
    } catch (err) {
      console.error('[useTasks] Gagal edit subtask:', err);
    }
  }, []);

  const deleteSubtask = useCallback(async (taskId, subtaskId) => {
    try {
      await tasksAPI.removeSubtask(taskId, subtaskId);
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) };
        })
      );
    } catch (err) {
      console.error('[useTasks] Gagal hapus subtask:', err);
    }
  }, []);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const getTaskProgress = (task) => {
    const total = task.subtasks?.length || 0;
    const completed = task.subtasks?.filter((s) => s.completed).length || 0;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  const updateTaskNotes = useCallback(async (taskId, newNotes) => {
    try {
      const updated = await tasksAPI.update(taskId, { notes: newNotes });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error('[useTasks] Gagal update notes:', err);
    }
  }, []);

  const getActiveTask = (id) => tasks.find((t) => t.id === id) || null;

  return {
    tasks,
    focusLogs,
    isLoading,
    addFocusLog,
    addTask,
    deleteTask,
    editTask,
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