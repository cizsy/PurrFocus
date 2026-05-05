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
    getActiveTask, 
    editSubtask,
    deleteSubtask, // Make sure this is destructured
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

  const handleFinishSession = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks.length > 0) {
      const firstUnfinished = task.subtasks.find(s => !s.completed);
    if (firstUnfinished) {
      toggleSubtask(taskId, firstUnfinished.id);
    }
    }

    console.log("sesi selesai untuk task:", taskId);
  }

  return (
    <div className="min-h-screen bg-base-200">

      {view === 'dashboard' ? (
        <Dashboard 
          tasks={tasks}
          onAddTask={addTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={editTask}
          onToggleSubtask={toggleSubtask}
          onAddSubtask={addSubtask}
          onStartFocusing={startFocusing}
          onEditSubtask={editSubtask}
          onDeleteSubtask={deleteSubtask} // Add this line
        />
      ) : (
        <Pawmodoro 
          activeTask={currentActiveTask}
          onToggleSubtask={toggleSubtask}
          onAddSubtask={addSubtask}
          onDeleteSubtask={deleteSubtask} // Add this line
          onBack={() => setView('dashboard')}
          onFinishSession={handleFinishSession}
        />
      )}
    </div>
  );
}

export default App;