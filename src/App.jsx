// App.jsx
import React, { useState } from 'react';
import useTasks from './hooks/useTask';
import Dashboard from './pages/Dashboard';
import Pawmodoro from './pages/Pawmodoro';
import Tujuan from './pages/dashboardTujuan'; // Import page baru
import Layout from './components/layout';
import Statistik from './pages/statistik';

function App() {
  // 'dashboard' | 'tujuan' | 'statistik' | 'pengaturan' | 'pawmodoro'
  const [view, setView] = useState('dashboard');
  const [activeTaskId, setActiveTaskId] = useState(null);
  
  const { 
    tasks, 
    addTask, 
    deleteTask, 
    editTask, 
    toggleSubtask, 
    addSubtask,
    getActiveTask, 
    editSubtask,
    deleteSubtask,
    updateTaskDetail, // Pastikan ini ada di useTask.js kamu
    getTaskProgress
  } = useTasks();

  const currentActiveTask = getActiveTask(activeTaskId);

  // Navigasi ke Timer
  const startFocusing = (task) => {
    setActiveTaskId(task.id);
    setView('pawmodoro');
  };

  // Hitung task yang belum selesai untuk info di Navbar
  const activeTasksCount = tasks.filter(t => {
    const { percentage } = getTaskProgress(t);
    return percentage < 100;
  }).length;

  // --- RENDERING LOGIC ---

  // 1. Jika sedang dalam mode Fokus (Pawmodoro), tampilkan Full Screen tanpa Layout
  if (view === 'pawmodoro') {
    return (
      <Pawmodoro 
        activeTask={currentActiveTask}
        onToggleSubtask={toggleSubtask}
        onAddSubtask={addSubtask}
        onDeleteSubtask={deleteSubtask}
        onBack={() => setView('dashboard')}
        onFinishSession={(taskId) => {
          // Logika otomatis centang subtask pertama yang belum selesai
          const task = tasks.find(t => t.id === taskId);
          const firstUnfinished = task?.subtasks.find(s => !s.completed);
          if (firstUnfinished) toggleSubtask(taskId, firstUnfinished.id);
        }}
      />
    );
  }

  // 2. Jika bukan mode fokus, gunakan Layout (Sidebar + Navbar)
  return (
    <Layout 
      activePage={view} 
      setPage={setView} 
      totalActiveTasks={activeTasksCount}
    >
      {view === 'dashboard' && (
        <Dashboard 
          tasks={tasks}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
          onStartFocusing={startFocusing}
        />
      )}

      {view === 'tujuan' && (
        <Tujuan
          tasks={tasks}
          updateTaskDetail={updateTaskDetail}
          onDeleteTask={deleteTask}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
          onEditSubtask={editSubtask}
        />
      )}

      {view === 'statistik' && (
       <Statistik
        tasks={tasks}
       /> 
      )}

      {view === 'pengaturan' && (
        <div className="p-10">
          <h2 className="text-2xl font-bold">Halaman Pengaturan (Coming Soon)</h2>
        </div>
      )}
    </Layout>
  );
}

export default App;