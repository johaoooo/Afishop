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
    <div className="fixed inset-0 z-[9999] bg-[#f3f6f3] flex flex-col items-center justify-center gap-6 select-none">
      <img
        src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png"
        alt="AFI Collection"
        className="h-20 w-auto object-contain"
      />
      <span className="pop-sticker">Chargement</span>
      <p className="text-5xl sm:text-6xl md:text-7xl font-black italic text-[#028444] tracking-tight font-mono tabular-nums">
        {Math.round(progress * 100)}%
      </p>
    </div>
  );
}
