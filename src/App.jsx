import React, { useState } from 'react';
import useTasks from './hooks/useTask';
import useStats from './hooks/useStats'; 
import Dashboard from './pages/dashboard'; 
import Pawmodoro from './pages/Pawmodoro';
import Tujuan from './pages/dashboardTujuan';
import Layout from './components/layout';
import Statistik from './pages/statistik';
import Riwayat from './pages/riwayat'; 
import Pengaturan from './pages/pengaturan';

function App() {
  const [view, setView] = useState('dashboard');
  const [activeTaskId, setActiveTaskId] = useState(null);
  
  const { 
    tasks = [], 
    focusLogs = [],
    addFocusLog,
    addTask, 
    deleteTask, 
    editTask, 
    toggleSubtask, 
    addSubtask,
    editSubtask,
    deleteSubtask,
    updateTaskDetail,
    updateTaskNotes
  } = useTasks() || {};

  const stats = useStats(tasks, focusLogs);

  const currentActiveTask = tasks.find(t => t.id === activeTaskId);

  const activeTasksCount = tasks.filter(t => {
    const total = t.subtasks?.length || 0;
    const done = t.subtasks?.filter(s => s.completed).length || 0;
    const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
    return percentage < 100;
  }).length;

  const startFocusing = (task) => {
    setActiveTaskId(task.id);
    setView('pawmodoro');
  };

  if (view === 'pawmodoro') {
    return (
      <Pawmodoro 
        activeTask={currentActiveTask}
        sessionCount={stats?.sessionCount || 0} 
        onToggleSubtask={toggleSubtask}
        onAddSubtask={addSubtask}
        onEditSubtask={editSubtask}
        onDeleteSubtask={deleteSubtask}
        onUpdateNotes={updateTaskNotes}
        onBack={() => setView('dashboard')}
        
        onFinishSession={(taskId, duration) => {
          if (addFocusLog) addFocusLog(taskId, duration); 
          
          const task = tasks.find(t => t.id === taskId);

          if (duration >= 15 && task && toggleSubtask) {
            const firstUnfinished = task.subtasks.find(s => !s.completed);
            if (firstUnfinished) toggleSubtask(taskId, firstUnfinished.id);
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
          focusLogs={focusLogs}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
          onStartFocusing={startFocusing}
        />
      )}

      {view === 'tujuan' && (
        <Tujuan
          tasks={tasks}
          onAddTask={addTask}
          onStartFocusing={startFocusing}
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
        /> 
      )}

      {view === 'riwayat' && (
        <Riwayat focusLogs={focusLogs} />
      )}

      {view === 'pengaturan' && (
        <Pengaturan />
      )}
    </Layout>
  );
}

export default App;