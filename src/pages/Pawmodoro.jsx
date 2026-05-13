import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Calculator,
  CheckSquare,
  Clock3,
  Image,
  Music,
  NotebookPen,
  Pause,
  Play,
  Save,
  Timer,
  X,
} from "lucide-react";

import FloatingSubtask from "../components/floatingComponents/floatingSubtask";
import FloatingCalculator from "../components/floatingComponents/calculator";
import FloatingNotes from "../components/floatingComponents/notes";
import FloatingBackground from "../components/floatingComponents/background";
import FloatingMusic from "../components/floatingComponents/music";

import toast, { Toaster } from "react-hot-toast";
import alarm from "../assets/alarm.mp3";

import { brandAssets } from "../components/brand";
import { catAssets } from "../components/catAssets";
import { purrThemes, DEFAULT_THEME } from "../components/purrThemes";

const getSavedThemeName = () => {
  try {
    const savedSettings = JSON.parse(
      localStorage.getItem("purrfocus_settings") || "{}"
    );

    return savedSettings.theme || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

const getSavedPawSettings = () => {
  try {
    const settings = JSON.parse(
      localStorage.getItem("purrfocus_settings") || "{}"
    );

    return {
      focusDuration: Number(settings.focusDuration) || 25,
      maxSessions: Number(settings.maxSessions) || 4,
      autoStartBreak: settings.autoStartBreak || false,
      notifications: settings.notifications !== false,
      volume: settings.volume !== undefined ? Number(settings.volume) : 80,
    };
  } catch {
    return {
      focusDuration: 25,
      maxSessions: 4,
      autoStartBreak: false,
      notifications: true,
      volume: 80,
    };
  }
};

function Pawmodoro({
  activeTask,
  onFinishSession,
  onBack,
  onToggleSubtask,
  onAddSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onUpdateNotes,
  maxSessions: maxSessionsFromProps,
}) {
  const [themeName, setThemeName] = useState(getSavedThemeName);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  const surface = theme.cardBg || theme.panelBg;
  const softSurface = theme.cardSoft || "bg-white/35";

  const [mode, setMode] = useState("focus");
  const [currentSession, setCurrentSession] = useState(1);
  const [timerType, setTimerType] = useState("pomodoro");

  const [pawSettings, setPawSettings] = useState(getSavedPawSettings);

  const sessionLimit = Number(maxSessionsFromProps) || pawSettings.maxSessions;

  const [focusDuration, setFocusDuration] = useState(() => {
    return pawSettings.focusDuration;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    return pawSettings.focusDuration * 60;
  });

  const [isActive, setIsActive] = useState(false);
  const [viewMode, setViewMode] = useState("focus");

  const [showSubtask, setShowSubtask] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [customBg, setCustomBg] = useState(null);

  const audioRef = useRef(new Audio(alarm));

  useEffect(() => {
    const handleThemeChange = (event) => {
      setThemeName(event.detail || getSavedThemeName());
    };

    window.addEventListener("purrfocus-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("purrfocus-theme-change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const handleSettingsChange = (event) => {
      const nextSettings = event.detail || getSavedPawSettings();

      const normalizedSettings = {
        focusDuration: Number(nextSettings.focusDuration) || 25,
        maxSessions: Number(nextSettings.maxSessions) || 4,
        autoStartBreak: nextSettings.autoStartBreak || false,
        notifications: nextSettings.notifications !== false,
        volume:
          nextSettings.volume !== undefined ? Number(nextSettings.volume) : 80,
      };

      setPawSettings(normalizedSettings);

      if (!isActive && mode === "focus" && timerType === "pomodoro") {
        setFocusDuration(normalizedSettings.focusDuration);
        setTimeLeft(normalizedSettings.focusDuration * 60);
        setCurrentSession(1);
      }
    };

    window.addEventListener("purrfocus-settings-change", handleSettingsChange);

    return () => {
      window.removeEventListener(
        "purrfocus-settings-change",
        handleSettingsChange
      );
    };
  }, [isActive, mode, timerType]);

  const catColor = theme.isDark ? "white" : "black";
  const cats = catAssets?.[catColor] || catAssets?.black || {};

  const currentLogo = theme.isDark
    ? brandAssets.logo.light
    : brandAssets.logo.dark;

  const elapsedFocusSeconds = useMemo(() => {
    if (timerType === "stopwatch") return timeLeft;
    if (mode !== "focus") return 0;

    return Math.max(0, focusDuration * 60 - timeLeft);
  }, [focusDuration, mode, timeLeft, timerType]);

  const currentCat = useMemo(() => {
    if (mode === "break" || mode === "longBreak") {
      return cats.rest || cats.sleep || cats.stretch;
    }

    if (timerType === "stopwatch") {
      if (isActive && timeLeft >= 20 * 60) return cats.focusFire || cats.focus;
      if (isActive) return cats.focus || cats.focusFire;
      if (timeLeft > 0) return cats.stretch || cats.rest;
      return cats.sleep || cats.rest;
    }

    if (!isActive && elapsedFocusSeconds === 0) {
      return cats.sleep || cats.rest;
    }

    if (isActive && elapsedFocusSeconds >= focusDuration * 60 * 0.65) {
      return cats.focusFire || cats.focus;
    }

    if (isActive) {
      return cats.focus || cats.focusFire;
    }

    return cats.stretch || cats.rest || cats.focus;
  }, [
    cats,
    elapsedFocusSeconds,
    focusDuration,
    isActive,
    mode,
    timeLeft,
    timerType,
  ]);

  const defaultBackground = theme.appBg;
  const isStringBg = typeof customBg === "string";
  const backgroundClass = isStringBg ? customBg : defaultBackground;
  const backgroundStyle = customBg && !isStringBg ? customBg : {};

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(
        2,
        "0"
      )}`;
    }

    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const saveProgressManually = () => {
    if (!activeTask) return;

    let durationMins = 0;

    if (timerType === "pomodoro") {
      durationMins = Math.floor((focusDuration * 60 - timeLeft) / 60);
    } else {
      durationMins = Math.floor(timeLeft / 60);
    }

    if (durationMins >= 1) {
      onFinishSession(activeTask.id, durationMins);
      toast.success(`${durationMins} menit fokus tersimpan.`);
    } else {
      toast.error("Waktu terlalu singkat untuk dicatat.");
    }

    onBack();
  };

  useEffect(() => {
    const formatTabTime = () => {
      const h = Math.floor(timeLeft / 3600);
      const m = Math.floor((timeLeft % 3600) / 60);
      const s = timeLeft % 60;

      if (h > 0) {
        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(
          2,
          "0"
        )}`;
      }

      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    if (isActive) {
      document.title = `${formatTabTime()} - ${
        mode === "focus" ? "Fokus" : "Istirahat"
      }`;
    } else {
      document.title = "PurrFocus";
    }

    return () => {
      document.title = "PurrFocus";
    };
  }, [timeLeft, isActive, mode]);

  useEffect(() => {
    if (!isActive) {
      if (timerType === "pomodoro") {
        if (mode === "focus") setTimeLeft(focusDuration * 60);
        if (mode === "break") setTimeLeft(5 * 60);
        if (mode === "longBreak") setTimeLeft(15 * 60);
      }

      if (timerType === "stopwatch" && timeLeft === 0) {
        setTimeLeft(0);
      }
    }
  }, [mode, timerType, focusDuration, isActive]);

  const handleSesiSelesai = () => {
    setIsActive(false);

    const settings = getSavedPawSettings();

    if (settings.notifications !== false) {
      audioRef.current.volume = settings.volume / 100;

      audioRef.current.play().catch((error) => {
        console.log("Audio Error:", error);
      });
    }

    if (mode === "focus") {
      toast.success(`Sesi ${currentSession} selesai. Fokus tercatat.`);

      if (onFinishSession && activeTask) {
        onFinishSession(activeTask.id, focusDuration);
      }

      if (currentSession >= sessionLimit) {
        setMode("longBreak");
        toast("Waktunya istirahat panjang.");
      } else {
        setMode("break");
        toast("Istirahat pendek dulu.");
      }

      if (settings.autoStartBreak) {
        setIsActive(true);
      }
    } else {
      if (mode === "longBreak") {
        setCurrentSession(1);
        toast("Siklus baru dimulai.");
      } else {
        setCurrentSession((prev) => prev + 1);
        toast(`Fokus sesi ${currentSession + 1}.`);
      }

      setMode("focus");
    }
  };

  useEffect(() => {
    let interval = null;

    if (isActive) {
      if (timerType === "pomodoro" && timeLeft <= 0) {
        handleSesiSelesai();
      } else {
        interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (timerType === "pomodoro") return Math.max(prev - 1, 0);
            return prev + 1;
          });
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerType]);

  const adjustTime = (amountMins) => {
    setFocusDuration((prev) => {
      const newDuration = Math.max(1, prev + amountMins);

      if (!isActive && mode === "focus" && timerType === "pomodoro") {
        setTimeLeft(newDuration * 60);
      }

      return newDuration;
    });
  };

  const handleStopwatchFinish = () => {
    setIsActive(false);

    const durationMins = Math.floor(timeLeft / 60);

    if (durationMins >= 1) {
      toast.success(`Durasi ${durationMins} menit tersimpan.`);

      if (onFinishSession && activeTask) {
        onFinishSession(activeTask.id, durationMins);
      }
    } else {
      toast.error("Waktu terlalu singkat untuk dicatat.");
    }

    setMode("break");
    setTimerType("pomodoro");
  };

  const radius = 134;
  const circumference = 2 * Math.PI * radius;

  let progress = 0;

  if (timerType === "pomodoro") {
    const currentTargetSecs =
      mode === "focus" ? focusDuration * 60 : mode === "break" ? 300 : 900;

    progress = ((currentTargetSecs - timeLeft) / currentTargetSecs) * 100;
  } else {
    progress = ((timeLeft % 60) / 60) * 100;
  }

  const modeLabel = () => {
    if (mode === "focus") {
      return `Sesi Fokus ${currentSession}/${sessionLimit}`;
    }

    if (mode === "longBreak") return "Istirahat Panjang";

    return "Istirahat Pendek";
  };

  const canSaveOnExit =
    (timerType === "stopwatch" && timeLeft >= 60) ||
    (timerType === "pomodoro" && mode === "focus" && elapsedFocusSeconds >= 60);

  return (
    <div
      className={`h-screen w-full overflow-hidden relative flex flex-col items-center justify-center transition-all duration-700 ${backgroundClass} ${theme.text}`}
      style={backgroundStyle}
    >
      <Toaster position="top-center" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-black/10 blur-3xl" />
      </div>

      {showExitConfirm && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-md">
          <div
            className={`w-full max-w-sm rounded-[2rem] border ${theme.border} ${surface} p-7 text-center shadow-2xl`}
          >
            {(canSaveOnExit ? cats.angry : cats.sad) && (
              <img
                src={canSaveOnExit ? cats.angry : cats.sad}
                alt=""
                className="mx-auto mb-4 h-28 w-28 object-contain"
              />
            )}

            <h3 className={`mb-2 text-2xl font-black ${theme.text}`}>
              Mau keluar?
            </h3>

            <p
              className={`mb-7 text-sm font-medium leading-relaxed ${theme.muted}`}
            >
              {canSaveOnExit
                ? "Kamu sudah fokus cukup lama. Simpan dulu hasilnya biar nggak sia-sia."
                : "Sesi ini belum cukup lama untuk dicatat. Yakin mau keluar?"}
            </p>

            <div className="flex flex-col gap-3">
              {canSaveOnExit && (
                <button
                  onClick={saveProgressManually}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-wider transition-all active:scale-95 ${theme.button}`}
                >
                  <Save size={17} strokeWidth={2.7} />
                  Simpan & Keluar
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className={`flex-1 rounded-2xl py-3.5 text-sm font-black transition-all active:scale-95 ${softSurface}`}
                >
                  Batal
                </button>

                <button
                  onClick={onBack}
                  className="flex-1 rounded-2xl bg-red-500 py-3.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-red-600 active:scale-95"
                >
                  Buang Sesi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="absolute left-6 right-6 top-6 z-40 flex items-start justify-between pointer-events-none">
        <img
          src={currentLogo}
          alt="PurrFocus Logo"
          className="w-36 object-contain pointer-events-auto"
        />

        <button
          onClick={() => setShowExitConfirm(true)}
          className={`pointer-events-auto inline-flex items-center gap-2 rounded-full border ${theme.border} ${surface} px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95`}
        >
          <X size={14} strokeWidth={3} />
          Keluar
        </button>
      </header>

      <main className="z-10 flex w-full max-w-4xl flex-col items-center px-5">
        {viewMode === "focus" ? (
          <div className="flex w-full flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 flex min-h-24 flex-col items-center justify-end gap-2 text-center">
              <span
                className={`rounded-full border ${theme.border} ${surface} px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md`}
              >
                {modeLabel()}
              </span>

              <div className="mt-1 flex gap-1.5">
                {Array.from({ length: sessionLimit }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index + 1 === currentSession
                        ? "w-6 bg-current"
                        : index + 1 < currentSession
                        ? "w-2 bg-current opacity-40"
                        : "w-2 bg-black/20"
                    }`}
                  />
                ))}
              </div>

              {activeTask && (
                <p
                  className={`mt-2 max-w-md truncate text-sm font-black tracking-wide ${theme.muted}`}
                >
                  Target: {activeTask.title}
                </p>
              )}
            </div>

            <div className="mb-4 flex h-10 items-center justify-center">
              <div
                className={`flex rounded-full border ${theme.border} ${surface} p-1 shadow-sm backdrop-blur-md transition-all duration-500 ${
                  isActive || (timerType === "stopwatch" && timeLeft > 0)
                    ? "pointer-events-none scale-95 opacity-0"
                    : "scale-100 opacity-100"
                }`}
              >
                <button
                  onClick={() => setTimerType("pomodoro")}
                  className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase transition-all ${
                    timerType === "pomodoro"
                      ? `${theme.button}`
                      : `${theme.muted} hover:opacity-80`
                  }`}
                >
                  Pomodoro
                </button>

                <button
                  onClick={() => {
                    setTimerType("stopwatch");
                    setTimeLeft(0);
                  }}
                  className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase transition-all ${
                    timerType === "stopwatch"
                      ? `${theme.button}`
                      : `${theme.muted} hover:opacity-80`
                  }`}
                >
                  Stopwatch
                </button>
              </div>
            </div>

            <div className="relative mb-6 flex h-80 w-80 items-center justify-center">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90 drop-shadow-[0_0_18px_rgba(0,0,0,0.10)]"
                viewBox="0 0 288 288"
              >
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="opacity-10"
                />

                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference - (progress / 100) * circumference
                  }
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out opacity-80"
                />
              </svg>

              <div
                className={`absolute inset-8 rounded-full border ${theme.border} ${surface} shadow-xl backdrop-blur-md`}
              />

              <div className="relative z-10 flex flex-col items-center justify-center">
                {currentCat && (
                  <img
                    src={currentCat}
                    alt="Kucing fokus"
                    className="mb-2 h-24 w-24 object-contain"
                  />
                )}

                <h2
                  className={`font-mono text-6xl font-black tracking-tighter ${theme.text}`}
                >
                  {formatTime(timeLeft)}
                </h2>

                <p
                  className={`mt-2 text-[10px] font-black uppercase tracking-[0.25em] ${theme.muted}`}
                >
                  {timerType === "pomodoro" ? "timer" : "stopwatch"}
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-md items-center justify-center gap-4">
              <div className="flex w-28 justify-end gap-2">
                <div
                  className={`flex gap-2 transition-all duration-500 ${
                    timerType === "pomodoro" && !isActive
                      ? "translate-x-0 opacity-100"
                      : "pointer-events-none -translate-x-4 opacity-0"
                  }`}
                >
                  <MiniButton
                    onClick={() => adjustTime(-5)}
                    label="-5"
                    theme={theme}
                  />
                  <MiniButton
                    onClick={() => adjustTime(-1)}
                    label="-1"
                    theme={theme}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!activeTask && mode === "focus") {
                    toast.error("Pilih target dulu.");
                    return;
                  }

                  audioRef.current
                    .play()
                    .then(() => {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    })
                    .catch(() => {});

                  setIsActive((prev) => !prev);
                }}
                className={`z-20 flex w-48 items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 ${theme.button}`}
              >
                {isActive ? (
                  <>
                    <Pause size={19} strokeWidth={3} />
                    Jeda
                  </>
                ) : (
                  <>
                    <Play size={19} strokeWidth={3} />
                    Mulai
                  </>
                )}
              </button>

              <div className="relative flex h-11 w-28 justify-start">
                <div
                  className={`absolute left-0 flex gap-2 transition-all duration-500 ${
                    timerType === "pomodoro" && !isActive
                      ? "translate-x-0 opacity-100"
                      : "pointer-events-none translate-x-4 opacity-0"
                  }`}
                >
                  <MiniButton
                    onClick={() => adjustTime(1)}
                    label="+1"
                    theme={theme}
                  />
                  <MiniButton
                    onClick={() => adjustTime(5)}
                    label="+5"
                    theme={theme}
                  />
                </div>

                <div
                  className={`absolute left-0 flex transition-all duration-500 ${
                    timerType === "stopwatch" && timeLeft >= 10 && !isActive
                      ? "translate-x-0 opacity-100"
                      : "pointer-events-none translate-x-4 opacity-0"
                  }`}
                >
                  <button
                    onClick={handleStopwatchFinish}
                    className="flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-emerald-600 active:scale-95"
                  >
                    <Save size={14} strokeWidth={3} />
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ClockView theme={theme} surface={surface} />
        )}
      </main>

      <footer className="absolute bottom-6 left-6 right-6 z-40 flex items-end justify-between pointer-events-none">
        <div
          className={`pointer-events-auto flex gap-2 rounded-2xl border ${theme.border} ${surface} p-1.5 shadow-lg backdrop-blur-xl`}
        >
          <ToolbarBtn
            icon={CheckSquare}
            onClick={() => setShowSubtask(!showSubtask)}
            active={showSubtask}
            tooltip="Subtask"
            theme={theme}
          />
          <ToolbarBtn
            icon={NotebookPen}
            onClick={() => setShowNotes(!showNotes)}
            active={showNotes}
            tooltip="Catatan"
            theme={theme}
          />
          <ToolbarBtn
            icon={Calculator}
            onClick={() => setShowCalc(!showCalc)}
            active={showCalc}
            tooltip="Kalkulator"
            theme={theme}
          />
          <ToolbarBtn
            icon={Music}
            onClick={() => setShowMusic(!showMusic)}
            active={showMusic}
            tooltip="Musik"
            theme={theme}
          />
          <ToolbarBtn
            icon={Image}
            onClick={() => setShowBgPicker(!showBgPicker)}
            active={showBgPicker}
            tooltip="Ganti suasana"
            theme={theme}
          />
        </div>

        <div
          className={`pointer-events-auto flex gap-1.5 rounded-2xl border ${theme.border} ${surface} p-1.5 shadow-lg backdrop-blur-xl`}
        >
          <ToolbarBtn
            icon={Timer}
            onClick={() => setViewMode("focus")}
            active={viewMode === "focus"}
            tooltip="Mode fokus"
            theme={theme}
          />
          <ToolbarBtn
            icon={Clock3}
            onClick={() => setViewMode("clock")}
            active={viewMode === "clock"}
            tooltip="Mode jam"
            theme={theme}
          />
        </div>
      </footer>

      {showSubtask && (
        <FloatingSubtask
          activeTask={activeTask}
          onToggleSubtask={onToggleSubtask}
          onAddSubtask={onAddSubtask}
          onEditSubtask={onEditSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onClose={() => setShowSubtask(false)}
        />
      )}

      {showCalc && <FloatingCalculator onClose={() => setShowCalc(false)} />}

      {showNotes && (
        <FloatingNotes
          activeTask={activeTask}
          onUpdateNotes={onUpdateNotes}
          onClose={() => setShowNotes(false)}
        />
      )}

      {showBgPicker && (
        <FloatingBackground
          onSelect={(bg) => setCustomBg(bg)}
          onClose={() => setShowBgPicker(false)}
        />
      )}

      {showMusic && <FloatingMusic onClose={() => setShowMusic(false)} />}
    </div>
  );
}

function MiniButton({ onClick, label, theme }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-full border ${
        theme.border
      } ${
        theme.cardBg || theme.panelBg
      } text-xs font-black shadow-sm transition-all hover:scale-110 active:scale-95`}
    >
      {label}
    </button>
  );
}

function ToolbarBtn({ icon: Icon, onClick, active, tooltip, theme }) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 active:scale-95 ${
        active
          ? `${theme.button} scale-105 shadow-lg`
          : `${theme.muted} hover:bg-white/25 hover:opacity-90`
      }`}
    >
      <Icon size={18} strokeWidth={2.6} />
    </button>
  );
}

function ClockView({ theme, surface }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const ticker = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  return (
    <div className="text-center animate-in fade-in zoom-in-95 duration-500">
      <h2
        className={`font-mono text-7xl font-black drop-shadow-sm ${theme.text}`}
      >
        {time.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </h2>

      <div
        className={`mt-5 inline-block rounded-full border ${theme.border} ${surface} px-5 py-2 shadow-sm backdrop-blur-sm`}
      >
        <p
          className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.muted}`}
        >
          {time.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

export default Pawmodoro;