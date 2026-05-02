// pages/Dashboard.jsx
import React, { useState } from 'react';
import TaskList from '../components/tasks';

function Dashboard({ 
  tasks, 
  onAddTask, 
  onDeleteTask, 
  onEditTask, 
  onToggleSubtask, 
  onAddSubtask, 
  onStartFocusing,
  onEditSubtask,
  onDeleteSubtask
  }) {
  const [newTasksName, setNewTasksName] = useState("");

  const handleAddTask = () => {
    if (onAddTask(newTasksName)) {
      setNewTasksName("");
    }
  };

  return (
    <>
      <div style={{ margin: '30px 0', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Mau berburu apa hari ini?"
          value={newTasksName}
          onChange={(e) => setNewTasksName(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '250px' }}
        />
        <button onClick={handleAddTask} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#ffcc00', fontWeight: 'bold' }}>
          Tambah task
        </button>
      </div>

      <TaskList
        tasks={tasks}
        toggleSubtask={onToggleSubtask}
        addSubtask={onAddSubtask}
        deleteTask={onDeleteTask}
        editTask={onEditTask}
        onStartFocusing={onStartFocusing}
        onEditSubtask={onEditSubtask}
        onDeleteSubtask={onDeleteSubtask}

      />
    </>
  );
}

export default Dashboard;