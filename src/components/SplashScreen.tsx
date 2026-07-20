import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2000;
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
    <div className="fixed inset-0 z-[9999] bg-[#0d2818] flex flex-col items-center justify-center">
      <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center mb-10">
        <img
          src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png"
          alt="AFI Collection"
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>

      <div className="w-40 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-full transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <p className="text-white/40 text-xs mt-2 font-mono tabular-nums">
        {Math.round(progress * 100)}%
      </p>
    </div>
  );
}
