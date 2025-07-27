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
  CheckCircle,
  Globe,
  Smartphone,
  Monitor,
  Coffee,
  Award,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const stats = [
    { number: '10K+', label: 'Pelajar Aktif', icon: Users },
    { number: '500+', label: 'Quest Seru', icon: Target },
    { number: '50+', label: 'Mini Games', icon: Gamepad2 },
    { number: '24/7', label: 'Support', icon: Clock },
  ];

  const platforms = [
    { name: 'Web Browser', icon: Globe, description: 'Akses dari browser apapun' },
    { name: 'Mobile App', icon: Smartphone, description: 'Belajar di mana saja' },
    { name: 'Desktop App', icon: Monitor, description: 'Pengalaman optimal' },
  ];

  const testimonials = [
    {
      name: 'Sarah, 16 tahun',
      role: 'Pelajar SMA',
      message: 'Code Valley bikin belajar programming jadi seru banget! Sekarang aku udah bisa bikin website sendiri.',
      avatar: '👩‍🎓',
      rating: 5,
    },
    {
      name: 'Budi, Mahasiswa',
      role: 'Teknik Informatika',
      message: 'Game ini perfect buat yang mau belajar coding sambil have fun. Quest-questnya challenging tapi gak bikin stress.',
      avatar: '👨‍💻',
      rating: 5,
    },
    {
      name: 'Ibu Rina, 35 tahun',
      role: 'Ibu Rumah Tangga',
      message: 'Sebagai pemula, aku terbantu banget sama tutorial yang mudah dimengerti. Sekarang aku bisa coding!',
      avatar: '👩‍💼',
      rating: 5,
    },
    {
      name: 'Ahmad, 14 tahun',
      role: 'Pelajar SMP',
      message: 'Awalnya takut coding itu susah, tapi di Code Valley jadi mudah dan menyenangkan. Recommended banget!',
      avatar: '👦',
      rating: 5,
    },
    {
      name: 'Siti, 22 tahun',
      role: 'Fresh Graduate',
      message: 'Code Valley membantu saya mempersiapkan diri untuk dunia kerja. Skill coding saya meningkat drastis!',
      avatar: '👩‍🎓',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar onLoginClick={() => setAuthMode('login')} onRegisterClick={() => setAuthMode('register')} />
      
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-20 lg:pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 left-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-float"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-40 right-20 w-12 h-12 bg-green-400 rounded-full opacity-20 animate-float"
          />
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-40 left-20 w-20 h-20 bg-purple-400 rounded-full opacity-20 animate-float"
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
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
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

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Selamat Datang di{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Code Valley
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-blue-600 mr-2" />
                      <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Kenapa Pilih Code Valley? 🤔
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Support Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Akses Di Mana Saja 📱💻
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Code Valley tersedia di berbagai platform untuk kemudahan belajar Anda
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <platform.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{platform.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{platform.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Cara Bermain di Code Valley 🎯
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Kata Mereka Tentang Code Valley 💬
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Ribuan pelajar sudah merasakan serunya belajar coding di Code Valley!
              </p>
            </motion.div>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-8 lg:p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-600 text-center"
              >
                <div className="text-8xl mb-6">{testimonials[currentTestimonial].avatar}</div>
                
                {/* Star Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 italic leading-relaxed text-lg lg:text-xl">
                  "{testimonials[currentTestimonial].message}"
                </p>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-500 dark:text-gray-400">{testimonials[currentTestimonial].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Pertanyaan yang Sering Ditanyakan ❓
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Temukan jawaban untuk pertanyaan umum tentang Code Valley
              </p>
            </motion.div>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'Apakah Code Valley benar-benar gratis?',
                answer: 'Ya! Code Valley 100% gratis untuk semua fitur dasar. Kami juga menyediakan premium features untuk pengalaman yang lebih lengkap.',
              },
              {
                question: 'Bahasa programming apa saja yang bisa dipelajari?',
                answer: 'Kami menyediakan tutorial untuk JavaScript, Python, HTML/CSS, React, Node.js, dan masih banyak lagi. Konten terus ditambah setiap bulan!',
              },
              {
                question: 'Apakah cocok untuk pemula yang belum pernah coding?',
                answer: 'Sangat cocok! Code Valley dirancang khusus untuk pemula dengan tutorial step-by-step yang mudah dipahami dan sistem gamifikasi yang menyenangkan.',
              },
              {
                question: 'Bagaimana sistem level dan reward bekerja?',
                answer: 'Setiap kali menyelesaikan quest atau tutorial, kamu akan mendapat XP dan coins. Level up untuk unlock fitur baru dan dapatkan badge keren!',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-8">
                  {faq.answer}
                </p>
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

      {/* Footer */}
      <Footer />

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