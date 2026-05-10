import React, { useState, useEffect } from 'react';
import FloatingSubtask from '../components/floatingComponents/floatingSubtask';
import FloatingCalculator from '../components/floatingComponents/calculator';
import FloatingNotes from '../components/floatingComponents/notes';
import FloatingBackground from '../components/floatingComponents/background'; 
import toast, { Toaster } from 'react-hot-toast';
import FloatingMusic from '../components/floatingComponents/music';
import logoLight from '../assets/logoLight.png';

function Pawmodoro({ 
  activeTask, 
  onFinishSession, 
  onBack, 
  onToggleSubtask, 
  onAddSubtask, 
  onEditSubtask, 
  onDeleteSubtask, 
  onUpdateNotes,
  maxSessions = 4
}) {
  const [mode, setMode] = useState('focus'); 
  const [currentSession, setCurrentSession] = useState(1); 
  const [timerType, setTimerType] = useState('pomodoro'); 
  
  const [focusDuration, setFocusDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [viewMode, setViewMode] = useState("focus");

  const [showSubtask, setShowSubtask] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [currentBg, setCurrentBg] = useState('bg-gradient-to-br from-[#4a7ec2] to-[#2d5c94]');
  const isStringBg = typeof currentBg === 'string';

  useEffect(() => {
    const formatTabTime = () => {
      const h = Math.floor(timeLeft / 3600);
      const m = Math.floor((timeLeft % 3600) / 60);
      const s = timeLeft % 60;
      if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    
    if (isActive) {
      document.title = `${formatTabTime()} - ${mode === 'focus' ? '🔥 Fokus' : '🐟 Istirahat'}`;
    } else {
      document.title = "PurrFocus 🐾";
    }
    return () => { document.title = "PurrFocus 🐾"; };
  }, [timeLeft, isActive, mode]);

  useEffect(() => {
    if (!isActive) {
      if (timerType === 'pomodoro') {
        if (mode === 'focus') setTimeLeft(focusDuration * 60);
        else if (mode === 'break') setTimeLeft(5 * 60); 
        else if (mode === 'longBreak') setTimeLeft(15 * 60); 
      } else {
        setTimeLeft(0);
      }
    }
  }, [focusDuration, mode, isActive, timerType]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      if (timerType === 'pomodoro' && timeLeft <= 0) {
        handleSesiSelesai();
      } else {
        interval = setInterval(() => {
          setTimeLeft(prev => timerType === 'pomodoro' ? prev - 1 : prev + 1);
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerType]);

  useEffect(() => {
    if (typeof currentBg === 'string') {
      setCurrentBg(
        mode === 'focus' 
          ? 'bg-gradient-to-br from-[#4a7ec2] to-[#2d5c94]' 
          : 'bg-gradient-to-br from-[#45a387] to-[#2b735c]'
      );
    }
  }, [mode]);

  const handleSesiSelesai = () => {
    setIsActive(false);
    if (mode === 'focus') {
      toast.success(`Sesi ${currentSession} selesai! Misi tercatat. 🐾`);
      if (onFinishSession && activeTask) onFinishSession(activeTask.id, focusDuration);
      
      if (currentSession >= maxSessions) {
        setMode('longBreak'); 
        toast("Kerja bagus! Waktunya istirahat panjang. 🥳");
      } else {
        setMode('break'); 
        toast("Waktunya ngemil ikan sebentar! 🐟");
      }
    } else {
      if (mode === 'longBreak') {
        setCurrentSession(1); 
        toast("Siklus baru dimulai! Siap berburu lagi? 🔥");
      } else {
        setCurrentSession(prev => prev + 1); 
        toast(`Fokus sesi ${currentSession + 1}! Ayo semangat! 🔥`);
      }
      setMode('focus');
    }
  };

  const handleStopwatchFinish = () => {
    setIsActive(false);
    const durationMins = Math.max(1, Math.round(timeLeft / 60)); 
    toast.success(`Stopwatch dihentikan! Durasi: ${durationMins} menit. 🐾`);
    
    if (onFinishSession && activeTask) onFinishSession(activeTask.id, durationMins);
    
    setMode('break');
    setTimerType('pomodoro'); 
  };

  const handleBackClick = () => setShowExitConfirm(true); 

  // Kalkulasi Lingkaran SVG
  const radius = 134; 
  const circumference = 2 * Math.PI * radius;
  let progress = 0;
  
  if (timerType === 'pomodoro') {
    let currentTargetSecs = focusDuration * 60;
    if (mode === 'break') currentTargetSecs = 5 * 60;
    if (mode === 'longBreak') currentTargetSecs = 15 * 60;
    progress = ((currentTargetSecs - timeLeft) / currentTargetSecs) * 100;
  } else {
    progress = ((timeLeft % 60) / 60) * 100;
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div 
      className={`h-screen w-full transition-all duration-1000 ease-in-out relative flex flex-col items-center justify-center overflow-hidden ${isStringBg ? currentBg : ''}`}
      style={!isStringBg ? currentBg : {}}
    >
      <Toaster position="top-center" />
      
      {/* MODAL KELUAR */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4 shadow-2xl text-center transform transition-all scale-in-center">
            <div className="text-6xl mb-4">{isActive || timeLeft > 0 ? '🙀' : '😿'}</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Yakin mau keluar?</h3>
            <p className="text-slate-500 font-medium mb-8">
              {(isActive || timeLeft > 0)
                ? "Timer kamu sudah berjalan lho! Yakin mau membatalkan sesi ini?" 
                : "Belum mulai fokus nih, masa udah mau nyerah?"}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
              <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">Keluar</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-40 pointer-events-none">
        <div className="mb-5 px-2">
          <img src={logoLight} alt="PurrFocus Logo" className="w-40 object-contain" />
        </div>
        <button 
          onClick={handleBackClick} 
          className="pointer-events-auto group flex items-center gap-2 text-white/60 hover:text-white text-[10px] font-black tracking-[0.2em] uppercase transition-all bg-black/10 hover:bg-black/20 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:border-red-400/50 hover:bg-red-500/20"
        >✕ Keluar</button>
      </div>

      {/* MAIN VIEW */}
      <div className="z-10 flex flex-col items-center w-full max-w-lg">
        {viewMode === "focus" ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 w-full">
            
            {/* INFO ATAS: Sesi & Target */}
            <div className="mb-6 flex flex-col items-center gap-2 h-20 justify-end">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md border border-white/20 shadow-lg ${mode === 'focus' ? 'bg-white/20 text-white' : 'bg-[#45a387]/50 text-white'}`}>
                {mode === 'focus' ? `🔥 Sesi Berburu (${currentSession}/${maxSessions})` : mode === 'longBreak' ? '😴 Istirahat Panjang' : '🐟 Istirahat Pendek'}
              </span>
              <div className="flex gap-1.5 mt-1">
                {Array.from({ length: maxSessions }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 === currentSession ? 'w-6 bg-white' : i + 1 < currentSession ? 'w-2 bg-white/40' : 'w-2 bg-black/20'}`} />
                ))}
              </div>
              {activeTask && (
                <p className="text-white/90 text-sm font-bold tracking-wider max-w-md text-center line-clamp-1 drop-shadow-md mt-2">
                  Target: {activeTask.title}
                </p>
              )}
            </div>

            {/* TOGGLE MODE POMODORO / STOPWATCH */}
            <div className="h-10 mb-4 flex items-center justify-center transition-all duration-500">
              <div className={`flex bg-black/20 p-1 rounded-full border border-white/10 backdrop-blur-md transition-all duration-500 ease-in-out ${isActive || (timerType==='stopwatch' && timeLeft > 0) ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button onClick={() => setTimerType('pomodoro')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${timerType === 'pomodoro' ? 'bg-white text-slate-800 shadow-sm' : 'text-white/60 hover:text-white'}`}>⏳ Pomodoro</button>
                <button onClick={() => setTimerType('stopwatch')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${timerType === 'stopwatch' ? 'bg-white text-slate-800 shadow-sm' : 'text-white/60 hover:text-white'}`}>⏱️ Stopwatch</button>
              </div>
            </div>

            {/* LINGKARAN TIMER */}
            <div className="relative w-72 h-72 flex items-center justify-center mb-6">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" viewBox="0 0 288 288">
                <circle cx="144" cy="144" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
                <circle
                  cx="144" cy="144" r={radius} stroke="white" strokeWidth="8" fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (progress / 100) * circumference}
                  strokeLinecap="round" className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white cursor-default">
                 <div className="text-4xl mb-2 drop-shadow-md transition-transform hover:scale-110">
                   {mode === 'focus' ? '🐈‍⬛' : '🐟'}
                 </div>
                 <h2 className="text-6xl font-black tracking-tighter font-mono drop-shadow-xl mb-4">
                   {formatTime(timeLeft)}
                 </h2>
              </div>
            </div>

            {/* KONTROL HORIZONTAL - DIUBAH MENJADI FLEXBOX RAPI */}
            <div className="flex items-center justify-center gap-4 mt-2 w-full max-w-sm">
              
              {/* SAYAP KIRI (Tombol Kurang) - Lebar tetap agar proporsional */}
              <div className="flex justify-end gap-2 w-28">
                <div className={`flex gap-2 transition-all duration-500 ease-in-out ${timerType === 'pomodoro' && !isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                  <button onClick={() => setFocusDuration(d => Math.max(1, d - 5))} className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black transition-all hover:scale-110 active:scale-95">-5</button>
                  <button onClick={() => setFocusDuration(d => Math.max(1, d - 1))} className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black transition-all hover:scale-110 active:scale-95">-1</button>
                </div>
              </div>

              {/* TENGAH (Tombol Mulai Utama) */}
              <button 
                onClick={() => {
                  if (!activeTask && mode === 'focus') return toast.error("Pilih target dulu! 🐾");
                  setIsActive(!isActive);
                }} 
                className="z-20 bg-white px-8 py-3.5 rounded-full text-lg font-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all w-48 tracking-widest uppercase hover:scale-105 active:scale-95 shrink-0"
                style={{ color: isStringBg && mode === 'focus' ? '#4a7ec2' : '#45a387' }}
              >
                {isActive ? '⏸ JEDA' : '▶ MULAI'}
              </button>

              {/* SAYAP KANAN (Tombol Tambah atau Simpan) - Lebar tetap agar proporsional */}
              <div className="relative flex justify-start w-28 h-11">
                
                {/* Tombol Plus (Pomodoro) */}
                <div className={`absolute left-0 flex gap-2 transition-all duration-500 ease-in-out ${timerType === 'pomodoro' && !isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                  <button onClick={() => setFocusDuration(d => Math.max(1, d + 1))} className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black transition-all hover:scale-110 active:scale-95">+1</button>
                  <button onClick={() => setFocusDuration(d => Math.max(1, d + 5))} className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black transition-all hover:scale-110 active:scale-95">+5</button>
                </div>

                {/* Tombol Simpan (Stopwatch) */}
                <div className={`absolute left-0 flex transition-all duration-500 ease-in-out ${timerType === 'stopwatch' && timeLeft > 0 && !isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                  <button 
                    onClick={handleStopwatchFinish}
                    className="bg-green-500 text-white px-5 py-0 h-11 rounded-full text-[11px] font-black shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-green-600 transition-all uppercase tracking-widest hover:scale-105 active:scale-95 whitespace-nowrap flex items-center"
                  >
                    ⏹ Simpan
                  </button>
                </div>

              </div>

            </div>
          </div>
        ) : (
          <ClockView />
        )}
      </div>

      {/* 3. TOOLBAR */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-40 pointer-events-none">
        <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl pointer-events-auto shadow-lg">
          <ToolbarBtn icon="📋" onClick={() => setShowSubtask(!showSubtask)} active={showSubtask} tooltip="Sub-Rencana" />
          <ToolbarBtn icon="📓" onClick={() => setShowNotes(!showNotes)} active={showNotes} tooltip="Catatan" />
          <ToolbarBtn icon="🧮" onClick={() => setShowCalc(!showCalc)} active={showCalc} tooltip="Kalkulator" />
          <ToolbarBtn icon="🎵" onClick={() => setShowMusic(!showMusic)} active={showMusic} tooltip="Musik Lofi" />
          <ToolbarBtn icon="🖼️" onClick={() => setShowBgPicker(!showBgPicker)} active={showBgPicker} tooltip="Ganti Suasana" /> 
        </div>

        <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/10 gap-1.5 backdrop-blur-xl pointer-events-auto shadow-lg">
            <ToolbarBtn icon="🔥" onClick={() => setViewMode("focus")} active={viewMode === "focus"} tooltip="Mode Fokus" />
            <ToolbarBtn icon="🕒" onClick={() => setViewMode("clock")} active={viewMode === "clock"} tooltip="Mode Jam" />
        </div>
      </div>

      {/* RENDER COMPONENTS */}
      {showSubtask && <FloatingSubtask activeTask={activeTask} onToggleSubtask={onToggleSubtask} onAddSubtask={onAddSubtask} onEditSubtask={onEditSubtask} onDeleteSubtask={onDeleteSubtask} onClose={() => setShowSubtask(false)} />}
      {showCalc && <FloatingCalculator onClose={() => setShowCalc(false)} />}
      {showNotes && <FloatingNotes activeTask={activeTask} onUpdateNotes={onUpdateNotes} onClose={() => setShowNotes(false)} />}
      {showBgPicker && <FloatingBackground onSelect={(bg) => setCurrentBg(bg)} onClose={() => setShowBgPicker(false)} />}
      {showMusic && <FloatingMusic onClose={() => setShowMusic(false)}/>}
    </div>
  );
}

function ToolbarBtn({ icon, onClick, active, tooltip }) {
  return (
    <button 
      onClick={onClick}
      title={tooltip}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)] scale-105 text-gray-800' 
          : 'bg-transparent hover:bg-white/20 text-white/70 hover:text-white hover:scale-105 active:scale-95'
      }`}
    >
      <span className="text-lg drop-shadow-sm">{icon}</span>
    </button>
  );
}

function ClockView() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-center opacity-95 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-7xl font-black text-white leading-none font-mono tracking-tight drop-shadow-2xl">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </h2>
      <div className="mt-5 px-5 py-2 bg-black/10 border border-white/10 rounded-full backdrop-blur-sm">
        <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">
          {time.toDateString()}
        </p>
      </div>
    </div>
  );
}

export default Pawmodoro;