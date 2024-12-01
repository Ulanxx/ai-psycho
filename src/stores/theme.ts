import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
}

export const useThemeStore = create<ThemeState>(() => ({
  isDark: true,
}));