/**
 * Horizontal song row: prev/next buttons for `.song-scroll-row[data-n4n-scroll]`.
 * Theme with CSS variables on `.song-scroll-row` (see generateProfileCss).
 */

/** Minified for iframe srcDoc; keep in sync with initSongScrollRows below. */
export const SONG_SCROLL_NAV_INLINE =
  '(function(){function i(w){if(w.getAttribute("data-n4n-bound"))return;w.setAttribute("data-n4n-bound","1");var t=w.querySelector(".song-scroll");if(!t)return;var p=w.querySelector(".song-scroll-btn--prev"),n=w.querySelector(".song-scroll-btn--next");function step(d){t.scrollBy({left:d*t.clientWidth*0.85,behavior:"smooth"})}function sync(){var mx=Math.max(0,t.scrollWidth-t.clientWidth-1);if(p)p.disabled=t.scrollLeft<=2;if(n)n.disabled=t.scrollLeft>=mx}if(p)p.addEventListener("click",function(){step(-1)});if(n)n.addEventListener("click",function(){step(1)});t.addEventListener("scroll",sync);if(typeof ResizeObserver!="undefined")try{new ResizeObserver(sync).observe(t)}catch(e){}sync()}document.querySelectorAll("[data-n4n-scroll]").forEach(i)})();'

function bindWrap(wrap: HTMLElement) {
  if (wrap.getAttribute('data-n4n-bound')) return
  wrap.setAttribute('data-n4n-bound', '1')
  const track = wrap.querySelector<HTMLElement>('.song-scroll')
  if (!track) return
  const prev = wrap.querySelector<HTMLButtonElement>('.song-scroll-btn--prev')
  const next = wrap.querySelector<HTMLButtonElement>('.song-scroll-btn--next')
  const step = (dir: number) => {
    track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: 'smooth' })
  }
  const sync = () => {
    const max = Math.max(0, track.scrollWidth - track.clientWidth - 1)
    if (prev) prev.disabled = track.scrollLeft <= 2
    if (next) next.disabled = track.scrollLeft >= max
  }
  prev?.addEventListener('click', () => step(-1))
  next?.addEventListener('click', () => step(1))
  track.addEventListener('scroll', sync)
  try {
    const ro = new ResizeObserver(sync)
    ro.observe(track)
  } catch {
    /* ignore */
  }
  sync()
}

export function initSongScrollRows(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-n4n-scroll]').forEach((wrap) => {
    bindWrap(wrap)
  })
}
