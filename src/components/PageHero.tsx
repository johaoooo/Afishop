import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { AFI_IMAGES } from '../lib/images';

interface HeroCta {
  label: string;
  to?: string;
  href?: string;
}

interface PageHeroProps {
  title: React.ReactNode;
  ghostWord?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  /** Photo plein fond (recette unique, façon hero d'accueil) */
  backgroundImage?: string;
  /** Déprécié : conservé pour compatibilité, le rendu est toujours immersif */
  align?: 'split' | 'center';
  /** Libellé du fil d'Ariane (défaut : ghostWord) */
  crumb?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

// En-tête de page partagé — même recette que le hero d'accueil :
// photo plein fond, header transparent fusionné, mot fantôme géant,
// fil d'Ariane, badge, titre display, double CTA, particules et parallaxe.

function CtaButtons({ primary, secondary }: { primary?: HeroCta; secondary?: HeroCta }) {
  if (!primary && !secondary) return null;
  const render = (cta: HeroCta, isPrimary: boolean) => {
    const className = isPrimary ? 'btn-raised' : 'btn-ghost';
    if (cta.href) {
      const external = cta.href.startsWith('http') || cta.href.startsWith('tel:');
      return (
        <a
          key={cta.label}
          href={cta.href}
          {...(external && cta.href.startsWith('http')
            ? { target: '_blank' as const, rel: 'noopener noreferrer' }
            : {})}
          className={className}
        >
          <span>{cta.label}</span>
        </a>
      );
    }
    return (
      <Link key={cta.label} to={cta.to || '/contact'} className={className}>
        <span>{cta.label}</span>
      </Link>
    );
  };
  return (
    <div className="hero-cta-row pt-2 flex flex-wrap justify-center gap-3 sm:gap-4">
      {primary && render(primary, true)}
      {secondary && render(secondary, false)}
    </div>
  );
}

const PARTICLES = [
  { left: '8%', top: '25%', s: 5, dur: 4.2, dy: 0 },
  { left: '22%', top: '70%', s: 4, dur: 5.4, dy: 1 },
  { left: '55%', top: '18%', s: 6, dur: 4.8, dy: 0.5 },
  { left: '76%', top: '72%', s: 4, dur: 6.0, dy: 1.5 },
  { left: '90%', top: '30%', s: 5, dur: 3.8, dy: 0.2 },
];

function Particles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: p.left, top: p.top, width: p.s, height: p.s, background: color, opacity: 0.5, boxShadow: `0 0 12px ${color}` }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.dy }}
        />
      ))}
    </div>
  );
}

export function PageHero({
  title,
  ghostWord,
  subtitle,
  image,
  imageAlt,
  backgroundImage,
  crumb,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.12]);

  const bg = backgroundImage || image || AFI_IMAGES.exposition;
  const crumbLabel = crumb || ghostWord;

  return (
    <div ref={ref} className="wappe-hero relative overflow-hidden bg-[#070b08] text-white">
      {/* Fond plein-bleed derrière le header transparent (fusionné, comme l'accueil) */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0">
        <img
          src={bg}
          alt={imageAlt || 'AFI Collection'}
          className="h-full w-full object-cover object-center"
          loading="eager"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/65" />
      <div className="grid-bg absolute inset-0 opacity-10 pointer-events-none" />
      <div className="halftone-bg absolute top-0 right-0 w-1/2 h-1/2 opacity-10 pointer-events-none" />
      <Particles color="#05a855" />

      {ghostWord && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-black uppercase leading-none text-white/[0.08]"
          style={{ fontSize: 'clamp(4rem, 14vw, 11rem)' }}
        >
          {ghostWord}
        </span>
      )}

      {/* pt compensé pour la pilule header fixe (fusion, pas d'espaceur) */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 mx-auto px-6 pt-36 sm:pt-40 pb-16 sm:pb-20 md:px-12 min-h-[62svh] sm:min-h-[68svh] flex items-center justify-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl space-y-4 sm:space-y-5"
        >
          {crumbLabel && (
            <nav aria-label="Fil d'Ariane" className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white/60">
              <Link to="/" className="hover:text-[#2bff88] transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#05a855]" />
              <span className="text-white/90">{crumbLabel}</span>
            </nav>
          )}

          <h1
            className="font-black uppercase tracking-tight text-white text-balance text-4xl sm:text-5xl md:text-6xl leading-[1.02]"
            style={{ textShadow: '0 2px 24px rgba(0, 0, 0, 0.85)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mx-auto max-w-xl text-sm sm:text-base font-medium text-white/85"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.7)' }}
            >
              {subtitle}
            </p>
          )}
          <CtaButtons primary={primaryCta} secondary={secondaryCta} />
        </motion.div>
      </motion.div>
    </div>
  );
}
