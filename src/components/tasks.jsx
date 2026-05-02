// components/tasks.jsx
import React from "react";

function TaskList({ tasks, toggleSubtask, addSubtask, deleteTask, editTask, onStartFocusing, onEditSubtask, onDeleteSubtask }) {
  return (
    <div className="task-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {tasks.map((t) => (
        <div key={t.id} style={{ border: '1px solid #ccc', margin: '15px 0', padding: '15px', borderRadius: '12px', backgroundColor: 'white', color: 'black', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>{t.title}</h3>
          <div style={{ marginBottom: '10px' }}>
            <button onClick={() => editTask(t.id)}>📝 Edit</button>
            <button onClick={() => addSubtask(t.id)} style={{ margin: '0 5px' }}>+ Sub-rencana</button>
            <button onClick={() => deleteTask(t.id)} style={{ color: 'red' }}>🗑️ Hapus</button>
          </div>

          <button 
            onClick={() => onStartFocusing(t)}  
            style={{ backgroundColor: '#4CAF50', color: 'white', width: '100%', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            🎯 Fokus Sekarang
          </button>

          {(() => {
            const total = t.subtasks.length;
            const completed = t.subtasks.filter(s => s.completed).length;
            const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
            return (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '5px 0' }}>Status Kenyang: {percentage}% ({completed}/{total})</p>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '5px' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#4CAF50', borderRadius: '5px', transition: 'width 0.3s' }}></div>
                </div>
              </div>
            );
          })()}

          <ul style={{ listStyle: 'none', padding: '10px 0 0 0' }}>
            {t.subtasks.map((sub) => (
              <li key={sub.id} style={{ padding: '5px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={sub.completed} 
                  onChange={() => toggleSubtask(t.id, sub.id)} 
                /> 
                <span 
                  style={{ 
                    textDecoration: sub.completed ? 'line-through' : 'none', 
                    marginLeft: '8px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                  onClick={() => onEditSubtask(t.id, sub.id)}  // Changed to onEditSubtask
                >
                  {sub.text}
                </span>
                <button 
                  onClick={() => onEditSubtask(t.id, sub.id)}  // Changed to onEditSubtask
                  style={{ marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✏️
                </button>
                <button 
                  onClick={() => onDeleteSubtask(t.id, sub.id)}  // Changed to onDeleteSubtask
                  className="btn btn-outline btn-primary">
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TaskList;