import { motion } from 'framer-motion';

interface PageHeroProps {
  sticker: string;
  title: React.ReactNode;
  ghostWord?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
}

// En-tête de page partagé — style pop vitaminé : nuit, sticker,
// titre italic + mot fantôme en contour, photo AFI en carte pop.
export function PageHero({ sticker, title, ghostWord, subtitle, image, imageAlt }: PageHeroProps) {
  return (
    <div className="pop-night relative overflow-hidden">
      <div className="pop-halftone absolute inset-0 opacity-[0.06] pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-[#028444]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative">
        <div className={`flex flex-col ${image ? 'lg:flex-row' : ''} items-center gap-8 py-12 sm:py-16`}>
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="pop-sticker">{sticker}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase text-white tracking-tight leading-tight mt-4">
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
              <p className="text-white/60 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
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
