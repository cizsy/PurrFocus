import React, { useEffect, useState } from "react";
import {
  Home,
  Target,
  BarChart3,
  History,
  Settings,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { brandAssets } from "./brand";
import profil from "../assets/profil.jpg";
import { catAssets } from "./catAssets";

// IMPORT YANG DITAMBAHKAN: Panggil purrThemes dan DEFAULT_THEME
import { purrThemes, DEFAULT_THEME } from "./purrThemes"; 
// (Sesuaikan path import purrThemes di atas dengan struktur foldermu jika berbeda)

const getSavedTheme = () => {
  try {
    const savedSettings = JSON.parse(
      localStorage.getItem("purrfocus_settings") || "{}"
    );
    // Gunakan DEFAULT_THEME agar lebih aman
    return savedSettings.theme || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

const getSavedCollapseState = () => {
  try {
    return localStorage.getItem("purrfocus_sidebar_collapsed") === "true";
  } catch {
    return false;
  }
};

function Layout({ children, activePage, setPage, totalActiveTasks }) {
  const [themeName, setThemeName] = useState(getSavedTheme);
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];
  const [isCollapsed, setIsCollapsed] = useState(getSavedCollapseState);

  useEffect(() => {
  const handleThemeChange = (event) => {
    setThemeName(event.detail || getSavedTheme());
  };

  window.addEventListener("purrfocus-theme-change", handleThemeChange);

  return () => {
    window.removeEventListener("purrfocus-theme-change", handleThemeChange);
  };
  }, []);

  const catColor = theme.isDark ? "white" : "black";
  const pawIcon = catAssets?.[catColor]?.paw || catAssets?.black?.paw;
  const currentLogo = theme.isDark ? brandAssets.logo.light : brandAssets.logo.dark;  

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("purrfocus_sidebar_collapsed", String(next));
      return next;
    });
  };

  const pageInfo = {
    dashboard: {
      title: "Beranda",
      desc: `${totalActiveTasks} target aktif hari ini`,
    },
    tujuan: {
      title: "Tujuan Saya",
      desc: "Susun target kecil yang bisa kamu selesaikan",
    },
    statistik: {
      title: "Statistik",
      desc: "Lihat ritme fokus dan progres harianmu",
    },
    riwayat: {
      title: "Riwayat Fokus",
      desc: "Jejak sesi fokus yang sudah kamu lewati",
    },
    pengaturan: {
      title: "Pengaturan",
      desc: "Atur PurrFocus sesuai kebiasaanmu",
    },
    pawmodoro: {
      title: "Sesi Fokus",
      desc: "Waktunya masuk mode tenang",
    },
  };

  const navItem = (id, label, Icon) => {
    const isActive = activePage === id;

    return (
      <li>
        <button
          onClick={() => setPage(id)}
          title={isCollapsed ? label : ""}
          className={`group relative flex w-full items-center rounded-2xl font-bold transition-all duration-300
            ${isCollapsed ? "justify-center p-3" : "gap-3 p-3.5"}
            ${isActive ? theme.active : theme.navText}`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
              isActive ? "bg-white/35" : "bg-white/20 group-hover:bg-white/30"
            }`}
          >
            <Icon size={19} strokeWidth={2.4} />
          </span>

          {!isCollapsed && (
            <>
              <span className="flex-1 text-left text-sm">{label}</span>

              {/* {isActive && pawIcon && (
                <img
                  src={pawIcon}
                  alt=""
                  className="h-4 w-4 object-contain opacity-80"
                />
              )} */}
            </>
          )}


        </button>
      </li>
    );
  };

  const currentPage = pageInfo[activePage] || pageInfo.dashboard;

  return (
    <div
      className={`flex h-screen overflow-hidden p-4 font-sans transition-colors duration-300 ${theme.appBg} ${theme.text}`}
    >
      {/* SIDEBAR */}
      <aside
        className={`hidden h-full min-h-0 flex-col pr-4 transition-all duration-300 md:flex ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* BRAND PANEL */}
        <div
          className={`mb-4 shrink-0 rounded-[2rem] border ${theme.border} ${theme.panelBg} p-3 shadow-sm backdrop-blur-md`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <img
                src={currentLogo}
                alt="PurrFocus Logo"
                className="w-36 object-contain"
              />
            )}

            {isCollapsed && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/40">
                {pawIcon ? (
                  <img
                    src={pawIcon}
                    alt="PurrFocus"
                    className="h-7 w-7 object-contain"
                  />
                ) : (
                  <span className="text-sm font-black">PF</span>
                )}
              </div>
            )}

            <button
              onClick={handleToggleSidebar}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all ${theme.navText}`}
              title={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight size={17} strokeWidth={2.7} />
              ) : (
                <ChevronLeft size={17} strokeWidth={2.7} />
              )}
            </button>
          </div>
        </div>

        {/* MENU PANEL */}
        <div
          className={`flex min-h-0 flex-1 flex-col rounded-[2rem] border ${theme.border} ${theme.panelBg} p-3 shadow-sm backdrop-blur-md`}
        >
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <ul className="space-y-2">
              {navItem("dashboard", "Beranda", Home)}
              {navItem("tujuan", "Tujuan Saya", Target)}
              {navItem("statistik", "Statistik", BarChart3)}
              {navItem("riwayat", "Riwayat", History)}
              {navItem("pengaturan", "Pengaturan", Settings)}

              <li className="pt-4">
                <button
                  onClick={() => setPage("pawmodoro")}
                  title={isCollapsed ? "Mulai Fokus" : ""}
                  className={`flex w-full items-center justify-center rounded-3xl p-4 font-black transition-all hover:shadow-xl active:scale-95 ${theme.button}`}
                >
                  <Timer size={20} strokeWidth={2.7} />

                  {!isCollapsed && (
                    <span className="ml-3 text-sm uppercase tracking-wide">
                      Mulai Fokus
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`flex min-w-0 flex-1 flex-col overflow-hidden rounded-[2.5rem] border-4 ${theme.border} ${theme.mainBg} shadow-2xl transition-colors duration-300`}
      >
        {/* TOPBAR */}
        <nav
          className={`flex items-center justify-between gap-4 border-b border-black/5 px-5 py-5 backdrop-blur-md md:px-8 ${theme.topbarBg}`}
        >
          <div className="min-w-0">
            <p className={`mb-1 text-[10px] font-black uppercase tracking-[0.25em] ${theme.muted}`}>
              PurrFocus
            </p>

            <h2 className={`truncate text-2xl font-black tracking-tight ${theme.text}`}>
              {currentPage.title}
            </h2>

            <p className={`mt-1 text-xs font-bold ${theme.muted}`}>
              {currentPage.desc}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-black/5 bg-white/50 p-2 pr-4 shadow-sm backdrop-blur-sm">
            <img
              src={profil}
              alt="Profil"
              className="h-10 w-10 rounded-xl object-cover shadow-sm"
            />

            <div className="hidden text-left sm:block">
              <p className={`text-sm font-black leading-none ${theme.text}`}>
                John Doe
              </p>
              <p className={`mt-1 text-[10px] font-black uppercase tracking-wider ${theme.muted}`}>
                Teman Fokus
              </p>
            </div>
          </div>
        </nav>

        {/* MOBILE NAV */}
        <div
          className={`flex gap-2 overflow-x-auto border-b border-black/5 px-4 py-3 md:hidden ${theme.topbarBg}`}
        >
          <MobileNavButton active={activePage === "dashboard"} onClick={() => setPage("dashboard")} label="Beranda" theme={theme} />
          <MobileNavButton active={activePage === "tujuan"} onClick={() => setPage("tujuan")} label="Tujuan" theme={theme} />
          <MobileNavButton active={activePage === "pawmodoro"} onClick={() => setPage("pawmodoro")} label="Fokus" theme={theme} />
          <MobileNavButton active={activePage === "statistik"} onClick={() => setPage("statistik")} label="Statistik" theme={theme} />
          <MobileNavButton active={activePage === "riwayat"} onClick={() => setPage("riwayat")} label="Riwayat" theme={theme} />
          <MobileNavButton active={activePage === "pengaturan"} onClick={() => setPage("pengaturan")} label="Atur" theme={theme} />
        </div>

        <div className={`flex-1 overflow-y-auto custom-scrollbar ${theme.mainBg}`}>
          {children}
        </div>
      </main>
    </div>
  );
}

function MobileNavButton({ active, onClick, label, theme }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition-all ${
        active ? theme.button : "bg-white/45 text-current"
      }`}
    >
      {label}
    </button>
  );
}

export default Layout;