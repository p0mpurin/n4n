"use client"

import { useState } from 'react'
import { Trophy, Star, Lock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProfile } from '@/lib/profile-context'
import { AchievementCard } from './achievement-card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

export function AchievementsSection() {
  const { profile, style } = useProfile()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const unlockedAchievements = profile.achievements.filter(a => a.unlockedAt)
  const inProgressAchievements = profile.achievements.filter(a => !a.unlockedAt && a.progress !== undefined)
  const lockedAchievements = profile.achievements.filter(a => !a.unlockedAt && a.progress === undefined)

  const totalAchievements = profile.achievements.length
  const unlockedCount = unlockedAchievements.length
  const completionPercent = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0

  // Featured achievements (most recent unlocks or closest to completion)
  const featuredAchievements = [
    ...unlockedAchievements.slice(-2),
    ...inProgressAchievements.sort((a, b) => {
      const aPercent = (a.progress || 0) / (a.maxProgress || 1)
      const bPercent = (b.progress || 0) / (b.maxProgress || 1)
      return bPercent - aPercent
    }).slice(0, 2)
  ].slice(0, 4)

  return (
    <div 
      className="rounded-xl border border-border bg-card/30 p-6"
      style={{ fontFamily: style.fontFamily }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" style={{ color: style.primaryColor }} />
          <h2 className="text-lg font-bold" style={{ color: style.textColor }}>
            Achievements
          </h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                All Achievements
              </DialogTitle>
            </DialogHeader>
            
            {/* Overall Progress */}
            <div className="p-4 rounded-lg bg-secondary/30 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-primary font-bold">
                  {unlockedCount} / {totalAchievements}
                </span>
              </div>
              <Progress value={completionPercent} className="h-2" />
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unlocked">
                  <Star className="h-3 w-3 mr-1" />
                  Unlocked
                </TabsTrigger>
                <TabsTrigger value="progress">In Progress</TabsTrigger>
                <TabsTrigger value="locked">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[400px] mt-4">
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {profile.achievements.map((achievement) => (
                      <AchievementCard 
                        key={achievement.id} 
                        achievement={achievement}
                        size="md"
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="unlocked" className="mt-0">
                  {unlockedAchievements.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {unlockedAchievements.map((achievement) => (
                        <AchievementCard 
                          key={achievement.id} 
                          achievement={achievement}
                          size="md"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Star className="h-12 w-12 mb-3 opacity-50" />
                      <p>No achievements unlocked yet</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="progress" className="mt-0">
                  {inProgressAchievements.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {inProgressAchievements.map((achievement) => (
                        <AchievementCard 
                          key={achievement.id} 
                          achievement={achievement}
                          size="md"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Trophy className="h-12 w-12 mb-3 opacity-50" />
                      <p>No achievements in progress</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="locked" className="mt-0">
                  {lockedAchievements.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {lockedAchievements.map((achievement) => (
                        <AchievementCard 
                          key={achievement.id} 
                          achievement={achievement}
                          size="md"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Lock className="h-12 w-12 mb-3 opacity-50" />
                      <p>No locked achievements</p>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium" style={{ color: style.primaryColor }}>
            {unlockedCount}/{totalAchievements}
          </span>
        </div>
        <Progress value={completionPercent} className="h-2" />
      </div>
      
      {/* Featured Achievements */}
      <div className="grid grid-cols-4 gap-2">
        {featuredAchievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement}
            size="sm"
          />
        ))}
      </div>
    </div>
  )
}
