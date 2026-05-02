// pages/Pawmodoro.jsx
import React from 'react';
import Timer from '../components/Timer';
import FloatingSubtask from '../components/floatingComponents/floatingSubtask';

function Pawmodoro({ activeTask, onToggleSubtask, onAddSubtask, onEditSubtask, onDeleteSubtask, onBack, onFinishSession }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <button 
        onClick={onBack} 
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '10px', backgroundColor: '#ffcc00', color: 'black', border: 'none', fontWeight: 'bold' }}>
        ⬅ Dashboard
      </button>
      
      <Timer 
      activeTask={activeTask} 
      onFinishSession={onFinishSession}
      />

      <FloatingSubtask 
        activeTask={activeTask}
        onToggleSubtask={onToggleSubtask}
        onAddSubtask={onAddSubtask}
        onEditSubtask={onEditSubtask}
        onDeleteSubtask={onDeleteSubtask}
      />
    </div>
  );
}

export default Pawmodoro;