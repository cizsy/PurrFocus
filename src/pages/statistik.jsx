import React, { useEffect, useState } from "react";
import {
  Timer,
  CheckCircle2,
  BarChart3,
  Flame,
  Trophy,
  Footprints,
  Sparkles,
  Crown,
  Target,
} from "lucide-react";

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

function Statistik({ tasks = [], focusLogs = [], archivedTasks = [] }) {
  const [themeName, setThemeName] = useState(getSavedThemeName);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  const {
    focusTimeToday,
    completedTasks,
    totalXP,
    focusScore,
    currentStreak,
    weeklyDistribution,
    categoryDistribution,
  } = useStats(tasks, focusLogs, archivedTasks);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setThemeName(event.detail || getSavedThemeName());
    };

    window.addEventListener("purrfocus-theme-change", handleThemeChange);

    return () => {
      window.removeEventListener("purrfocus-theme-change", handleThemeChange);
    };
  }, []);

  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  const catColor = theme.isDark ? "white" : "black";
  const catSad = catAssets?.[catColor]?.sad || catAssets?.black?.sad;

  const recentLogs = [...focusLogs].reverse().slice(0, 5);
  const highestWeeklyValue = Math.max(...weeklyDistribution, 1);

  return (
    <div
      className={`min-h-full flex-1 overflow-y-auto custom-scrollbar p-5 md:p-6 space-y-5 transition-colors duration-300 ${theme.mainBg} ${theme.text}`}
    >
      {/* HERO */}
      <section
        className={`relative overflow-hidden rounded-[2rem] border ${theme.border} ${theme.panelBg} p-6 md:p-8 shadow-sm backdrop-blur-md`}
      >
        <div className="relative z-10">
          <p
            className={`mb-2 text-[10px] font-black uppercase tracking-[0.25em] ${theme.muted}`}
          >
            Statistik Fokus
          </p>

          <h1 className={`text-3xl font-black tracking-tight ${theme.text}`}>
            Lihat ritme fokusmu.
          </h1>

          <p
            className={`mt-2 max-w-xl text-sm font-medium leading-relaxed ${theme.muted}`}
          >
            Pantau durasi fokus, target selesai, streak, dan jejak sesi yang
            sudah kamu kumpulkan.
          </p>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard
          theme={theme}
          icon={Timer}
          label="Total Fokus"
          value={focusTimeToday}
        />

        <StatCard
          theme={theme}
          icon={CheckCircle2}
          label="Target Beres"
          value={completedTasks}
          suffix="task"
        />

        <StatCard
          theme={theme}
          icon={BarChart3}
          label="Skor Harian"
          value={`${focusScore}%`}
        />

        <StatCard
          theme={theme}
          icon={Flame}
          label="Streak"
          value={currentStreak}
          suffix="hari"
        />

        <StatCard
          theme={theme}
          icon={Trophy}
          label="Poin Fokus"
          value={totalXP}
          suffix="XP"
        />
      </section>

      <section className="grid grid-cols-12 gap-5">
        {/* AKTIVITAS MINGGUAN */}
        <div
          className={`col-span-12 rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 md:p-6 shadow-sm backdrop-blur-md lg:col-span-7`}
        >
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p
                className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
              >
                Aktivitas Mingguan
              </p>
              <h2 className={`text-lg font-black ${theme.text}`}>
                Pola fokus 7 hari terakhir
              </h2>
            </div>

            <span className="rounded-full bg-white/40 px-3 py-1 text-[10px] font-black">
              menit
            </span>
          </div>

          <div className="flex h-40 items-end justify-between gap-3 px-1">
            {weeklyDistribution.map((value, index) => {
              const height = Math.min(
                (value / highestWeeklyValue) * 100,
                100
              );

              return (
                <div
                  key={index}
                  className="group flex flex-1 flex-col items-center gap-3"
                >
                  <div className="relative flex h-32 w-full max-w-[28px] items-end justify-center overflow-hidden rounded-full bg-black/10">
                    <div
                      className="w-full rounded-full bg-current opacity-70 transition-all duration-700 group-hover:opacity-100"
                      style={{
                        height: `${height}%`,
                        minHeight: value > 0 ? "8px" : "4px",
                      }}
                    />

                    <span className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/80 px-2 py-1 text-[9px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      {value}m
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${theme.muted}`}
                  >
                    {days[index]}
                  </span>
                </div>
              );
            })}
          </div>

          {weeklyDistribution.every((value) => value === 0) && (
            <p className={`mt-5 text-center text-xs font-bold ${theme.muted}`}>
              Belum ada sesi fokus minggu ini.
            </p>
          )}
        </div>

        {/* KATEGORI */}
        <div
          className={`col-span-12 rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 md:p-6 shadow-sm backdrop-blur-md lg:col-span-5`}
        >
          <div className="mb-6">
            <p
              className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
            >
              Kategori Utama
            </p>
            <h2 className={`text-lg font-black ${theme.text}`}>
              Arah fokusmu
            </h2>
          </div>

          <div className="space-y-5">
            {categoryDistribution.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[1.4rem] bg-white/35 p-5 text-center">
                {catSad && (
                  <img
                    src={catSad}
                    alt=""
                    className="mb-3 h-20 w-20 object-contain opacity-90"
                  />
                )}

                <p className={`text-xs font-bold leading-relaxed ${theme.muted}`}>
                  Belum ada kategori yang cukup aktif. Isi target dulu, baru
                  grafiknya bisa pamer.
                </p>
              </div>
            ) : (
              categoryDistribution.map((category, index) => (
                <div key={index}>
                  <div className="mb-2 flex justify-between text-[11px] font-black uppercase tracking-wider">
                    <span className={theme.text}>{category.label}</span>
                    <span className={theme.muted}>{category.value}%</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-current opacity-70 transition-all duration-700 ease-out"
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-white/35 p-4">
            <p className={`text-xs font-bold leading-relaxed ${theme.muted}`}>
              Kategori paling tinggi menunjukkan jenis aktivitas yang paling
              sering kamu sentuh.
            </p>
          </div>
        </div>

        {/* JEJAK TERAKHIR */}
        <div
          className={`col-span-12 rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 md:p-6 shadow-sm backdrop-blur-md`}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p
                className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
              >
                Jejak Terakhir
              </p>
              <h2 className={`text-lg font-black ${theme.text}`}>
                Sesi fokus terbaru
              </h2>
            </div>

            <span className="hidden rounded-full bg-white/40 px-3 py-1 text-[10px] font-black md:inline">
              {focusLogs.length} sesi
            </span>
          </div>

          <div className="grid gap-3">
            {recentLogs.length === 0 ? (
              <EmptyLogs theme={theme} cat={catSad} />
            ) : (
              recentLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-[1.4rem] border border-black/5 bg-white/40 p-4 transition-all hover:-translate-y-0.5 hover:bg-white/55 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/40">
                      <Footprints size={19} strokeWidth={2.6} />
                    </div>

                    <div>
                      <p className={`text-sm font-black ${theme.text}`}>
                        Sesi fokus selesai
                      </p>
                      <p
                        className={`mt-0.5 text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}
                      >
                        {new Date(log.date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-full bg-white/45 px-3 py-1 text-xs font-black">
                    +{log.duration}m
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section
        className={`rounded-[2rem] border ${theme.border} ${theme.panelBg} p-5 md:p-6 shadow-sm backdrop-blur-md`}
      >
        <div className="mb-6">
          <p
            className={`mb-1 text-[10px] font-black uppercase tracking-[0.22em] ${theme.muted}`}
          >
            Pencapaian
          </p>
          <h2 className={`text-lg font-black ${theme.text}`}>
            Tanda kecil dari progresmu
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Badge
            theme={theme}
            icon={Sparkles}
            title="Mulai Tenang"
            desc="Berhasil masuk app"
            unlocked={true}
          />

          <Badge
            theme={theme}
            icon={Flame}
            title="Ritme Terjaga"
            desc="Streak 3 hari"
            unlocked={currentStreak >= 3}
          />

          <Badge
            theme={theme}
            icon={Target}
            title="Tuntas"
            desc="5 target beres"
            unlocked={completedTasks >= 5}
          />

          <Badge
            theme={theme}
            icon={Crown}
            title="Konsisten"
            desc="1000 XP terkumpul"
            unlocked={totalXP >= 1000}
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ theme, icon: Icon, label, value, suffix }) {
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
        {suffix && (
          <span className={`ml-1 text-[10px] font-bold ${theme.muted}`}>
            {suffix}
          </span>
        )}
      </p>

      <p
        className={`mt-2 text-[9px] font-black uppercase tracking-[0.2em] ${theme.muted}`}
      >
        {label}
      </p>
    </div>
  );
}

function EmptyLogs({ theme, cat }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-black/10 bg-white/35 px-6 py-12 text-center">
      {cat && (
        <img
          src={cat}
          alt=""
          className="mb-4 h-24 w-24 object-contain opacity-90"
        />
      )}

      <h3 className={`text-sm font-black ${theme.text}`}>
        Belum ada jejak fokus
      </h3>

      <p className={`mt-2 max-w-xs text-xs font-bold leading-relaxed ${theme.muted}`}>
        Mulai satu sesi dulu. Statistik nggak bisa kerja kalau kamu cuma
        menatap dashboard.
      </p>
    </div>
  );
}

function Badge({ theme, icon: Icon, title, desc, unlocked }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center transition-all ${
        unlocked
          ? "border-black/5 bg-white/40 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
          : "border-transparent bg-black/10 opacity-35 grayscale"
      }`}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40">
        <Icon size={22} strokeWidth={2.5} />
      </div>

      <h3 className={`text-[10px] font-black uppercase tracking-wider ${theme.text}`}>
        {title}
      </h3>

      <p className={`mt-1 text-[9px] font-bold leading-tight ${theme.muted}`}>
        {desc}
      </p>
    </div>
  );
}

export default Statistik;