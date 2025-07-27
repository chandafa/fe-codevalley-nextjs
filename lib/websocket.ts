import { WebSocketMessage } from '@/types/api';
import { useAuthStore, useGameStore, useFriendsStore, useNotificationStore } from './store';

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private isConnecting = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws?token=${encodeURIComponent(token)}`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.setupEventHandlers();
        
        // Send ping to keep connection alive
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.stopPingInterval();
        
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect(token);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  private setupEventHandlers() {
    // Handle real-time events from backend
    this.on('player_position_update', (data) => {
      // Handle other players' position updates
      console.log('Player position update:', data);
    });

    this.on('world_object_update', (data) => {
      // Handle world object changes (trees chopped, etc.)
      console.log('World object update:', data);
    });

    this.on('npc_position_update', (data) => {
      // Handle NPC movement
      console.log('NPC position update:', data);
    });

    this.on('time_update', (data) => {
      // Handle game time progression
      console.log('Time update:', data);
    });

    this.on('season_change', (data) => {
      // Handle seasonal changes
      console.log('Season change:', data);
    });

    this.on('interaction_result', (data) => {
      // Handle interaction results
      console.log('Interaction result:', data);
    });

    this.on('quest_update', (data) => {
      const { updateQuest } = useGameStore.getState();
      updateQuest(data);
    });

    this.on('friend_request', (data) => {
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        id: Date.now().toString(),
        type: 'friend_request',
        title: 'Friend Request',
        message: `${data.username} sent you a friend request`,
        is_read: false,
        created_at: new Date().toISOString(),
        data: data
      });
    });

    this.on('achievement_unlocked', (data) => {
      const { addNotification } = useGameStore.getState();
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Achievement Unlocked!',
        message: `You earned: ${data.title}`,
      });
    });

    this.on('level_up', (data) => {
      const { updateUser } = useAuthStore.getState();
      const { addNotification } = useGameStore.getState();
      
      updateUser({ level: data.new_level, exp: data.new_exp });
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Level Up!',
        message: `Congratulations! You reached level ${data.new_level}`,
      });
    });

    this.on('user_status', (data) => {
      const { setOnlineFriends } = useFriendsStore.getState();
      setOnlineFriends(data.online_friends);
    });

    this.on('dm_message', (data) => {
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        id: Date.now().toString(),
        type: 'friend_request',
        title: 'New Message',
        message: `${data.from}: ${data.message}`,
        is_read: false,
        created_at: new Date().toISOString(),
        data: data
      });
    });

    this.on('guild_invitation', (data) => {
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        id: Date.now().toString(),
        type: 'guild',
        title: 'Guild Invitation',
        message: `You've been invited to join ${data.guild_name}`,
        is_read: false,
        created_at: new Date().toISOString(),
        data: data
      });
    });

    this.on('notification', (data) => {
      const { addNotification } = useNotificationStore.getState();
      addNotification(data);
    });
  }

  private pingInterval: NodeJS.Timeout | null = null;

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', {});
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect(token: string) {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect(token);
    }, delay);
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type) || [];
    listeners.forEach(listener => {
      try {
        listener(message.data);
      } catch (error) {
        console.error(`Error in WebSocket listener for ${message.type}:`, error);
      }
    });
  }

  send(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Cannot send message:', type);
    }
  }

  on(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  off(eventType: string, callback: (data: any) => void) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  disconnect() {
    this.stopPingInterval();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsManager = new WebSocketManager();