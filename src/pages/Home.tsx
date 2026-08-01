import SEO from '../components/SEO';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiTruck, 
  FiShield, 
  FiAward, 
  FiStar,
  FiShoppingBag,
  FiUsers,
  FiHeadphones,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight
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
    subtitle: 'L\'Élégance Artisanale & Inclusive',
    description: 'Des créations uniques faites main avec passion par nos maîtres artisans béninois.',
    cta: 'Découvrir la boutique',
    ctaLink: '/boutique'
  },
  { 
    id: 2, 
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573442/WhatsApp_Image_2026-08-01_at_08.30.47_w1owpu.jpg',
    title: 'Autonomisation & Inclusion',
    subtitle: 'Le Macramé pour les Communautés Sourdes',
    description: 'Offrir des outils concrets d\'indépendance financière et célébrer la résilience à travers l\'artisanat.',
    cta: 'Notre engagement social',
    ctaLink: '/a-propos'
  },
  { 
    id: 3, 
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1785574438/WhatsApp_Image_2026-08-01_at_09.53.13_syzpyy.jpg',
    title: 'Savoir-Faire & Terroir',
    subtitle: 'Du Grain au Klui-Klui Traditionnel',
    description: 'Une aventure humaine et gourmande : de la torréfaction collective au foyer au Klui-Klui croustillant.',
    cta: 'Découvrir le terroir',
    ctaLink: '/boutique?cat=agroalimentaire'
  },
];

const socialImpactStory = {
  badge: "Inclusion & Égalité des Chances",
  title: "Le macramé comme levier d'autonomie pour les communautés sourdes et malentendantes",
  subtitle: "Célébrer la résilience et le talent : le silence n'est pas un obstacle à la création.",
  images: [
    {
      id: 1,
      url: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573442/WhatsApp_Image_2026-08-01_at_08.30.47_w1owpu.jpg",
      alt: "Artisane sourde-muette assemblant un sac macramé sur cadre en bois",
      label: "Assemblage minutieux sur cadre en bois",
      fit: "object-cover object-top"
    },
    {
      id: 2,
      url: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573443/WhatsApp_Image_2026-08-01_at_08.31.11_1_mu9zgn.jpg",
      alt: "Détail du tressage macramé aux cordes fuchsia et naturelles",
      fit: "object-cover object-top"
    }
  ],
  text: "Une image puissante qui capture l'essence de notre engagement en faveur de l'inclusion. Dans nos ateliers de formation, cette jeune artisane sourde-muette est pleinement concentrée sur l'assemblage minutieux d'un sac en macramé sur un cadre en bois traditionnel. Sous ses doigts agiles, cordes et motifs aux touches rose fuchsia se transforment en une œuvre unique, symbole de sa créativité et de son avenir.",
  quote: "Chaque nœud est un pas vers l'indépendance financière, la confiance en soi et l'intégration sociale.",
  cards: [
    {
      id: 1,
      title: "Fierté et accomplissement : la remise des créations",
      image: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785575610/WhatsApp_Image_2026-08-01_at_10.09.08_1_crzxkb.jpg",
      text: "Une magnifique photo de groupe marquant l'aboutissement de notre atelier de formation ! Entourés des formateurs et encadrants, les participants présentent avec fierté leurs sacs artisanaux uniques aux couleurs vibrantes.",
      badge: "Formation CFP Dorcas"
    },
    {
      id: 2,
      title: "La fierté du travail accompli avec passion",
      image: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785574438/WhatsApp_Image_2026-08-01_at_09.51.43_ykpwvs.jpg",
      text: "Un sourire rayonnant qui en dit long ! Vêtue d'une élégante tenue en pagne, cette participante présente son sac macramé confectionné avec soin, illustrant la parfaite maîtrise des techniques de nouage.",
      badge: "Savoir-faire Maîtrisé"
    }
  ]
};

const terroirStory = {
  badge: "Gastronomie & Terroir Béninois",
  title: "Du grain au croustillant : le Klui-Klui d'exception",
  subtitle: "Une tradition gourmande façonnée par des mains expertes au cœur de nos communautés.",
  steps: [
    {
      number: "01",
      title: "Au cœur de nos communautés",
      subtitle: "Torréfaction au foyer traditionnel",
      image: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785574438/WhatsApp_Image_2026-08-01_at_09.53.13_syzpyy.jpg",
      text: "Réunies autour du foyer traditionnel, ces femmes mettent en commun leur énergie et leur expertise pour la torréfaction artisanale des arachides. Cet instant d'apprentissage et d'entraide capture l'essence du dynamisme local."
    },
    {
      number: "02",
      title: "La magie du geste",
      subtitle: "Extraction & malaxage traditionnel",
      image: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573441/WhatsApp_Image_2026-08-01_at_08.48.24_1_z0ovdv.jpg",
      text: "Dans ce grand bassin en aluminium, les mains expertes s'activent pour malaxer une pâte d'arachide onctueuse au ton beige doré. Un travail manuel patient qui libère tous les arômes d'une recette séculaire."
    },
    {
      number: "03",
      title: "Le Klui-Klui traditionnel",
      subtitle: "Snack gourmand & authentique",
      image: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573444/WhatsApp_Image_2026-08-01_at_08.31.11_2_x6h3lg.jpg",
      text: "Bâtonnets d'arachide croustillants, dorés à souhait, façonnés puis frits après l'extraction de l'huile. Snack emblématique, sain et gourmand, reflet de la rigueur de nos artisanes."
    }
  ]
};

const statsData = [
  { key: 'clients', value: 500, suffix: '+', icon: FiUsers, label: 'Clients satisfaits' },
  { key: 'products', value: 500, suffix: '+', icon: FiShoppingBag, label: 'Produits uniques' },
  { key: 'artisans', value: 1000, suffix: '+', icon: FiAward, label: 'Artisans partenaires' },
  { key: 'satisfaction', value: 98, suffix: '%', icon: FiStar, label: 'Satisfaction' },
];

const advantages = [
  { 
    icon: FiAward, 
    title: '100% Artisanal & Fait Main', 
    text: 'Créations authentiques façonnées par des maîtres artisans béninois au savoir-faire d\'exception.',
    bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/60',
    delay: 0.1
  },
  { 
    icon: FiTruck, 
    title: 'Livraison Express 48h', 
    text: 'Expédition rapide et sécurisée au Bénin, Côte d\'Ivoire, Sénégal et dans toute l\'Afrique.',
    bg: 'bg-blue-500/10 text-blue-600 border-blue-200/60',
    delay: 0.2
  },
  { 
    icon: FiShield, 
    title: 'Paiements 100% Sécurisés', 
    text: 'Règlement facile via Mobile Money (MTN, Moov, KKiaPay), carte bancaire ou virement.',
    bg: 'bg-amber-500/10 text-amber-600 border-amber-200/60',
    delay: 0.3
  },
  { 
    icon: FiHeadphones, 
    title: 'Service Client Dédié', 
    text: 'Notre équipe vous accompagne à chaque étape pour une expérience d\'achat chaleureuse.',
    bg: 'bg-purple-500/10 text-purple-600 border-purple-200/60',
    delay: 0.4
  },
];

const featuredSections = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441621/WhatsApp_Image_2026-05-03_at_13.03.09_2_cujxnk.jpg',
    title: 'Un savoir-faire d\'exception',
    text: 'Chaque fil raconte une histoire. Découvrez l\'art noble du macramé et du tissage traditionnel, où la patience et la passion donnent naissance à des pièces d\'une élégance inégalée.',
    reverse: false,
    objectFit: 'object-cover'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441634/WhatsApp_Image_2026-05-03_at_13.14.33_hqblr4.jpg',
    title: 'Nos collections à votre rencontre',
    text: 'Présents lors des grands événements régionaux de l\'artisanat d\'art, nous faisons rayonner la richesse de notre patrimoine culturel à travers des expositions vibrantes et modernes.',
    reverse: true,
    objectFit: 'object-cover object-top'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441639/WhatsApp_Image_2026-05-03_at_13.15.26_1_vauaky.jpg',
    title: 'Tisser l\'avenir au féminin',
    text: 'AFI Collection s\'engage concrètement pour l\'autonomisation des femmes à travers le CFP Dorcas, en leur offrant des formations professionnelles certifiées aux métiers de la création.',
    reverse: false,
    objectFit: 'object-cover'
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441647/WhatsApp_Image_2026-05-03_at_13.15.30_1_z0l9dw.jpg',
    title: 'Le cœur d\'AFI Collection',
    text: 'Une équipe passionnée et dévouée, unie par le même désir : célébrer l\'identité africaine et propulser l\'artisanat local vers des standards internationaux.',
    reverse: true,
    objectFit: 'object-cover'
  },
  {
    id: 5,
    image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441670/WhatsApp_Image_2026-05-03_at_13.07.31_ian4cg.jpg',
    title: 'Des mains d\'or, des pièces uniques',
    text: 'Derrière chaque création se cache le talent précieux d\'une artisane. En commandant chez nous, vous contribuez directement à la rémunération juste et à l\'indépendance de nos partenaires.',
    reverse: false,
    objectFit: 'object-cover'
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Aminata Diallo',
    role: 'Cliente fidèle — Cotonou',
    content: 'J\'ai découvert AFI Collection lors d\'une exposition. Depuis, je ne cesse de commander leurs sacs macramé. La finition est d\'une finesse remarquable et chaque pièce fait sensation !',
    rating: 5
  },
  {
    id: 2,
    name: 'Koffi Mensah',
    role: 'Artisan partenaire — Abomey-Calavi',
    content: 'Collaborer avec AFI Collection a valorisé notre travail d\'artisan. La plateforme nous offre une vitrine professionnelle dans toute l\'Afrique de l\'Ouest.',
    rating: 5
  },
  {
    id: 3,
    name: 'Marie-Claire Adjovi',
    role: 'Cliente — Abidjan',
    content: 'Les sandales en macramé et cuir sont splendides et tellement confortables ! La livraison à Abidjan s\'est faite en 48h chrono. Je recommande à 100%.',
    rating: 5
  },
  {
    id: 4,
    name: 'Jean-Baptiste Ouedraogo',
    role: 'Client régulier — Ouagadougou',
    content: 'Offrir une création AFI Collection, c\'est transmettre un vrai morceau de culture béninoise. Mes proches ont adoré les ensembles en pagne tissé.',
    rating: 5
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
// COMPOSANTS AUXILIAIRES
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

  return <span>{current.toLocaleString('fr-FR')}{suffix}</span>;
}

function FeatureSection({ section, index }: { section: typeof featuredSections[0]; index: number }) {
  return (
    <motion.div 
      className={`flex flex-col ${section.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 lg:gap-12 items-center py-10 lg:py-14 ${index !== 0 ? 'border-t border-gray-200/60' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full lg:w-1/2 group">
        <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-black/5 border border-gray-100">
          <img
            src={section.image}
            alt={section.title}
            className={`w-full h-64 sm:h-80 md:h-[400px] ${section.objectFit || 'object-cover'} group-hover:scale-105 transition-transform duration-700 ease-out`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 space-y-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
          {section.title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {section.text}
        </p>
        <Link 
          to="/boutique" 
          className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-[#1a6b3c]/20 hover:scale-105"
        >
          <span>Découvrir nos créations</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================================
// PAGE ACCUEIL PRINCIPALE
// ============================================================

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [activeCategory, setActiveCategory] = useState('toutes');
  const [impactSlideIndex, setImpactSlideIndex] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setImpactSlideIndex((prev) => (prev + 1) % socialImpactStory.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);

  const autoScroll = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current || autoScrollPaused) return;
    const el = ref.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    if (el.scrollLeft >= maxScroll - 1) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: el.clientWidth * 0.5, behavior: 'smooth' });
    }
  }, [autoScrollPaused]);

  useEffect(() => {
    const ti = setInterval(() => autoScroll(testimonialRef), 3500);
    const pi = setInterval(() => autoScroll(partnerRef), 3500);
    return () => { clearInterval(ti); clearInterval(pi); };
  }, [autoScroll]);

  useEffect(() => {
    Promise.all([
      productsApi.getAll(),
      trainingsApi.getAll(),
    ])
      .then(([pData, tData]) => {
        setProducts(pData.products || []);
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

  const categoriesList = ['toutes', 'macramé', 'teinture', 'décoration', 'accessoires', 'sésame', 'soja'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'toutes') return products.slice(0, 8);
    return products.filter(p => p.category?.toLowerCase().includes(activeCategory)).slice(0, 8);
  }, [products, activeCategory]);

  return (
    <div className="bg-[#f8faf8] text-gray-900 overflow-x-clip">
      <SEO
        title="Boutique Artisanale"
        description="Découvrez AFI Collection, votre boutique artisanale de sacs macramé, sandales, pagnes, accessoires et produits agroalimentaires du Bénin. Livraison 48h."
      />
      
      {/* ============================================================ */}
      {/* HERO SLIDER (TEXTE VISIBLE SANS SCROLL) */}
      {/* ============================================================ */}
      <section 
        className="relative overflow-hidden bg-black"
        style={{ height: 'calc(100vh - 80px)', minHeight: 560, maxHeight: 840 }}
      >
        <AnimatePresence mode="wait">
          {slides.map((s, i) => (
            i === currentSlide && (
              <motion.div
                key={s.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
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

        <div className="absolute inset-0 z-10 bg-black/45" />
        <div className="absolute inset-0 z-15 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        <div className="absolute inset-0 z-15 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Content Container - Carefully proportioned */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6 md:px-12 w-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                className="max-w-xl text-left space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                  {slides[currentSlide].title}
                  <br />
                  <span className="text-[#4ade80]">
                    {slides[currentSlide].subtitle}
                  </span>
                </h1>

                <p className="text-white/90 text-xs sm:text-sm max-w-md leading-relaxed font-normal drop-shadow">
                  {slides[currentSlide].description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to={slides[currentSlide].ctaLink}
                    className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-5 py-2.5 rounded-full transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-[#1a6b3c]/30 hover:scale-105 group"
                  >
                    <span>{slides[currentSlide].cta}</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/formations"
                    className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white hover:bg-white/10 font-bold px-5 py-2.5 rounded-full transition-all duration-300 text-xs sm:text-sm backdrop-blur-xs hover:scale-105"
                  >
                    <span>Nos Formations CFP</span>
                  </Link>
                </div>

                {/* Compact Stat Bar - Fully transparent floating layout (no background cards) */}
                <div className="hidden sm:grid grid-cols-4 gap-4 pt-4 mt-2 border-t border-white/20">
                  {statsData.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={stat.key} className="flex items-center gap-2.5 text-white">
                        <div className="text-[#4ade80] shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-black text-white leading-none drop-shadow-sm">
                            <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-white/80 font-semibold uppercase tracking-wider mt-0.5 drop-shadow-xs">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>


      </section>

      {/* ============================================================ */}
      {/* SECTION AVANTAGES */}
      {/* ============================================================ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Les engagements <span className="text-[#1a6b3c]">AFI Collection</span>
            </h2>
            <p className="text-gray-500 mt-1 max-w-md mx-auto text-xs sm:text-sm">
              L'alliance de la qualité artisanale et de la satisfaction client
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {advantages.map((a, index) => (
              <motion.div
                key={a.title}
                className="group relative p-5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${a.bg} border flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <a.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1a6b3c] transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                    {a.text}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center text-[11px] font-semibold text-[#1a6b3c]">
                  <span>Garantie AFI</span>
                  <FiCheckCircle className="w-3 h-3 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION IMPACT SOCIAL & INCLUSION (COMMUNAUTÉS SOURDES) */}
      {/* ============================================================ */}
      <section className="py-14 lg:py-20 bg-gradient-to-b from-[#091a10] via-[#0d2818] to-[#07150c] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {socialImpactStory.title}
            </h2>
            <p className="text-emerald-200/80 mt-2 text-xs sm:text-sm">
              {socialImpactStory.subtitle}
            </p>
          </div>

          {/* Main Story Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            {/* Interactive Image Slider Box - Perfectly framed & proportioned */}
            <motion.div 
              className="lg:col-span-6 relative group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 h-[400px] sm:h-[460px] lg:h-[500px] bg-[#07160c]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={impactSlideIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <img 
                      src={socialImpactStory.images[impactSlideIndex].url} 
                      alt={socialImpactStory.images[impactSlideIndex].alt} 
                      className={`w-full h-full ${socialImpactStory.images[impactSlideIndex].fit || 'object-cover object-center'}`}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                {/* Top Controls & Navigation */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                  <button 
                    onClick={() => setImpactSlideIndex(0)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all backdrop-blur-md border ${
                      impactSlideIndex === 0 
                        ? 'bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-black/50 text-white/70 border-white/20 hover:bg-black/80'
                    }`}
                  >
                    Photo 1
                  </button>
                  <button 
                    onClick={() => setImpactSlideIndex(1)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all backdrop-blur-md border ${
                      impactSlideIndex === 1 
                        ? 'bg-purple-600 text-white border-purple-400' 
                        : 'bg-black/50 text-white/70 border-white/20 hover:bg-black/80'
                    }`}
                  >
                    Photo 2
                  </button>
                </div>

                {/* Left/Right Arrow Navigation overlay */}
                <button 
                  onClick={() => setImpactSlideIndex((prev) => (prev - 1 + socialImpactStory.images.length) % socialImpactStory.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110"
                  aria-label="Image précédente"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => setImpactSlideIndex((prev) => (prev + 1) % socialImpactStory.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110"
                  aria-label="Image suivante"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>

                {/* Quote & Slide Indicator Overlay at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/15 space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-white/95 italic leading-relaxed">
                    &ldquo;{socialImpactStory.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 font-semibold pt-1 border-t border-white/10">
                    <span>{socialImpactStory.images[impactSlideIndex].alt}</span>
                    <span className="font-mono text-white/70">{impactSlideIndex + 1} sur 2</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description & Impact Points */}
            <motion.div 
              className="lg:col-span-6 space-y-5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed">
                <p>
                  {socialImpactStory.text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <p className="text-xl sm:text-2xl font-black text-emerald-400">100%</p>
                  <p className="text-xs text-gray-300 font-medium">Inclusion & Formation</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <p className="text-xl sm:text-2xl font-black text-purple-400">Autonomie</p>
                  <p className="text-xs text-gray-300 font-medium">Financière & Sociale</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/formations"
                  className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg hover:scale-105 text-xs sm:text-sm"
                >
                  <span>En savoir plus sur nos ateliers inclusifs</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Cards Showcase: Remise des créations & Fierté du fait main */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {socialImpactStory.cards.map((card) => (
              <motion.div
                key={card.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 flex flex-col sm:flex-row gap-4 p-4 items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-full sm:w-2/5 aspect-[4/3] rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {card.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION SAVOIR-FAIRE TERROIR & KLUI-KLUI */}
      {/* ============================================================ */}
      <section className="py-14 lg:py-20 bg-[#faf8f5]">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              {terroirStory.title}
            </h2>
            <p className="text-gray-600 mt-2 text-xs sm:text-sm">
              {terroirStory.subtitle}
            </p>
          </div>

          {/* 3 Step Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {terroirStory.steps.map((step, idx) => (
              <motion.div
                key={step.number}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-950/5 flex flex-col justify-between group"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#1a6b3c] text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                      Étape {step.number}
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      {step.subtitle}
                    </p>
                    <h3 className="text-lg font-black text-gray-900 leading-snug group-hover:text-[#1a6b3c] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                      {step.text}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs font-bold text-[#1a6b3c]">
                    <span>100% Naturel & Artisanal</span>
                    <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/boutique"
              className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-7 py-3 rounded-full transition shadow-md shadow-[#1a6b3c]/20 hover:scale-105 text-xs sm:text-sm"
            >
              <span>Découvrir nos produits agroalimentaires du terroir</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION UNIVERSE & ENGAGEMENT */}
      {/* ============================================================ */}
      <section className="py-12 lg:py-16 bg-[#f4f7f4]">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              Découvrez <span className="text-[#1a6b3c]">notre histoire</span>
            </h2>
            <p className="text-gray-500 mt-1 max-w-lg mx-auto text-xs sm:text-sm">
              Plongez au cœur de l'artisanat béninois à travers nos valeurs et nos passions.
            </p>
          </div>

          <div className="space-y-4">
            {featuredSections.map((section, index) => (
              <FeatureSection key={section.id} section={section} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION PRODUITS VEDETTES */}
      {/* ============================================================ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Nos <span className="text-[#1a6b3c]">créations artisanales</span>
              </h2>
            </div>

            {/* Filter Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize shrink-0 transition-all ${
                    activeCategory === cat
                      ? 'bg-[#1a6b3c] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 p-8">
              <FiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">Aucun produit dans cette catégorie</p>
              <button 
                onClick={() => setActiveCategory('toutes')} 
                className="mt-3 bg-[#1a6b3c] text-white text-xs font-bold px-4 py-2 rounded-full"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/boutique"
              className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-bold px-7 py-3 rounded-full transition shadow-md shadow-[#1a6b3c]/20 hover:scale-105 text-xs sm:text-sm"
            >
              <span>Voir tout le catalogue de la boutique</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION FORMATIONS */}
      {/* ============================================================ */}
      <section className="py-12 lg:py-16 bg-[#f4f7f4]">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Nos <span className="text-[#1a6b3c]">filières de formation (CFP Dorcas)</span>
            </h2>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm max-w-lg mx-auto">
              Apprenez un métier d'art et devenez autonome grâce à nos modules certifiés.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trainings.slice(0, 4).map((t, index) => {
              const accent = t.color || '#1a6b3c';
              const imgSrc = t.image?.startsWith('/')
                ? `http://localhost:5000${t.image}`
                : t.image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600';

              return (
                <motion.div
                  key={t.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <div>
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-xs" style={{ color: accent }}>
                        ⏱ {t.duration || '3 mois'}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug group-hover:text-[#1a6b3c] transition-colors">{t.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{t.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-1">
                    <span className="text-xs font-bold text-gray-900 font-mono">{t.price}</span>
                    <Link to="/formations" className="text-xs font-bold text-[#1a6b3c] flex items-center gap-1 hover:underline">
                      S'inscrire <FiArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/formations"
              className="inline-flex items-center gap-2 border-2 border-[#1a6b3c] text-[#1a6b3c] hover:bg-[#1a6b3c] hover:text-white font-bold px-6 py-2.5 rounded-full transition duration-300 text-xs sm:text-sm"
            >
              En savoir plus sur le CFP Dorcas
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION TEMOIGNAGES ET PARTENAIRES EN COULEUR */}
      {/* ============================================================ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Ce qu'ils <span className="text-[#1a6b3c]">pensent de nous</span>
            </h2>
          </div>

          <div
            ref={testimonialRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-4 md:pb-0 scrollbar-hide"
            onMouseEnter={() => setAutoScrollPaused(true)}
            onMouseLeave={() => setAutoScrollPaused(false)}
          >
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 hover:border-[#1a6b3c]/30 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-w-[260px] snap-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <div>
                  <div className="flex items-center gap-1 mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-gray-200/60">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a6b3c] to-[#4ade80] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PARTENAIRES EN COULEURS (SANS GREYSCALE) */}
          <div className="mt-14 pt-10 border-t border-gray-100 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              Nos partenaires institutionnels et associatifs
            </p>
            <div
              ref={partnerRef}
              className="flex md:grid md:grid-cols-6 gap-5 overflow-x-auto items-center justify-center snap-x snap-mandatory md:overflow-visible pb-2 scrollbar-hide"
            >
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-2xl p-4 flex items-center justify-center border border-gray-100 min-w-[130px] md:min-w-0 hover:shadow-md transition-all hover:scale-105">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 object-contain transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=1a6b3c&color=fff&size=80`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA FINAL */}
      {/* ============================================================ */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <motion.div
            className="max-w-5xl mx-auto text-center p-8 sm:p-12 lg:p-16 rounded-3xl relative overflow-hidden bg-gradient-to-br from-[#07170d] via-[#1a6b3c] to-[#0a2314] shadow-xl text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#4ade80]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#4ade80]/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                Prêt à découvrir l'excellence <br />
                <span className="text-[#4ade80]">de l'artisanat béninois</span> ?
              </h2>
              <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Parcourez nos créations uniques ou rejoignez nos programmes de formation pour développer vos compétences.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Link 
                  to="/boutique" 
                  className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-[#1a6b3c] px-7 py-3 rounded-full font-bold transition-all shadow-lg hover:scale-105 text-xs sm:text-sm"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Accéder à la boutique</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white hover:bg-white/10 px-7 py-3 rounded-full font-bold transition text-xs sm:text-sm"
                >
                  <span>Nous contacter</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

