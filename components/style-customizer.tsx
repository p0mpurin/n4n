"use client"

import { useState } from 'react'
import { Paintbrush, Type, Maximize, Code, RotateCcw, Check, X, Eye, EyeOff } from 'lucide-react'
import { useProfile } from '@/lib/profile-context'
import { fontOptions, defaultStyle } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export function StyleCustomizer() {
  const { style, updateStyle, resetStyle } = useProfile()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentStyle = style

  const handleResetToDefault = () => {
    resetStyle()
  }

  const colorPresets = [
    { name: 'Midnight', bg: '#0a0a0a', primary: '#22c55e', accent: '#3b82f6' },
    { name: 'Ocean', bg: '#0c1929', primary: '#06b6d4', accent: '#8b5cf6' },
    { name: 'Sunset', bg: '#1a0a0a', primary: '#f97316', accent: '#ec4899' },
    { name: 'Forest', bg: '#0a1a0a', primary: '#22c55e', accent: '#84cc16' },
    { name: 'Vapor', bg: '#1a0a1a', primary: '#d946ef', accent: '#06b6d4' },
    { name: 'Minimal', bg: '#ffffff', primary: '#0a0a0a', accent: '#6b7280' },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Paintbrush className="h-4 w-4" />
          Customize
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Customize Profile
          </SheetTitle>
          <SheetDescription>
            Personalize your profile with custom colors, fonts, and styles. Changes preview live.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex items-center gap-2 py-4">
          <Button size="sm" variant="ghost" onClick={handleResetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to defaults
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors" className="text-xs">
                <Paintbrush className="h-3 w-3 mr-1" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-xs">
                <Type className="h-3 w-3 mr-1" />
                Type
              </TabsTrigger>
              <TabsTrigger value="layout" className="text-xs">
                <Maximize className="h-3 w-3 mr-1" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="css" className="text-xs">
                <Code className="h-3 w-3 mr-1" />
                CSS
              </TabsTrigger>
            </TabsList>
            
            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-6 pt-4">
              {/* Presets */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Presets</Label>
                <div className="grid grid-cols-3 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        updateStyle({
                          backgroundColor: preset.bg,
                          primaryColor: preset.primary,
                          accentColor: preset.accent,
                          textColor: preset.bg === '#ffffff' ? '#0a0a0a' : '#fafafa'
                        })
                      }}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex gap-1">
                        <div 
                          className="h-4 w-4 rounded-full border" 
                          style={{ backgroundColor: preset.bg }}
                        />
                        <div 
                          className="h-4 w-4 rounded-full" 
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="h-4 w-4 rounded-full" 
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-[10px]">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Custom Colors */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Custom Colors</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Background</Label>
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded-md border cursor-pointer"
                        style={{ backgroundColor: currentStyle.backgroundColor }}
                      />
                      <Input
                        type="text"
                        value={currentStyle.backgroundColor}
                        onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                        className="h-10 font-mono text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Text</Label>
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded-md border cursor-pointer"
                        style={{ backgroundColor: currentStyle.textColor }}
                      />
                      <Input
                        type="text"
                        value={currentStyle.textColor}
                        onChange={(e) => updateStyle({ textColor: e.target.value })}
                        className="h-10 font-mono text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Primary</Label>
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded-md border cursor-pointer"
                        style={{ backgroundColor: currentStyle.primaryColor }}
                      />
                      <Input
                        type="text"
                        value={currentStyle.primaryColor}
                        onChange={(e) => updateStyle({ primaryColor: e.target.value })}
                        className="h-10 font-mono text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Accent</Label>
                    <div className="flex gap-2">
                      <div 
                        className="h-10 w-10 rounded-md border cursor-pointer"
                        style={{ backgroundColor: currentStyle.accentColor }}
                      />
                      <Input
                        type="text"
                        value={currentStyle.accentColor}
                        onChange={(e) => updateStyle({ accentColor: e.target.value })}
                        className="h-10 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Font Family</Label>
                  <Select
                    value={currentStyle.fontFamily}
                    onValueChange={(value) => updateStyle({ fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Font Size</Label>
                    <span className="text-xs text-muted-foreground">{currentStyle.fontSize}</span>
                  </div>
                  <Slider
                    value={[parseInt(currentStyle.fontSize)]}
                    onValueChange={([value]) => updateStyle({ fontSize: `${value}px` })}
                    min={12}
                    max={24}
                    step={1}
                  />
                </div>
                
                {/* Font Preview */}
                <div 
                  className="p-4 rounded-lg border bg-card"
                  style={{ 
                    fontFamily: currentStyle.fontFamily,
                    fontSize: currentStyle.fontSize
                  }}
                >
                  <p className="font-bold mb-1">The quick brown fox jumps</p>
                  <p className="text-muted-foreground">over the lazy dog.</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Border Radius</Label>
                    <span className="text-xs text-muted-foreground">{currentStyle.borderRadius}</span>
                  </div>
                  <Slider
                    value={[parseInt(currentStyle.borderRadius)]}
                    onValueChange={([value]) => updateStyle({ borderRadius: `${value}px` })}
                    min={0}
                    max={24}
                    step={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Spacing</Label>
                    <span className="text-xs text-muted-foreground">{currentStyle.spacing}</span>
                  </div>
                  <Slider
                    value={[parseInt(currentStyle.spacing)]}
                    onValueChange={([value]) => updateStyle({ spacing: `${value}px` })}
                    min={8}
                    max={32}
                    step={4}
                  />
                </div>
                
                {/* Layout Preview */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Preview</Label>
                  <div className="flex gap-2">
                    <div 
                      className="h-16 w-16 bg-primary"
                      style={{ borderRadius: currentStyle.borderRadius }}
                    />
                    <div 
                      className="h-16 w-16 bg-secondary"
                      style={{ borderRadius: currentStyle.borderRadius }}
                    />
                    <div 
                      className="h-16 w-16 bg-muted"
                      style={{ borderRadius: currentStyle.borderRadius }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Custom CSS Tab */}
            <TabsContent value="css" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom CSS</Label>
                <p className="text-xs text-muted-foreground">
                  Write custom CSS to style your profile. Use .profile-customizable to target your profile container.
                </p>
                <Textarea
                  value={currentStyle.customCSS}
                  onChange={(e) => updateStyle({ customCSS: e.target.value })}
                  placeholder={`.profile-customizable {
  /* Your custom styles here */
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.profile-customizable h1 {
  text-shadow: 0 0 20px var(--primary);
}`}
                  className="min-h-[200px] font-mono text-xs"
                />
              </div>
              
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
                <p className="text-xs text-yellow-500">
                  <strong>Tip:</strong> Use CSS variables like var(--user-primary), var(--user-accent) to reference your chosen colors.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
