import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';

function Timer({ activeTask, onFinishSession }) {
  const [mode, setMode] = useState('fokus'); // 'fokus', 'short', 'long'
  const [fokusDuration, setFokusDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [playFinish] = useSound('/finish.mp3', { volume: 0.5 });

  // 1. FIXED: Sinkronisasi Durasi (Ini yang bikin "ubah jam ke fokus" macet)
  useEffect(() => {
    // Kita reset seconds HANYA jika timer tidak sedang berjalan
    if (!isActive) {
      if (mode === 'fokus') setSeconds(fokusDuration * 60);
      else if (mode === 'short') setSeconds(5 * 60);
      else if (mode === 'long') setSeconds(10 * 60);
    }
  }, [fokusDuration, mode, isActive]);

  const changeMode = (newMode) => {
    // Biarkan pindah mode jika timer sedang tidak aktif
    setMode(newMode);
    setIsActive(false); // Pastikan berhenti dulu kalau pindah mode manual
  };

  const handleSessionEnd = () => {
    playFinish();
    setIsActive(false);
    
    if (mode === 'fokus') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);

      // Kirim data ke App.jsx (log menit nyata yang diselesaikan)
      if (onFinishSession && activeTask) {
        onFinishSession(activeTask.id, fokusDuration);
      }
      
      // AUTO-BREAK LOGIC
      if (newCount % 4 === 0) {
        toast.success("Misi besar tuntas! Istirahat Panjang ya 👑");
        setMode('long'); // useEffect di atas akan otomatis setSeconds(10 * 60)
      } else {
        toast.success("Satu mangsa tumbang! Break dulu ☕");
        setMode('short'); // useEffect di atas akan otomatis setSeconds(5 * 60)
      }
    } else {
      // Selesai istirahat, balik ke fokus
      toast("Kembali berburu! 🔥");
      setMode('fokus');
    }
  };

  // 2. TIMER CORE LOGIC
  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (isActive && seconds === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins} : ${s < 10 ? '0' : ''}${s}`;
  };

  // Progress Bar Logic
  const getTotalSeconds = () => {
    if (mode === 'fokus') return fokusDuration * 60;
    if (mode === 'short') return 5 * 60;
    return 10 * 60;
  };
  const progress = ((getTotalSeconds() - seconds) / getTotalSeconds()) * 100;

  return (
    <div className="flex flex-col items-center text-white">
      <Toaster position="top-center" />

      {/* 🟠 MODE SELECTOR (Tambah ini biar user bisa pilih manual) */}
      <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-2xl border border-white/5">
        {['fokus', 'short', 'long'].map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              mode === m ? 'bg-white text-[#4a7ec2]' : 'text-white opacity-40 hover:opacity-100'
            }`}
          >
            {m === 'short' ? 'Kecil' : m === 'long' ? 'Besar' : 'Berburu'}
          </button>
        ))}
      </div>

      {/* CIRCULAR PROGRESS */}
      <div className="relative w-72 h-72 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="144" cy="144" r="130" stroke="white" strokeWidth="8" fill="transparent" className="opacity-10" />
          <circle 
            cx="144" cy="144" r="130" stroke="white" strokeWidth="8" fill="transparent" 
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
            strokeLinecap="round" className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
            <span className={`text-8xl transition-all duration-500 ${isActive ? 'animate-bounce' : 'opacity-50'}`}>
              {mode === 'fokus' ? '🐱' : '😴'}
            </span>
        </div>
      </div>

      {/* WAKTU */}
      <h2 className="text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl font-mono">
        {formatTime(seconds)}
      </h2>

      {/* ADJUSTMENT (Hanya untuk mode fokus) */}
      <div className={`flex gap-3 mb-8 transition-all ${isActive || mode !== 'fokus' ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}>
        {[-5, -1, +1, +5].map(val => (
          <button 
            key={val} 
            onClick={() => setFokusDuration(d => Math.max(1, d + val))}
            className="bg-white/10 hover:bg-white text-white hover:text-[#4a7ec2] w-12 py-2 rounded-xl text-xs font-black border border-white/10 transition-all"
          >
            {val > 0 ? `+${val}` : val}
          </button>
        ))}
      </div>

      {/* INDICATOR DOTS */}
      <div className="mb-8 text-center bg-black/10 px-6 py-3 rounded-3xl border border-white/5">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 opacity-40">Progress Berburu</p>
        <div className="flex gap-3 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 
                ${i <= (sessionCount % 4) || (sessionCount > 0 && sessionCount % 4 === 0) 
                  ? 'bg-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.8)]' 
                  : 'bg-white/20'}`} 
            />
          ))}
        </div>
      </div>

      {/* MAIN BUTTON */}
      <button 
        onClick={() => {
          if (!activeTask && mode === 'fokus') return toast.error("Pilih mangsa dulu di dashboard! 🐾");
          setIsActive(!isActive);
        }}
        className={`${isActive ? 'bg-white/20 text-white' : 'bg-white text-[#4a7ec2]'} px-20 py-5 rounded-[2.5rem] text-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all`}
      >
        {isActive ? "JEDA" : "MULAI"}
      </button>

      {/* RESET */}
      {!isActive && (
        <button 
          onClick={() => {
             setSeconds(getTotalSeconds());
             toast("Timer diatur ulang! 🔄");
          }} 
          className="mt-8 text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-[0.2em] transition-opacity"
        >
          Reset Timer
        </button>
      )}
    </div>
  );
}

export default Timer;