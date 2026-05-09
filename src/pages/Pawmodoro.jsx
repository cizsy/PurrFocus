import React, { useState, useEffect } from 'react';
import FloatingSubtask from '../components/floatingComponents/floatingSubtask';
import FloatingCalculator from '../components/floatingComponents/calculator';
import FloatingNotes from '../components/floatingComponents/notes';
// Sesuaikan path import ini dengan nama file background buatanmu ya!
import FloatingBackground from '../components/floatingComponents/background'; 
import toast, { Toaster } from 'react-hot-toast';
import logoLight from '../assets/logoLight.png'; 

function Pawmodoro({ activeTask, onFinishSession, onBack, onToggleSubtask, onAddSubtask, onEditSubtask, onDeleteSubtask, onUpdateNotes, logoLight }) {
  const [mode, setMode] = useState('focus');
  const [focusDuration, setFocusDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [viewMode, setViewMode] = useState("focus");

  // State Toolbar
  const [showSubtask, setShowSubtask] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showMusic, setShowMusic] = useState(false);

  // State Background (Default warna biru fokus)
  const [currentBg, setCurrentBg] = useState('bg-gradient-to-br from-[#4a7ec2] to-[#2d5c94]');

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (!isActive) {
      if (mode === 'focus') setTimeLeft(focusDuration * 60);
      else setTimeLeft(5 * 60);
    }
  }, [focusDuration, mode, isActive]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSesiSelesai();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Otomatis ganti warna kalau mode berubah (dari fokus ke istirahat atau sebaliknya)
  useEffect(() => {
    setCurrentBg(
      mode === 'focus' 
        ? 'bg-gradient-to-br from-[#4a7ec2] to-[#2d5c94]' 
        : 'bg-gradient-to-br from-[#45a387] to-[#2b735c]'
    );
  }, [mode]);

  const handleSesiSelesai = () => {
    setIsActive(false);
    if (mode === 'focus') {
      toast.success("Misi selesai! 🐾");
      if (onFinishSession && activeTask) onFinishSession(activeTask.id, focusDuration);
      setMode('break');
    } else {
      toast("Siap berburu lagi? 🔥");
      setMode('focus');
    }
  };

  const currentTargetSecs = mode === 'focus' ? focusDuration * 60 : 5 * 60;
  const progress = ((currentTargetSecs - timeLeft) / currentTargetSecs) * 100;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    // CLASS BACKGROUND SEKARANG PAKAI VARIABLE DINAMIS: ${currentBg}
    <div className={`h-screen w-full transition-colors duration-1000 ease-in-out relative flex flex-col items-center justify-center overflow-hidden ${currentBg}`}>
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '1rem', background: '#333', color: '#fff' } }} />
      
      {/* 1. HEADER */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-40 pointer-events-none">
        <div className="flex items-center pointer-events-auto">
           {logoLight ? (
             <img src={logoLight} alt="PurrFocus Logo" className="w-32 object-contain hover:scale-105 transition-transform" />
           ) : (
             <span className="text-white font-black tracking-widest uppercase text-xl drop-shadow-md">PURRFOCUS</span>
           )}
        </div>
        <button 
          onClick={onBack} 
          className="pointer-events-auto group flex items-center gap-2 text-white/60 hover:text-white text-[10px] font-black tracking-[0.2em] uppercase transition-all bg-black/10 hover:bg-black/20 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10"
        >
          <span>✕</span> Batalkan Misi
        </button>
      </div>

      {/* 2. MAIN VIEW */}
      <div className="z-10 flex flex-col items-center">
        {viewMode === "focus" ? (
          <div className="flex flex-col items-center transition-transform duration-500">
            
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <circle cx="96" cy="96" r="90" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
                <circle
                  cx="96" cy="96" r="90" stroke="white" strokeWidth="6" fill="transparent"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                  strokeLinecap="round" className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-5xl filter drop-shadow-md transition-all duration-500 ${isActive ? 'animate-bounce' : 'opacity-50 scale-90'}`}>
                   {mode === 'focus' ? '🐈‍⬛' : '🐟'}
                </span>
              </div>
            </div>

            <h2 className="text-6xl font-black text-white mt-6 tracking-tighter font-mono drop-shadow-xl leading-none">
              {formatTime(timeLeft)}
            </h2>

            <div className="mt-6 flex flex-col items-center gap-5">
              
              <div className={`flex gap-2 transition-all duration-500 ${isActive ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {[-5, -1, 1, 5].map(val => (
                  <button 
                    key={val}
                    onClick={() => setFocusDuration(d => Math.max(1, d + val))}
                    className="w-10 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[10px] font-black rounded-lg backdrop-blur-md transition-all active:scale-90"
                  >
                    {val > 0 ? `+${val}` : val}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  if (!activeTask && mode === 'focus') return toast.error("Pilih target dulu! 🐾");
                  setIsActive(!isActive);
                }} 
                style={{ color: mode === 'focus' ? '#4a7ec2' : '#45a387' }}
                className="bg-white px-10 py-3 rounded-full text-base font-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all w-48 tracking-widest uppercase flex items-center justify-center gap-2"
              >
                {isActive ? (
                  <> <span className="text-lg">⏸</span> Jeda</>
                ) : (
                  <> <span className="text-lg">▶</span> Mulai</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="transition-transform duration-500">
             <ClockView />
          </div>
        )}
      </div>

      {/* 3. TOOLBAR BAWAH */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-40 pointer-events-none">
        
        <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg pointer-events-auto">
          <ToolbarBtn icon="📋" onClick={() => setShowSubtask(!showSubtask)} active={showSubtask} tooltip="Subtasks" />
          <ToolbarBtn icon="📓" onClick={() => setShowNotes(!showNotes)} active={showNotes} tooltip="Notes" />
          <ToolbarBtn icon="🧮" onClick={() => setShowCalc(!showCalc)} active={showCalc} tooltip="Kalkulator" />
          <ToolbarBtn icon="🎵" onClick={() => setShowMusic(!showMusic)} active={showMusic} tooltip="Music" />
          {/* Tombol ganti background sudah dihubungkan */}
          <ToolbarBtn icon="🖼️" onClick={() => setShowBgPicker(!showBgPicker)} active={showBgPicker} tooltip="Background" /> 
        </div>

        <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/10 gap-1.5 backdrop-blur-xl shadow-lg pointer-events-auto">
            <ToolbarBtn icon="🔥" onClick={() => setViewMode("focus")} active={viewMode === "focus"} tooltip="Timer Mode" />
            <ToolbarBtn icon="🕒" onClick={() => setViewMode("clock")} active={viewMode === "clock"} tooltip="Clock Mode" />
        </div>
      </div>

      {/* FLOATING COMPONENTS TERPUSAT */}
      {showSubtask && <FloatingSubtask activeTask={activeTask} onToggleSubtask={onToggleSubtask} onAddSubtask={onAddSubtask} onEditSubtask={onEditSubtask} onDeleteSubtask={onDeleteSubtask} onClose={() => setShowSubtask(false)} />}
      {showCalc && <FloatingCalculator onClose={() => setShowCalc(false)} />}
      {showNotes && <FloatingNotes activeTask={activeTask} onUpdateNotes={onUpdateNotes} onClose={() => setShowNotes(false)} />}
      
      {/* Ini panggil komponen buatanmu. onSelect melempar class baru ke state currentBg */}
      {showBgPicker && <FloatingBackground onSelect={(bg) => setCurrentBg(bg)} onClose={() => setShowBgPicker(false)} />}
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
    <div className="text-center opacity-95 flex flex-col items-center">
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