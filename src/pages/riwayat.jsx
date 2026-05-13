import React, { useEffect, useState } from "react";
import {
  Target,
  Timer,
  ChevronDown,
  ChevronUp,
  Footprints,
  StickyNote,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
} from "lucide-react";

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

const safeReadJSON = (key, fallback = []) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const formatDuration = (minutes) => {
  const safeMinutes = Number(minutes) || 0;
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}j`;

  return `${hours}j ${mins}m`;
};

function Riwayat({ focusLogs = [] }) {
  const [historyTasks, setHistoryTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("misi");
  const [filter, setFilter] = useState("semua");
  const [expandedTask, setExpandedTask] = useState(null);

  const [themeName, setThemeName] = useState(getSavedThemeName);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  useEffect(() => {
    const savedHistory = safeReadJSON("purrfocus_history", []);
    const activeTasks = safeReadJSON("purrfocus_tasks", []);

    const todaysFinishedTasks = activeTasks.filter((task) => {
      const total = task.subtasks?.length || 0;
      const done = task.subtasks?.filter((subtask) => subtask.completed).length || 0;

      return total > 0 && done === total;
    });

    const combined = [...savedHistory, ...todaysFinishedTasks];
    const uniqueHistory = Array.from(
      new Map(combined.map((item) => [item.id, item])).values()
    );

    const sorted = uniqueHistory.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setHistoryTasks(sorted);
  }, []);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setThemeName(event.detail || getSavedThemeName());
    };

    window.addEventListener("purrfocus-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("purrfocus-theme-change", handleThemeChange);
    };
  }, []);

  const catColor = theme.isDark ? "white" : "black";
  const catSad = catAssets?.[catColor]?.sad || catAssets?.black?.sad;
  const catAngry = catAssets?.[catColor]?.angry || catAssets?.black?.angry;

  const groupTasksByDate = (tasks) => {
    return tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (!acc[date]) acc[date] = [];
      acc[date].push(task);

      return acc;
    }, {});
  };

  const groupLogsByDate = (logs) => {
    return [...logs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .reduce((acc, log) => {
        const date = new Date(log.date).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        if (!acc[date]) acc[date] = [];
        acc[date].push(log);

        return acc;
      }, {});
  };

  const filteredTasks = historyTasks.filter((task) => {
    const isCompleted =
      task.subtasks?.length > 0 &&
      task.subtasks.every((subtask) => subtask.completed);

    if (filter === "selesai") return isCompleted;
    if (filter === "gagal") return !isCompleted;

    return true;
  });

  const groupedTasks = groupTasksByDate(filteredTasks);
  const groupedLogs = groupLogsByDate(focusLogs);

  const totalMisi = historyTasks.length;

  const misiBerhasil = historyTasks.filter((task) => {
    return (
      task.subtasks?.length > 0 &&
      task.subtasks.every((subtask) => subtask.completed)
    );
  }).length;

  const totalMenitFokus = focusLogs.reduce((total, log) => {
    return total + (Number(log.duration) || 0);
  }, 0);

  return (
    <div
      className={`min-h-full flex-1 overflow-y-auto custom-scrollbar p-5 md:p-6 space-y-5 transition-colors duration-300 ${theme.mainBg} ${theme.text}`}
    >
      {/* HERO */}
      <section
        className={`relative overflow-hidden rounded-[2rem] border ${theme.border} ${theme.panelBg} p-6 md:p-8 shadow-sm backdrop-blur-md`}
      >
        <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p
              className={`mb-2 text-[10px] font-black uppercase tracking-[0.25em] ${theme.muted}`}
            >
              Riwayat Fokus
            </p>

            <h1 className={`text-3xl font-black tracking-tight ${theme.text}`}>
              Jejak yang sudah kamu lewati.
            </h1>

            <p
              className={`mt-2 max-w-xl text-sm font-medium leading-relaxed ${theme.muted}`}
            >
              Lihat kembali target yang pernah kamu kerjakan dan sesi fokus yang
              sudah tercatat.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-[1.7rem] border border-black/5 bg-white/35 p-4 backdrop-blur-sm">
            <HeroStat theme={theme} label="Misi" value={totalMisi} />
            <HeroStat theme={theme} label="Selesai" value={misiBerhasil} />
            <HeroStat theme={theme} label="Fokus" value={formatDuration(totalMenitFokus)} />
          </div>
        </div>

        <div className="absolute -right-10 -bottom-14 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      </section>

      {/* TAB NAV */}
      <section
        className={`flex flex-col gap-3 rounded-[2rem] border ${theme.border} ${theme.panelBg} p-3 shadow-sm backdrop-blur-md md:flex-row md:items-center md:justify-between`}
      >
        <div className="flex gap-2">
          <TabButton
            active={activeTab === "misi"}
            onClick={() => setActiveTab("misi")}
            icon={Target}
            label="Riwayat Misi"
            theme={theme}
          />

          <TabButton
            active={activeTab === "fokus"}
            onClick={() => setActiveTab("fokus")}
            icon={Timer}
            label="Jejak Fokus"
            theme={theme}
          />
        </div>

        {activeTab === "misi" && (
          <label className="flex items-center gap-2 rounded-2xl bg-white/40 px-3 py-2">
            <Filter size={15} strokeWidth={2.5} />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className={`bg-transparent text-xs font-black outline-none cursor-pointer ${theme.text}`}
            >
              <option value="semua">Semua Misi</option>
              <option value="selesai">Selesai</option>
              <option value="gagal">Terbengkalai</option>
            </select>
          </label>
        )}
      </section>

      <section className="pb-10">
        {/* TAB MISI */}
        {activeTab === "misi" &&
          (Object.keys(groupedTasks).length === 0 ? (
            <EmptyState
              theme={theme}
              cat={catSad}
              title="Belum ada riwayat misi"
              message="Target yang selesai atau masuk riwayat akan muncul di sini."
            />
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedTasks).map((date) => (
                <div key={date} className="relative">
                  <DateDivider theme={theme} date={date} />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {groupedTasks[date].map((task) => {
                      const total = task.subtasks?.length || 0;
                      const done =
                        task.subtasks?.filter((subtask) => subtask.completed)
                          .length || 0;

                      const isCompleted = total > 0 && total === done;
                      const percent =
                        total === 0 ? 0 : Math.round((done / total) * 100);
                      const isExpanded = expandedTask === task.id;

                      const taskFocusTime = focusLogs
                        .filter((log) => log.taskId === task.id)
                        .reduce((total, log) => total + (Number(log.duration) || 0), 0);

                      return (
                        <article
                          key={task.id}
                          className={`h-fit rounded-[1.7rem] border ${theme.border} ${theme.panelBg} p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-md`}
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                                isCompleted
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-orange-500/10 text-orange-600"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={12} strokeWidth={3} />
                              ) : (
                                <AlertCircle size={12} strokeWidth={3} />
                              )}
                              {isCompleted ? "Selesai" : "Terbengkalai"}
                            </span>

                            <span className={`rounded-full bg-white/40 px-2.5 py-1 text-[10px] font-black ${theme.muted}`}>
                              {task.category || "Umum"}
                            </span>
                          </div>

                          <h3 className={`mb-1 text-lg font-black leading-tight ${theme.text}`}>
                            {task.title}
                          </h3>

                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className={`text-[11px] font-bold ${theme.muted}`}>
                              {done}/{total} langkah
                            </span>
                            <span className="opacity-30">•</span>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-black ${theme.muted}`}>
                              <Clock size={12} strokeWidth={2.5} />
                              {formatDuration(taskFocusTime)}
                            </span>
                          </div>

                          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-black/10">
                            <div
                              className="h-full rounded-full bg-current opacity-70 transition-all duration-700"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              onClick={() =>
                                setExpandedTask(isExpanded ? null : task.id)
                              }
                              className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-colors ${theme.muted}`}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp size={13} strokeWidth={3} />
                                  Tutup Catatan
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={13} strokeWidth={3} />
                                  Lihat Catatan
                                </>
                              )}
                            </button>

                            <span className={`text-[10px] font-black ${theme.muted}`}>
                              {percent}%
                            </span>
                          </div>

                          {isExpanded && (
                            <div className="mt-4 border-t border-black/5 pt-4">
                              <div className="mb-3">
                                <h4 className={`mb-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${theme.muted}`}>
                                  <StickyNote size={13} strokeWidth={2.5} />
                                  Catatan Misi
                                </h4>

                                <div className="rounded-xl border border-black/5 bg-white/35 p-3 text-xs font-medium leading-relaxed">
                                  {task.notes || "Tidak ada catatan untuk misi ini."}
                                </div>
                              </div>

                              <div>
                                <h4 className={`mb-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${theme.muted}`}>
                                  <Footprints size={13} strokeWidth={2.5} />
                                  Detail Sesi
                                </h4>

                                <div className="space-y-1">
                                  {focusLogs.filter((log) => log.taskId === task.id)
                                    .length > 0 ? (
                                    focusLogs
                                      .filter((log) => log.taskId === task.id)
                                      .map((log, index) => (
                                        <div
                                          key={index}
                                          className={`flex justify-between rounded-lg bg-white/30 px-3 py-2 text-[10px] font-bold ${theme.muted}`}
                                        >
                                          <span>Sesi {index + 1}</span>
                                          <span>{log.duration} menit</span>
                                        </div>
                                      ))
                                  ) : (
                                    <p className={`text-[10px] font-bold italic ${theme.muted}`}>
                                      Data sesi tidak ditemukan.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* TAB FOKUS */}
        {activeTab === "fokus" &&
          (Object.keys(groupedLogs).length === 0 ? (
            <EmptyState
              theme={theme}
              cat={catSad}
              title="Belum ada sesi fokus"
              message="Sesi fokus yang selesai akan muncul di sini."
            />
          ) : (
            <div className="mx-auto max-w-3xl space-y-8">
              {Object.keys(groupedLogs).map((date) => {
                const totalDurasiHariIni = groupedLogs[date].reduce(
                  (total, log) => total + (Number(log.duration) || 0),
                  0
                );

                return (
                  <div
                    key={date}
                    className={`rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 md:p-6 shadow-sm backdrop-blur-md`}
                  >
                    <div className="mb-5 flex items-center justify-between border-b border-black/5 pb-4">
                      <h3 className={`font-black ${theme.text}`}>{date}</h3>

                      <span className="rounded-full bg-white/40 px-3 py-1.5 text-xs font-black">
                        Total: {formatDuration(totalDurasiHariIni)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {groupedLogs[date].map((log, index) => {
                        const taskName =
                          historyTasks.find((task) => task.id === log.taskId)
                            ?.title ||
                          log.taskTitle ||
                          "Sesi fokus selesai";

                        const xp = (Number(log.duration) || 0) * 2;

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white/35 p-3 transition-all hover:bg-white/50"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40">
                              <Footprints size={20} strokeWidth={2.6} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className={`truncate text-sm font-black ${theme.text}`}>
                                {taskName}
                              </h4>

                              <p className={`text-xs font-bold ${theme.muted}`}>
                                {new Date(log.date).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-black">
                                +{log.duration}
                                <span className="text-xs">m</span>
                              </p>
                              <p className={`text-[9px] font-black uppercase tracking-widest ${theme.muted}`}>
                                +{xp} XP
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </section>
    </div>
  );
}

function HeroStat({ theme, label, value }) {
  return (
    <div className="text-center">
      <p className={`text-[9px] font-black uppercase tracking-widest ${theme.muted}`}>
        {label}
      </p>
      <p className={`mt-1 text-xl font-black ${theme.text}`}>{value}</p>
    </div>
  );
}

function DateDivider({ theme, date }) {
  return (
    <div className={`sticky top-0 z-10 mb-4 flex items-center gap-3 py-2 ${theme.mainBg}/90 backdrop-blur-md`}>
      <span className="rounded-xl bg-white/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest">
        {date}
      </span>

      <div className="h-px flex-1 bg-black/10" />
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, theme }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black transition-all active:scale-95 ${
        active ? theme.button : `bg-white/35 ${theme.muted} hover:bg-white/50`
      }`}
    >
      <Icon size={16} strokeWidth={2.7} />
      {label}
    </button>
  );
}

function EmptyState({ theme, cat, title, message }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[2rem] border ${theme.border} ${theme.panelBg} px-6 py-20 text-center shadow-sm backdrop-blur-md`}
    >
      {cat && (
        <img
          src={cat}
          alt=""
          className="mb-4 h-28 w-28 object-contain opacity-90"
        />
      )}

      <h3 className={`text-lg font-black ${theme.text}`}>{title}</h3>

      <p className={`mt-2 max-w-xs text-sm font-bold leading-relaxed ${theme.muted}`}>
        {message}
      </p>
    </div>
  );
}

export default Riwayat;