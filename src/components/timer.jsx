import React, { useState, useEffect } from 'react';

function Timer({ activeTask }) {
  const [mode, setMode] = useState('fokus');
  const [fokusDuration, setFokusDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  // --- 1. FUNGSI HELPER ---

  // Ganti mode (Fokus, Short, Long)
  const changeMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'fokus') setSeconds(fokusDuration * 60);
    else if (newMode === 'short') setSeconds(5 * 60);
    else if (newMode === 'long') setSeconds(10 * 60);
  };

  // Atur durasi fokus secara manual (Tambah/Kurang)
  const adjustFokusDuration = (amount) => {
    const newDuration = Math.max(5, Math.min(120, fokusDuration + amount));
    setFokusDuration(newDuration);
    // Jika sedang di mode fokus, langsung update detiknya tanpa useEffect
    if (mode === 'fokus') {
      setIsActive(false);
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
      alert("Meong! Pilih satu mangsa (task) dulu sebelum mulai fokus! 🐾");
      return;
    }
    setIsActive(true);
  };

  // --- 2. LOGIKA HITUNG MUNDUR ---
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, mode]);

  const formatTime = (secs) => {
    const totalSeconds = Math.max(0, secs);
    const mins = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#444681', padding: '20px', borderRadius: '15px', color: 'white', maxWidth: '500px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '10px' }}>
        <p style={{ fontWeight: 'bold' }}>Sesi Selesai: {sessionCount % 4}/4 🐾</p>
      </div>

      {activeTask ? (
        <div style={{ marginBottom: '20px', padding: '10px', border: '2px solid #ffcc00', borderRadius: '10px', backgroundColor: 'rgba(255, 204, 0, 0.1)' }}>
          <p style={{ margin: 0, fontSize: '12px' }}>Sedang Mengerjakan:</p>
          <h3 style={{ margin: 0, color: '#ffcc00' }}>🔥 {activeTask.title}</h3>
        </div>
      ) : (
        <div style={{ marginBottom: '20px', padding: '10px', border: '2px dashed #ccc', borderRadius: '10px' }}>
          <p style={{ margin: 0 }}>⚠️ Pilih task di bawah agar kucing bisa fokus!</p>
        </div>
      )}


     {/* PENGATUR DURASI (Dikunci saat sedang fokus) */}
      <div style={{ marginBottom: '15px' }}>
        <p style={{ fontSize: '14px', marginBottom: '5px' }}>Atur Waktu Fokus:</p>
        <button 
          disabled={isActive} 
          onClick={() => adjustFokusDuration(-5)} 
          style={{ cursor: isActive ? 'not-allowed' : 'pointer', opacity: isActive ? 0.5 : 1 }}> 
          ➖ 
        </button>
        <span style={{ margin: '0 15px', fontWeight: 'bold' }}> {fokusDuration}m </span>
        <button 
          disabled={isActive} 
          onClick={() => adjustFokusDuration(5)} 
          style={{ cursor: isActive ? 'not-allowed' : 'pointer', opacity: isActive ? 0.5 : 1 }}> 
          ➕ 
        </button>
      </div>

      <h2 style={{ fontSize: '18px', marginBottom: '5px', letterSpacing: '2px' }}>{mode.toUpperCase()} MODE</h2>
      <div style={{ fontSize: '70px', fontWeight: 'bold', fontFamily: 'monospace', color: '#ffcc00', marginBottom: '20px' }}>
        {formatTime(seconds)}
      </div>

      <div style={{ marginBottom: '25px' }}>
        <button 
          onClick={isActive ? () => setIsActive(false) : handleStart} 
          style={{ padding: '12px 40px', fontSize: '18px', borderRadius: '10px', cursor: 'pointer', backgroundColor: isActive ? '#ff4d4d' : '#4CAF50', color: 'white', border: 'none', fontWeight: 'bold' }}>
          {isActive ? "⏸️ PAUSE" : "▶️ START"}
        </button>
        
       <button 
          disabled={isActive}
          onClick={() => changeMode(mode)} 
          style={{ 
            marginLeft: '10px', 
            padding: '12px 20px', 
            cursor: isActive ? 'not-allowed' : 'pointer', 
            borderRadius: '10px', 
            border: 'none', 
            backgroundColor: '#eee', 
            color: '#333',
            opacity: isActive ? 0.4 : 1
          }}>
          🔄 RESET
        </button>
      </div>

      {/* Tombol Mode (Fokus, Short, Long) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button 
          disabled={isActive} 
          onClick={() => changeMode('fokus')} 
          style={{ 
            backgroundColor: mode === 'fokus' ? '#ffcc00' : '#666', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '5px', 
            color: 'black',
            // Tambahan visual agar terlihat mati saat isActive = true
            opacity: isActive ? 0.4 : 1, 
            cursor: isActive ? 'not-allowed' : 'pointer' 
          }}>
          Fokus
        </button>
        
        <button 
          disabled={isActive} 
          onClick={() => changeMode('short')} 
          style={{ 
            backgroundColor: mode === 'short' ? '#ffcc00' : '#666', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '5px', 
            color: 'black',
            opacity: isActive ? 0.4 : 1, 
            cursor: isActive ? 'not-allowed' : 'pointer' 
          }}>
          Short Break
        </button>
        
        <button 
          disabled={isActive} 
          onClick={() => changeMode('long')} 
          style={{ 
            backgroundColor: mode === 'long' ? '#ffcc00' : '#666', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '5px', 
            color: 'black',
            opacity: isActive ? 0.4 : 1, 
            cursor: isActive ? 'not-allowed' : 'pointer' 
          }}>
          Long Break
        </button>
      </div>
    </div>
  );
}

export default Timer;