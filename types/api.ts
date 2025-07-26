// API Response Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  level: number;
  exp: number;
  coins: number;
  health: number;
  energy: number;
  is_online: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface Friend {
  id: string;
  username: string;
  avatar_url?: string;
  level: number;
  is_online: boolean;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  reward_coins: number;
  reward_exp: number;
  required_items?: Record<string, number>;
  is_repeatable: boolean;
  is_active: boolean;
  status?: 'available' | 'active' | 'completed' | 'locked';
  progress?: number;
  max_progress?: number;
  created_at: string;
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
  is_equipped?: boolean;
  price?: number;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
  location: string;
  dialogues: Dialogue[];
  quests_available: string[];
  relationship_level: number;
  max_relationship: number;
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
  next_dialogue_id?: string;
  consequence?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: string;
  progress: number;
  max_progress: number;
  completed: boolean;
  reward_coins: number;
  reward_exp: number;
  expires_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  requirements: string[];
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  max_progress?: number;
  reward_coins?: number;
  reward_exp?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  earned_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  current_level: number;
  max_level: number;
  upgrade_cost: number;
  prerequisites?: string[];
  benefits: string[];
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  is_public: boolean;
  member_count: number;
  max_members: number;
  level: number;
  exp: number;
  created_at: string;
  owner: {
    id: string;
    username: string;
  };
}

export interface GuildMember {
  id: string;
  username: string;
  avatar_url?: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  contribution: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  start_time: string;
  end_time: string;
  reward_coins: number;
  reward_exp: number;
  max_participants?: number;
  current_participants: number;
  is_active: boolean;
  requirements?: string[];
}

export interface MiniGame {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'coding' | 'puzzle' | 'memory';
  difficulty: string;
  time_limit: number;
  reward_coins: number;
  reward_exp: number;
  questions?: MiniGameQuestion[];
}

export interface MiniGameQuestion {
  id: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
}

export interface MiniGameSession {
  id: string;
  minigame_id: string;
  score: number;
  time_taken: number;
  completed: boolean;
  answers: string[];
  started_at: string;
  completed_at?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  stock: number;
  is_available: boolean;
  discount?: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  result_item: string;
  result_quantity: number;
  required_items: Record<string, number>;
  crafting_time: number;
  required_skill_level?: number;
}

export interface MarketplaceListing {
  id: string;
  seller: {
    id: string;
    username: string;
  };
  item_name: string;
  description: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  content: TutorialStep[];
  reward_coins: number;
  reward_exp: number;
  completed?: boolean;
  progress?: number;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'quiz' | 'interactive';
  order: number;
}

export interface Notification {
  id: string;
  type: 'friend_request' | 'achievement' | 'quest' | 'guild' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

export interface DailyReward {
  id: string;
  day: number;
  reward_coins: number;
  reward_exp: number;
  reward_items?: InventoryItem[];
  claimed: boolean;
  available_at: string;
}

export interface UserStatistics {
  total_quests_completed: number;
  total_exp_earned: number;
  total_coins_earned: number;
  total_friends: number;
  login_streak: number;
  total_playtime: number;
  achievements_unlocked: number;
  skills_maxed: number;
  guild_contributions: number;
  marketplace_sales: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    level: number;
  };
  value: number;
  change: number;
}

export interface CodeBattle {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  problem: string;
  test_cases: TestCase[];
  player_solution?: string;
  status: 'pending' | 'completed' | 'failed';
  score?: number;
  time_spent?: number;
  reward_coins: number;
  reward_exp: number;
}

export interface TestCase {
  input: string;
  expected_output: string;
  hidden?: boolean;
}

export interface StoryProgress {
  id: string;
  chapter_id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  unlocked: boolean;
  reward_coins?: number;
  reward_exp?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}