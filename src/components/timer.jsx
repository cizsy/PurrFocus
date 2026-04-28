import React, { useState, useEffect } from 'react';

function Timer({ activeTask }) {
  const [mode, setMode] = useState('fokus');
  const [fokusDuration, setFokusDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // --- LOGIKA ANTI-GANTI ---
  const changeMode = (newMode) => {
    if (isActive) return; // Tolak mentah-mentah jika timer jalan
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'fokus') setSeconds(fokusDuration * 60);
    else if (newMode === 'short') setSeconds(5 * 60);
    else if (newMode === 'long') setSeconds(10 * 60);
  };

  const adjustFokusDuration = (amount) => {
    if (isActive) return; // Tolak mentah-mentah jika timer jalan
    const newDuration = Math.max(1, Math.min(120, fokusDuration + amount));
    setFokusDuration(newDuration);
    if (mode === 'fokus') {
      setSeconds(newDuration * 60);
    }
  };

  const handleSessionEnd = () => {
    setIsActive(false);
    if (mode === 'fokus') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      if (newCount % 4 === 0) {
        alert("Hebat! 4 mangsa tertangkap. Waktunya Long Break! 🐾");
        changeMode('long');
      } else {
        alert("Satu sesi fokus selesai. Istirahat sejenak! 🐱");
        changeMode('short');
      }
    } else {
      alert("Istirahat selesai. Ayo berburu lagi! 🔥");
      changeMode('fokus');
    }
  };

  const handleStart = () => {
    if (!activeTask && mode === 'fokus') {
      alert("Pilih satu mangsa dulu di dashboard! 🐾");
      return;
    }
    setIsActive(true);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, mode]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Style helper untuk tombol yang sedang disable
  const disabledStyle = {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none' // Mematikan interaksi mouse secara total
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#444681', padding: '30px', borderRadius: '20px', color: 'white', maxWidth: '450px', margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
      
      <p style={{ fontWeight: 'bold', color: '#ffcc00' }}>🏆 Sesi Selesai: {sessionCount % 4}/4</p>

      <div style={{ margin: '20px 0', padding: '15px', border: '2px solid #ffcc00', borderRadius: '15px', backgroundColor: 'rgba(255, 204, 0, 0.1)' }}>
        <p style={{ margin: 0, fontSize: '12px' }}>TARGET SAAT INI:</p>
        <h3 style={{ margin: 0, color: '#ffcc00' }}>🔥 {activeTask?.title || "Belum ada task"}</h3>
      </div>

      {/* --- PENGATUR DURASI --- */}
      <div style={{ marginBottom: '20px', ...(isActive ? disabledStyle : {}) }}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>Atur Menit Fokus:</p>
        <button onClick={() => adjustFokusDuration(-1)} style={{ padding: '5px 15px', cursor: 'pointer' }}>➖</button>
        <span style={{ margin: '0 20px', fontWeight: 'bold', fontSize: '20px' }}>{fokusDuration}m</span>
        <button onClick={() => adjustFokusDuration(1)} style={{ padding: '5px 15px', cursor: 'pointer' }}>➕</button>
      </div>

      <h2 style={{ fontSize: '14px', letterSpacing: '3px', margin: 0 }}>{mode.toUpperCase()} MODE</h2>
      <div style={{ fontSize: '80px', fontWeight: 'bold', fontFamily: 'monospace', color: '#ffcc00', margin: '10px 0' }}>
        {formatTime(seconds)}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={isActive ? () => setIsActive(false) : handleStart} 
          style={{ padding: '15px 40px', fontSize: '18px', borderRadius: '12px', cursor: 'pointer', backgroundColor: isActive ? '#ff4d4d' : '#4CAF50', color: 'white', border: 'none', fontWeight: 'bold' }}>
          {isActive ? "⏸️ PAUSE" : "▶️ START"}
        </button>
        
        <button 
          onClick={() => changeMode(mode)} 
          style={{ marginLeft: '10px', padding: '15px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#eee', ...(isActive ? disabledStyle : { cursor: 'pointer' }) }}>
          🔄 RESET
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', ...(isActive ? disabledStyle : {}) }}>
        {['fokus', 'short', 'long'].map((m) => (
          <button 
            key={m}
            onClick={() => changeMode(m)} 
            style={{ 
              backgroundColor: mode === m ? '#ffcc00' : '#666', 
              border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', color: mode === m ? 'black' : 'white', fontWeight: 'bold' 
            }}>
            {m === 'fokus' ? 'Fokus' : m === 'short' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Timer;