// App.jsx
import React, { useState } from 'react';
import useTasks from './hooks/useTask';
import Dashboard from './pages/Dashboard';
import Pawmodoro from './pages/Pawmodoro';

function App() {
  const [view, setView] = useState('dashboard');
  const [activeTaskId, setActiveTaskId] = useState(null);
  
  const { 
    tasks, 
    addTask, 
    deleteTask, 
    editTask, 
    toggleSubtask, 
    addSubtask,
    getActiveTask 
  } = useTasks();

  const currentActiveTask = getActiveTask(activeTaskId);

  const startFocusing = (task) => {
    setActiveTaskId(task.id);
    setView('pawmodoro');
  };

  const handleDeleteTask = (taskId) => {
    if (deleteTask(taskId) && activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#333469', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>PurrFocus 🐾</h1>

      {view === 'dashboard' ? (
        <Dashboard 
          tasks={tasks}
          onAddTask={addTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={editTask}
          onToggleSubtask={toggleSubtask}
          onAddSubtask={addSubtask}
          onStartFocusing={startFocusing}
        />
      ) : (
        <Pawmodoro 
          activeTask={currentActiveTask}
          onToggleSubtask={toggleSubtask}
          onAddSubtask={addSubtask}
          onBack={() => setView('dashboard')}
        />
      )}
    </div>
  );
}

export default App;