import { defaultStyle, type ProfileStyle } from './mock-data'

export function mergeProfileStyle(rowStyle: unknown): ProfileStyle {
  return rowStyle && typeof rowStyle === 'object'
    ? { ...defaultStyle, ...(rowStyle as Partial<ProfileStyle>) }
    : defaultStyle
}

/** Reads saved background: prefers `style.backgroundImage` (no DB migration), then legacy `background_image_url`. */
export function backgroundImageFromRow(row: Record<string, unknown>): string {
  const merged = mergeProfileStyle(row.style)
  const fromStyle = typeof merged.backgroundImage === 'string' ? merged.backgroundImage.trim() : ''
  if (fromStyle) return fromStyle
  const legacy = typeof row.background_image_url === 'string' ? row.background_image_url.trim() : ''
  return legacy || ''
}
