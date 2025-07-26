import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, Quest, InventoryItem, DailyTask, Achievement, Friend, Guild, 
  Notification, Skill, Event, MiniGame, ShopItem, Tutorial, Badge,
  UserStatistics, LeaderboardEntry, MarketplaceListing, DailyReward
} from '@/types/api';

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

interface FriendsState {
  friends: Friend[];
  onlineFriends: Friend[];
  friendRequests: Friend[];
  setFriends: (friends: Friend[]) => void;
  setOnlineFriends: (friends: Friend[]) => void;
  setFriendRequests: (requests: Friend[]) => void;
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
}

interface GuildState {
  currentGuild: Guild | null;
  guilds: Guild[];
  guildMembers: any[];
  setCurrentGuild: (guild: Guild | null) => void;
  setGuilds: (guilds: Guild[]) => void;
  setGuildMembers: (members: any[]) => void;
}

interface GameState {
  quests: Quest[];
  activeQuests: Quest[];
  inventory: InventoryItem[];
  dailyTasks: DailyTask[];
  achievements: Achievement[];
  badges: Badge[];
  skills: Skill[];
  events: Event[];
  miniGames: MiniGame[];
  shopItems: ShopItem[];
  tutorials: Tutorial[];
  marketplaceListings: MarketplaceListing[];
  dailyRewards: DailyReward[];
  statistics: UserStatistics | null;
  leaderboards: {
    coins: LeaderboardEntry[];
    exp: LeaderboardEntry[];
    tasks: LeaderboardEntry[];
  };
  notifications: GameNotification[];
  setQuests: (quests: Quest[]) => void;
  setActiveQuests: (quests: Quest[]) => void;
  setInventory: (items: InventoryItem[]) => void;
  setDailyTasks: (tasks: DailyTask[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setBadges: (badges: Badge[]) => void;
  setSkills: (skills: Skill[]) => void;
  setEvents: (events: Event[]) => void;
  setMiniGames: (games: MiniGame[]) => void;
  setShopItems: (items: ShopItem[]) => void;
  setTutorials: (tutorials: Tutorial[]) => void;
  setMarketplaceListings: (listings: MarketplaceListing[]) => void;
  setDailyRewards: (rewards: DailyReward[]) => void;
  setStatistics: (stats: UserStatistics) => void;
  setLeaderboards: (type: 'coins' | 'exp' | 'tasks', entries: LeaderboardEntry[]) => void;
  addNotification: (notification: GameNotification) => void;
  removeNotification: (id: string) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  updateQuest: (quest: Quest) => void;
}

interface GameNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
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

export const useFriendsStore = create<FriendsState>((set) => ({
  friends: [],
  onlineFriends: [],
  friendRequests: [],
  setFriends: (friends) => set({ friends }),
  setOnlineFriends: (onlineFriends) => set({ onlineFriends }),
  setFriendRequests: (friendRequests) => set({ friendRequests }),
  addFriend: (friend) => set((state) => ({ 
    friends: [...state.friends, friend] 
  })),
  removeFriend: (friendId) => set((state) => ({
    friends: state.friends.filter(f => f.id !== friendId),
    onlineFriends: state.onlineFriends.filter(f => f.id !== friendId),
  })),
}));

export const useGuildStore = create<GuildState>((set) => ({
  currentGuild: null,
  guilds: [],
  guildMembers: [],
  setCurrentGuild: (currentGuild) => set({ currentGuild }),
  setGuilds: (guilds) => set({ guilds }),
  setGuildMembers: (guildMembers) => set({ guildMembers }),
}));

export const useGameStore = create<GameState>((set) => ({
  quests: [],
  activeQuests: [],
  inventory: [],
  dailyTasks: [],
  achievements: [],
  badges: [],
  skills: [],
  events: [],
  miniGames: [],
  shopItems: [],
  tutorials: [],
  marketplaceListings: [],
  dailyRewards: [],
  statistics: null,
  leaderboards: {
    coins: [],
    exp: [],
    tasks: [],
  },
  notifications: [],
  setQuests: (quests) => set({ quests }),
  setActiveQuests: (activeQuests) => set({ activeQuests }),
  setInventory: (inventory) => set({ inventory }),
  setDailyTasks: (dailyTasks) => set({ dailyTasks }),
  setAchievements: (achievements) => set({ achievements }),
  setBadges: (badges) => set({ badges }),
  setSkills: (skills) => set({ skills }),
  setEvents: (events) => set({ events }),
  setMiniGames: (miniGames) => set({ miniGames }),
  setShopItems: (shopItems) => set({ shopItems }),
  setTutorials: (tutorials) => set({ tutorials }),
  setMarketplaceListings: (marketplaceListings) => set({ marketplaceListings }),
  setDailyRewards: (dailyRewards) => set({ dailyRewards }),
  setStatistics: (statistics) => set({ statistics }),
  setLeaderboards: (type, entries) => set((state) => ({
    leaderboards: { ...state.leaderboards, [type]: entries }
  })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  updateInventoryItem: (item) =>
    set((state) => ({
      inventory: state.inventory.map(i => i.id === item.id ? item : i),
    })),
  updateQuest: (quest) =>
    set((state) => ({
      quests: state.quests.map(q => q.id === quest.id ? quest : q),
      activeQuests: state.activeQuests.map(q => q.id === quest.id ? quest : q),
    })),
}));

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({ 
    notifications,
    unreadCount: notifications.filter(n => !n.is_read).length,
  }),
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: !notification.is_read ? state.unreadCount + 1 : state.unreadCount,
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, is_read: true })),
    unreadCount: 0,
  })),
  removeNotification: (id) => set((state) => {
    const notification = state.notifications.find(n => n.id === id);
    return {
      notifications: state.notifications.filter(n => n.id !== id),
      unreadCount: notification && !notification.is_read 
        ? Math.max(0, state.unreadCount - 1) 
        : state.unreadCount,
    };
  }),
}));