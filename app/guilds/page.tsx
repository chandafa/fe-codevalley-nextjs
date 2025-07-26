'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Crown,
  Plus,
  Search,
  Star,
  Calendar,
  TrendingUp,
  Settings,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { GameLayout } from '@/components/layout/game-layout';
import { useGuildStore, useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Guild, GuildMember } from '@/types/api';

export default function GuildsPage() {
  const { currentGuild, guilds, guildMembers, setCurrentGuild, setGuilds, setGuildMembers } = useGuildStore();
  const { addNotification } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    is_public: true,
  });

  useEffect(() => {
    const fetchGuildsData = async () => {
      try {
        setIsLoading(true);
        
        const guildsResponse = await api.guilds.list();
        setGuilds(guildsResponse.data.data);
        
        // If user has a guild, fetch details
        // This would typically come from user profile
        // For now, we'll assume no current guild
        
      } catch (error) {
        console.error('Failed to fetch guilds data:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat data guild',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuildsData();
  }, [setGuilds, addNotification]);

  const handleCreateGuild = async () => {
    if (!createForm.name.trim()) return;
    
    try {
      const response = await api.guilds.create(createForm);
      const newGuild = response.data.data;
      
      setCurrentGuild(newGuild);
      setGuilds([newGuild, ...guilds]);
      setShowCreateDialog(false);
      setCreateForm({ name: '', description: '', is_public: true });
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Guild Created!',
        message: `Welcome to ${newGuild.name}! You are now the guild leader.`,
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal membuat guild',
      });
    }
  };

  const handleJoinGuild = async (guildId: string) => {
    try {
      await api.guilds.join(guildId);
      
      const guild = guilds.find(g => g.id === guildId);
      if (guild) {
        setCurrentGuild(guild);
        
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Joined Guild!',
          message: `Welcome to ${guild.name}!`,
        });
      }
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal bergabung dengan guild',
      });
    }
  };

  const handleLeaveGuild = async () => {
    if (!currentGuild) return;
    
    try {
      await api.guilds.leave(currentGuild.id);
      
      setCurrentGuild(null);
      setGuildMembers([]);
      
      addNotification({
        id: Date.now().toString(),
        type: 'info',
        title: 'Left Guild',
        message: `You have left ${currentGuild.name}`,
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal keluar dari guild',
      });
    }
  };

  const filteredGuilds = guilds.filter(guild =>
    guild.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guild.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading guilds...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Guilds & Communities</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join programming communities, collaborate on projects, and grow together!
          </p>
        </motion.div>

        {currentGuild ? (
          // Current Guild View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Guild Header */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Shield className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{currentGuild.name}</h2>
                      <p className="text-purple-100 mb-4">{currentGuild.description}</p>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-white/20 text-white">
                          Level {currentGuild.level}
                        </Badge>
                        <Badge className="bg-white/20 text-white">
                          {currentGuild.member_count}/{currentGuild.max_members} Members
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLeaveGuild}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Leave
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guild Tabs */}
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Guild Members</h3>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Members
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Mock members data */}
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>M{index + 1}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">Member {index + 1}</h4>
                            <p className="text-sm text-gray-600">Level {10 + index}</p>
                          </div>
                          {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
                  <p className="text-gray-600">Guild projects will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
                  <p className="text-gray-600">Guild events will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="leaderboard">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Leaderboard Coming Soon</h3>
                  <p className="text-gray-600">Member rankings will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : (
          // Guild Discovery View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search guilds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Guild
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Guild</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="guild-name">Guild Name</Label>
                      <Input
                        id="guild-name"
                        value={createForm.name}
                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                        placeholder="Enter guild name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="guild-description">Description</Label>
                      <Textarea
                        id="guild-description"
                        value={createForm.description}
                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                        placeholder="Describe your guild..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="public-guild"
                        checked={createForm.is_public}
                        onCheckedChange={(checked) => setCreateForm({ ...createForm, is_public: checked })}
                      />
                      <Label htmlFor="public-guild">Public Guild</Label>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleCreateGuild} className="flex-1">
                        Create Guild
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Guilds Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuilds.map((guild, index) => (
                <motion.div
                  key={guild.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{guild.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{guild.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Level {guild.level}</Badge>
                            <Badge variant="secondary">
                              {guild.member_count}/{guild.max_members}
                            </Badge>
                            {guild.is_public && (
                              <Badge className="bg-green-100 text-green-800">Public</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Crown className="w-4 h-4" />
                          <span>{guild.owner.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{guild.exp} XP</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => handleJoinGuild(guild.id)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Join Guild
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredGuilds.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No guilds found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try a different search term' : 'Be the first to create a guild!'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </GameLayout>
  );
}