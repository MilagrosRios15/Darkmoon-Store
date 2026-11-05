import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Posición del scroll guardada para cada entrada del historial.
const savedPositions = new Map<string, number>();

// Tiempo máximo para esperar a que la página tenga su altura final
// (los productos llegan desde la API después de dibujar la página).
const RESTORE_TIMEOUT_MS = 3000;

export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentKey = useRef(location.key);
  // Mientras se restaura una posición, no se guarda la posición actual.
  const restoring = useRef(false);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    const handleScroll = () => {
      if (restoring.current) return;
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

    // Página nueva (enlace o botón): empieza arriba de todo.
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
      return;
    }

    // Atrás / Adelante: se vuelve a la posición guardada.
    const target = savedPositions.get(location.key) ?? 0;
    window.scrollTo(0, target);

    // Si ya llegó (o era arriba de todo), no hace falta nada más.
    if (target === 0 || Math.abs(window.scrollY - target) < 2) return;

    // La página todavía es más corta que la posición guardada porque los
    // productos no llegaron: se reintenta cada vez que la página crece.
    restoring.current = true;

    const observer = new ResizeObserver(() => {
      window.scrollTo(0, target);
      if (Math.abs(window.scrollY - target) < 2) stop();
    });

    const timeoutId = window.setTimeout(stop, RESTORE_TIMEOUT_MS);

    function stop() {
      restoring.current = false;
      observer.disconnect();
      window.clearTimeout(timeoutId);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
    }

    // Si el usuario empieza a moverse, se deja de insistir.
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stop);

    observer.observe(document.body);

    return stop;
  }, [location.key, navigationType]);

  return null;
}