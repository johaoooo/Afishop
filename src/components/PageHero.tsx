import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface HeroCta {
  label: string;
  to?: string;
  href?: string;
}

interface PageHeroProps {
  sticker: string;
  title: React.ReactNode;
  ghostWord?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  /** Photo plein fond (variante centrée façon hero akatech) */
  backgroundImage?: string;
  /** 'split' (bandeau clair + carte photo) ou 'center' (photo plein fond) */
  align?: 'split' | 'center';
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
}

// En-tête de page partagé — recette du hero akatech adaptée au clair AFI :
// mot fantôme géant, kicker, description, double CTA, particules
// flottantes et parallaxe au scroll. Rétro-compatible.

function CtaButtons({ primary, secondary, light }: { primary?: HeroCta; secondary?: HeroCta; light?: boolean }) {
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
    <div className={`hero-cta-row pt-2 flex flex-wrap gap-3 sm:gap-4 ${light ? 'justify-center' : ''}`}>
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
  align = 'split',
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.12]);

  if (align === 'center' && backgroundImage) {
    return (
      <div ref={ref} className="relative overflow-hidden text-white shadow-md">
        <motion.div style={{ scale: bgScale }} className="absolute inset-0">
          <img
            src={backgroundImage}
            alt={imageAlt || 'AFI Collection'}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#070b08]/72" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        <Particles color="#05a855" />

        {ghostWord && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-black italic uppercase leading-none text-white/[0.08]"
            style={{ fontSize: 'clamp(4rem, 14vw, 11rem)' }}
          >
            {ghostWord}
          </span>
        )}

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="container relative z-10 mx-auto px-6 py-20 sm:py-28 md:px-12 md:py-32 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl space-y-3"
          >
            <h1 className="font-black uppercase tracking-tight text-white drop-shadow-md text-4xl sm:text-5xl md:text-6xl leading-[1.02]">
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto max-w-xl text-sm sm:text-base font-medium text-white/85 drop-shadow-sm">
                {subtitle}
              </p>
            )}
            <CtaButtons primary={primaryCta} secondary={secondaryCta} light />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className="pop-night relative overflow-hidden">
      <div className="pop-halftone absolute inset-0 opacity-[0.06] pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-[#028444]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 left-10 w-80 h-80 bg-[#05a855]/10 rounded-full blur-3xl pointer-events-none" />
      <Particles color="#028444" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative">
        <div className={`flex flex-col ${image ? 'lg:flex-row' : ''} items-center gap-8 py-14 sm:py-20`}>
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase text-[#0f1f14] tracking-tight leading-tight mt-4">
              <span className="pop-ghost-wrap">
                {ghostWord && (
                  <span className="pop-ghost" aria-hidden="true">
                    {ghostWord}
                  </span>
                )}
                {title}
              </span>
            </h1>
            {subtitle && (
              <p className="text-[#0f1f14]/60 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
            <CtaButtons primary={primaryCta} secondary={secondaryCta} />
          </motion.div>

          {image && (
            <motion.div
              className="w-full lg:w-[38%] shrink-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="pop-card overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src={image}
                  alt={imageAlt || 'AFI Collection'}
                  className="w-full h-56 sm:h-72 object-cover"
                  loading="eager"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
