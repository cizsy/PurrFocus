import { DEFAULT_THEME, purrThemes } from "../components/purrThemes";

export function getSavedThemeName() {
  try {
    const savedSettings = JSON.parse(
      localStorage.getItem("purrfocus_settings") || "{}"
    );

    return savedSettings.theme || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function usePurrTheme() {
  const themeName = getSavedThemeName();
  const theme = purrThemes[themeName] || purrThemes[DEFAULT_THEME];

  return {
    themeName,
    theme,
    isDarkTheme: theme.isDark,
    catColor: theme.isDark ? "white" : "black",
  };
}