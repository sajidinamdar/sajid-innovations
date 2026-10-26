import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const scrollToElement = () => {
        try {
          const el = document.getElementById(targetId) || document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            return true;
          }
        } catch {
          // ignore selector errors
        }
        return false;
      };

      if (!scrollToElement()) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (scrollToElement() || attempts >= 20) {
            clearInterval(interval);
          }
        }, 40);
        return () => clearInterval(interval);
      }
      return;
    }

    // When navigating to a new route without a hash, instantly reset scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
