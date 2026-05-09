import React, { useState } from 'react';
import useTasks from './hooks/useTask';
import useStats from './hooks/useStats'; // <-- JANGAN LUPA IMPORT INI YA!
import Dashboard from './pages/Dashboard';
import Pawmodoro from './pages/Pawmodoro';
import Tujuan from './pages/dashboardTujuan';
import Layout from './components/layout';
import Statistik from './pages/statistik';

function App() {
  const [view, setView] = useState('dashboard');
  const [activeTaskId, setActiveTaskId] = useState(null);
  
  // Panggil useTasks CUKUP SATU KALI SAJA di sini
  const { 
    tasks, 
    focusLogs,
    addFocusLog,
    addTask, 
    deleteTask, 
    editTask, 
    toggleSubtask, 
    addSubtask,
    getActiveTask, 
    editSubtask,
    deleteSubtask,
    updateTaskDetail,
    getTaskProgress,
    updateTaskNotes
  } = useTasks();

  // Panggil useStats
  const stats = useStats(tasks, focusLogs);

  const currentActiveTask = getActiveTask(activeTaskId);

  const startFocusing = (task) => {
    setActiveTaskId(task.id);
    setView('pawmodoro');
  };

  const activeTasksCount = tasks.filter(t => {
    const { percentage } = getTaskProgress(t);
    return percentage < 100;
  }).length;

  // --- RENDER LOGIC ---

  if (view === 'pawmodoro') {
    return (
      <Pawmodoro 
        activeTask={currentActiveTask}
        sessionCount={stats.sessionCount} // <-- KIRIM DATA SESSION COUNT KE PAWMODORO
        onToggleSubtask={toggleSubtask}
        onAddSubtask={addSubtask}
        onEditSubtask={editSubtask}
        onDeleteSubtask={deleteSubtask}
        onUpdateNotes={updateTaskNotes}
        onBack={() => setView('dashboard')}
        onFinishSession={(taskId, duration) => {
          // 1. Catat log berdasarkan durasi nyata (misal 25 menit)
          addFocusLog(taskId, duration); 
          
          // 2. Cari subtask pertama yang belum kelar, lalu centang otomatis
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            const firstUnfinished = task.subtasks.find(s => !s.completed);
            if (firstUnfinished) {
              toggleSubtask(taskId, firstUnfinished.id);
            }
          }
        }}
      />
    );
  }

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
        focusLogs={focusLogs}
        stats={stats} // <-- Pastikan komponen Statistik menerima props ini
       /> 
      )}

      {view === 'pengaturan' && (
        <div className="p-10 text-center">
          <h2 className="text-2xl font-black text-slate-800">PENGATURAN ⚙️</h2>
          <p className="text-slate-400 mt-2">Sabar ya, kucingnya lagi ngerakit fitur ini...</p>
        </div>
      )}
    </Layout>
  );
}

export default App;