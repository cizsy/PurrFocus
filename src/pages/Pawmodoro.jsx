// pages/Pawmodoro.jsx
import React, { useState, useEffect } from 'react';
import Timer from '../components/Timer';
import FloatingSubtask from '../components/floatingComponents/floatingSubtask';
import FloatingCalculator from '../components/floatingComponents/calculator';
import FloatingNotes from '../components/floatingComponents/notes';

function Pawmodoro({ activeTask, onToggleSubtask, onAddSubtask, onEditSubtask, onDeleteSubtask, onBack, onFinishSession }) {
  const [viewMode, setViewMode] = useState("focus");

  return (
    <div style={{ textAlign: 'center' }}>
      <button 
        onClick={onBack} 
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '10px', backgroundColor: '#ffcc00', color: 'black', border: 'none', fontWeight: 'bold' }}>
        ⬅ Dashboard
      </button>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setViewMode("focus")}>🎯 Fokus</button>
        <button onClick={() => setViewMode("clock")}>🕒 Jam</button>
      </div>
      
      <div style={{ display: viewMode === "focus" ? "block" : "none" }}>
        <Timer 
          activeTask={activeTask}
          onFinishSession={onFinishSession}
        />
      </div>

      <div style={{ display: viewMode === "clock" ? "block" : "none" }}>
        <ClockView />
      </div>

      <FloatingSubtask 
        activeTask={activeTask}
        onToggleSubtask={onToggleSubtask}
        onAddSubtask={onAddSubtask}
        onEditSubtask={onEditSubtask}
        onDeleteSubtask={onDeleteSubtask}
      />
      <FloatingCalculator />
      <FloatingNotes />
    </div>
  );
}

function ClockView() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontSize: "60px", color: "white", marginTop: "50px" }}>
      {time.toLocaleTimeString()}
    </div>
  );
}

export default Pawmodoro;