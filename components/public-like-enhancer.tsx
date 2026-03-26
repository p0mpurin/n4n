'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { hasUserLiked, toggleLike } from '@/lib/likes'

type Props = {
  profileId: string
  initialLikes: number
}

function renderLikeLabel(count: number): string {
  return `<strong>${count}</strong> likes`
}

function findLikeButton(): HTMLButtonElement | null {
  return (
    document.querySelector<HTMLButtonElement>('[data-n4n-like-btn]') ??
    document.querySelector<HTMLButtonElement>('.social-stats button.stat-like-action')
  )
}

export function PublicLikeEnhancer({ profileId, initialLikes }: Props) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const btn = findLikeButton()
    if (!btn) return

    let mounted = true
    let likes = initialLikes
    let liked = false

    const ownProfile = Boolean(user && user.id === profileId)

    const apply = () => {
      btn.innerHTML = renderLikeLabel(likes)
      btn.setAttribute('aria-pressed', liked ? 'true' : 'false')
      if (loading) {
        btn.removeAttribute('title')
        btn.disabled = false
        btn.style.removeProperty('opacity')
        btn.style.removeProperty('pointer-events')
        btn.style.cursor = 'pointer'
        return
      }
      if (!user) {
        btn.setAttribute('title', 'Sign in to like')
        btn.disabled = false
        btn.style.removeProperty('opacity')
        btn.style.removeProperty('pointer-events')
        btn.style.cursor = 'pointer'
        return
      }
      if (ownProfile) {
        btn.setAttribute('title', "You can't like your own profile")
        btn.disabled = true
        btn.style.opacity = '0.7'
        btn.style.pointerEvents = 'none'
        btn.style.removeProperty('cursor')
        return
      }
      btn.setAttribute('title', liked ? 'Unlike' : 'Like')
      btn.disabled = false
      btn.style.removeProperty('opacity')
      btn.style.removeProperty('pointer-events')
      btn.style.cursor = 'pointer'
    }

    const init = async () => {
      if (loading) return
      if (user && !ownProfile) {
        liked = await hasUserLiked(profileId, user.id)
      } else {
        liked = false
      }
      if (!mounted) return
      apply()
    }

    const onClick = async () => {
      if (loading) return
      if (!user) {
        const next = encodeURIComponent(pathname || '/')
        window.location.assign(`/login?next=${next}`)
        return
      }
      if (ownProfile) return
      const result = await toggleLike(profileId, user.id)
      likes = result.count
      liked = result.liked
      if (!mounted) return
      apply()
    }

    btn.addEventListener('click', onClick)
    apply()
    init()

    return () => {
      mounted = false
      btn.removeEventListener('click', onClick)
    }
  }, [user, loading, profileId, initialLikes, pathname])

  return null
}

