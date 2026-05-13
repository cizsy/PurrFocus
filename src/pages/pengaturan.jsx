import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ThemeCard from "../components/ThemeCards";
import { themeOptions, purrThemes, DEFAULT_THEME } from "../components/purrThemes";

function Pengaturan() {
  const [settings, setSettings] = useState({
  volume: 80,
  notifications: true,
  autoStartBreak: false,
  dailyTarget: 120,
  focusDuration: 25,
  maxSessions: 4,
  theme: DEFAULT_THEME,
  });

  useEffect(() => {
    try {
      const savedSettings = JSON.parse(
        localStorage.getItem("purrfocus_settings") || "{}"
      );

      setSettings((prev) => ({
        ...prev,
        ...savedSettings,
        theme: savedSettings.theme || DEFAULT_THEME,
      }));
    } catch {
      localStorage.removeItem("purrfocus_settings");
    }
  }, []);

  const currentTheme =
    purrThemes[settings.theme] || purrThemes[DEFAULT_THEME];

  const handleChange = (key, value) => {
    setSettings((prev) => {
      const nextSettings = { ...prev, [key]: value };

      if (key === "theme") {
        localStorage.setItem("purrfocus_settings", JSON.stringify(nextSettings));

        window.dispatchEvent(
          new CustomEvent("purrfocus-theme-change", {
            detail: value,
          })
        );
      }

      return nextSettings;
    });
  };
  const handleSave = () => {
  localStorage.setItem("purrfocus_settings", JSON.stringify(settings));

  window.dispatchEvent(
    new CustomEvent("purrfocus-settings-change", {
      detail: settings,
    })
  );

  toast.success("Pengaturan berhasil disimpan.");
  };

  const handleWipeData = () => {
    if (
      window.confirm(
        "Yakin mau menghapus SEMUA data? Ini tidak bisa dibatalkan."
      )
    ) {
      localStorage.clear();
      toast.success("Semua data berhasil dihapus.");
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  return (
    <div
      className={`min-h-full flex-1 overflow-y-auto custom-scrollbar p-6 pb-28 space-y-6 relative transition-colors duration-300 ${currentTheme.mainBg} ${currentTheme.text}`}
    >
      <Toaster position="top-center" />

      {/* HEADER */}
      <section
        className={`relative overflow-hidden rounded-[2rem] border ${currentTheme.border} ${currentTheme.panelBg} p-8 shadow-sm backdrop-blur-md`}
      >
        <div className="relative z-10">
          <p
            className={`mb-2 text-[10px] font-black uppercase tracking-[0.25em] ${currentTheme.muted}`}
          >
            PurrFocus
          </p>

          <h1 className={`text-3xl font-black tracking-tight ${currentTheme.text}`}>
            Pengaturan
          </h1>

          <p
            className={`mt-2 max-w-md text-sm font-medium leading-relaxed ${currentTheme.muted}`}
          >
            Atur suasana fokus, sesi, notifikasi, dan tampilan sesuai kebiasaanmu.
          </p>
        </div>

        <span className="absolute -right-5 -top-8 text-[120px] opacity-[0.06] grayscale pointer-events-none">
          ⚙️
        </span>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AUDIO */}
        <SettingCard
          title="Audio & Notifikasi"
          icon="🔊"
          theme={currentTheme}
        >
          <SettingRow
            title="Notifikasi Pop-up"
            desc="Munculkan toast saat sesi selesai."
            theme={currentTheme}
          >
            <Toggle
              active={settings.notifications}
              onClick={() =>
                handleChange("notifications", !settings.notifications)
              }
              theme={currentTheme}
            />
          </SettingRow>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className={`font-bold ${currentTheme.text}`}>
                  Volume Alarm
                </p>
                <p className={`text-[11px] font-medium ${currentTheme.muted}`}>
                  Atur keras pelan suara alarm sesi.
                </p>
              </div>

              <p className={`text-xs font-black ${currentTheme.muted}`}>
                {settings.volume}%
              </p>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) =>
                handleChange("volume", parseInt(e.target.value) || 0)
              }
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-current bg-black/10"
            />
          </div>
        </SettingCard>

        {/* FOKUS */}
        <SettingCard
          title="Preferensi Fokus"
          icon="⏳"
          theme={currentTheme}
        >
          <SettingRow
            title="Durasi Sesi Fokus"
            desc="Durasi satu sesi Pomodoro."
            theme={currentTheme}
          >
            <NumberInput
              value={settings.focusDuration}
              min={1}
              max={180}
              onChange={(value) => handleChange("focusDuration", value)}
              suffix="mnt"
              theme={currentTheme}
            />
          </SettingRow>

          <SettingRow
            title="Jumlah Sesi per Siklus"
            desc="Berapa sesi fokus sebelum istirahat panjang."
            theme={currentTheme}
          >
            <NumberInput
              value={settings.maxSessions}
              min={1}
              max={10}
              onChange={(value) => handleChange("maxSessions", value)}
              suffix="sesi"
              theme={currentTheme}
            />
          </SettingRow>

          <SettingRow
            title="Otomatis Mulai Istirahat"
            desc="Langsung masuk mode istirahat setelah fokus selesai."
            theme={currentTheme}
          >
            <Toggle
              active={settings.autoStartBreak}
              onClick={() =>
                handleChange("autoStartBreak", !settings.autoStartBreak)
              }
              theme={currentTheme}
            />
          </SettingRow>
        </SettingCard>

        {/* TEMA */}
        <section
          className={`lg:col-span-2 rounded-[2rem] border ${currentTheme.border} ${currentTheme.panelBg} p-6 shadow-sm backdrop-blur-md`}
        >
          <div className="mb-6 flex items-center gap-3 border-b border-black/5 pb-4">
            <span className="text-2xl">🎨</span>
            <div>
              <h2 className={`text-lg font-black ${currentTheme.text}`}>
                Tema Tampilan
              </h2>
              <p className={`text-[11px] font-medium ${currentTheme.muted}`}>
                Pilih warna tampilan berdasarkan warna kucing asli.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {themeOptions.map((theme) => (
              <ThemeCard
                key={theme.id}
                active={settings.theme === theme.id}
                title={theme.title}
                desc={theme.desc}
                colors={theme.colors}
                onClick={() => handleChange("theme", theme.id)}
              />
            ))}
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="lg:col-span-2 rounded-[2rem] border border-red-100 bg-red-50/70 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl text-red-500">
              ⚠️
            </div>

            <div>
              <h2 className="text-lg font-black text-red-600">
                Zona Berbahaya
              </h2>
              <p className="max-w-md text-[11px] font-medium leading-relaxed text-red-400/90">
                Menghapus seluruh data tugas, riwayat, statistik, dan pengaturan.
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <button
            onClick={handleWipeData}
            className="w-full md:w-auto rounded-xl bg-red-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-all hover:scale-105 hover:bg-red-600 active:scale-95 whitespace-nowrap"
          >
            Hapus Semua Data
          </button>
        </section>
      </div>

      {/* SAVE BUTTON */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 rounded-full px-8 py-4 font-black shadow-2xl transition-all hover:scale-105 active:scale-95 ${currentTheme.button}`}
        >
          <span>💾</span>
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

function SettingCard({ title, icon, theme, children }) {
  return (
    <section
      className={`rounded-[2rem] border ${theme.border} ${theme.panelBg} p-6 shadow-sm backdrop-blur-md`}
    >
      <div className="mb-6 flex items-center gap-3 border-b border-black/5 pb-4">
        <span className="text-2xl">{icon}</span>
        <h2 className={`text-lg font-black ${theme.text}`}>{title}</h2>
      </div>

      <div className="space-y-6">{children}</div>
    </section>
  );
}

function SettingRow({ title, desc, theme, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className={`font-bold ${theme.text}`}>{title}</p>
        <p className={`text-[11px] font-medium ${theme.muted}`}>{desc}</p>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

function NumberInput({ value, onChange, min = 0, max, suffix, theme }) {
  const handleInput = (e) => {
    const parsed = parseInt(e.target.value) || min;
    const safeValue = max ? Math.min(max, Math.max(min, parsed)) : Math.max(min, parsed);
    onChange(safeValue);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={handleInput}
        className={`w-16 rounded-lg border border-black/10 bg-white/60 py-1.5 text-center font-black outline-none transition-all focus:border-black/30 ${theme.text}`}
      />
      <span className={`text-xs font-bold ${theme.muted}`}>{suffix}</span>
    </div>
  );
}

function Toggle({ active, onClick, disabled = false, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative h-6 w-12 rounded-full transition-colors duration-300 ${
        active ? "bg-black/70" : "bg-black/10"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <div
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
          active ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default Pengaturan;