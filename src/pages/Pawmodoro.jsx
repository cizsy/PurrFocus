// pages/Pawmodoro.jsx
import React from 'react';
import Timer from '../components/Timer';
import FloatingSubtask from '../components/floatingSubtask';

function Pawmodoro({ activeTask, onToggleSubtask, onAddSubtask, onBack }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <button 
        onClick={onBack} 
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '10px', backgroundColor: '#ffcc00', color: 'black', border: 'none', fontWeight: 'bold' }}>
        ⬅ Dashboard
      </button>
      
      <Timer activeTask={activeTask} />

      <FloatingSubtask 
        activeTask={activeTask}
        onToggleSubtask={onToggleSubtask}
        onAddSubtask={onAddSubtask}
      />
    </div>
  );
}

export default Pawmodoro;