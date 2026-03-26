"use client"

import { useProfile } from '@/lib/profile-context'
import { Music } from 'lucide-react'

export default function StudioPreviewPage() {
  const { buildSrcDoc, ready } = useProfile()

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Music className="h-10 w-10 animate-pulse text-neutral-600" />
      </div>
    )
  }

  return (
    <iframe
      title="Niche4Niche profile"
      className="h-screen w-screen border-0"
      srcDoc={buildSrcDoc()}
    />
  )
}
