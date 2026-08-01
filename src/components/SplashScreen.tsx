import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    const update = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct < 1) requestAnimationFrame(update);
      else onFinish();
    };
    const raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0d2818] flex flex-col items-center justify-center select-none">
      <p className="text-5xl sm:text-6xl md:text-7xl font-black text-[#4ade80] tracking-tight font-mono tabular-nums">
        {Math.round(progress * 100)}%
      </p>
    </div>
  );
}
