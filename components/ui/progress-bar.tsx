'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  animated?: boolean;
}

export function ProgressBar({
  value,
  max,
  label,
  showValue = true,
  className,
  color = 'blue',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showValue && (
            <span className="text-sm text-gray-500">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        {animated ? (
          <motion.div
            className={cn('h-2.5 rounded-full', colorClasses[color])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={cn('h-2.5 rounded-full', colorClasses[color])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
}