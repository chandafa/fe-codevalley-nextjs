'use client';

import { motion } from 'framer-motion';
import {
  Code,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Heart,
  ExternalLink,
  BookOpen,
  Users,
  Shield,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Beranda', href: '#home' },
        { name: 'Fitur', href: '#features' },
        { name: 'Cara Bermain', href: '#how-it-works' },
        { name: 'Testimoni', href: '#testimonials' },
      ],
    },
    {
      title: 'Belajar',
      links: [
        { name: 'Tutorial JavaScript', href: '#' },
        { name: 'Tutorial Python', href: '#' },
        { name: 'Tutorial React', href: '#' },
        { name: 'Tutorial Node.js', href: '#' },
      ],
    },
    {
      title: 'Komunitas',
      links: [
        { name: 'Discord', href: '#', external: true },
        { name: 'Forum', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Events', href: '#' },
      ],
    },
    {
      title: 'Bantuan',
      links: [
        { name: 'FAQ', href: '#' },
        { name: 'Panduan', href: '#' },
        { name: 'Kontak', href: '#contact' },
        { name: 'Status Server', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'Youtube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
    { name: 'Github', icon: Github, href: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
  ];

  const features = [
    { icon: BookOpen, text: '500+ Tutorial Interaktif' },
    { icon: Users, text: '10K+ Pelajar Aktif' },
    { icon: Shield, text: 'Platform Aman & Terpercaya' },
    { icon: Zap, text: 'Belajar Sambil Bermain' },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              Dapatkan Update Terbaru! 📧
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Berlangganan newsletter kami untuk mendapatkan tips coding, update fitur terbaru, dan konten eksklusif lainnya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Masukkan email Anda..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Berlangganan
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-300">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Code Valley
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Platform belajar programming yang menyenangkan dan interaktif. 
                Bergabunglah dengan ribuan pelajar lainnya dan mulai perjalanan coding Anda hari ini!
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>support@codevalley.id</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.name}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-gray-400"
            >
              <span>© {currentYear} Code Valley. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>in Indonesia</span>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 text-sm text-gray-400"
            >
              <a href="#" className="hover:text-white transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}