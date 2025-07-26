'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  MessageCircle,
  Crown,
  Search,
  Filter,
  Check,
  X,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameLayout } from '@/components/layout/game-layout';
import { useFriendsStore, useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Friend } from '@/types/api';

export default function FriendsPage() {
  const { friends, onlineFriends, friendRequests, setFriends, setOnlineFriends, setFriendRequests, addFriend, removeFriend } = useFriendsStore();
  const { addNotification } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFriendUsername, setNewFriendUsername] = useState('');

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        setIsLoading(true);
        
        const [friendsResponse, onlineResponse] = await Promise.all([
          api.friends.list(),
          api.friends.online(),
        ]);
        
        setFriends(friendsResponse.data.data);
        setOnlineFriends(onlineResponse.data.data);
        
        // Filter pending requests
        const requests = friendsResponse.data.data.filter((f: Friend) => f.status === 'pending');
        setFriendRequests(requests);
        
      } catch (error) {
        console.error('Failed to fetch friends data:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat data teman',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendsData();
  }, [setFriends, setOnlineFriends, setFriendRequests, addNotification]);

  const handleAddFriend = async () => {
    if (!newFriendUsername.trim()) return;
    
    try {
      await api.friends.add(newFriendUsername);
      setNewFriendUsername('');
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Friend Request Sent',
        message: `Friend request sent to ${newFriendUsername}`,
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal mengirim friend request',
      });
    }
  };

  const handleAcceptFriend = async (username: string) => {
    try {
      await api.friends.accept(username);
      
      // Update local state
      const updatedRequests = friendRequests.filter(f => f.username !== username);
      setFriendRequests(updatedRequests);
      
      // Refresh friends list
      const friendsResponse = await api.friends.list();
      setFriends(friendsResponse.data.data);
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Friend Added',
        message: `${username} is now your friend!`,
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal menerima friend request',
      });
    }
  };

  const handleRemoveFriend = async (username: string) => {
    try {
      await api.friends.remove(username);
      
      // Update local state
      const friend = friends.find(f => f.username === username);
      if (friend) {
        removeFriend(friend.id);
      }
      
      addNotification({
        id: Date.now().toString(),
        type: 'info',
        title: 'Friend Removed',
        message: `${username} has been removed from your friends`,
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal menghapus teman',
      });
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.status === 'accepted' &&
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading friends...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Friends & Social</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with fellow programmers, share your journey, and learn together!
          </p>
        </motion.div>

        {/* Add Friend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add New Friend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter username..."
                  value={newFriendUsername}
                  onChange={(e) => setNewFriendUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
                  className="flex-1"
                />
                <Button onClick={handleAddFriend} disabled={!newFriendUsername.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Friends Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All Friends ({filteredFriends.length})
              </TabsTrigger>
              <TabsTrigger value="online">
                Online ({onlineFriends.length})
              </TabsTrigger>
              <TabsTrigger value="requests">
                Requests ({friendRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search friends..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Friends Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={friend.avatar_url} />
                              <AvatarFallback>
                                {friend.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {friend.is_online && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{friend.username}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Level {friend.level}</Badge>
                              {friend.is_online ? (
                                <Badge className="bg-green-100 text-green-800">Online</Badge>
                              ) : (
                                <Badge variant="secondary">Offline</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRemoveFriend(friend.username)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredFriends.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No friends found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try a different search term' : 'Start by adding some friends!'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="online" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {onlineFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={friend.avatar_url} />
                              <AvatarFallback>
                                {friend.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{friend.username}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Level {friend.level}</Badge>
                              <Badge className="bg-green-100 text-green-800">Online Now</Badge>
                            </div>
                          </div>
                        </div>

                        <Button size="sm" className="w-full">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Chat
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {onlineFriends.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No friends online</h3>
                  <p className="text-gray-600">Your friends will appear here when they're online</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <div className="space-y-4">
                {friendRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={request.avatar_url} />
                              <AvatarFallback>
                                {request.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900">{request.username}</h4>
                              <p className="text-sm text-gray-600">Level {request.level}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => handleAcceptFriend(request.username)}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRemoveFriend(request.username)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {friendRequests.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No friend requests</h3>
                  <p className="text-gray-600">Friend requests will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </GameLayout>
  );
}