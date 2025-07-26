'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Clock,
  Award,
  Play,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GameLayout } from '@/components/layout/game-layout';
import { useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Quest } from '@/types/api';
import { getDifficultyColor, cn } from '@/lib/utils';

export default function QuestsPage() {
  const { quests, setQuests, addNotification } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        setIsLoading(true);
        const response = await api.quests.list();
        setQuests(response.data.data);
      } catch (error) {
        console.error('Failed to fetch quests:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat daftar quest',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuests();
  }, [setQuests, addNotification]);

  const handleStartQuest = async (questId: string) => {
    try {
      await api.quests.start(questId);
      
      // Update quest status locally
      const updatedQuests = quests.map(quest =>
        quest.id === questId ? { ...quest, status: 'active' as const } : quest
      );
      setQuests(updatedQuests);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Quest Dimulai!',
        message: 'Quest telah ditambahkan ke daftar aktif Anda',
      });
    } catch (error) {
      console.error('Failed to start quest:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Gagal memulai quest',
      });
    }
  };

  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || quest.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || quest.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || quest.status === selectedStatus;
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
      default:
        return <Star className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'locked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat quest...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quest Board</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pilih quest untuk memulai petualangan coding Anda. Selesaikan tantangan dan dapatkan reward!
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cari quest..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Level</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="algorithm">Algorithm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Quest Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(quest.status)}
                      <Badge className={getStatusColor(quest.status)}>
                        {quest.status}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={getDifficultyColor(quest.difficulty)}>
                      {quest.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{quest.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {quest.description}
                  </p>

                  {/* Progress Bar for Active Quests */}
                  {quest.status === 'active' && quest.progress !== undefined && quest.maxProgress && (
                    <div>
                      <ProgressBar
                        value={quest.progress}
                        max={quest.maxProgress}
                        label="Progress"
                        color="blue"
                      />
                    </div>
                  )}

                  {/* Requirements */}
                  {quest.requirements && quest.requirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {quest.requirements.slice(0, 2).map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            {req}
                          </li>
                        ))}
                        {quest.requirements.length > 2 && (
                          <li className="text-gray-400">
                            +{quest.requirements.length - 2} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Award className="w-4 h-4" />
                        <span>{quest.rewards.xp} XP</span>
                      </div>
                      {quest.rewards.items && quest.rewards.items.length > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Star className="w-4 h-4" />
                          <span>{quest.rewards.items.length} items</span>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-500">{quest.category}</span>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {quest.status === 'available' && (
                      <Button
                        onClick={() => handleStartQuest(quest.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Mulai Quest
                      </Button>
                    )}
                    {quest.status === 'active' && (
                      <Button variant="outline" className="w-full">
                        <Clock className="w-4 h-4 mr-2" />
                        Lanjutkan
                      </Button>
                    )}
                    {quest.status === 'completed' && (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Selesai
                      </Button>
                    )}
                    {quest.status === 'locked' && (
                      <Button variant="outline" className="w-full" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        Terkunci
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quest tidak ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah filter pencarian atau cari dengan kata kunci lain
            </p>
          </motion.div>
        )}
      </div>
    </GameLayout>
  );
}