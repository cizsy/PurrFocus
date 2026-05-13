export const purrThemes = {
  gingerCream: {
    id: "gingerCream",
    title: "Ginger Cream",
    desc: "Hangat, cerah, dan cozy.",
    colors: ["#F2CDA0", "#FFF6EB", "#D8893A"],
    isDark: false,

    appBg: "bg-[#F2CDA0]",
    mainBg: "bg-[#FFF6EB]",

    // Panel dibuat sedikit lebih pekat agar card putih di dalamnya tidak nyaru
    panelBg: "bg-[#F9E8D6]", 
    cardBg: "bg-[#FFFFFF]",
    cardSoft: "bg-[#F0D5BB]",
    cardStrong: "bg-white",

    topbarBg: "bg-[#FFF6EB]/90",

    active: "bg-white text-[#2F241B] shadow-lg shadow-[#B86D2B]/10",
    navText: "text-[#8C6445]/80 hover:text-[#2F241B] hover:bg-white/40",
    button: "bg-[#D8893A] hover:bg-[#B86D2B] text-white",

    text: "text-[#2F241B]",
    muted: "text-[#9B7A5E]",

    border: "border-[#EAD3BD]",
    divider: "border-[#EEDDCC]",
    ring: "ring-[#D8893A]/30",
  },

  blackSmoke: {
    id: "blackSmoke",
    title: "Black Smoke",
    desc: "Gelap, tenang, cocok untuk fokus malam.",
    colors: ["#0C0C0C", "#141312", "#D9B98F"],
    isDark: true,

    appBg: "bg-[#0C0C0C]",
    mainBg: "bg-[#141312]",

    panelBg: "bg-[#1C1A19]",
    cardBg: "bg-[#252220]",
    cardSoft: "bg-[#2A2724]",
    cardStrong: "bg-[#332E2B]",

    topbarBg: "bg-[#141312]/95",

    active: "bg-[#332E2B] text-white shadow-lg shadow-black/30",
    navText: "text-white/60 hover:text-white hover:bg-white/10",
    button: "bg-[#D9B98F] hover:bg-[#F3D7AD] text-[#141312]",

    text: "text-[#F8EFE2]",
    muted: "text-[#A79C8E]",

    border: "border-[#2E2A26]",
    divider: "border-[#252220]",
    ring: "ring-[#D9B98F]/30",
  },

  whiteMilk: {
    id: "whiteMilk",
    title: "White Milk",
    desc: "Bersih, lembut, dan minimal.",
    colors: ["#E6E4DF", "#F8F7F4", "#7A7A72"],
    isDark: false,

    appBg: "bg-[#E6E4DF]",
    mainBg: "bg-[#F8F7F4]",

    panelBg: "bg-[#EFECE6]", // Cukup gelap untuk membuat warna putih terlihat jelas
    cardBg: "bg-[#FFFFFF]",
    cardSoft: "bg-[#E6E2DA]",
    cardStrong: "bg-[#FFFFFF]",

    topbarBg: "bg-[#F8F7F4]/95",

    active: "bg-white text-[#2D2C29] shadow-lg shadow-black/5",
    navText: "text-[#7A7770]/80 hover:text-[#2D2C29] hover:bg-white/50",
    button: "bg-[#7A7A72] hover:bg-[#5F5F59] text-white",

    text: "text-[#2D2C29]",
    muted: "text-[#8E8A82]",

    border: "border-[#DCD8CF]",
    divider: "border-[#E5E2DA]",
    ring: "ring-[#7A7A72]/25",
  },

  blueGrey: {
    id: "blueGrey",
    title: "Blue Grey",
    desc: "Kalem, dingin, dan rapi.",
    colors: ["#C7D1D6", "#F0F4F6", "#556975"],
    isDark: false,

    appBg: "bg-[#C7D1D6]",
    mainBg: "bg-[#F0F4F6]",

    panelBg: "bg-[#E3EAEF]",
    cardBg: "bg-[#FFFFFF]",
    cardSoft: "bg-[#D5DFE6]",
    cardStrong: "bg-[#FFFFFF]",

    topbarBg: "bg-[#F0F4F6]/95",

    active: "bg-white text-[#243039] shadow-lg shadow-[#556975]/10",
    navText: "text-[#52646E]/80 hover:text-[#243039] hover:bg-white/50",
    button: "bg-[#556975] hover:bg-[#40535E] text-white",

    text: "text-[#243039]",
    muted: "text-[#71828B]",

    border: "border-[#C6D3DB]",
    divider: "border-[#D6E0E7]",
    ring: "ring-[#556975]/30",
  },

  calicoSoft: {
    id: "calicoSoft",
    title: "Calico Soft",
    desc: "Lembut, hangat, dan punya aksen playful.",
    colors: ["#EAC8B0", "#FFF4EC", "#B55A2A"],
    isDark: false,

    appBg: "bg-[#EAC8B0]",
    mainBg: "bg-[#FFF4EC]",

    panelBg: "bg-[#F5E0D0]",
    cardBg: "bg-[#FFFFFF]",
    cardSoft: "bg-[#E8CDB9]",
    cardStrong: "bg-[#FFFFFF]",

    topbarBg: "bg-[#FFF4EC]/95",

    active: "bg-white text-[#2E241F] shadow-lg shadow-[#B55A2A]/10",
    navText: "text-[#8E6B5A]/80 hover:text-[#2E241F] hover:bg-white/50",
    button: "bg-[#B55A2A] hover:bg-[#8F4726] text-white",

    text: "text-[#2E241F]",
    muted: "text-[#957466]",

    border: "border-[#E0C3AE]",
    divider: "border-[#E8D1C0]",
    ring: "ring-[#B55A2A]/30",
  },

  tuxedoNoir: {
    id: "tuxedoNoir",
    title: "Tuxedo Noir",
    desc: "Kontras, clean, dan elegan.",
    colors: ["#111827", "#F1F5F9", "#111827"],
    isDark: false,

    appBg: "bg-[#111827]",
    mainBg: "bg-[#F1F5F9]",

    panelBg: "bg-[#E2E8F0]",
    cardBg: "bg-[#FFFFFF]",
    cardSoft: "bg-[#CBD5E1]",
    cardStrong: "bg-[#FFFFFF]",

    topbarBg: "bg-[#F1F5F9]/95",

    active: "bg-white text-[#111827] shadow-lg shadow-black/10",
    navText: "text-[#334155]/80 hover:text-[#0F172A] hover:bg-white/50",
    button: "bg-[#111827] hover:bg-[#374151] text-white",

    text: "text-[#0F172A]",
    muted: "text-[#475569]",

    border: "border-[#CBD5E1]",
    divider: "border-[#E2E8F0]",
    ring: "ring-[#111827]/20",
  },

  brownTabby: {
    id: "brownTabby",
    title: "Brown Tabby",
    desc: "Natural, earthy, dan paling cozy.",
    colors: ["#DAB894", "#FDF5ED", "#6B4C2A"],
    isDark: false,

    appBg: "bg-[#DAB894]",
    mainBg: "bg-[#FDF5ED]",

    panelBg: "bg-[#EEDBC5]",
    cardBg: "bg-[#FFFFFF]",
    cardSoft: "bg-[#E0C8AD]",
    cardStrong: "bg-[#FFFFFF]",

    topbarBg: "bg-[#FDF5ED]/95",

    active: "bg-white text-[#2D241B] shadow-lg shadow-[#6B4C2A]/10",
    navText: "text-[#7A5A3A]/80 hover:text-[#2D241B] hover:bg-white/40",
    button: "bg-[#6B4C2A] hover:bg-[#4F3722] text-white",

    text: "text-[#2D241B]",
    muted: "text-[#806951]",

    border: "border-[#D6C0A9]",
    divider: "border-[#E4D1BF]",
    ring: "ring-[#6B4C2A]/30",
  },

  sealPoint: {
    id: "sealPoint",
    title: "Seal Point",
    desc: "Hangat, lembut, dan sedikit elegan.",
    colors: ["#D8C2B0", "#FDF8F4", "#52413A"],
    isDark: false,

    appBg: "bg-[#D8C2B0]",
    mainBg: "bg-[#FDF8F4]",

    panelBg: "bg-[#EBE0D6]",
    cardBg: "bg-[#FFFFFF]",
    cardSoft: "bg-[#DECFC2]",
    cardStrong: "bg-[#FFFFFF]",

    topbarBg: "bg-[#FDF8F4]/95",

    active: "bg-white text-[#2E2522] shadow-lg shadow-[#52413A]/10",
    navText: "text-[#7B5F52]/80 hover:text-[#2E2522] hover:bg-white/40",
    button: "bg-[#52413A] hover:bg-[#332822] text-white",

    text: "text-[#2E2522]",
    muted: "text-[#8E7468]",

    border: "border-[#D4C4B8]",
    divider: "border-[#E2D6CB]",
    ring: "ring-[#52413A]/30",
  },
};

export const themeOptions = Object.values(purrThemes);

export const DEFAULT_THEME = "gingerCream";