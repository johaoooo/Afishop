import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiTruck, 
  FiShield, 
  FiAward, 
  FiStar,
  FiShoppingBag,
  FiUsers
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi, trainingsApi, type Product, type Training } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

// ============================================================
// DONNÉES
// ============================================================

const slides = [
  { 
    id: 1, 
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1780563938/slidee_npenrh.png',
    title: 'AFI Collection',
    subtitle: 'L\'Élégance Artisanale',
    description: 'Des créations uniques, faites main avec passion par des artisans talentueux d\'Afrique de l\'Ouest.',
    cta: 'Découvrir la boutique',
    ctaLink: '/boutique'
  },
  { 
    id: 2, 
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1784014275/WhatsApp_Image_2026-07-14_at_08.29.54_rsd6nr.jpg',
    title: 'Artisanat Africain',
    subtitle: 'Authenticité et savoir-faire',
    description: 'Chaque pièce raconte l\'histoire d\'un artisan et de son héritage.',
    cta: 'En savoir plus',
    ctaLink: '/a-propos'
  },
  { 
    id: 3, 
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1780563939/slide3_zsjt4w.png',
    title: 'Teinture & Tradition',
    subtitle: 'La couleur de l\'Afrique',
    description: 'Des tissus uniques aux motifs traditionnels africains.',
    cta: 'Découvrir',
    ctaLink: '/boutique'
  },
];

const statsData = [
  { key: 'clients', value: 500, suffix: '+', icon: FiUsers, label: 'Clients satisfaits' },
  { key: 'products', value: 150, suffix: '+', icon: FiShoppingBag, label: 'Produits uniques' },
  { key: 'artisans', value: 50, suffix: '+', icon: FiAward, label: 'Artisans partenaires' },
  { key: 'satisfaction', value: 98, suffix: '%', icon: FiStar, label: 'Taux de satisfaction' },
];

// ============================================================
// SECTION AVANTAGES
// ============================================================

const advantages = [
  { 
    icon: FiAward, 
    title: '100% Artisanal', 
    text: 'Chaque pièce est faite main par des artisans béninois talentueux.',
    bg: 'bg-amber-50',
    color: 'text-amber-600',
    delay: 0.1
  },
  { 
    icon: FiTruck, 
    title: 'Livraison 48h', 
    text: 'Expédition rapide sur Cotonou, Abidjan, Dakar et toute l\'Afrique.',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    delay: 0.2
  },
  { 
    icon: FiShield, 
    title: 'Paiement sécurisé', 
    text: 'Mobile Money, carte bancaire, virement — en toute confiance.',
    bg: 'bg-green-50',
    color: 'text-green-600',
    delay: 0.3
  },
];

// ============================================================
// SUITE DES DONNÉES
// ============================================================

const featuredSections = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441621/WhatsApp_Image_2026-05-03_at_13.03.09_2_cujxnk.jpg',
    title: 'Un savoir-faire ancestral',
    text: 'Chaque fil raconte une histoire. Découvrez l\'art du tissage traditionnel, où la patience et la passion donnent vie à des étoffes uniques.',
    reverse: false,
    badge: 'Savoir-faire',
    objectFit: 'object-cover'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441634/WhatsApp_Image_2026-05-03_at_13.14.33_hqblr4.jpg',
    title: 'Nos collections à votre rencontre',
    text: 'Présents lors des grands rendez-vous de l\'artisanat, nous célébrons la richesse de notre culture à travers des expositions vibrantes et modernes.',
    reverse: true,
    badge: 'Événements',
    objectFit: 'object-cover object-top'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441639/WhatsApp_Image_2026-05-03_at_13.15.26_1_vauaky.jpg',
    title: 'Tisser l\'avenir au féminin',
    text: 'Au-delà de l\'art, Aficollection s\'engage pour l\'autonomisation des femmes à travers des formations pratiques aux métiers du macramé et de l\'artisanat.',
    reverse: false,
    badge: 'Engagement',
    objectFit: 'object-cover'
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441647/WhatsApp_Image_2026-05-03_at_13.15.30_1_z0l9dw.jpg',
    title: 'Le cœur d\'Aficollection',
    text: 'Une équipe passionnée, unie par le désir de valoriser le patrimoine local et de propulser l\'artisanat africain vers de nouveaux horizons.',
    reverse: true,
    badge: 'Notre équipe',
    objectFit: 'object-cover'
  },
  {
    id: 5,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441670/WhatsApp_Image_2026-05-03_at_13.07.31_ian4cg.jpg',
    title: 'Des mains d\'or, des pièces uniques',
    text: 'Derrière chaque produit se cache le talent d\'une artisane dévouée. En achetant chez nous, vous soutenez directement leur travail et leur indépendance.',
    reverse: false,
    badge: 'Nos artisans',
    objectFit: 'object-cover'
  },
];

const partners = [
  { id: 1, name: 'GRAAD', logo: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1782579417/WhatsApp_Image_2026-06-27_at_17.56.06_wnsfvn.jpg' },
  { id: 2, name: 'ODEVOD', logo: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1782577860/WhatsApp_Image_2026-06-27_at_17.21.27_ecgftx.jpg' },
  { id: 3, name: 'AMAF', logo: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1782577834/AMAF_mcq0dz.jpg' },
  { id: 4, name: 'FIMA/PN', logo: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1782573391/fm_kvfpmv.jpg' },
  { id: 5, name: 'Partenaire 5', logo: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1782577850/WhatsApp_Image_2026-06-02_at_18.05.42_1_dbgi7t.jpg' },
  { id: 6, name: 'Partenaire 6', logo: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1782577624/images_geckie.png' },
];

// ============================================================
// COMPOSANTS
// ============================================================

function AnimatedNumber({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCurrent(Math.floor(progress * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{current.toLocaleString()}{suffix}</span>;
}

function FeatureSection({ section, index }: { section: typeof featuredSections[0], index: number }) {
  return (
    <motion.div 
      className={`flex flex-col ${section.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center py-12 lg:py-16 ${index !== 0 ? 'border-t border-gray-100/80' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
    >
      <div className="w-full lg:w-1/2 group">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <img
            src={section.image}
            alt={section.title}
            className={`w-full h-64 sm:h-80 md:h-[420px] ${section.objectFit || 'object-cover'} group-hover:scale-105 transition-transform duration-700 ease-out`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';
            }}
          />
          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-[#1a6b3c] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-black/10">
            {section.badge}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 space-y-4 lg:space-y-5">
        <div className="space-y-2">
          <span className="inline-block text-[#1a6b3c] text-xs font-bold tracking-[0.2em] uppercase">
            {section.badge}
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 leading-tight tracking-tight">
            {section.title}
          </h3>
        </div>
        <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
          {section.text}
        </p>
        <Link 
          to="/boutique" 
          className="inline-flex items-center gap-2.5 text-[#1a6b3c] font-semibold group-hover-link transition-all duration-300"
        >
          <span className="relative">
            Découvrir
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#1a6b3c] transition-all duration-300 group-hover-link:w-full" />
          </span>
          <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover-link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================================
// PAGE HOME
// ============================================================

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const totalSlides = slides.length;

  useEffect(() => {
    Promise.all([
      productsApi.getAll(),
      trainingsApi.getAll(),
    ])
      .then(([pData, tData]) => {
        setProducts(pData.products.slice(0, 8));
        setTrainings(tData.trainings || []);
      })
      .catch(() => { setProducts([]); setTrainings([]); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <div className="bg-[#faf8f5]">
      <SEO
        title="Boutique Artisanale"
        description="Découvrez AFI Collection, votre boutique artisanale de sacs macramé, sandales, pagnes, accessoires et tissus africains. Livraison 48h au Bénin."
      />
      
      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section 
        className="relative overflow-hidden bg-black"
        style={{ height: 'calc(100vh - 80px)', minHeight: 600, maxHeight: 900 }}
      >
        <AnimatePresence mode="wait">
          {slides.map((s, i) => (
            i === currentSlide && (
              <motion.div
                key={s.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <img
                  src={imgErrors[s.id] ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600' : s.image}
                  alt={s.title}
                  onError={() => setImgErrors((prev) => ({ ...prev, [s.id]: true }))}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        <div className="absolute inset-0 z-[15] bg-black/40" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-0 z-20 flex items-center" style={{ paddingBottom: '80px' }}>
          <div className="container mx-auto px-6 md:px-12 w-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                className="max-w-2xl text-left"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                  {slides[currentSlide].title}
                  <br />
                  <span className="text-[#4ade80] drop-shadow-2xl">
                    {slides[currentSlide].subtitle}
                  </span>
                </h1>

                <motion.p 
                  className="text-white/80 text-base md:text-lg mt-4 max-w-xl leading-relaxed drop-shadow-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.div 
                  className="flex flex-wrap gap-3 mt-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to={slides[currentSlide].ctaLink}
                    className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-5 py-2.5 rounded-full transition-all duration-300 text-sm shadow-lg shadow-[#1a6b3c]/30 hover:shadow-[#1a6b3c]/50 hover:scale-105 group"
                  >
                    {slides[currentSlide].cta}
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/formations"
                    className="border-2 border-white/50 hover:border-white text-white hover:bg-white hover:text-gray-900 font-bold px-5 py-2.5 rounded-full transition-all duration-300 text-sm backdrop-blur-sm hover:scale-105"
                  >
                    Nos formations
                  </Link>
                </motion.div>

                <motion.div 
                  className="flex flex-wrap gap-4 sm:gap-6 mt-6 pt-6 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {statsData.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={stat.key} className="flex items-center gap-2 text-white">
                        <div className="p-1.5 rounded-full bg-white/10">
                          <IconComponent className="w-3.5 h-3.5 text-[#4ade80]" />
                        </div>
                        <div>
                          <p className="text-base font-black text-white tracking-tight">
                            <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                          </p>
                          <p className="text-[9px] text-white/60 font-medium uppercase tracking-wider">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: AVANTAGES */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <motion.div 
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#1a6b3c] text-xs font-bold tracking-[0.2em] uppercase">
              Pourquoi AFI Collection
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mt-2 tracking-tight">
              Nos <span className="text-[#1a6b3c]">engagements</span>
            </h2>
            <p className="text-gray-400 mt-2 max-w-md mx-auto text-sm">
              Trois piliers qui font la différence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advantages.map((a, index) => (
              <motion.div
                key={a.title}
                className="group relative p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${a.bg} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                
                <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-2xl ${a.bg} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-500`}>
                  <a.icon className="w-6 sm:w-8 h-6 sm:h-8 text-[#1a6b3c]" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-[#1a6b3c] transition-colors duration-300">
                  {a.title}
                </h3>
                <p className="text-gray-500 text-sm mt-2 sm:mt-3 leading-relaxed">
                  {a.text}
                </p>

                <div className="absolute bottom-4 right-4 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#1a6b3c]/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#1a6b3c]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: FEATURED SECTIONS */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#faf8f5]">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <motion.div 
            className="text-center mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#1a6b3c] text-xs font-bold tracking-[0.2em] uppercase">
              Notre univers
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mt-2 sm:mt-3 tracking-tight">
              Découvrez <span className="text-[#1a6b3c]">notre histoire</span>
            </h2>
            <p className="text-gray-400 mt-2 max-w-lg mx-auto text-sm">
              Plongez au cœur de l'artisanat béninois à travers nos valeurs et nos engagements.
            </p>
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {featuredSections.map((section, index) => (
              <FeatureSection key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: PRODUITS */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-[#1a6b3c] text-xs font-bold tracking-[0.2em] uppercase">
                Sélection
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mt-1 sm:mt-2 tracking-tight">
                Nos <span className="text-[#1a6b3c]">créations</span>
              </h2>
            </div>
            <Link 
              to="/boutique" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a6b3c] hover:text-[#14532d] group mt-4 sm:mt-0"
            >
              <span className="relative">
                Tout voir
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1a6b3c] group-hover:w-full transition-all duration-300" />
              </span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-2xl" />
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100">
              <FiShoppingBag className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {products.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: FORMATIONS */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#faf8f5]">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#1a6b3c] text-xs font-bold tracking-[0.2em] uppercase">
              CFP Dorcas
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mt-1 sm:mt-2 tracking-tight">
              Nos <span className="text-[#1a6b3c]">formations</span>
            </h2>
            <p className="text-gray-400 mt-1 text-sm max-w-lg mx-auto">
              Développez vos compétences artisanales avec nos formations professionnelles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trainings.slice(0, 4).map((t, index) => {
              const accent = t.color || '#1a6b3c';
              const imgSrc = t.image?.startsWith('/')
                ? `http://localhost:5000${t.image}`
                : t.image || 'https://placehold.co/600x400/1a6b3c/ffffff?text=AFI';
              return (
                <motion.div
                  key={t.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 border border-gray-100 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={imgSrc}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm" style={{ color: accent }}>
                      {t.duration || '3 mois'}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-black text-gray-800 mb-1 leading-tight">{t.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">{t.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">{t.price}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{t.students} étudiants</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            className="text-center mt-8 sm:mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/formations" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a6b3c] hover:text-[#14532d] group"
            >
              <span className="relative">
                Voir toutes nos formations
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1a6b3c] group-hover:w-full transition-all duration-300" />
              </span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: PARTENAIRES */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <motion.div
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#1a6b3c] text-xs font-bold tracking-[0.2em] uppercase">
              Nos partenaires
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mt-1 sm:mt-2 tracking-tight">
              Ils nous <span className="text-[#1a6b3c]">font confiance</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-2 text-sm">
              Des partenaires engagés qui soutiennent notre mission de valorisation de l'artisanat béninois
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                className="bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center border border-gray-100/80 hover:border-[#1a6b3c]/20 hover:shadow-lg transition-all duration-400 hover:-translate-y-1.5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.5) }}
              >
                <div className="w-full h-16 sm:h-20 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=1a6b3c&color=fff&size=100`;
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7: CTA FINAL */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <motion.div
            className="max-w-5xl mx-auto text-center p-8 sm:p-12 md:p-16 lg:p-20 rounded-3xl relative overflow-hidden bg-gradient-to-br from-[#0d2818] via-[#1a6b3c] to-[#0d2818]"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-[#4ade80]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-[#4ade80]/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:w-96 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <span className="inline-block text-[#4ade80] text-xs font-bold tracking-[0.3em] uppercase mb-3 sm:mb-4">
                Rejoignez-nous
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-2xl mx-auto">
                Prêt à découvrir <br className="hidden sm:block" />
                <span className="text-[#4ade80]">l'artisanat</span> béninois ?
              </h2>
              <p className="text-green-100/80 text-sm sm:text-base md:text-lg mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed">
                Rejoignez-nous et soutenez les artisans talentueux d'Afrique de l'Ouest.
              </p>
              <Link 
                to="/boutique" 
                className="inline-flex items-center gap-2 sm:gap-3 bg-white hover:bg-gray-50 text-[#1a6b3c] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-4.5 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-black/20 hover:shadow-[#4ade80]/20 text-sm sm:text-base group mt-6 sm:mt-8"
              >
                <FiShoppingBag className="w-4 sm:w-5 h-4 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Découvrir la boutique</span>
                <FiArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
