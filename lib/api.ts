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
          // Jika tidak ada refresh token, langsung gagalkan saja
          throw new Error("No refresh token available");
        }
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {
            refreshToken,
          }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);

        // Atur header untuk request yang diulang
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // window.location.href = '/';

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
      apiClient.post<ApiResponse<{ user: any; accessToken: string; refreshToken: string }>>('/api/v1/auth/register', data),
    
    login: (data: { email: string; password: string }) =>
      apiClient.post<ApiResponse<{ user: any; accessToken: string; refreshToken: string }>>('/api/v1/auth/login', data),
    
    me: () =>
      apiClient.get<ApiResponse<any>>('/api/v1/auth/me'),
    
    updateProfile: (data: any) =>
      apiClient.put<ApiResponse<any>>('/api/v1/auth/profile', data),
  },

  // Quest endpoints
  quests: {
    list: (params?: { difficulty?: string; category?: string; status?: string }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/quests', { params }),
    
    details: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/quests/${id}`),
    
    start: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/quests/${id}/start`),
    
    complete: (id: string, data?: any) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/quests/${id}/complete`, data),
    
    progress: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/quests/${id}/progress`),
  },

  // Inventory endpoints
  inventory: {
    get: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/inventory'),
    
    add: (itemId: string, quantity: number) =>
      apiClient.post<ApiResponse<any>>('/api/v1/inventory/add', { itemId, quantity }),
    
    use: (itemId: string, quantity?: number) =>
      apiClient.post<ApiResponse<any>>('/api/v1/inventory/use', { itemId, quantity }),
    
    remove: (itemId: string, quantity: number) =>
      apiClient.delete<ApiResponse<any>>('/api/v1/inventory/remove', { data: { itemId, quantity } }),
  },

  // NPC endpoints
  npcs: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/npcs'),
    
    details: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/api/v1/npcs/${id}`),
    
    interact: (id: string, dialogueId?: string, responseId?: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/npcs/${id}/interact`, { dialogueId, responseId }),
  },

  // Daily tasks endpoints
  dailyTasks: {
    today: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/daily-tasks/today'),
    
    complete: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/daily-tasks/${id}/complete`),
    
    history: (params?: { page?: number; limit?: number }) =>
      apiClient.get<PaginatedResponse<any>>('/api/v1/daily-tasks/history', { params }),
  },

  // Achievements endpoints
  achievements: {
    list: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/achievements'),
    
    unlocked: () =>
      apiClient.get<ApiResponse<any[]>>('/api/v1/achievements/unlocked'),
    
    check: (id: string) =>
      apiClient.post<ApiResponse<any>>(`/api/v1/achievements/${id}/check`),
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
};

export default apiClient;