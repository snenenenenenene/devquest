import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeColors = {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  "muted-foreground": string
  popover: string
  "popover-foreground": string
  border: string
  input: string
  card: string
  "card-foreground": string
  destructive: string
  "destructive-foreground": string
  "primary-foreground": string
}

export type Theme = {
  id: string
  name: string
  description: string
  category: "system" | "game" | "custom"
  colors: ThemeColors
  projectId?: number
}

type ThemeStore = {
  predefinedThemes: Theme[]
  userThemes: Theme[]
  projectThemes: Theme[]
  currentTheme: string | null
  addUserTheme: (theme: Omit<Theme, "id">) => void
  addProjectTheme: (projectId: number, theme: Omit<Theme, "id" | "projectId">) => void
  setCurrentTheme: (themeId: string) => void
}

const lightTheme: Theme = {
  id: "light",
  name: "Light",
  description: "Clean and minimal light theme",
  category: "system",
  colors: {
    primary: "#0F172A",
    secondary: "#E2E8F0",
    accent: "#0EA5E9",
    background: "#FFFFFF",
    foreground: "#0F172A",
    muted: "#F1F5F9",
    "muted-foreground": "#64748B",
    popover: "#FFFFFF",
    "popover-foreground": "#0F172A",
    border: "#E2E8F0",
    input: "#F8FAFC",
    card: "#FFFFFF",
    "card-foreground": "#0F172A",
    destructive: "#EF4444",
    "destructive-foreground": "#FFFFFF",
    "primary-foreground": "#FFFFFF",
  },
}

const darkTheme: Theme = {
  id: "dark",
  name: "Dark",
  description: "Dark theme for low-light environments",
  category: "system",
  colors: {
    primary: "#0EA5E9",
    secondary: "#1E293B",
    accent: "#0EA5E9",
    background: "#0F172A",
    foreground: "#E2E8F0",
    muted: "#1E293B",
    "muted-foreground": "#94A3B8",
    popover: "#0F172A",
    "popover-foreground": "#E2E8F0",
    border: "#1E293B",
    input: "#1E293B",
    card: "#1E293B",
    "card-foreground": "#E2E8F0",
    destructive: "#EF4444",
    "destructive-foreground": "#FFFFFF",
    "primary-foreground": "#FFFFFF",
  },
}

const systemTheme: Theme = {
  id: "system",
  name: "Automatic",
  description: "Automatically match your system theme",
  category: "system",
  colors: {
    ...lightTheme.colors,
    primary: "#0EA5E9", // Use accent color for better visibility
    "primary-foreground": "#FFFFFF",
  },
}

const minecraftTheme: Theme = {
  id: "minecraft",
  name: "Minecraft",
  description: "Inspired by the blocky world of Minecraft",
  category: "game",
  colors: {
    primary: "#34C759",
    secondary: "#FF9900",
    accent: "#FFC107",
    background: "#2F2F2F",
    foreground: "#FFFFFF",
    muted: "#3F3F3F",
    "muted-foreground": "#BDBDBD",
    popover: "#3F3F3F",
    "popover-foreground": "#FFFFFF",
    border: "#4F4F4F",
    input: "#3F3F3F",
    card: "#3F3F3F",
    "card-foreground": "#FFFFFF",
    destructive: "#FF3737",
    "destructive-foreground": "#FFFFFF",
  },
}

const arcaneViTheme: Theme = {
  id: "arcane-vi",
  name: "Arcane Vi",
  description: "Inspired by Vi from League of Legends: Arcane",
  category: "game",
  colors: {
    primary: "#FF69B4",
    secondary: "#8E24AA",
    accent: "#FFC400",
    background: "#1A1A2E",
    foreground: "#FFFFFF",
    muted: "#2A2A3E",
    "muted-foreground": "#B0B0C0",
    popover: "#2A2A3E",
    "popover-foreground": "#FFFFFF",
    border: "#3A3A4E",
    input: "#2A2A3E",
    card: "#2A2A3E",
    "card-foreground": "#FFFFFF",
    destructive: "#FF3366",
    "destructive-foreground": "#FFFFFF",
  },
}

const arcaneJinxTheme: Theme = {
  id: "arcane-jinx",
  name: "Arcane Jinx",
  description: "Inspired by Jinx from League of Legends: Arcane",
  category: "game",
  colors: {
    primary: "#00C8FF",
    secondary: "#FF99CC",
    accent: "#FF69B4",
    background: "#0A0A1E",
    foreground: "#FFFFFF",
    muted: "#1A1A2E",
    "muted-foreground": "#B0B0C0",
    popover: "#1A1A2E",
    "popover-foreground": "#FFFFFF",
    border: "#2A2A3E",
    input: "#1A1A2E",
    card: "#1A1A2E",
    "card-foreground": "#FFFFFF",
    destructive: "#FF1493",
    "destructive-foreground": "#FFFFFF",
  },
}

const pokemonTheme: Theme = {
  id: "pokemon",
  name: "Pokémon",
  description: "Inspired by the world of Pokémon",
  category: "game",
  colors: {
    primary: "#FF0000",
    secondary: "#3B4CCA",
    accent: "#FFDE00",
    background: "#FFFFFF",
    foreground: "#1A1A1A",
    muted: "#F0F0F0",
    "muted-foreground": "#666666",
    popover: "#FFFFFF",
    "popover-foreground": "#1A1A1A",
    border: "#E0E0E0",
    input: "#F0F0F0",
    card: "#FFFFFF",
    "card-foreground": "#1A1A1A",
    destructive: "#CC0000",
    "destructive-foreground": "#FFFFFF",
  },
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      predefinedThemes: [
        lightTheme,
        darkTheme,
        systemTheme,
        minecraftTheme,
        arcaneViTheme,
        arcaneJinxTheme,
        pokemonTheme,
      ],
      userThemes: [],
      projectThemes: [],
      currentTheme: "system",
      addUserTheme: (theme) =>
        set((state) => ({
          userThemes: [
            ...state.userThemes,
            { ...theme, id: `user-${Date.now()}` },
          ],
        })),
      addProjectTheme: (projectId, theme) =>
        set((state) => ({
          projectThemes: [
            ...state.projectThemes,
            {
              ...theme,
              id: `project-${projectId}-${Date.now()}`,
              projectId,
            },
          ],
        })),
      setCurrentTheme: (themeId) => set({ currentTheme: themeId }),
    }),
    {
      name: "theme-storage",
    }
  )
)
