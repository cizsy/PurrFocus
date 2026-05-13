import React, { useEffect, useState } from "react";
import { Plus, Timer, Target, Flame, CheckCircle2, BarChart3, CalendarDays } from "lucide-react";
import useStats from "../hooks/useStats";
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

const parseLocalDate = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

function Dashboard({
  tasks = [],
  focusLogs = [],
  onAddTask,
  onStartFocusing,
}) {
  const [newTasksName, setNewTasksName] = useState("");
  const [themeName, setThemeName] = useState(getSavedThemeName);

  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  const {
    focusTimeToday,
    sessionCount,
    completedTasks,
    focusScore,
    currentStreak,
    totalXP,
  } = useStats(tasks, focusLogs);

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
  const catPeek = catAssets?.[catColor]?.peek || catAssets?.black?.peek;
  const catAngry = catAssets?.[catColor]?.angry || catAssets?.black?.angry;

  const getProgress = (task) => {
    const total = task.subtasks?.length || 0;
    const done = task.subtasks?.filter((subtask) => subtask.completed).length || 0;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    return { total, done, percent };
  };

  const activeTasks = tasks.filter((task) => getProgress(task).percent < 100);

  const handleAddTask = () => {
    if (!newTasksName.trim()) return;

    const success = onAddTask(newTasksName.trim());

    if (success !== false) {
      setNewTasksName("");
    }
  };

  const deadlineTasks = tasks
    .filter((task) => task.deadline)
    .sort((a, b) => parseLocalDate(a.deadline) - parseLocalDate(b.deadline))
    .slice(0, 3);

  const today = new Date();

  const heroCat = activeTasks.length === 0 ? catAngry : catPeek;

  return (
    <div
      className={`min-h-full p-5 md:p-6 transition-colors duration-300 ${theme.mainBg} ${theme.text}`}
    >
      <div className="grid grid-cols-12 gap-5">
        {/* HERO */}
        <section
          className={`relative col-span-12 overflow-hidden rounded-[2rem] border ${theme.border} ${theme.panelBg} p-6 md:p-8 shadow-sm backdrop-blur-md`}
        >
          <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p
                className={`mb-2 text-[10px] font-black uppercase tracking-[0.25em] ${theme.muted}`}
              >
                Beranda Fokus
              </p>

              <h1 className={`text-3xl font-black tracking-tight ${theme.text}`}>
                Mulai dengan satu target kecil.
              </h1>

              <p
                className={`mt-3 max-w-xl text-sm font-medium leading-relaxed ${theme.muted}`}
              >
                Pilih satu hal yang mau dikerjakan, mulai sesi fokus, lalu biarkan progresnya numpuk pelan-pelan.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    if (activeTasks[0]) onStartFocusing(activeTasks[0]);
                  }}
                  disabled={activeTasks.length === 0}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${theme.button}`}
                >
                  <Timer size={18} strokeWidth={2.7} />
                  Mulai Fokus
                </button>

                <div
                  className={`inline-flex items-center justify-center rounded-2xl border border-black/5 bg-white/40 px-5 py-3 text-xs font-black ${theme.muted}`}
                >
                  {activeTasks.length} target aktif
                </div>
              </div>
            </div>

            {heroCat && (
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-[2rem] bg-white/35 md:h-44 md:w-44">
                <img
                  src={heroCat}
                  alt="Kucing PurrFocus"
                  className="h-32 w-32 object-contain md:h-40 md:w-40"
                />
              </div>
            )}
          </div>

          <div className="absolute -right-10 -bottom-14 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        </section>

        {/* MINI STATS */}
        <section className="col-span-12 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatCard theme={theme} icon={Timer} label="Fokus" value={focusTimeToday} />
          <StatCard theme={theme} icon={BarChart3} label="Sesi" value={sessionCount} />
          <StatCard theme={theme} icon={CheckCircle2} label="Selesai" value={completedTasks} />
          <StatCard theme={theme} icon={Target} label="Skor" value={`${focusScore}%`} />
          <StatCard theme={theme} icon={Flame} label="Streak" value={currentStreak} />
          <StatCard theme={theme} icon={Target} label="Poin" value={totalXP} />
        </section>

        {/* TARGET AKTIF */}
        <section
          className={`col-span-12 lg:col-span-8 rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 md:p-6 shadow-sm backdrop-blur-md`}
        >
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
              >
                Fokus Hari Ini
              </p>
              <h2 className={`text-xl font-black ${theme.text}`}>
                Target aktif
              </h2>
            </div>

            <div className="flex rounded-[1.5rem] border border-black/5 bg-white/45 p-1.5 shadow-sm">
              <input
                className={`w-40 bg-transparent px-4 text-sm font-bold outline-none placeholder:opacity-50 focus:w-56 transition-all md:w-48 ${theme.text}`}
                placeholder="Tambah target..."
                value={newTasksName}
                onChange={(event) => setNewTasksName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleAddTask();
                }}
              />

              <button
                onClick={handleAddTask}
                className={`inline-flex items-center gap-1.5 rounded-[1.1rem] px-4 py-2 text-xs font-black transition-all active:scale-95 ${theme.button}`}
              >
                <Plus size={15} strokeWidth={3} />
                Tambah
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {activeTasks.length === 0 ? (
              <EmptyTarget theme={theme} cat={catAngry} />
            ) : (
              activeTasks.map((task) => {
                const progress = getProgress(task);

                return (
                  <div
                    key={task.id}
                    className="group rounded-[1.5rem] border border-black/5 bg-white/45 p-4 transition-all hover:-translate-y-0.5 hover:bg-white/60 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/45 md:flex">
                        <Target size={19} strokeWidth={2.7} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className={`truncate text-sm font-black ${theme.text}`}>
                              {task.title}
                            </h3>
                            <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}>
                              {progress.done}/{progress.total} langkah selesai
                            </p>
                          </div>

                          <span className="rounded-full bg-white/50 px-3 py-1 text-[10px] font-black">
                            {progress.percent}%
                          </span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
                          <div
                            className="h-full rounded-full bg-current transition-all duration-700"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => onStartFocusing(task)}
                        className={`rounded-[1.2rem] px-5 py-3 text-xs font-black shadow-sm transition-all active:scale-95 ${theme.button}`}
                      >
                        Mulai
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* RIGHT SIDE */}
        <aside className="col-span-12 space-y-5 lg:col-span-4">
          {/* CAT NOTE */}
          <section
            className={`rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 shadow-sm backdrop-blur-md`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
                >
                  Teman Fokus
                </p>
                <h2 className={`text-lg font-black ${theme.text}`}>
                  {activeTasks.length === 0
                    ? "Kucingmu mulai curiga."
                    : "Kucingmu ngintip progresmu."}
                </h2>
                <p className={`mt-2 text-xs font-bold leading-relaxed ${theme.muted}`}>
                  {activeTasks.length === 0
                    ? "Belum ada target aktif. Tambahin satu dulu, agar kocheng tidak marah."
                    : "Ada target yang bisa dikerjakan. Pilih satu, kerjakan pelan-pelan."}
                </p>
              </div>

              {heroCat && (
                <img
                  src={heroCat}
                  alt=""
                  className="h-20 w-20 shrink-0 object-contain"
                />
              )}
            </div>
          </section>

          {/* CALENDAR */}
          <section
            className={`rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 shadow-sm backdrop-blur-md`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p
                  className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
                >
                  Kalender
                </p>
                <h2 className={`text-lg font-black ${theme.text}`}>
                  Jadwal bulan ini
                </h2>
              </div>

              <CalendarDays size={21} strokeWidth={2.5} className="opacity-60" />
            </div>

            <div className={`mb-3 grid grid-cols-7 gap-2 text-center text-[10px] font-black ${theme.muted}`}>
              <span>S</span>
              <span>S</span>
              <span>R</span>
              <span>K</span>
              <span>J</span>
              <span>S</span>
              <span>M</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {[...Array(31)].map((_, index) => {
                const day = index + 1;
                const isToday = day === today.getDate();

                const hasDeadline = tasks.some((task) => {
                  if (!task.deadline) return false;

                  const deadline = parseLocalDate(task.deadline);
                  if (!deadline) return false;

                  return (
                    deadline.getDate() === day &&
                    deadline.getMonth() === today.getMonth() &&
                    deadline.getFullYear() === today.getFullYear()
                  );
                });

                return (
                  <div key={day} className="relative">
                    <div
                      className={`flex aspect-square items-center justify-center rounded-xl text-xs font-black transition-all
                        ${
                          isToday
                            ? `${theme.button} shadow-sm`
                            : "bg-white/35 hover:bg-white/55"
                        }
                        ${hasDeadline && !isToday ? "ring-2 ring-current" : ""}
                      `}
                    >
                      {day}
                    </div>

                    {hasDeadline && (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* DEADLINE */}
          <section
            className={`rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 shadow-sm backdrop-blur-md`}
          >
            <div className="mb-4">
              <p
                className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
              >
                Deadline
              </p>
              <h2 className={`text-lg font-black ${theme.text}`}>
                Terdekat
              </h2>
            </div>

            {deadlineTasks.length > 0 ? (
              <div className="space-y-3">
                {deadlineTasks.map((task) => {
                  const deadline = parseLocalDate(task.deadline);

                  return (
                    <div
                      key={task.id}
                      className="rounded-[1.4rem] border border-black/5 bg-white/40 p-4"
                    >
                      <p className={`truncate text-sm font-black ${theme.text}`}>
                        {task.title}
                      </p>
                      <p className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}>
                        {deadline?.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={`rounded-[1.4rem] bg-white/40 p-4 text-xs font-bold leading-relaxed ${theme.muted}`}>
                Belum ada deadline. Aman, tapi jangan santai juga.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ theme, icon: Icon, label, value }) {
  return (
    <div
      className={`rounded-[1.5rem] border ${theme.border} ${theme.panelBg} p-4 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/40">
          <Icon size={18} strokeWidth={2.6} />
        </span>

        <span className="h-2 w-2 rounded-full bg-current opacity-40" />
      </div>

      <p className={`text-xl font-black leading-none ${theme.text}`}>
        {value}
      </p>

      <p
        className={`mt-2 text-[9px] font-black uppercase tracking-[0.2em] ${theme.muted}`}
      >
        {label}
      </p>
    </div>
  );
}

function EmptyTarget({ theme, cat }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-black/10 bg-white/35 px-6 py-14 text-center">
      {cat && (
        <img
          src={cat}
          alt=""
          className="mb-4 h-28 w-28 object-contain opacity-90"
        />
      )}

      <h3 className={`text-base font-black ${theme.text}`}>
        Belum ada target aktif
      </h3>

      <p className={`mt-2 max-w-sm text-xs font-bold leading-relaxed ${theme.muted}`}>
        Tambahkan satu target kecil dulu. Kucingmu sudah mulai menilai dari pojokan.
      </p>
    </div>
  );
}

export default Dashboard;