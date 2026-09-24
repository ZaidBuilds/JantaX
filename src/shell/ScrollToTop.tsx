import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Route changes start at the top of the page, like a normal site. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
