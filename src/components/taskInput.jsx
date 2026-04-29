import React from 'react';

function TaskInput({ newTasksName, setNewTasksName, onAddTask }) {
  return (
    <div style={{ margin: '30px 0', textAlign: 'center' }}>
      <input
        type="text"
        placeholder="Mau berburu apa hari ini?"
        value={newTasksName}
        onChange={(e) => setNewTasksName(e.target.value)}
        style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '250px' }}
      />
      <button onClick={onAddTask} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#ffcc00', fontWeight: 'bold' }}>
        Tambah task
      </button>
    </div>
  );
}

export default TaskInput;