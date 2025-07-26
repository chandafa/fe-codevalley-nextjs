'use client';

import { useEffect } from 'react';
import { Navigation } from './navigation';
import { HUD } from './hud';
import { NotificationContainer } from '@/components/ui/notification';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const { isAuthenticated, updateUser, setLoading } = useAuthStore();

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
    }
  }, [isAuthenticated, updateUser, setLoading]);

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