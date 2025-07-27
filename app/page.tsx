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
  BookOpen,
  Gamepad2,
  Star,
  Heart,
  Zap,
  Target,
  Gift,
  HelpCircle,
  PlayCircle,
  Sparkles,
  Rocket,
  Shield,
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
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
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
      const { user, access_token, refresh_token } = response.data.data;
      
      login(user, access_token, refresh_token);
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
      const { user, access_token, refresh_token } = response.data.data;
      
      login(user, access_token, refresh_token);
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
      title: 'Belajar Coding Interaktif',
      description: 'Editor code real-time dengan tantangan programming yang seru dan mudah dipahami',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Berteman & Berkolaborasi',
      description: 'Temukan teman baru, bergabung dengan guild, dan belajar bersama komunitas',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Trophy,
      title: 'Sistem Achievement',
      description: 'Kumpulkan badge, unlock achievement, dan naik level dengan menyelesaikan quest',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Gamepad2,
      title: 'Mini Games Seru',
      description: 'Quiz programming, puzzle logic, dan tantangan coding yang menghibur',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Tutorial Lengkap',
      description: 'Panduan step-by-step dari basic hingga advanced dengan video dan praktek',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Gift,
      title: 'Reward Harian',
      description: 'Login setiap hari untuk mendapatkan coins, items, dan bonus XP',
      color: 'from-red-500 to-pink-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah, 16 tahun',
      role: 'Pelajar SMA',
      message: 'Code Valley bikin belajar programming jadi seru banget! Sekarang aku udah bisa bikin website sendiri.',
      avatar: '👩‍🎓',
    },
    {
      name: 'Budi, Mahasiswa',
      role: 'Teknik Informatika',
      message: 'Game ini perfect buat yang mau belajar coding sambil have fun. Quest-questnya challenging tapi gak bikin stress.',
      avatar: '👨‍💻',
    },
    {
      name: 'Ibu Rina, 35 tahun',
      role: 'Ibu Rumah Tangga',
      message: 'Sebagai pemula, aku terbantu banget sama tutorial yang mudah dimengerti. Sekarang aku bisa coding!',
      avatar: '👩‍💼',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 left-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-40 right-20 w-12 h-12 bg-green-400 rounded-full opacity-20"
          />
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-40 left-20 w-20 h-20 bg-purple-400 rounded-full opacity-20"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Code className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                Selamat Datang di{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Code Valley
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                🎮 Belajar programming sambil bermain di dunia digital yang seru! 
                Cocok untuk <span className="font-semibold text-blue-600">anak-anak</span>, 
                <span className="font-semibold text-green-600"> pelajar</span>, 
                <span className="font-semibold text-purple-600"> mahasiswa</span>, dan 
                <span className="font-semibold text-orange-600"> siapa saja</span> yang ingin belajar coding! ✨
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                  onClick={() => setAuthMode('register')}
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  Mulai Petualangan Gratis!
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 hover:bg-gray-50"
                  onClick={() => setShowVideo(true)}
                >
                  <PlayCircle className="w-6 h-6 mr-3" />
                  Lihat Video Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600">Pelajar Aktif</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Quest Seru</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-purple-600">50+</div>
                  <div className="text-sm text-gray-600">Mini Games</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Kenapa Pilih Code Valley? 🤔
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Platform belajar programming yang dirancang khusus untuk membuat coding jadi mudah, seru, dan menyenangkan!
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Cara Bermain di Code Valley 🎯
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hanya 3 langkah mudah untuk memulai petualangan coding kamu!
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Daftar & Buat Karakter',
                description: 'Buat akun gratis dan customize avatar kamu. Pilih nama yang keren untuk petualangan coding!',
                icon: User,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: '2',
                title: 'Mulai Quest Pertama',
                description: 'Ikuti tutorial interaktif dan selesaikan quest pertama kamu. Dapatkan XP dan coins!',
                icon: Target,
                color: 'from-green-500 to-emerald-500',
              },
              {
                step: '3',
                title: 'Level Up & Explore',
                description: 'Naik level, unlock fitur baru, berteman dengan player lain, dan jadi master programmer!',
                icon: Star,
                color: 'from-purple-500 to-pink-500',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto shadow-2xl`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Kata Mereka Tentang Code Valley 💬
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ribuan pelajar sudah merasakan serunya belajar coding di Code Valley!
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-6xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.message}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Siap Memulai Petualangan Coding? 🚀
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pelajar lainnya dan mulai perjalanan menjadi programmer handal!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                onClick={() => setAuthMode('register')}
              >
                <Play className="w-6 h-6 mr-3" />
                Daftar Sekarang - GRATIS!
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-2xl"
                onClick={() => setAuthMode('login')}
              >
                Sudah Punya Akun?
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Butuh Bantuan? 🤝
            </h2>
            <p className="text-gray-600 mb-8">
              Tim support kami siap membantu kamu 24/7. Jangan ragu untuk bertanya!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="rounded-xl">
                <HelpCircle className="w-5 h-5 mr-2" />
                FAQ & Panduan
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl">
                <Mail className="w-5 h-5 mr-2" />
                Hubungi Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {authMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setAuthMode(null);
                loginForm.reset();
                registerForm.reset();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
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
                    ? 'Lanjutkan petualangan coding kamu' 
                    : 'Mulai petualangan coding kamu sekarang'}
                </p>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10 h-12 text-base rounded-xl"
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
                    <Label htmlFor="password" className="text-base font-medium">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className="pl-10 pr-10 h-12 text-base rounded-xl"
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-base font-semibold rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Masuk'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-base font-medium"
                      onClick={() => setAuthMode('register')}
                    >
                      Belum punya akun? Daftar sekarang
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
                  <div>
                    <Label htmlFor="username" className="text-base font-medium">Username</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="username"
                        type="text"
                        className="pl-10 h-12 text-base rounded-xl"
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
                    <Label htmlFor="reg-email" className="text-base font-medium">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="reg-email"
                        type="email"
                        className="pl-10 h-12 text-base rounded-xl"
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
                    <Label htmlFor="reg-password" className="text-base font-medium">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        className="pl-10 pr-10 h-12 text-base rounded-xl"
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-base font-semibold rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Daftar Gratis'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-base font-medium"
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

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Demo Code Valley</h3>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Video demo akan segera tersedia!</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}