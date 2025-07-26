import axios, { AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data.data;
        localStorage.setItem("accessToken", access_token);

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event("auth-error"));
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  auth: {
    register: (data: { username: string; email: string; password: string }) =>
      apiClient.post<ApiResponse<{ user: any; access_token: string; refresh_token: string }>>('/api/v1/auth/register', data),
    
    login: (data: { email: string; password: string }) =>
      apiClient.post<ApiResponse<{ user: any; access_token: string; refresh_token: string }>>('/api/v1/auth/login', data),
    
    logout: () =>
      apiClient.post<ApiResponse<null>>('/api/v1/auth/logout'),
    
    me: () =>
      apiClient.get<ApiResponse<any>>('/api/v1/auth/me'),
    
    updateProfile: (data: any) =>
      apiClient.put<ApiResponse<any>>('/api/v1/auth/profile', data),
    
    uploadAvatar: (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return apiClient.post<ApiResponse<{ avatar_url: string }>>('/api/v1/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    
    deleteAccount: () =>
      apiClient.delete<ApiResponse<null>>('/api/v1/auth/delete'),
  },

  // Quest endpoints
  quests: {
    list: (params?: { page?: number; per_page?: number }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/quests', { params }),
    
    details: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/quests/${id}`),
    
    start: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/quests/${id}/start`),
    
    complete: (id: string, data?: { submitted_items?: Record<string, number> }) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/quests/${id}/complete`, data),
    
    progress: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/quests/progress'),
  },

  // Friends system
  friends: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/friends'),
    
    add: (username: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/friends/${username}/add`),
    
    accept: (username: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/friends/${username}/accept`),
    
    remove: (username: string) =>
      apiClient.delete<ApiResponse<any>>(`/api/v1/friends/${username}/remove`),
    
    online: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/friends/online'),
  },

  // Leaderboard
  leaderboard: {
    coins: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/leaderboard/coins'),
    
    exp: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/leaderboard/exp'),
    
    tasks: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/leaderboard/tasks'),
  },

  // Shop & Economy
  shop: {
    items: (params?: { page?: number; per_page?: number }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/shop/items', { params }),
    
    buy: (id: string, quantity: number) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/shop/items/${id}/buy`, { quantity }),
    
    sell: (id: string, quantity: number) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/shop/items/${id}/sell`, { quantity }),
  },

  // Inventory endpoints
  inventory: {
    get: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/inventory'),
    
    getItem: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/inventory/${id}`),
    
    use: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/inventory/use/${id}`),
    
    equip: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/inventory/equip/${id}`),
    
    unequip: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/inventory/unequip/${id}`),
  },

  // Notifications
  notifications: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/notifications'),
    
    markRead: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/notifications/${id}/read`),
    
    markAllRead: () =>
      apiClient.post<ApiResponse<any>>('/api/v1/notifications/mark-read'),
  },

  // Messaging
  messages: {
    send: (username: string, message: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/messages/${username}/send`, { message }),
    
    conversations: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/messages/conversations'),
  },

  // Achievements & Badges
  achievements: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/achievements'),
  },

  badges: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/badges'),
  },

  // Skills
  skills: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/skills'),
    
    upgrade: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/skills/${id}/upgrade`),
  },

  // Guilds
  guilds: {
    create: (data: { name: string; description: string; is_public: boolean }) =>
      apiClient.post<ApiResponse<any>>('/api/v1/guilds', data),
    
    list: (params?: { page?: number; per_page?: number }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/guilds', { params }),
    
    details: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/guilds/${id}`),
    
    join: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/guilds/${id}/join`),
    
    leave: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/guilds/${id}/leave`),
    
    invite: (id: string, username: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/guilds/${id}/invite/${username}`),
    
    kick: (id: string, username: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/guilds/${id}/kick/${username}`),
  },

  // Events
  events: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/events'),
    
    details: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/events/${id}`),
    
    join: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/events/${id}/join`),
    
    complete: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/events/${id}/complete`),
  },

  // Crafting
  crafting: {
    recipes: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/crafting/recipes'),
    
    execute: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/crafting/${id}/execute`),
  },

  // Mini Games
  miniGames: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/minigames'),
    
    start: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/minigames/${id}/start`),
    
    submit: (id: string, data: { answers: string[]; score: number; time_taken: number }) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/minigames/${id}/submit`, data),
  },

  // Daily Rewards
  dailyRewards: {
    status: () =>
      apiClient.get<ApiResponse<any>>('/api/v1/rewards/daily'),
    
    claim: () =>
      apiClient.post<ApiResponse<any>>('/api/v1/rewards/daily/claim'),
  },

  // Marketplace
  marketplace: {
    listings: (params?: { page?: number; per_page?: number }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/marketplace', { params }),
    
    create: (data: { item_name: string; description: string; price: number; quantity: number }) =>
      apiClient.post<ApiResponse<any>>('/api/v1/marketplace', data),
    
    buy: (id: string, quantity: number) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/marketplace/${id}/buy`, { quantity }),
  },

  // Tutorials
  tutorials: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/tutorials'),
    
    start: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/tutorials/${id}/start`),
    
    complete: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/tutorials/${id}/complete`),
  },

  // Statistics
  stats: {
    me: () =>
      apiClient.get<ApiResponse<any>>('/api/v1/stats/me'),
  },

  // Daily tasks endpoints
  dailyTasks: {
    today: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/daily-tasks/today'),
    
    complete: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/daily-tasks/${id}/complete`),
    
    history: (params?: { page?: number; per_page?: number }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/daily-tasks/history', { params }),
  },

  // NPC endpoints
  npcs: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/npcs'),
    
    details: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/npcs/${id}`),
    
    interact: (id: string, dialogueId?: string, responseId?: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/npcs/${id}/interact`, { dialogue_id: dialogueId, response_id: responseId }),
  },

  // Story endpoints
  story: {
    progress: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/story/progress'),
    
    complete: (chapterId: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/story/${chapterId}/complete`),
  },

  // Code battles endpoints
  codeBattles: {
    list: (params?: { difficulty?: string; language?: string }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/code-battles', { params }),
    
    start: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/code-battles/${id}/start`),
    
    details: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/code-battles/${id}`),
    
    submit: (id: string, solution: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/code-battles/${id}/submit`, { solution }),
    
    history: (params?: { page?: number; limit?: number }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/code-battles/history', { params }),
  },

  // Admin endpoints
  admin: {
    users: {
      list: (params?: { page?: number; per_page?: number }) =>
        apiClient.get<PaginatedResponse<any>>('/api/v1/admin/users', { params }),
      
      ban: (id: string, reason: string, duration: number) =>
        apiClient.put<ApiResponse<any>>(`/api/v1/admin/users/${id}/ban`, { reason, duration }),
      
      changeRole: (id: string, role: string) =>
        apiClient.put<ApiResponse<any>>(`/api/v1/admin/users/${id}/role`, { role }),
    },
    
    stats: () =>
      apiClient.get<ApiResponse<any>>('/api/v1/admin/stats'),
    
    logs: (params?: { page?: number; per_page?: number }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/admin/logs', { params }),
    
    quests: {
      create: (data: any) =>
        apiClient.post<ApiResponse<any>>('/api/v1/admin/quests', data),
    },
  },
};

export default apiClient;