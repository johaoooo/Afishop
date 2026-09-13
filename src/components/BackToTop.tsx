import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

/**
 * Bouton retour en haut avec anneau de progression,
 * transposition du BackToTop Wappe Food en vert AFI.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShow(y > 600);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const r = 15;
  const c = 2 * Math.PI * r;

  return (
    <button
      type="button"
      aria-label="Retour en haut"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="wappe-back-top"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="#05a855"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
        />
      </svg>
      <FiArrowUp className="relative w-4 h-4" />
    </button>
  );
}
