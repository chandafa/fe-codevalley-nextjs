'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Play,
  Code,
  Users,
  Trophy,
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuthStore, useGameStore } from '@/lib/store';
import { api } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function LandingPage() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const { addNotification } = useGameStore();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await api.auth.login(data);
      const { user, accessToken, refreshToken } = response.data.data;
      
      login(user, accessToken, refreshToken);
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Selamat datang!',
        message: `Halo ${user.username}, selamat datang di Code Valley!`,
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Login gagal',
        message: error.response?.data?.message || 'Terjadi kesalahan saat login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const response = await api.auth.register(data);
      const { user, accessToken, refreshToken } = response.data.data;
      
      login(user, accessToken, refreshToken);
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Akun berhasil dibuat!',
        message: `Selamat bergabung di Code Valley, ${user.username}!`,
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Registrasi gagal',
        message: error.response?.data?.message || 'Terjadi kesalahan saat membuat akun',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Code,
      title: 'Interactive Coding',
      description: 'Belajar programming dengan editor code interaktif dan tantangan real-time',
    },
    {
      icon: Users,
      title: 'NPC Mentors',
      description: 'Berinteraksi dengan AI mentor dan developer berpengalaman',
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Unlock achievement dan badge untuk setiap pencapaian coding',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Code Valley
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Petualangan seru belajar programming di dunia digital. Kembangkan skill coding sambil menjelajahi desa virtual yang penuh tantangan!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                  onClick={() => setAuthMode('register')}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Mulai Perjalanan
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg"
                  onClick={() => setAuthMode('login')}
                >
                  Sudah Punya Akun?
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rasakan pengalaman belajar coding yang berbeda dengan fitur-fitur inovatif
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {(authMode === 'login' || authMode === 'register') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setAuthMode('login');
                loginForm.reset();
                registerForm.reset();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {authMode === 'login' ? 'Masuk ke Code Valley' : 'Bergabung dengan Code Valley'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {authMode === 'login' 
                    ? 'Lanjutkan petualangan coding Anda' 
                    : 'Mulai petualangan coding Anda sekarang'}
                </p>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        placeholder="your@email.com"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className="pl-10 pr-10"
                        placeholder="Password"
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Masuk'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                      onClick={() => setAuthMode('register')}
                    >
                      Belum punya akun? Daftar sekarang
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="username"
                        type="text"
                        className="pl-10"
                        placeholder="username"
                        {...registerForm.register('username')}
                      />
                    </div>
                    {registerForm.formState.errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="reg-email"
                        type="email"
                        className="pl-10"
                        placeholder="your@email.com"
                        {...registerForm.register('email')}
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        className="pl-10 pr-10"
                        placeholder="Password (min. 6 karakter)"
                        {...registerForm.register('password')}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Daftar'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                      onClick={() => setAuthMode('login')}
                    >
                      Sudah punya akun? Masuk sekarang
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}