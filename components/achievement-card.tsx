"use client"

import { cn } from '@/lib/utils'
import { type Achievement } from '@/lib/mock-data'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface AchievementCardProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementCard({ achievement, size = 'md' }: AchievementCardProps) {
  const isUnlocked = !!achievement.unlockedAt
  const hasProgress = achievement.progress !== undefined && achievement.maxProgress !== undefined
  const progressPercent = hasProgress 
    ? (achievement.progress! / achievement.maxProgress!) * 100 
    : 0

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  }

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative group rounded-xl border transition-all cursor-default",
              sizeClasses[size],
              isUnlocked 
                ? "bg-card border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10" 
                : "bg-muted/30 border-border opacity-60 grayscale hover:opacity-80"
            )}
          >
            {/* Glow effect for unlocked */}
            {isUnlocked && (
              <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            
            <div className="relative flex flex-col items-center text-center">
              {/* Icon */}
              <div className={cn(
                "mb-2 transition-transform group-hover:scale-110",
                iconSizes[size],
                !isUnlocked && "grayscale"
              )}>
                {achievement.icon}
              </div>
              
              {/* Name */}
              <h4 className={cn(
                "font-semibold",
                size === 'sm' && "text-xs",
                size === 'md' && "text-sm",
                size === 'lg' && "text-base"
              )}>
                {achievement.name}
              </h4>
              
              {/* Progress Bar */}
              {hasProgress && !isUnlocked && (
                <div className="w-full mt-2">
                  <Progress value={progressPercent} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {achievement.progress} / {achievement.maxProgress}
                  </p>
                </div>
              )}
              
              {/* Unlocked Date */}
              {isUnlocked && size !== 'sm' && (
                <Badge variant="secondary" className="mt-2 text-[10px]">
                  Unlocked
                </Badge>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          <div className="space-y-1">
            <p className="font-semibold">{achievement.name}</p>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
            {isUnlocked && achievement.unlockedAt && (
              <p className="text-xs text-primary">
                Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
            {hasProgress && !isUnlocked && (
              <p className="text-xs">
                Progress: {achievement.progress} / {achievement.maxProgress}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
