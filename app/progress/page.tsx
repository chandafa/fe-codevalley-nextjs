'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Star,
  Trophy,
  Target,
  Code,
  Database,
  Globe,
  Smartphone,
  Server,
  Palette,
  Brain,
  Zap,
  Award,
  Calendar,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GameLayout } from '@/components/layout/game-layout';
import { useAuthStore, useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Skill, Achievement, Badge as BadgeType, UserStatistics, StoryProgress } from '@/types/api';

export default function ProgressPage() {
  const { user } = useAuthStore();
  const { addNotification } = useGameStore();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [storyProgress, setStoryProgress] = useState<StoryProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true);
        
        const [skillsRes, achievementsRes, badgesRes, statsRes, storyRes] = await Promise.all([
          api.skills.list(),
          api.achievements.list(),
          api.badges.list(),
          api.stats.me(),
          api.story.progress(),
        ]);
        
        setSkills(skillsRes.data.data);
        setAchievements(achievementsRes.data.data);
        setBadges(badgesRes.data.data);
        setStatistics(statsRes.data.data);
        setStoryProgress(storyRes.data.data);
        
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat data progress',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [addNotification]);

  const handleUpgradeSkill = async (skillId: string) => {
    try {
      await api.skills.upgrade(skillId);
      
      // Refresh skills data
      const skillsRes = await api.skills.list();
      setSkills(skillsRes.data.data);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Skill Upgraded!',
        message: 'Your skill has been upgraded successfully',
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Upgrade Failed',
        message: error.response?.data?.message || 'Gagal upgrade skill',
      });
    }
  };

  const getSkillIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return Globe;
      case 'backend':
        return Server;
      case 'database':
        return Database;
      case 'mobile':
        return Smartphone;
      case 'design':
        return Palette;
      case 'algorithm':
        return Brain;
      case 'devops':
        return Zap;
      default:
        return Code;
    }
  };

  const getSkillColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return 'from-blue-500 to-cyan-500';
      case 'backend':
        return 'from-green-500 to-emerald-500';
      case 'database':
        return 'from-purple-500 to-violet-500';
      case 'mobile':
        return 'from-pink-500 to-rose-500';
      case 'design':
        return 'from-orange-500 to-amber-500';
      case 'algorithm':
        return 'from-red-500 to-pink-500';
      case 'devops':
        return 'from-indigo-500 to-blue-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading progress...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Progress</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your coding journey, upgrade skills, and celebrate achievements!
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{user?.level || 0}</div>
              <div className="text-blue-100">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{user?.exp || 0}</div>
              <div className="text-blue-100">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{statistics?.achievements_unlocked || 0}</div>
              <div className="text-blue-100">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{statistics?.total_quests_completed || 0}</div>
              <div className="text-blue-100">Quests Completed</div>
            </div>
          </div>
        </motion.div>

        {/* Progress Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill, index) => {
                  const SkillIcon = getSkillIcon(skill.category);
                  const skillColor = getSkillColor(skill.category);
                  const canUpgrade = skill.current_level < skill.max_level && 
                                   (user?.coins || 0) >= skill.upgrade_cost;
                  
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <div className={`w-16 h-16 bg-gradient-to-r ${skillColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                              <SkillIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{skill.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
                            
                            <Badge variant="outline" className="mb-4">
                              {skill.category}
                            </Badge>
                          </div>

                          {/* Skill Level Progress */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Level {skill.current_level}</span>
                              <span className="text-sm text-gray-500">
                                {skill.current_level}/{skill.max_level}
                              </span>
                            </div>
                            <ProgressBar
                              value={skill.current_level}
                              max={skill.max_level}
                              color="blue"
                              showValue={false}
                            />
                          </div>

                          {/* Benefits */}
                          {skill.benefits && skill.benefits.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits:</h4>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {skill.benefits.slice(0, 2).map((benefit, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Upgrade Button */}
                          {skill.current_level < skill.max_level && (
                            <Button
                              className="w-full"
                              onClick={() => handleUpgradeSkill(skill.id)}
                              disabled={!canUpgrade}
                            >
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Upgrade ({skill.upgrade_cost} coins)
                            </Button>
                          )}

                          {skill.current_level === skill.max_level && (
                            <Badge className="w-full justify-center bg-green-100 text-green-800">
                              <Trophy className="w-4 h-4 mr-2" />
                              Maxed Out!
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'opacity-60'}`}>
                      <CardContent className="p-6 text-center">
                        <div className="text-6xl mb-4">{achievement.icon}</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                        
                        <Badge variant="outline" className="mb-4">
                          {achievement.category}
                        </Badge>

                        {achievement.unlocked ? (
                          <div>
                            <Badge className="bg-green-100 text-green-800 mb-2">
                              <Trophy className="w-4 h-4 mr-2" />
                              Unlocked!
                            </Badge>
                            {achievement.unlocked_at && (
                              <p className="text-xs text-gray-500">
                                {new Date(achievement.unlocked_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            {achievement.progress !== undefined && achievement.max_progress && (
                              <div className="mb-2">
                                <ProgressBar
                                  value={achievement.progress}
                                  max={achievement.max_progress}
                                  color="yellow"
                                  label="Progress"
                                />
                              </div>
                            )}
                            <Badge variant="secondary">
                              <Target className="w-4 h-4 mr-2" />
                              In Progress
                            </Badge>
                          </div>
                        )}

                        {/* Requirements */}
                        {achievement.requirements && achievement.requirements.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-xs font-semibold text-gray-700 mb-2">Requirements:</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {achievement.requirements.slice(0, 2).map((req, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`text-center p-4 ${badge.earned_at ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200' : 'opacity-50'}`}>
                      <CardContent className="p-0">
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{badge.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                        
                        {badge.earned_at ? (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            Earned
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Locked
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="story" className="space-y-6">
              <div className="space-y-4">
                {storyProgress.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`${chapter.completed ? 'bg-green-50 border-green-200' : chapter.unlocked ? 'bg-blue-50 border-blue-200' : 'opacity-50'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                chapter.completed ? 'bg-green-500' : chapter.unlocked ? 'bg-blue-500' : 'bg-gray-400'
                              }`}>
                                {chapter.completed ? (
                                  <Trophy className="w-4 h-4 text-white" />
                                ) : chapter.unlocked ? (
                                  <BookOpen className="w-4 h-4 text-white" />
                                ) : (
                                  <span className="text-white text-sm font-bold">{index + 1}</span>
                                )}
                              </div>
                              <h3 className="font-bold text-lg text-gray-900">{chapter.title}</h3>
                            </div>
                            <p className="text-gray-600 mb-4">{chapter.description}</p>
                            
                            {chapter.unlocked && !chapter.completed && (
                              <div className="mb-4">
                                <ProgressBar
                                  value={chapter.progress}
                                  max={100}
                                  color="blue"
                                  label="Chapter Progress"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            {chapter.completed && (
                              <Badge className="bg-green-100 text-green-800 mb-2">
                                <Trophy className="w-4 h-4 mr-2" />
                                Completed
                              </Badge>
                            )}
                            {chapter.reward_coins && (
                              <p className="text-sm text-gray-600">
                                Reward: {chapter.reward_coins} coins
                              </p>
                            )}
                            {chapter.reward_exp && (
                              <p className="text-sm text-gray-600">
                                +{chapter.reward_exp} XP
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Statistics Summary */}
        {statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Your Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {statistics.total_playtime}h
                    </div>
                    <div className="text-sm text-gray-600">Total Playtime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {statistics.login_streak}
                    </div>
                    <div className="text-sm text-gray-600">Login Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {statistics.total_friends}
                    </div>
                    <div className="text-sm text-gray-600">Friends</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {statistics.skills_maxed}
                    </div>
                    <div className="text-sm text-gray-600">Skills Maxed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </GameLayout>
  );
}