'use client'

import { useEffect } from 'react'
import { initSongScrollRows } from '@/lib/song-scroll-nav'

/** Binds prev/next controls on public profile (server-rendered HTML fragment). */
export function SongScrollNavMount() {
  useEffect(() => {
    initSongScrollRows(document)
  }, [])
  return null
}
