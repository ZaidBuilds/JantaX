import { useEffect } from 'react';

const SELECTOR = '.table-wrap, .data-table-wrap, .jantax-table-wrapper';

/** Name a scroll box after its table caption or the nearest heading above it. */
function labelFor(el: HTMLElement): string {
  const caption = el.querySelector('caption')?.textContent?.trim();
  if (caption) return caption;
  let node: Element | null = el;
  while (node && node !== document.body) {
    let prev = node.previousElementSibling;
    while (prev) {
      const h = prev.matches('h1,h2,h3,h4') ? prev : prev.querySelector('h1,h2,h3,h4');
      if (h?.textContent?.trim()) return `${h.textContent.trim()} (table)`;
      prev = prev.previousElementSibling;
    }
    node = node.parentElement;
  }
  return 'Data table';
}

/**
 * Wide tables scroll sideways inside their wrapper. Keyboard users can only scroll a box they can focus,
 * so any wrapper that actually overflows becomes a named, focusable region (WCAG 2.1.1).
 */
export function ScrollableRegions() {
  useEffect(() => {
    let frame = 0;
    const apply = () => {
      frame = 0;
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        const scrolls = el.scrollWidth > el.clientWidth + 1;
        if (scrolls && !el.hasAttribute('tabindex')) {
          el.tabIndex = 0;
          el.setAttribute('role', 'region');
          if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', labelFor(el));
          el.dataset.scrollRegion = 'auto';
        } else if (!scrolls && el.dataset.scrollRegion === 'auto') {
          el.removeAttribute('tabindex');
          el.removeAttribute('role');
          el.removeAttribute('aria-label');
          delete el.dataset.scrollRegion;
        }
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
