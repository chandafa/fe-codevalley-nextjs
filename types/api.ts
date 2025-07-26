// API Response Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  xpToNext: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  status: 'available' | 'active' | 'completed' | 'locked';
  requirements: string[];
  rewards: {
    xp: number;
    items: InventoryItem[];
  };
  progress?: number;
  maxProgress?: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'tool' | 'resource' | 'consumable' | 'equipment';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  icon: string;
  stats?: Record<string, number>;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  dialogues: Dialogue[];
  questsAvailable: string[];
  relationshipLevel: number;
}

export interface Dialogue {
  id: string;
  text: string;
  responses?: DialogueResponse[];
  triggers?: string[];
}

export interface DialogueResponse {
  id: string;
  text: string;
  nextDialogueId?: string;
  consequence?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewards: {
    xp: number;
    items: InventoryItem[];
  };
  expiresAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requirements: string[];
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface CodeBattle {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  problem: string;
  testCases: TestCase[];
  playerSolution?: string;
  status: 'pending' | 'completed' | 'failed';
  score?: number;
  timeSpent?: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface StoryProgress {
  id: string;
  chapterId: string;
  completed: boolean;
  progress: number;
  unlocked: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}