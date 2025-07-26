'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Map,
  Users,
  Code,
  Trophy,
  Calendar,
  TrendingUp,
  ArrowRight,
  Star,
  Target,
  Gamepad2,
  ShoppingCart,
  Shield,
  UserCheck,
  Settings,
  BarChart3,
  Users2,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GameLayout } from '@/components/layout/game-layout';
import { useAuthStore, useGameStore } from '@/lib/store';
import { api } from '@/lib/api';

// Admin Dashboard Component
function AdminDashboard() {
  const { user } = useAuthStore();
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalQuests: 0,
    completedQuests: 0,
    totalGuilds: 0,
    systemHealth: 'good',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.admin.stats();
        setAdminStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const adminActions = [
    {
      title: 'Kelola Pengguna',
      description: 'Manage user accounts and permissions',
      icon: Users2,
      href: '/admin/users',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Kelola Quest',
      description: 'Create and manage game quests',
      icon: Target,
      href: '/admin/quests',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Analytics',
      description: 'View system analytics and reports',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'System Logs',
      description: 'Monitor system activities',
      icon: AlertTriangle,
      href: '/admin/logs',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Pengaturan',
      description: 'System configuration',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-gray-500 to-gray-600',
    },
    {
      title: 'Guild Management',
      description: 'Manage guilds and communities',
      icon: Shield,
      href: '/admin/guilds',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Admin Dashboard - {user?.username}
            </h1>
            <p className="text-red-100 text-lg">
              Kelola sistem Code Valley dengan mudah
            </p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <div className="flex items-center gap-2 text-yellow-200 mb-1">
              <Settings className="w-5 h-5" />
              <span className="font-semibold">Administrator</span>
            </div>
            <p className="text-sm text-red-100">
              System Status: {adminStats.systemHealth === 'good' ? '✅ Healthy' : '⚠️ Issues'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Admin Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{adminStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {adminStats.activeUsers} active today
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quests</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{adminStats.totalQuests}</div>
              <p className="text-xs text-muted-foreground">
                {adminStats.completedQuests} completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Guilds</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{adminStats.totalGuilds}</div>
              <p className="text-xs text-muted-foreground">
                Communities active
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {adminStats.systemHealth === 'good' ? '100%' : '85%'}
              </div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Admin Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link href={action.href}>
                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    <div className="flex items-center text-sm font-medium text-blue-600">
                      Kelola
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Player Dashboard Component
function PlayerDashboard() {
  const { user } = useAuthStore();
  const { setQuests, setActiveQuests, setDailyTasks, dailyTasks, addNotification } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    questsCompleted: 0,
    totalQuests: 0,
    activeQuests: 0,
    dailyTasksCompleted: 0,
    totalDailyTasks: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch quests
        const questsResponse = await api.quests.list();
        const quests = questsResponse.data.data;
        setQuests(quests);
        
        const activeQuests = quests.filter((q: any) => q.status === 'active');
        const completedQuests = quests.filter((q: any) => q.status === 'completed');
        setActiveQuests(activeQuests);
        
        // Fetch daily tasks
        const dailyTasksResponse = await api.dailyTasks.today();
        const tasks = dailyTasksResponse.data.data;
        setDailyTasks(tasks);
        
        const completedTasks = tasks.filter((t: any) => t.completed);
        
        setStats({
          questsCompleted: completedQuests.length,
          totalQuests: quests.length,
          activeQuests: activeQuests.length,
          dailyTasksCompleted: completedTasks.length,
          totalDailyTasks: tasks.length,
        });
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat data dashboard',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [setQuests, setActiveQuests, setDailyTasks, addNotification]);

  const quickActions = [
    {
      title: 'Jelajahi Quest',
      description: 'Temukan tantangan coding baru',
      icon: Map,
      href: '/quests',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Mini Games',
      description: 'Test your coding skills',
      icon: Gamepad2,
      href: '/minigames',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Shop',
      description: 'Upgrade your tools',
      icon: ShoppingCart,
      href: '/shop',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Friends',
      description: 'Connect with others',
      icon: UserCheck,
      href: '/friends',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Guilds',
      description: 'Join a community',
      icon: Shield,
      href: '/guilds',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Code Editor',
      description: 'Practice coding',
      icon: Code,
      href: '/editor',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Selamat datang kembali, {user?.username}!
            </h1>
            <p className="text-blue-100 text-base lg:text-lg">
              Siap untuk petualangan coding hari ini?
            </p>
          </div>
          <div className="mt-4 lg:mt-0 text-right">
            <div className="flex items-center gap-2 text-yellow-200 mb-1">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold">Level {user?.level}</span>
            </div>
            <p className="text-sm text-blue-100">
              {user?.exp} / {user?.exp_to_next} XP
            </p>
            <div className="w-32 bg-blue-400/30 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${user ? (user.exp / (user.exp_to_next || 1)) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Quest Aktif</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-blue-600">{stats.activeQuests}</div>
              <p className="text-xs text-muted-foreground">
                {stats.questsCompleted}/{stats.totalQuests} completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Daily Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-green-600">
                {stats.dailyTasksCompleted}/{stats.totalDailyTasks}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalDailyTasks > 0 
                  ? `${Math.round((stats.dailyTasksCompleted / stats.totalDailyTasks) * 100)}% completed`
                  : 'No tasks today'
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Total XP</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-purple-600">{user?.exp || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.round((user?.exp || 0) * 0.1)} this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium">Streak</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-yellow-600">7</div>
              <p className="text-xs text-muted-foreground">
                days coding streak
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link href={action.href}>
                <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardContent className="p-4 lg:p-6">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-3 lg:mb-4`}>
                      <action.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">{action.title}</h3>
                    <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4 line-clamp-2">{action.description}</p>
                    <div className="flex items-center text-xs lg:text-sm font-medium text-blue-600">
                      Mulai
                      <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Tasks Progress */}
      {dailyTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Daily Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyTasks.slice(0, 3).map((task, index) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm lg:text-base">{task.title}</h4>
                      <p className="text-xs lg:text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="ml-4 w-24 lg:w-32">
                      <ProgressBar
                        value={task.progress}
                        max={task.max_progress}
                        color={task.completed ? 'green' : 'blue'}
                        showValue={false}
                      />
                    </div>
                  </div>
                ))}
                {dailyTasks.length > 3 && (
                  <div className="text-center pt-4 border-t">
                    <Link href="/daily-tasks">
                      <Button variant="outline" size="sm">
                        Lihat Semua Tasks
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Code Valley Map Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-600" />
              Code Valley Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-6 lg:p-8 text-center">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/80 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium">Village Center</span>
                </div>
                <div className="bg-white/80 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium">Code Forest</span>
                </div>
                <div className="bg-white/80 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium">Debug Cave</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm lg:text-base">
                Jelajahi berbagai area di Code Valley untuk menemukan quest dan tantangan baru!
              </p>
              <Link href="/map">
                <Button>
                  Jelajahi Map
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <GameLayout>
      {user?.role === 'admin' ? <AdminDashboard /> : <PlayerDashboard />}
    </GameLayout>
  );
}