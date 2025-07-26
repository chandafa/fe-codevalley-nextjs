'use client';

import { useEffect, useRef } from 'react';
import { Navigation } from './navigation';
import { HUD } from './hud';
import { NotificationContainer } from '@/components/ui/notification';
import { useAuthStore, useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { wsManager } from '@/lib/websocket';

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const { isAuthenticated, updateUser, setLoading, accessToken } = useAuthStore();
  const { addNotification } = useGameStore();
  const wsConnected = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await api.auth.me();
          updateUser(response.data.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
      
      // Initialize WebSocket connection
      if (accessToken && !wsConnected.current) {
        wsManager.connect(accessToken);
        wsConnected.current = true;
        
        // Setup WebSocket event listeners
        wsManager.on('quest_update', (data) => {
          addNotification({
            id: Date.now().toString(),
            type: 'info',
            title: 'Quest Updated',
            message: `Quest "${data.title}" has been updated`,
          });
        });
        
        wsManager.on('friend_request', (data) => {
          addNotification({
            id: Date.now().toString(),
            type: 'info',
            title: 'Friend Request',
            message: `${data.username} sent you a friend request`,
          });
        });
        
        wsManager.on('achievement_unlocked', (data) => {
          addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Achievement Unlocked! 🏆',
            message: `You earned: ${data.title}`,
          });
        });
        
        wsManager.on('level_up', (data) => {
          updateUser({ level: data.new_level, exp: data.new_exp });
          addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Level Up! 🎉',
            message: `Congratulations! You reached level ${data.new_level}`,
          });
        });
      }
    }
    
    return () => {
      if (wsConnected.current) {
        wsManager.disconnect();
        wsConnected.current = false;
      }
    };
  }, [isAuthenticated, updateUser, setLoading, accessToken, addNotification]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:ml-64">
        <HUD />
        <main className="pt-16 lg:pt-20 p-4 lg:p-8">
          {children}
        </main>
      </div>
      <NotificationContainer />
    </div>
  );
}