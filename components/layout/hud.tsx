'use client';

import { useEffect, useState } from 'react';
import { Bell, Clock, Coins, Users, Wifi, WifiOff } from 'lucide-react';
import { XPBar } from '@/components/ui/xp-bar';
import { useAuthStore, useGameStore, useFriendsStore } from '@/lib/store';
import { api } from '@/lib/api';
import { wsManager } from '@/lib/websocket';

export function HUD() {
  const { user } = useAuthStore();
  const { dailyTasks, notifications } = useGameStore();
  const { onlineFriends } = useFriendsStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setUnreadNotifications(notifications.length);
  }, [notifications]);

  useEffect(() => {
    const checkConnection = () => {
      setIsOnline(wsManager.isConnected());
    };
    
    const interval = setInterval(checkConnection, 5000);
    checkConnection();
    
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const totalTasks = dailyTasks.length;

  return (
    <div className="fixed top-0 left-0 lg:left-64 right-0 bg-white border-b border-gray-200 shadow-sm z-30">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Left: User info and XP */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-gray-900">{user.username}</h2>
              <p className="text-xs text-gray-500">Level {user.level}</p>
              <div className="flex items-center gap-1 text-xs">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-red-500" />
                    <span className="text-red-500">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-48">
            <XPBar
              currentXP={user.xp}
              nextLevelXP={user.exp_to_next || 1000}
              level={user.level}
              showLevel={false}
            />
          </div>
        </div>

        {/* Right: Stats and notifications */}
        <div className="flex items-center gap-4">
          {/* Online friends count */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              {onlineFriends.length} online
            </span>
          </div>

          {/* User coins */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600 font-medium">
              {user?.coins || 0}
            </span>
          </div>

          {/* Daily tasks progress */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              Tasks: {completedTasks}/{totalTasks}
            </span>
          </div>

          {/* Current time */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">
              {currentTime.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}