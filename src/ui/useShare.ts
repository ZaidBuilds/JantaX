import { useCallback } from 'react';
import { useToast } from './Toast';

/** Native share sheet where available, otherwise copy the link and confirm. */
export function useShare() {
  const toast = useToast();
  return useCallback(
    async (data: { title: string; text?: string; url?: string }) => {
      const url = data.url || window.location.href;
      try {
        if (navigator.share) {
          await navigator.share({ title: data.title, text: data.text, url });
          return;
        }
      } catch (e) {
        if ((e as DOMException)?.name === 'AbortError') return;
      }
      try {
        await navigator.clipboard.writeText(url);
        toast('Link copied to clipboard');
      } catch {
        toast('Could not copy the link');
      }
    },
    [toast]
  );
}
