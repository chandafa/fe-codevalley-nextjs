import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Quest, InventoryItem, DailyTask, Achievement } from '@/types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

interface GameState {
  quests: Quest[];
  activeQuests: Quest[];
  inventory: InventoryItem[];
  dailyTasks: DailyTask[];
  achievements: Achievement[];
  notifications: Notification[];
  setQuests: (quests: Quest[]) => void;
  setActiveQuests: (quests: Quest[]) => void;
  setInventory: (items: InventoryItem[]) => void;
  setDailyTasks: (tasks: DailyTask[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useGameStore = create<GameState>((set) => ({
  quests: [],
  activeQuests: [],
  inventory: [],
  dailyTasks: [],
  achievements: [],
  notifications: [],
  setQuests: (quests) => set({ quests }),
  setActiveQuests: (activeQuests) => set({ activeQuests }),
  setInventory: (inventory) => set({ inventory }),
  setDailyTasks: (dailyTasks) => set({ dailyTasks }),
  setAchievements: (achievements) => set({ achievements }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));