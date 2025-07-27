'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Star,
  Coins,
  Clock,
  Map as MapIcon,
  MessageCircle,
  Package,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GameLayout } from '@/components/layout/game-layout';
import { useAuthStore, useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { wsManager } from '@/lib/websocket';

// Game constants
const TILE_SIZE = 32;
const MAP_WIDTH = 50;
const MAP_HEIGHT = 30;
const VIEWPORT_WIDTH = 25;
const VIEWPORT_HEIGHT = 15;

interface Position {
  x: number;
  y: number;
}

interface Player {
  id: string;
  username: string;
  position: Position;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  avatar_url?: string;
}

interface NPC {
  id: string;
  name: string;
  position: Position;
  sprite: string;
  dialogue?: string;
  canInteract: boolean;
}

interface WorldObject {
  id: string;
  type: 'tree' | 'rock' | 'chest' | 'building' | 'farm_plot' | 'sign';
  position: Position;
  sprite: string;
  canInteract: boolean;
  interactionText?: string;
  data?: any;
}

interface GameTime {
  game_year: number;
  game_season: string;
  game_day: number;
  game_hour: number;
  game_minute: number;
}

interface QuestPopup {
  id: string;
  title: string;
  message: string;
  type: 'started' | 'completed' | 'updated';
}

export default function GamePage() {
  const { user } = useAuthStore();
  const { addNotification } = useGameStore();
  
  // Game state
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [worldObjects, setWorldObjects] = useState<WorldObject[]>([]);
  const [gameTime, setGameTime] = useState<GameTime>({
    game_year: 1,
    game_season: 'spring',
    game_day: 1,
    game_hour: 6,
    game_minute: 0,
  });
  
  // UI state
  const [camera, setCamera] = useState<Position>({ x: 0, y: 0 });
  const [selectedObject, setSelectedObject] = useState<WorldObject | NPC | null>(null);
  const [questPopup, setQuestPopup] = useState<QuestPopup | null>(null);
  const [showMinimap, setShowMinimap] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState<Position>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  
  // Refs
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  const lastMoveTime = useRef<number>(0);
  const joystickRef = useRef<HTMLDivElement>(null);

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Get initial player position
        const positionResponse = await api.world.getPosition();
        const position = positionResponse.data.data;
        
        // Get map state
        const mapResponse = await api.world.getMapState('village');
        const mapData = mapResponse.data.data;
        
        // Get game time
        const timeResponse = await api.world.getTime();
        const time = timeResponse.data.data;
        
        // Initialize player
        if (user) {
          const player: Player = {
            id: user.id,
            username: user.username,
            position: position || { x: 25, y: 15 },
            direction: 'down',
            isMoving: false,
            avatar_url: user.avatar_url,
          };
          setCurrentPlayer(player);
          setCamera({ 
            x: player.position.x - VIEWPORT_WIDTH / 2, 
            y: player.position.y - VIEWPORT_HEIGHT / 2 
          });
        }
        
        // Set map data
        setOtherPlayers(mapData.players || []);
        setNpcs(mapData.npcs || generateMockNPCs());
        setWorldObjects(mapData.objects || generateMockWorldObjects());
        setGameTime(time);
        
      } catch (error) {
        console.error('Failed to initialize game:', error);
        // Use mock data if API fails
        initializeMockData();
      }
    };

    initializeGame();
    
    // Check if mobile
    setIsMobile(window.innerWidth <= 768);
    
    // Setup WebSocket listeners
    setupWebSocketListeners();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [user]);

  const initializeMockData = () => {
    if (user) {
      const player: Player = {
        id: user.id,
        username: user.username,
        position: { x: 25, y: 15 },
        direction: 'down',
        isMoving: false,
        avatar_url: user.avatar_url,
      };
      setCurrentPlayer(player);
      setCamera({ x: 20, y: 10 });
    }
    
    setNpcs(generateMockNPCs());
    setWorldObjects(generateMockWorldObjects());
  };

  const generateMockNPCs = (): NPC[] => [
    {
      id: '1',
      name: 'Code Mentor Alice',
      position: { x: 20, y: 10 },
      sprite: '👩‍🏫',
      dialogue: 'Welcome to Code Valley! Ready to learn some programming?',
      canInteract: true,
    },
    {
      id: '2',
      name: 'Debug Dave',
      position: { x: 30, y: 20 },
      sprite: '👨‍💻',
      dialogue: 'I can help you fix those pesky bugs!',
      canInteract: true,
    },
    {
      id: '3',
      name: 'API Annie',
      position: { x: 15, y: 25 },
      sprite: '👩‍💼',
      dialogue: 'Need help connecting to external services?',
      canInteract: true,
    },
  ];

  const generateMockWorldObjects = (): WorldObject[] => [
    // Trees
    { id: '1', type: 'tree', position: { x: 10, y: 8 }, sprite: '🌳', canInteract: true, interactionText: 'Chop' },
    { id: '2', type: 'tree', position: { x: 12, y: 8 }, sprite: '🌲', canInteract: true, interactionText: 'Chop' },
    { id: '3', type: 'tree', position: { x: 35, y: 12 }, sprite: '🌳', canInteract: true, interactionText: 'Chop' },
    
    // Buildings
    { id: '4', type: 'building', position: { x: 5, y: 5 }, sprite: '🏠', canInteract: true, interactionText: 'Enter' },
    { id: '5', type: 'building', position: { x: 40, y: 8 }, sprite: '🏢', canInteract: true, interactionText: 'Enter' },
    
    // Chests
    { id: '6', type: 'chest', position: { x: 18, y: 18 }, sprite: '📦', canInteract: true, interactionText: 'Open' },
    { id: '7', type: 'chest', position: { x: 32, y: 25 }, sprite: '🎁', canInteract: true, interactionText: 'Open' },
    
    // Farm plots
    { id: '8', type: 'farm_plot', position: { x: 8, y: 20 }, sprite: '🟫', canInteract: true, interactionText: 'Plant' },
    { id: '9', type: 'farm_plot', position: { x: 10, y: 20 }, sprite: '🌱', canInteract: true, interactionText: 'Water' },
    { id: '10', type: 'farm_plot', position: { x: 12, y: 20 }, sprite: '🌿', canInteract: true, interactionText: 'Harvest' },
    
    // Signs
    { id: '11', type: 'sign', position: { x: 25, y: 5 }, sprite: '🪧', canInteract: true, interactionText: 'Read' },
  ];

  const setupWebSocketListeners = () => {
    wsManager.on('player_position_update', (data) => {
      setOtherPlayers(prev => {
        const updated = prev.filter(p => p.id !== data.player_id);
        updated.push({
          id: data.player_id,
          username: data.username,
          position: { x: data.pos_x, y: data.pos_y },
          direction: data.direction,
          isMoving: data.is_moving,
        });
        return updated;
      });
    });

    wsManager.on('world_object_update', (data) => {
      setWorldObjects(prev => 
        prev.map(obj => obj.id === data.object_id ? { ...obj, ...data.changes } : obj)
      );
    });

    wsManager.on('npc_position_update', (data) => {
      setNpcs(prev =>
        prev.map(npc => npc.id === data.npc_id 
          ? { ...npc, position: { x: data.pos_x, y: data.pos_y } }
          : npc
        )
      );
    });

    wsManager.on('time_update', (data) => {
      setGameTime(data);
    });

    wsManager.on('quest_update', (data) => {
      setQuestPopup({
        id: data.quest_id,
        title: data.title,
        message: data.message,
        type: data.type,
      });
      
      setTimeout(() => setQuestPopup(null), 5000);
    });
  };

  // Movement system
  const movePlayer = useCallback(async (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!currentPlayer) return;
    
    const now = Date.now();
    if (now - lastMoveTime.current < 200) return; // Throttle movement
    lastMoveTime.current = now;

    let newX = currentPlayer.position.x;
    let newY = currentPlayer.position.y;

    switch (direction) {
      case 'up': newY = Math.max(0, newY - 1); break;
      case 'down': newY = Math.min(MAP_HEIGHT - 1, newY + 1); break;
      case 'left': newX = Math.max(0, newX - 1); break;
      case 'right': newX = Math.min(MAP_WIDTH - 1, newX + 1); break;
    }

    // Check for collisions
    const hasCollision = [...worldObjects, ...npcs].some(obj => 
      obj.position.x === newX && obj.position.y === newY
    );

    if (!hasCollision) {
      const updatedPlayer = {
        ...currentPlayer,
        position: { x: newX, y: newY },
        direction,
        isMoving: true,
      };

      setCurrentPlayer(updatedPlayer);
      
      // Update camera to follow player
      setCamera({
        x: Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, newX - VIEWPORT_WIDTH / 2)),
        y: Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, newY - VIEWPORT_HEIGHT / 2)),
      });

      // Send position update to server
      try {
        wsManager.send('player_move', {
          pos_x: newX,
          pos_y: newY,
          direction,
          is_moving: true,
        });
      } catch (error) {
        console.error('Failed to send position update:', error);
      }

      // Stop moving animation after a delay
      setTimeout(() => {
        setCurrentPlayer(prev => prev ? { ...prev, isMoving: false } : null);
      }, 200);
    }
  }, [currentPlayer, worldObjects, npcs]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    const gameLoop = () => {
      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        movePlayer('up');
      } else if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        movePlayer('down');
      } else if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        movePlayer('left');
      } else if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        movePlayer('right');
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [movePlayer]);

  // Mobile joystick controls
  const handleJoystickStart = (e: React.TouchEvent) => {
    if (!joystickRef.current) return;
    
    setIsJoystickActive(true);
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    
    setJoystickPosition({ x: deltaX, y: deltaY });
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!isJoystickActive || !joystickRef.current) return;
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const touch = e.touches[0];
    const deltaX = Math.max(-40, Math.min(40, touch.clientX - centerX));
    const deltaY = Math.max(-40, Math.min(40, touch.clientY - centerY));
    
    setJoystickPosition({ x: deltaX, y: deltaY });
    
    // Determine direction based on joystick position
    const threshold = 20;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) movePlayer('right');
      else if (deltaX < -threshold) movePlayer('left');
    } else {
      if (deltaY > threshold) movePlayer('down');
      else if (deltaY < -threshold) movePlayer('up');
    }
  };

  const handleJoystickEnd = () => {
    setIsJoystickActive(false);
    setJoystickPosition({ x: 0, y: 0 });
  };

  // Interaction system
  const handleInteraction = async (target: WorldObject | NPC) => {
    if (!currentPlayer) return;
    
    const distance = Math.abs(target.position.x - currentPlayer.position.x) + 
                    Math.abs(target.position.y - currentPlayer.position.y);
    
    if (distance > 1) {
      addNotification({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Too Far',
        message: 'Move closer to interact with this object.',
      });
      return;
    }

    try {
      // Send interaction to server
      wsManager.send('player_interact', {
        target_id: target.id,
        target_type: 'type' in target ? 'object' : 'npc',
        pos_x: target.position.x,
        pos_y: target.position.y,
      });

      // Handle different interaction types
      if ('dialogue' in target) {
        // NPC interaction
        addNotification({
          id: Date.now().toString(),
          type: 'info',
          title: target.name,
          message: target.dialogue || 'Hello there!',
        });
      } else {
        // Object interaction
        switch (target.type) {
          case 'chest':
            addNotification({
              id: Date.now().toString(),
              type: 'success',
              title: 'Chest Opened',
              message: 'You found some coins and items!',
            });
            break;
          case 'tree':
            addNotification({
              id: Date.now().toString(),
              type: 'success',
              title: 'Tree Chopped',
              message: 'You collected wood and gained experience!',
            });
            break;
          case 'farm_plot':
            if (target.sprite === '🟫') {
              addNotification({
                id: Date.now().toString(),
                type: 'info',
                title: 'Planting',
                message: 'You planted algorithm seeds!',
              });
            } else if (target.sprite === '🌱') {
              addNotification({
                id: Date.now().toString(),
                type: 'info',
                title: 'Watering',
                message: 'Your code is growing nicely!',
              });
            } else {
              addNotification({
                id: Date.now().toString(),
                type: 'success',
                title: 'Harvest',
                message: 'You harvested mature code libraries!',
              });
            }
            break;
        }
      }
    } catch (error) {
      console.error('Interaction failed:', error);
    }
  };

  const formatGameTime = (time: GameTime) => {
    const hour = time.game_hour.toString().padStart(2, '0');
    const minute = time.game_minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  const getSeasonEmoji = (season: string) => {
    switch (season) {
      case 'spring': return '🌸';
      case 'summer': return '☀️';
      case 'fall': return '🍂';
      case 'winter': return '❄️';
      default: return '🌸';
    }
  };

  if (!currentPlayer) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Code Valley...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-200 to-green-200 overflow-hidden">
      {/* Game Canvas */}
      <div className="relative w-full h-full">
        <canvas
          ref={gameCanvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Game World Grid */}
        <div 
          className="absolute inset-0 grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${VIEWPORT_WIDTH}, ${TILE_SIZE}px)`,
            gridTemplateRows: `repeat(${VIEWPORT_HEIGHT}, ${TILE_SIZE}px)`,
            transform: `translate(${-camera.x * TILE_SIZE}px, ${-camera.y * TILE_SIZE}px)`,
          }}
        >
          {/* Render world objects */}
          {worldObjects.map((obj) => (
            <div
              key={obj.id}
              className="absolute flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: obj.position.x * TILE_SIZE,
                top: obj.position.y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
                fontSize: TILE_SIZE * 0.8,
              }}
              onClick={() => handleInteraction(obj)}
              title={obj.interactionText}
            >
              {obj.sprite}
            </div>
          ))}
          
          {/* Render NPCs */}
          {npcs.map((npc) => (
            <div
              key={npc.id}
              className="absolute flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: npc.position.x * TILE_SIZE,
                top: npc.position.y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
              onClick={() => handleInteraction(npc)}
              title={npc.name}
            >
              <div style={{ fontSize: TILE_SIZE * 0.6 }}>{npc.sprite}</div>
              <div className="text-xs font-bold text-white bg-black bg-opacity-50 px-1 rounded">
                {npc.name.split(' ')[0]}
              </div>
            </div>
          ))}
          
          {/* Render other players */}
          {otherPlayers.map((player) => (
            <div
              key={player.id}
              className="absolute flex flex-col items-center"
              style={{
                left: player.position.x * TILE_SIZE,
                top: player.position.y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
            >
              <div 
                className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold ${
                  player.isMoving ? 'animate-bounce' : ''
                }`}
              >
                {player.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-xs font-bold text-white bg-black bg-opacity-50 px-1 rounded">
                {player.username}
              </div>
            </div>
          ))}
          
          {/* Render current player */}
          <div
            className="absolute flex flex-col items-center z-10"
            style={{
              left: currentPlayer.position.x * TILE_SIZE,
              top: currentPlayer.position.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          >
            <div 
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-lg ${
                currentPlayer.isMoving ? 'animate-bounce' : ''
              }`}
            >
              {currentPlayer.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs font-bold text-yellow-300 bg-black bg-opacity-50 px-1 rounded">
              {currentPlayer.username}
            </div>
          </div>
        </div>
      </div>

      {/* UI Overlays */}
      
      {/* Top-left: Player Stats */}
      <div className="absolute top-4 left-4 z-20">
        <Card className="bg-black/80 text-white border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg">{user?.username}</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Level {user?.level || 1}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <ProgressBar value={user?.health || 100} max={100} color="red" showValue={false} />
                <span className="text-sm">{user?.health || 100}/100</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-500" />
                <ProgressBar value={user?.exp || 0} max={user?.exp_to_next || 1000} color="blue" showValue={false} />
                <span className="text-sm">{user?.exp || 0}/{user?.exp_to_next || 1000}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top-right: Time and Coins */}
      <div className="absolute top-4 right-4 z-20">
        <Card className="bg-black/80 text-white border-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <div className="text-center">
                  <div className="font-bold">{formatGameTime(gameTime)}</div>
                  <div className="text-xs text-gray-300">
                    {getSeasonEmoji(gameTime.game_season)} Day {gameTime.game_day}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">{user?.coins || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom-left: Quest Popup */}
      <AnimatePresence>
        {questPopup && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="absolute bottom-4 left-4 z-20"
          >
            <Card className="bg-black/90 text-white border-yellow-500 max-w-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={
                    questPopup.type === 'completed' ? 'bg-green-500' :
                    questPopup.type === 'started' ? 'bg-blue-500' : 'bg-yellow-500'
                  }>
                    {questPopup.type === 'completed' ? '✅ Completed' :
                     questPopup.type === 'started' ? '🎯 Started' : '📝 Updated'}
                  </Badge>
                </div>
                <h4 className="font-bold mb-1">{questPopup.title}</h4>
                <p className="text-sm text-gray-300">{questPopup.message}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-right: Minimap */}
      {showMinimap && (
        <div className="absolute bottom-4 right-4 z-20">
          <Card className="bg-black/80 text-white border-purple-500">
            <CardContent className="p-2">
              <div className="w-32 h-20 bg-green-800 relative rounded overflow-hidden">
                {/* Player dot */}
                <div
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${(currentPlayer.position.x / MAP_WIDTH) * 100}%`,
                    top: `${(currentPlayer.position.y / MAP_HEIGHT) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                
                {/* NPC dots */}
                {npcs.map((npc) => (
                  <div
                    key={npc.id}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    style={{
                      left: `${(npc.position.x / MAP_WIDTH) * 100}%`,
                      top: `${(npc.position.y / MAP_HEIGHT) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
                
                {/* Object dots */}
                {worldObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className="absolute w-1 h-1 bg-gray-400 rounded-full"
                    style={{
                      left: `${(obj.position.x / MAP_WIDTH) * 100}%`,
                      top: `${(obj.position.y / MAP_HEIGHT) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </div>
              <div className="text-xs text-center mt-1">Code Valley</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Controls */}
      {isMobile && (
        <div className="absolute bottom-20 left-4 z-20">
          <div
            ref={joystickRef}
            className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center border-2 border-white/30"
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
          >
            <div
              className="w-8 h-8 bg-white rounded-full transition-transform"
              style={{
                transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/50 text-white border-white/30"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowMinimap(!showMinimap)}
          className="bg-black/50 text-white border-white/30"
        >
          <MapIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Instructions */}
      {!isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <Card className="bg-black/80 text-white border-purple-500">
            <CardContent className="p-2">
              <div className="text-xs text-center">
                Use <kbd className="px-1 bg-gray-700 rounded">WASD</kbd> or <kbd className="px-1 bg-gray-700 rounded">Arrow Keys</kbd> to move • Click objects to interact
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}