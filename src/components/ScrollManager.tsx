import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const savedPositions = new Map<string, number>();

export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentKey = useRef(location.key);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    const handleScroll = () => {
      savedPositions.set(currentKey.current, window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.history.scrollRestoration = 'auto';
    };
  }, []);

  useLayoutEffect(() => {
    currentKey.current = location.key;

    if (navigationType === 'POP') {
      window.scrollTo(0, savedPositions.get(location.key) ?? 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.key, navigationType]);

  return null;
}