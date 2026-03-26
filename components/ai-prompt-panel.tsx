'use client'

import { useState } from 'react'
import { ChevronDown, Copy, Check, Sparkles } from 'lucide-react'
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
  const [open, setOpen] = useState(true)
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
    <Collapsible open={open} onOpenChange={setOpen} className={cn('rounded-lg border border-border bg-card/30', className)}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-card/50">
        <Sparkles className="h-4 w-4 shrink-0 text-amber-500/90" />
        <span className="flex-1 text-sm font-semibold">AI prompt</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-3 pb-3 pt-1 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Theme (CSS only)</strong> is what you want most of the time: the app fills real HTML from your library, and your pasted CSS styles it. New sections and songs inherit the theme. This prompt also includes selectors for Studio/public likes-views-friends chrome. The model must not swap cover URLs or stream links—it only writes CSS.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Use <strong className="text-foreground">Full page</strong> only if you turn on <strong className="text-foreground">Custom HTML</strong> and will paste both HTML and CSS.
        </p>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Layout &amp; vibe (free-form)
          </Label>
          <Textarea
            value={creativeBrief}
            onChange={(e) => setCreativeBrief(e.target.value)}
            placeholder='e.g. "Y2K chrome, tight grids, neon green accents, huge section titles, lots of negative space"'
            className="min-h-[72px] resize-y text-xs"
            spellCheck
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md border border-border/80 bg-background/40 px-2 py-2">
          <div className="min-w-0">
            <p className="text-sm font-medium">Full page: include library URLs</p>
            <p className="text-xs text-muted-foreground">
              Encourages exact <code className="text-[10px]">href</code> / <code className="text-[10px]">img src</code> in generated HTML (not used for theme-only).
            </p>
          </div>
          <Switch checked={includeLibrary} onCheckedChange={setIncludeLibrary} />
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" size="sm" className="w-full" onClick={() => copy('theme')}>
            {copied === 'theme' ? (
              <>
                <Check className="mr-2 h-3.5 w-3.5 text-green-500" />
                Copied theme prompt
              </>
            ) : (
              <>
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy theme prompt (CSS only)
              </>
            )}
          </Button>
          <Button type="button" variant="secondary" size="sm" className="w-full" onClick={() => copy('full')}>
            {copied === 'full' ? (
              <>
                <Check className="mr-2 h-3.5 w-3.5 text-green-500" />
                Copied full-page prompt
              </>
            ) : (
              <>
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy full HTML + CSS prompt
              </>
            )}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
