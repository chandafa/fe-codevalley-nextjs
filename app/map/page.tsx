'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Map as MapIcon,
  MapPin,
  Users,
  Trophy,
  Star,
  Zap,
  Shield,
  Code,
  BookOpen,
  Coffee,
  Home,
  Trees,
  Mountain,
  Waves,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GameLayout } from '@/components/layout/game-layout';
import { useGameStore } from '@/lib/store';

interface Location {
  id: string;
  name: string;
  description: string;
  type: 'village' | 'forest' | 'mountain' | 'lake' | 'building';
  x: number;
  y: number;
  unlocked: boolean;
  npcs: number;
  quests: number;
  level_requirement?: number;
  icon: any;
  color: string;
}

export default function MapPage() {
  const { addNotification } = useGameStore();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 70 });

  const locations: Location[] = [
    {
      id: 'village_center',
      name: 'Village Center',
      description: 'The heart of Code Valley where all programmers gather. Find shops, guilds, and friendly NPCs here.',
      type: 'village',
      x: 50,
      y: 70,
      unlocked: true,
      npcs: 8,
      quests: 5,
      icon: Home,
      color: 'text-blue-500',
    },
    {
      id: 'code_forest',
      name: 'Code Forest',
      description: 'A mystical forest where algorithms grow on trees. Perfect for learning data structures and solving puzzles.',
      type: 'forest',
      x: 25,
      y: 45,
      unlocked: true,
      npcs: 4,
      quests: 8,
      icon: Trees,
      color: 'text-green-500',
    },
    {
      id: 'debug_mountain',
      name: 'Debug Mountain',
      description: 'A challenging mountain where the most difficult bugs hide. Only experienced programmers dare to climb.',
      type: 'mountain',
      x: 75,
      y: 25,
      unlocked: false,
      npcs: 2,
      quests: 12,
      level_requirement: 15,
      icon: Mountain,
      color: 'text-purple-500',
    },
    {
      id: 'api_lake',
      name: 'API Lake',
      description: 'A serene lake where data flows like water. Learn about REST APIs and database connections here.',
      type: 'lake',
      x: 80,
      y: 60,
      unlocked: true,
      npcs: 3,
      quests: 6,
      icon: Waves,
      color: 'text-cyan-500',
    },
    {
      id: 'framework_tower',
      name: 'Framework Tower',
      description: 'A towering structure housing the most advanced frameworks and libraries. Reach the top to master them all.',
      type: 'building',
      x: 30,
      y: 20,
      unlocked: false,
      npcs: 5,
      quests: 15,
      level_requirement: 25,
      icon: Building,
      color: 'text-orange-500',
    },
    {
      id: 'startup_district',
      name: 'Startup District',
      description: 'The bustling business district where entrepreneurs and developers collaborate on innovative projects.',
      type: 'building',
      x: 65,
      y: 45,
      unlocked: true,
      npcs: 6,
      quests: 10,
      icon: Building,
      color: 'text-red-500',
    },
    {
      id: 'learning_grove',
      name: 'Learning Grove',
      description: 'A peaceful grove dedicated to education. Find tutorials, documentation, and helpful mentors here.',
      type: 'forest',
      x: 20,
      y: 75,
      unlocked: true,
      npcs: 7,
      quests: 4,
      icon: BookOpen,
      color: 'text-emerald-500',
    },
    {
      id: 'coffee_corner',
      name: 'Coffee Corner',
      description: 'Every programmer needs caffeine! Relax, chat with friends, and take a break from coding.',
      type: 'village',
      x: 45,
      y: 85,
      unlocked: true,
      npcs: 3,
      quests: 2,
      icon: Coffee,
      color: 'text-amber-500',
    },
  ];

  const handleLocationClick = (location: Location) => {
    if (!location.unlocked) {
      addNotification({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Location Locked',
        message: `You need to reach level ${location.level_requirement} to unlock ${location.name}`,
      });
      return;
    }

    setSelectedLocation(location);
    setShowLocationDetails(true);
  };

  const handleTravelTo = (location: Location) => {
    setPlayerPosition({ x: location.x, y: location.y });
    setShowLocationDetails(false);
    
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      title: 'Travel Complete',
      message: `Welcome to ${location.name}!`,
    });
  };

  return (
    <GameLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Code Valley Map</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore the magical world of Code Valley! Visit different locations to find NPCs, quests, and learning opportunities.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-blue-600" />
                Interactive Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Map SVG */}
              <div className="relative w-full h-96 lg:h-[600px] bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 overflow-hidden">
                {/* Background Elements */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Rivers */}
                  <path
                    d="M 0 60 Q 30 55 50 60 Q 70 65 100 60"
                    stroke="#3B82F6"
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.3"
                  />
                  
                  {/* Paths */}
                  <path
                    d="M 50 70 Q 40 60 25 45"
                    stroke="#8B5CF6"
                    strokeWidth="0.3"
                    fill="none"
                    strokeDasharray="1,1"
                    opacity="0.5"
                  />
                  <path
                    d="M 50 70 Q 60 50 75 25"
                    stroke="#8B5CF6"
                    strokeWidth="0.3"
                    fill="none"
                    strokeDasharray="1,1"
                    opacity="0.5"
                  />
                  <path
                    d="M 50 70 Q 65 65 80 60"
                    stroke="#8B5CF6"
                    strokeWidth="0.3"
                    fill="none"
                    strokeDasharray="1,1"
                    opacity="0.5"
                  />
                </svg>

                {/* Player Position */}
                <motion.div
                  className="absolute w-6 h-6 -translate-x-3 -translate-y-3 z-20"
                  style={{
                    left: `${playerPosition.x}%`,
                    top: `${playerPosition.y}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <div className="w-6 h-6 bg-yellow-400 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  </div>
                </motion.div>

                {/* Locations */}
                {locations.map((location, index) => {
                  const IconComponent = location.icon;
                  return (
                    <motion.div
                      key={location.id}
                      className="absolute -translate-x-4 -translate-y-4 z-10"
                      style={{
                        left: `${location.x}%`,
                        top: `${location.y}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <button
                        onClick={() => handleLocationClick(location)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
                          location.unlocked
                            ? 'bg-white border-2 border-blue-300 hover:border-blue-500'
                            : 'bg-gray-300 border-2 border-gray-400 opacity-60'
                        }`}
                        disabled={!location.unlocked}
                      >
                        <IconComponent className={`w-4 h-4 ${location.unlocked ? location.color : 'text-gray-500'}`} />
                      </button>
                      
                      {/* Location Label */}
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className={`text-xs font-medium px-2 py-1 rounded shadow-sm ${
                          location.unlocked
                            ? 'bg-white text-gray-800 border border-gray-200'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {location.name}
                          {!location.unlocked && location.level_requirement && (
                            <div className="text-xs text-red-500">
                              Lv.{location.level_requirement}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location, index) => {
                  const IconComponent = location.icon;
                  return (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          location.unlocked ? 'hover:-translate-y-1' : 'opacity-60'
                        }`}
                        onClick={() => handleLocationClick(location)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              location.unlocked ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <IconComponent className={`w-5 h-5 ${location.unlocked ? location.color : 'text-gray-400'}`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{location.name}</h3>
                                {!location.unlocked && (
                                  <Badge variant="secondary" className="text-xs">
                                    Lv.{location.level_requirement}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {location.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{location.npcs} NPCs</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Trophy className="w-3 h-3" />
                                  <span>{location.quests} Quests</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location Details Modal */}
        <Dialog open={showLocationDetails} onOpenChange={setShowLocationDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedLocation && (
                  <>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <selectedLocation.icon className={`w-6 h-6 ${selectedLocation.color}`} />
                    </div>
                    <div>
                      <span>{selectedLocation.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {selectedLocation.type}
                      </Badge>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedLocation && (
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">
                  {selectedLocation.description}
                </p>

                {/* Location Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-600">NPCs</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">{selectedLocation.npcs}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">Quests</span>
                    </div>
                    <div className="text-2xl font-bold text-green-800">{selectedLocation.quests}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleTravelTo(selectedLocation)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Travel Here
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowLocationDetails(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}