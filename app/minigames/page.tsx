'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Brain,
  Code,
  Puzzle,
  Clock,
  Trophy,
  Play,
  Star,
  Target,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GameLayout } from '@/components/layout/game-layout';
import { useGameStore } from '@/lib/store';
import { api } from '@/lib/api';
import { MiniGame, MiniGameSession } from '@/types/api';
import { getDifficultyColor } from '@/lib/utils';

export default function MiniGamesPage() {
  const { miniGames, setMiniGames, addNotification } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [gameSession, setGameSession] = useState<MiniGameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const fetchMiniGames = async () => {
      try {
        setIsLoading(true);
        const response = await api.miniGames.list();
        setMiniGames(response.data.data);
      } catch (error) {
        console.error('Failed to fetch mini games:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat mini games',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMiniGames();
  }, [setMiniGames, addNotification]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStarted) {
      handleGameComplete();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted]);

  const handleStartGame = async (game: MiniGame) => {
    try {
      const response = await api.miniGames.start(game.id);
      const session = response.data.data;
      
      setSelectedGame(game);
      setGameSession(session);
      setCurrentQuestion(0);
      setAnswers([]);
      setTimeLeft(game.time_limit);
      setGameStarted(true);
      
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal memulai game',
      });
    }
  };

  const handleAnswerQuestion = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (selectedGame && currentQuestion < selectedGame.questions!.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleGameComplete();
    }
  };

  const handleGameComplete = async () => {
    if (!selectedGame || !gameSession) return;

    try {
      const score = calculateScore();
      const timeTaken = selectedGame.time_limit - timeLeft;
      
      await api.miniGames.submit(selectedGame.id, {
        answers,
        score,
        time_taken: timeTaken,
      });

      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Game Complete!',
        message: `Score: ${score}% | Time: ${timeTaken}s | Earned ${selectedGame.reward_coins} coins!`,
      });

      // Reset game state
      setSelectedGame(null);
      setGameSession(null);
      setGameStarted(false);
      setCurrentQuestion(0);
      setAnswers([]);
      setTimeLeft(0);

    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Gagal menyelesaikan game',
      });
    }
  };

  const calculateScore = (): number => {
    if (!selectedGame?.questions) return 0;
    
    let correct = 0;
    selectedGame.questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correct++;
      }
    });
    
    return Math.round((correct / selectedGame.questions.length) * 100);
  };

  const getGameIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return Brain;
      case 'coding':
        return Code;
      case 'puzzle':
        return Puzzle;
      case 'memory':
        return Target;
      default:
        return Gamepad2;
    }
  };

  const getGameColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'from-blue-500 to-blue-600';
      case 'coding':
        return 'from-green-500 to-green-600';
      case 'puzzle':
        return 'from-purple-500 to-purple-600';
      case 'memory':
        return 'from-orange-500 to-orange-600';
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
            <p className="text-gray-600">Loading mini games...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mini Games</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Test your programming knowledge with fun and challenging mini games!
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {miniGames.map((game, index) => {
            const GameIcon = getGameIcon(game.type);
            const gameColor = getGameColor(game.type);
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${gameColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <GameIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{game.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                      
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge variant="outline">{game.type}</Badge>
                        <Badge className={getDifficultyColor(game.difficulty)}>
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{game.time_limit}s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span>{game.reward_coins} coins</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-blue-500" />
                          <span>{game.reward_exp} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-500" />
                          <span>{game.questions?.length || 0} questions</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => handleStartGame(game)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Game
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {miniGames.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No mini games available</h3>
            <p className="text-gray-600">Check back later for new challenges!</p>
          </div>
        )}

        {/* Game Dialog */}
        <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedGame && (
                  <>
                    <div className={`w-8 h-8 bg-gradient-to-br ${getGameColor(selectedGame.type)} rounded-lg flex items-center justify-center`}>
                      {(() => {
                        const GameIcon = getGameIcon(selectedGame.type);
                        return <GameIcon className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                    {selectedGame.title}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedGame && gameStarted && (
              <div className="space-y-6">
                {/* Progress and Timer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Question {currentQuestion + 1} of {selectedGame.questions?.length || 0}
                    </span>
                    <Progress 
                      value={((currentQuestion + 1) / (selectedGame.questions?.length || 1)) * 100} 
                      className="w-32"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="font-mono text-lg font-bold text-red-500">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Question */}
                {selectedGame.questions && selectedGame.questions[currentQuestion] && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        {selectedGame.questions[currentQuestion].question}
                      </h3>
                      
                      {selectedGame.type === 'quiz' && selectedGame.questions[currentQuestion].options && (
                        <div className="space-y-3">
                          {selectedGame.questions[currentQuestion].options!.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full text-left justify-start h-auto p-4"
                              onClick={() => handleAnswerQuestion(option)}
                            >
                              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}

                      {selectedGame.type === 'coding' && (
                        <div className="space-y-4">
                          <textarea
                            className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
                            placeholder="Write your code here..."
                            onChange={(e) => {
                              const newAnswers = [...answers];
                              newAnswers[currentQuestion] = e.target.value;
                              setAnswers(newAnswers);
                            }}
                          />
                          <Button onClick={() => handleAnswerQuestion(answers[currentQuestion] || '')}>
                            Submit Code
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GameLayout>
  );
}