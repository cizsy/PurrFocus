import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';

function Timer({ activeTask }) {
  const [mode, setMode] = useState('fokus');
  const [fokusDuration, setFokusDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [playFinish] = useSound('/finish.mp3', { volume: 0.5 }); // Taruh file suara di public/

  // Load session count dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("purrfocus_sessions");
    if (saved) setSessionCount(parseInt(saved));
  }, []);

  // Simpan session count
  useEffect(() => {
    localStorage.setItem("purrfocus_sessions", sessionCount);
  }, [sessionCount]);

  const changeMode = (newMode) => {
    if (isActive) {
      toast.error("Timer lagi jalan! Pause dulu.");
      return;
    }
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'fokus') setSeconds(fokusDuration * 60);
    else if (newMode === 'short') setSeconds(5 * 60);
    else if (newMode === 'long') setSeconds(10 * 60);
  };

  const resetTimer = () => {
    if (isActive) {
      toast.error("Timer lagi jalan! Pause dulu.");
      return;
    }
    if (mode === 'fokus') setSeconds(fokusDuration * 60);
    else if (mode === 'short') setSeconds(5 * 60);
    else setSeconds(10 * 60);
    toast("Timer direset ⏲️");
  };

  const adjustFokusDuration = (amount) => {
    if (isActive) {
      toast.error("Timer lagi jalan! Pause dulu.");
      return;
    }
    const newDuration = Math.max(1, Math.min(120, fokusDuration + amount));
    setFokusDuration(newDuration);
    if (mode === 'fokus') setSeconds(newDuration * 60);
  };

  const handleSessionEnd = () => {
    playFinish(); // Play suara
    setIsActive(false);
    
    if (mode === 'fokus') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      
      toast.success(`🎉 Sesi fokus selesai! +1 mangsa`, {
        duration: 3000,
        icon: '🐾'
      });
      
      if (newCount % 4 === 0) {
        toast.success("Hebat! 4 mangsa tertangkap. Waktunya Long Break! 🐾", {
          duration: 4000,
          icon: '🎯'
        });
        changeMode('long');
      } else {
        toast.success("Satu sesi fokus selesai. Istirahat sejenak! 🐱", {
          duration: 3000,
          icon: '☕'
        });
        changeMode('short');
      }
    } else {
      toast.success("Istirahat selesai. Ayo berburu lagi! 🔥", {
        icon: '⚡'
      });
      changeMode('fokus');
    }
  };

  const handleStart = () => {
    if (!activeTask && mode === 'fokus') {
      toast.error("Pilih satu mangsa dulu di dashboard! 🐾");
      return;
    }
    setIsActive(true);
    toast(`Mode ${mode} dimulai! Semangat! 🚀`);
  };

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const disabledStyle = {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none'
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div style={{ textAlign: 'center', backgroundColor: '#444681', padding: '30px', borderRadius: '20px', color: 'white', maxWidth: '450px', margin: '0 auto', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
        
        {/* Session Dots Indicator */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', marginBottom: '5px', color: '#ffcc00' }}>🎯 PROGRES SESI</p>
          <div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  margin: '0 5px',
                  backgroundColor: i <= (sessionCount % 4) ? '#ffcc00' : '#555',
                  transition: 'all 0.3s ease',
                  boxShadow: i <= (sessionCount % 4) ? '0 0 5px #ffcc00' : 'none'
                }}
              />
            ))}
          </div>
          <p style={{ margin: '5px 0 0', fontSize: '12px' }}>{sessionCount % 4}/4 sesi menuju long break</p>
        </div>

        <div style={{ margin: '20px 0', padding: '15px', border: '2px solid #ffcc00', borderRadius: '15px', backgroundColor: 'rgba(255, 204, 0, 0.1)' }}>
          <p style={{ margin: 0, fontSize: '12px' }}>TARGET SAAT INI:</p>
          <h3 style={{ margin: 0, color: '#ffcc00' }}>🔥 {activeTask?.title || "Belum ada task"}</h3>
        </div>

        {/* Pengatur Durasi */}
        <div style={{ marginBottom: '20px', ...(isActive ? disabledStyle : {}) }}>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>Atur Menit Fokus:</p>
          <button onClick={() => adjustFokusDuration(-1)} style={{ padding: '5px 15px', cursor: 'pointer', borderRadius: '8px', border: 'none' }}>➖</button>
          <span style={{ margin: '0 20px', fontWeight: 'bold', fontSize: '20px' }}>{fokusDuration}m</span>
          <button onClick={() => adjustFokusDuration(1)} style={{ padding: '5px 15px', cursor: 'pointer', borderRadius: '8px', border: 'none' }}>➕</button>
        </div>

        <h2 style={{ fontSize: '14px', letterSpacing: '3px', margin: 0 }}>{mode.toUpperCase()} MODE</h2>
        <div style={{ fontSize: '80px', fontWeight: 'bold', fontFamily: 'monospace', color: '#ffcc00', margin: '10px 0' }}>
          {formatTime(seconds)}
        </div>

        <div style={{ marginBottom: '30px' }}>
          <button 
            onClick={isActive ? () => setIsActive(false) : handleStart} 
            style={{ padding: '15px 40px', fontSize: '18px', borderRadius: '12px', cursor: 'pointer', backgroundColor: isActive ? '#ff4d4d' : '#4CAF50', color: 'white', border: 'none', fontWeight: 'bold', marginRight: '10px' }}>
            {isActive ? "⏸️ PAUSE" : "▶️ START"}
          </button>
          
          <button 
            onClick={resetTimer} 
            style={{ padding: '15px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#eee', cursor: 'pointer' }}>
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
              {m === 'fokus' ? '🎯 Fokus' : m === 'short' ? '☕ Short Break' : '🌿 Long Break'}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default Timer;