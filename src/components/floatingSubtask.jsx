// components/FloatingSubtask.jsx
import React, { useState } from 'react';

function FloatingSubtask({ activeTask, onToggleSubtask, onAddSubtask }) {
  const [showOverlay, setShowOverlay] = useState(false);

  if (!activeTask) return null;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {showOverlay && (
        <div style={{ backgroundColor: 'white', color: 'black', padding: '15px', borderRadius: '15px', marginBottom: '15px', width: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'left', border: '2px solid #ffcc00' }}>
          <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Daftar Mangsa 📋</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {activeTask.subtasks.map(sub => (
              <div key={sub.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={sub.completed} 
                  onChange={() => onToggleSubtask(activeTask.id, sub.id)} 
                />
                <span style={{ marginLeft: '10px', textDecoration: sub.completed ? 'line-through' : 'none', color: sub.completed ? '#888' : 'black' }}>
                  {sub.text}
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onAddSubtask(activeTask.id)}
            style={{ marginTop: '10px', width: '100%', padding: '5px', cursor: 'pointer', borderRadius: '5px', border: '1px dashed #666', background: 'none' }}>
            + Tambah Sub-rencana
          </button>
        </div>
      )}
      <button 
        onClick={() => setShowOverlay(!showOverlay)}
        style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ffcc00', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'block', marginLeft: 'auto' }}>
        {showOverlay ? '✖' : '📋'}
      </button>
    </div>
  );
}

export default FloatingSubtask;