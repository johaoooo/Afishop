import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TAGLINES = [
  "Macramé d'art fait main",
  '100% artisanat béninois',
  'Inclusion & savoir-faire',
  'Atelier Abomey-Calavi',
];

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [tagline, setTagline] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2000;
    let done = false;
    const update = () => {
      const pct = Math.min((Date.now() - start) / duration, 1);
      setProgress(pct);
      if (pct < 1) {
        requestAnimationFrame(update);
      } else if (!done) {
        done = true;
        setLeaving(true);
        setTimeout(onFinish, 380);
      }
    };
    const raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [onFinish]);

  useEffect(() => {
    const id = setInterval(() => setTagline((t) => (t + 1) % TAGLINES.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#f3f6f3] flex flex-col items-center justify-center gap-5 select-none overflow-hidden px-6"
      animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.04 : 1 }}
      transition={{ duration: 0.35, ease: 'easeIn' }}
    >
      <div className="pop-halftone absolute inset-0 opacity-[0.07] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#028444]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-20 w-80 h-80 bg-[#05a855]/10 rounded-full blur-3xl pointer-events-none" />
      <span aria-hidden="true" className="wappe-word">
        AFI
      </span>

      <motion.img
        src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1783162335/afiii_wqkawf.png"
        alt="AFI Collection"
        className="h-20 sm:h-24 w-auto object-contain relative"
        initial={{ opacity: 0, y: 16, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <span className="pop-sticker">Chargement</span>
      </motion.div>

      <div className="relative w-56 sm:w-64">
        <div className="h-2 rounded-full bg-[#0f1f14]/10 overflow-hidden border border-[#028444]/25">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#028444] to-[#05a855] transition-[width] duration-100"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm font-black italic text-[#028444] font-mono tabular-nums">
          {Math.round(progress * 100)}%
        </p>
      </div>

      <div className="relative h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={tagline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-xs sm:text-sm font-bold text-[#0f1f14]/55 text-center"
          >
            ✦ {TAGLINES[tagline]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
