'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageCircle,
  Heart,
  Star,
  MapPin,
  Gift,
  Crown,
  Code,
  BookOpen,
  Briefcase,
  Coffee,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GameLayout } from '@/components/layout/game-layout';
import { useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { NPC, Dialogue } from '@/types/api';

export default function NPCsPage() {
  const { addNotification } = useGameStore();
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [currentDialogue, setCurrentDialogue] = useState<Dialogue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const fetchNPCs = async () => {
      try {
        setIsLoading(true);
        const response = await api.npcs.list();
        setNpcs(response.data.data);
      } catch (error) {
        console.error('Failed to fetch NPCs:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat daftar NPC',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNPCs();
  }, [addNotification]);

  const handleInteractWithNPC = async (npc: NPC, dialogueId?: string, responseId?: string) => {
    try {
      setIsInteracting(true);
      const response = await api.npcs.interact(npc.id, dialogueId, responseId);
      const dialogueData = response.data.data;
      
      setCurrentDialogue(dialogueData.dialogue);
      
      if (dialogueData.relationship_change) {
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Relationship Updated',
          message: `Your relationship with ${npc.name} has ${dialogueData.relationship_change > 0 ? 'improved' : 'decreased'}!`,
        });
      }
      
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Interaction Failed',
        message: error.response?.data?.message || 'Gagal berinteraksi dengan NPC',
      });
    } finally {
      setIsInteracting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'mentor':
        return BookOpen;
      case 'client':
        return Briefcase;
      case 'developer':
        return Code;
      case 'villager':
        return Coffee;
      case 'quest_giver':
        return Gift;
      default:
        return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'mentor':
        return 'from-blue-500 to-blue-600';
      case 'client':
        return 'from-green-500 to-green-600';
      case 'developer':
        return 'from-purple-500 to-purple-600';
      case 'villager':
        return 'from-yellow-500 to-yellow-600';
      case 'quest_giver':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading NPCs...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Village NPCs</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet the friendly residents of Code Valley! Build relationships and learn from experienced developers.
          </p>
        </motion.div>

        {/* NPCs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {npcs.map((npc, index) => {
            const RoleIcon = getRoleIcon(npc.role);
            const roleColor = getRoleColor(npc.role);
            
            return (
              <motion.div
                key={npc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="relative mb-4">
                        <Avatar className="w-20 h-20 mx-auto">
                          <AvatarImage src={npc.avatar_url} />
                          <AvatarFallback className="text-2xl">
                            {npc.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r ${roleColor} rounded-full flex items-center justify-center`}>
                          <RoleIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{npc.name}</h3>
                      <Badge variant="outline" className="mb-3">
                        {npc.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{npc.location}</span>
                      </div>
                    </div>

                    {/* Relationship Level */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Relationship</span>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-bold">
                            {npc.relationship_level}/{npc.max_relationship}
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        value={npc.relationship_level}
                        max={npc.max_relationship}
                        color="red"
                        showValue={false}
                      />
                    </div>

                    {/* Available Quests */}
                    {npc.quests_available && npc.quests_available.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {npc.quests_available.length} Quest{npc.quests_available.length > 1 ? 's' : ''} Available
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Interact Button */}
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedNPC(npc);
                        handleInteractWithNPC(npc);
                      }}
                      disabled={isInteracting}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {isInteracting ? 'Interacting...' : 'Talk'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {npcs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No NPCs found</h3>
            <p className="text-gray-600">The village seems quiet today. Check back later!</p>
          </div>
        )}

        {/* Dialogue Modal */}
        <Dialog open={!!selectedNPC} onOpenChange={() => {
          setSelectedNPC(null);
          setCurrentDialogue(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedNPC && (
                  <>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedNPC.avatar_url} />
                      <AvatarFallback>
                        {selectedNPC.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{selectedNPC.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {selectedNPC.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {currentDialogue && (
              <div className="space-y-6">
                {/* Dialogue Text */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-800 leading-relaxed"
                  >
                    {currentDialogue.text}
                  </motion.p>
                </div>

                {/* Response Options */}
                {currentDialogue.responses && currentDialogue.responses.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Choose your response:</h4>
                    {currentDialogue.responses.map((response, index) => (
                      <Button
                        key={response.id}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-4"
                        onClick={() => {
                          if (selectedNPC) {
                            handleInteractWithNPC(
                              selectedNPC,
                              response.next_dialogue_id,
                              response.id
                            );
                          }
                        }}
                        disabled={isInteracting}
                      >
                        <span className="font-medium mr-3">{index + 1}.</span>
                        {response.text}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Continue Button (if no responses) */}
                {(!currentDialogue.responses || currentDialogue.responses.length === 0) && (
                  <div className="text-center">
                    <Button
                      onClick={() => {
                        setSelectedNPC(null);
                        setCurrentDialogue(null);
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!currentDialogue && selectedNPC && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Starting conversation...</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}