import React from "react";

function TaskList({ tasks, toggleSubtask, addSubtask, deleteTask, editTask }) {
  return (
    <div className="task-container">
      {tasks.map((t) => (
        <div key={t.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '8px', backgroundColor: 'white', color: 'black' }}>
          <h3>{t.title}</h3>
          
          <button onClick={() => editTask(t.id)}>📝 Edit</button>
          <button onClick={() => addSubtask(t.id)}>+ Sub-rencana</button>
          <button onClick={() => deleteTask(t.id)} style={{ color: 'red' }}>🗑️ Hapus</button>

          {/* Logika Persentase */}
          {(() => {
            const total = t.subtasks.length;
            const completed = t.subtasks.filter(s => s.completed).length;
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
            return <p>Status Kenyang: {percentage}% ({completed}/{total})</p>;
          })()}

          <ul>
            {t.subtasks.map((sub) => (
              <li key={sub.id}>
                <input 
                  type="checkbox" 
                  checked={sub.completed} 
                  onChange={() => toggleSubtask(t.id, sub.id)} 
                /> 
                {sub.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TaskList;