'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { formatXP } from '@/lib/utils';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  showLevel?: boolean;
  className?: string;
}

export function XPBar({
  currentXP,
  nextLevelXP,
  level,
  showLevel = true,
  className,
}: XPBarProps) {
  const percentage = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      {showLevel && (
        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-600 fill-current" />
          <span className="text-sm font-bold text-yellow-800">{level}</span>
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">XP</span>
          <span className="text-xs text-gray-500">
            {formatXP(currentXP)}/{formatXP(nextLevelXP)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}