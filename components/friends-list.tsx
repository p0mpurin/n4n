"use client"

import { useState } from 'react'
import { Users, UserPlus, Search, ArrowUpDown, Sparkles } from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { type Friend } from '@/lib/mock-data'
import { FriendCard } from './friend-card'
import { TasteComparison } from './taste-comparison'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function FriendsList() {
  const { profile, style, removeFriend, addFriend } = useProfile()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'match' | 'shared'>('match')
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [comparingFriend, setComparingFriend] = useState<Friend | null>(null)

  // Filter friends
  const filteredFriends = profile.friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort friends
  const sortedFriends = [...filteredFriends].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.displayName.localeCompare(b.displayName)
      case 'match':
        return (b.tasteMatch || 0) - (a.tasteMatch || 0)
      case 'shared':
        return (b.sharedSongs || 0) - (a.sharedSongs || 0)
      default:
        return 0
    }
  })

  // Get online/listening friends
  const activeFriends = sortedFriends.filter(f => f.status !== 'offline')
  const offlineFriends = sortedFriends.filter(f => f.status === 'offline')

  const handleAddFriend = () => {
    if (!newUsername.trim()) return
    
    // Simulate adding a friend (in production, this would be an API call)
    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      username: newUsername.toLowerCase().replace(/\s/g, ''),
      displayName: newUsername,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUsername}`,
      status: 'offline',
      sharedSongs: Math.floor(Math.random() * 20),
      tasteMatch: Math.floor(Math.random() * 40) + 50
    }
    
    addFriend(newFriend)
    setNewUsername('')
    setIsAddFriendOpen(false)
  }

  return (
    <div 
      className="space-y-6"
      style={{ fontFamily: style.fontFamily }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" style={{ color: style.primaryColor }} />
          <h2 className="text-xl font-bold" style={{ color: style.textColor }}>
            Friends
          </h2>
          <span className="text-sm text-muted-foreground">
            {profile.friends.length} connections
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-48"
            />
          </div>
          
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy('match')}>
                Taste Match {sortBy === 'match' && '•'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('shared')}>
                Shared Songs {sortBy === 'shared' && '•'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                Name {sortBy === 'name' && '•'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Add Friend */}
          <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" style={{ backgroundColor: style.primaryColor }}>
                <UserPlus className="h-4 w-4" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Friend</DialogTitle>
                <DialogDescription>
                  Enter a username to connect and compare music taste.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username..."
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Once connected, you can compare music libraries and discover shared songs.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFriendOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFriend} disabled={!newUsername.trim()}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Active Friends */}
      {activeFriends.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-sm font-medium text-muted-foreground">
              Active Now ({activeFriends.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onRemove={() => removeFriend(friend.id)}
                onCompare={() => setComparingFriend(friend)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Offline Friends */}
      {offlineFriends.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Offline ({offlineFriends.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {offlineFriends.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onRemove={() => removeFriend(friend.id)}
                onCompare={() => setComparingFriend(friend)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {sortedFriends.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Users className="h-16 w-16 mb-4 opacity-50" />
          {searchQuery ? (
            <>
              <p className="text-lg font-medium">No friends found</p>
              <p className="text-sm">Try a different search term</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">No friends yet</p>
              <p className="text-sm">Add friends to compare music taste</p>
              <Button 
                className="mt-4 gap-2" 
                onClick={() => setIsAddFriendOpen(true)}
                style={{ backgroundColor: style.primaryColor }}
              >
                <UserPlus className="h-4 w-4" />
                Add Your First Friend
              </Button>
            </>
          )}
        </div>
      )}
      
      {/* Top Matches Highlight */}
      {sortedFriends.length > 0 && (
        <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Top Taste Matches</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {sortedFriends
              .filter(f => (f.tasteMatch || 0) >= 80)
              .slice(0, 3)
              .map((friend) => (
                <Button
                  key={friend.id}
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={() => setComparingFriend(friend)}
                >
                  {friend.displayName}
                  <span className="text-primary font-bold">{friend.tasteMatch}%</span>
                </Button>
              ))}
            {sortedFriends.filter(f => (f.tasteMatch || 0) >= 80).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No taste twins found yet. Keep adding friends!
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Taste Comparison Modal */}
      {comparingFriend && (
        <TasteComparison
          friend={comparingFriend}
          isOpen={!!comparingFriend}
          onClose={() => setComparingFriend(null)}
        />
      )}
    </div>
  )
}
