'use client'

import { useState } from 'react'
import { ChevronDown, Copy, Check, Sparkles, Wand2 } from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { buildStudioAiThemePrompt, buildStudioAiFullPagePrompt } from '@/lib/ai-studio-prompt'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

export function AiPromptPanel({ className }: { className?: string }) {
  const { profile } = useProfile()
  const [open, setOpen] = useState(false)
  const [creativeBrief, setCreativeBrief] = useState('')
  const [includeLibrary, setIncludeLibrary] = useState(true)
  const [copied, setCopied] = useState<'theme' | 'full' | null>(null)

  const themePrompt = buildStudioAiThemePrompt(profile, { creativeBrief })
  const fullPrompt = buildStudioAiFullPagePrompt(profile, {
    creativeBrief,
    includeLibrarySnapshot: includeLibrary,
  })

  const copy = async (kind: 'theme' | 'full') => {
    const text = kind === 'theme' ? themePrompt : fullPrompt
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied(null)
    }
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn('rounded-xl border border-border bg-card/40', className)}>
      <CollapsibleTrigger className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-card/60">
        <Wand2 className="h-4 w-4 shrink-0 text-violet-400" />
        <span className="flex-1 text-sm font-semibold">AI theme generator</span>
        <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400">
          Best with Claude
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-3.5 pb-4 pt-3 space-y-4">
        {/* Vibe input */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">
            Describe your vibe
          </Label>
          <Textarea
            value={creativeBrief}
            onChange={(e) => setCreativeBrief(e.target.value)}
            placeholder='e.g. "pastel pink + dark, soft glass panels, cozy rounded cards, big avatar"'
            className="min-h-[64px] resize-y text-xs leading-relaxed"
            spellCheck
          />
          <p className="text-[10px] text-muted-foreground/70">
            Layout, colors, typography, density — describe anything. The prompt handles the rest.
          </p>
        </div>

        {/* Theme prompt (primary) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-semibold">Theme (CSS only)</span>
            <span className="ml-auto text-[10px] text-muted-foreground">Recommended</span>
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-relaxed">
            Styles your page, avatar, stats, song cards, and Studio chrome. New sections automatically inherit the theme.
          </p>
          <Button type="button" size="sm" className="w-full" onClick={() => copy('theme')}>
            {copied === 'theme' ? (
              <><Check className="mr-2 h-3.5 w-3.5 text-green-400" /> Copied</>
            ) : (
              <><Copy className="mr-2 h-3.5 w-3.5" /> Copy theme prompt</>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] text-muted-foreground/60">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Full page prompt */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Full page (HTML + CSS)</span>
            <span className="ml-auto rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400">
              Advanced
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-relaxed">
            Only use with <strong>Custom HTML</strong> enabled. Generates both markup and styles. Data changes won&apos;t auto-update.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/30 px-2.5 py-2">
            <span className="text-xs">Include library URLs</span>
            <Switch checked={includeLibrary} onCheckedChange={setIncludeLibrary} />
          </div>
          <Button type="button" variant="secondary" size="sm" className="w-full" onClick={() => copy('full')}>
            {copied === 'full' ? (
              <><Check className="mr-2 h-3.5 w-3.5 text-green-400" /> Copied</>
            ) : (
              <><Copy className="mr-2 h-3.5 w-3.5" /> Copy full-page prompt</>
            )}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
