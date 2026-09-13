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
  FiHeadphones,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { productsApi, trainingsApi, type Product, type Training } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { SectionBg } from '../components/SectionBg';
import { WappeWord } from '../components/WappeWord';
import { AFI_IMAGES, AFI_FALLBACK_PRODUCT, AFI_FALLBACK_PHOTO } from '../lib/images';

// ============================================================
// DONNÉES
// ============================================================

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

const advantages = [
  { 
    icon: FiAward, 
    title: '100% Artisanal & Fait Main', 
    text: 'Créations authentiques façonnées par des maîtres artisans béninois au savoir-faire d\'exception.',
    bg: 'bg-[#028444]/15 text-[#028444] border-[#028444]/40',
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

function FeatureSection({ section, index }: { section: typeof featuredSections[0]; index: number }) {
  return (
    <motion.div 
      className={`flex flex-col ${section.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 lg:gap-12 items-center py-10 lg:py-14 ${index !== 0 ? 'border-t border-[#0f1f14]/10' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full lg:w-1/2 group">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#0f1f14]/15 bg-black/40">
          <img
            src={section.image}
            alt={section.title}
            className={`w-full h-64 sm:h-80 md:h-[400px] ${section.objectFit || 'object-cover'} group-hover:scale-105 transition-transform duration-700 ease-out`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                AFI_IMAGES.exposition;
            }}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 space-y-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f1f14] leading-tight tracking-tight">
          {section.title}
        </h3>
        <p className="text-[#0f1f14]/60 text-sm sm:text-base leading-relaxed">
          {section.text}
        </p>
        <Link 
          to="/boutique" 
          className="btn-raised btn-sm"
        >
          <span>Découvrir nos créations</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPOSANTS DU HERO POP INSPIRÉ DU SITE DU PORT 3002
// (EN VERT DU LOGO AFI : #028444 & #05a855)
// ═══════════════════════════════════════════════════════════

const HERO_SLOGANS = [
  { before: "Maison d'artisanat d'art & créations ", highlight: "FAIT MAIN" },
  { before: "Maroquinerie de prestige & macramé ", highlight: "BÉNINOIS" },
  { before: "Inclusion des sourds & formations certifiées ", highlight: "CFP DORCAS" },
  { before: "Saveurs authentiques du terroir & klui-klui ", highlight: "D'AGONLIN" },
];

const HERO_AVATARS = [
  { name: "Pelagie A.", img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785574438/WhatsApp_Image_2026-08-01_at_09.51.43_ykpwvs.jpg" },
  { name: "Dorcas D.", img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573442/WhatsApp_Image_2026-08-01_at_08.30.47_w1owpu.jpg" },
  { name: "Victoire K.", img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785575610/WhatsApp_Image_2026-08-01_at_10.09.08_1_crzxkb.jpg" },
  { name: "Bernadette M.", img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785574438/WhatsApp_Image_2026-08-01_at_09.53.13_syzpyy.jpg" },
];

const HERO_GALLERY_ITEMS = [
  {
    id: 1,
    title: "Sac Macramé Fuchsia & Naturel",
    type: "Maroquinerie d'Art",
    img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573443/WhatsApp_Image_2026-08-01_at_08.31.11_1_mu9zgn.jpg",
    url: "/boutique"
  },
  {
    id: 2,
    title: "Sac Banane Artisanal Tissé",
    type: "Accessoires & Mode",
    img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785574438/WhatsApp_Image_2026-08-01_at_09.51.43_ykpwvs.jpg",
    url: "/boutique"
  },
  {
    id: 3,
    title: "Atelier Macramé & Inclusion Sociale",
    type: "CFP Dorcas",
    img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573442/WhatsApp_Image_2026-08-01_at_08.30.47_w1owpu.jpg",
    url: "/formations"
  },
  {
    id: 4,
    title: "Klui-Klui d'Agonlin Croustillant",
    type: "Terroir Béninois",
    img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573444/WhatsApp_Image_2026-08-01_at_08.31.11_2_x6h3lg.jpg",
    url: "/boutique"
  },
  {
    id: 5,
    title: "Exposition & Salons d'Art",
    type: "Collection AFI",
    img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441621/WhatsApp_Image_2026-05-03_at_13.03.09_2_cujxnk.jpg",
    url: "/boutique"
  },
  {
    id: 6,
    title: "Remise des Diplômes & Créations",
    type: "Impact Social",
    img: "https://res.cloudinary.com/dzxesa3wi/image/upload/v1785575610/WhatsApp_Image_2026-08-01_at_10.09.08_1_crzxkb.jpg",
    url: "/formations"
  }
];

function HeroSloganCycle({ index }: { index: number }) {
  const { before, highlight } = HERO_SLOGANS[index % HERO_SLOGANS.length];

  return (
    <div className="mb-4 sm:mb-6 max-w-5xl mx-auto min-h-[4.8rem] sm:min-h-[6.2rem] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={index}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="font-black uppercase text-white text-center leading-[1.02] tracking-tight m-0 text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem]"
          style={{ textShadow: '0 2px 24px rgba(0, 0, 0, 0.85)' }}
        >
          {before}
          <span className="wappe-glow text-[#05a855]">
            {highlight}
          </span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

function CircularProjectsGallery() {

  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setActive((a) => (a + 1) % HERO_GALLERY_ITEMS.length), 2800);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const order = HERO_GALLERY_ITEMS.map((_, i) => {
    let rel = i - active;
    if (rel > HERO_GALLERY_ITEMS.length / 2) rel -= HERO_GALLERY_ITEMS.length;
    if (rel < -HERO_GALLERY_ITEMS.length / 2) rel += HERO_GALLERY_ITEMS.length;
    return rel;
  });

  const CARD_W = 320;
  const CARD_H = 172;
  const STEP = CARD_W * 0.72;

  return (
    <div className="relative h-[210px] sm:h-[235px] w-full max-w-[100vw] overflow-hidden flex items-center justify-center [perspective:1200px]">
      {HERO_GALLERY_ITEMS.map((p, i) => {
        const rel = order[i];
        const abs = Math.abs(rel);
        const x = rel * STEP;
        const y = abs * 14;
        const rot = rel * 8;
        const scale = 1 - abs * 0.13;
        const opacity = abs > 2 ? 0 : 1 - abs * 0.18;
        const isActive = rel === 0;

        return (
          <motion.div
            key={p.id}
            animate={{ x, y, rotate: rot, scale, opacity }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setActive(i)}
            style={{
              position: 'absolute',
              width: CARD_W,
              height: CARD_H,
              borderRadius: 14,
              overflow: 'hidden',
              zIndex: 10 - abs,
              cursor: 'pointer',
              border: isActive
                ? '2px solid #05a855'
                : '1px solid rgba(255,255,255,0.14)',
              boxShadow: isActive
                ? '0 0 0 3px rgba(5, 168, 85, 0.35), 0 16px 40px rgba(0,0,0,0.85)'
                : '0 6px 20px rgba(0,0,0,0.5)',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={p.img}
              alt={p.title}
              className="w-full h-full object-cover object-center"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: isActive
                  ? 'rgba(0, 0, 0, 0.70)'
                  : 'rgba(0, 0, 0, 0.55)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 text-left">
              <div className="font-extrabold text-white text-xs sm:text-sm tracking-tight line-clamp-1">
                {p.title}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-[#05a855] mt-0.5">
                {p.type}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================================
// PAGE ACCUEIL PRINCIPALE
// ============================================================

// ESSAI (réversible) : images du net assorties à chaque module
// de formation — prioritaires sur les images de l'API.
const TRAINING_NET_IMAGES: { match: string[]; src: string }[] = [
  {
    match: ['macram', 'tricot'],
    src: 'https://images.unsplash.com/photo-1632393121391-3c40fcfafe1a?auto=format&fit=crop&w=800&q=80',
  },
  {
    match: ['teinture', 'pagne'],
    src: 'https://images.unsplash.com/photo-1768212565424-efa3a3852b81?auto=format&fit=crop&w=800&q=80',
  },
  {
    match: ['sésame', 'sesame'],
    src: 'https://images.unsplash.com/photo-1705026042359-2d5b761845f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    match: ['soja', 'soy'],
    src: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80',
  },
];

function trainingNetImage(title: string): string | null {
  const t = (title || '').toLowerCase();
  return TRAINING_NET_IMAGES.find((e) => e.match.some((m) => t.includes(m)))?.src ?? null;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('toutes');
  const [impactSlideIndex, setImpactSlideIndex] = useState(0);
  // Navigation du hero façon Wappe : slogan piloté + pause au survol
  const [sloganIndex, setSloganIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (heroPaused || reduceMotion) return;
    const id = setInterval(() => setSloganIndex((i) => (i + 1) % HERO_SLOGANS.length), 3500);
    return () => clearInterval(id);
  }, [heroPaused, reduceMotion]);

  const heroMidRef = useRef<HTMLDivElement>(null);
  const heroGalleryRef = useRef<HTMLDivElement>(null);

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

  const categoriesList = ['toutes', 'macramé', 'teinture', 'décoration', 'accessoires', 'sésame', 'soja'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'toutes') return products.slice(0, 8);
    return products.filter(p => p.category?.toLowerCase().includes(activeCategory)).slice(0, 8);
  }, [products, activeCategory]);

  return (
    <div className="wappe-radical bg-[#f3f6f3] text-[#0f1f14] overflow-x-clip">
      <SEO
        title="Boutique Artisanale & Maroquinerie d'Art"
        description="Découvrez AFI Collection, maison d'artisanat d'art béninois : sacs macramé faits main, sandales, pagnes, agroalimentaire et formations certifiées CFP Dorcas. Livraison 48h."
      />
      
      {/* ============================================================ */}
      {/* HERO SECTION - Style Copié du Port 3002 en VERT DU LOGO AFI */}
      {/* ============================================================ */}
      <section 
        className="wappe-hero relative min-h-[92vh] lg:min-h-[100vh] w-full overflow-hidden flex flex-col justify-between items-center bg-[#070b08] pt-24 sm:pt-28 pb-6"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onMouseMove={(e) => {
          const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
          const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
          if (heroMidRef.current) {
            heroMidRef.current.style.transform = `translate3d(${x * 16}px, ${y * 12}px, 0)`;
          }
          if (heroGalleryRef.current) {
            heroGalleryRef.current.style.transform = `translate3d(${x * -18}px, ${y * -8}px, 0)`;
          }
        }}
      >
        {/* Calque Fond Arrière-Plan avec texture grille et demi-teinte */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1780563939/slide3_zsjt4w.png"
            alt="Artisanes AFI Collection"
            className="w-full h-full object-cover filter blur-[2px] scale-105 opacity-80"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="grid-bg absolute inset-0 opacity-10 pointer-events-none" />
          <div className="halftone-bg absolute top-0 right-0 w-1/2 h-1/2 opacity-10 pointer-events-none" />
        </div>

        {/* Particules Lumineuses Flottantes */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[
            { left: '10%', top: '20%', s: 5, dur: 4.2, dy: 0 },
            { left: '26%', top: '68%', s: 4, dur: 5.4, dy: 1 },
            { left: '52%', top: '16%', s: 6, dur: 4.8, dy: 0.5 },
            { left: '74%', top: '75%', s: 4, dur: 6.0, dy: 1.5 },
            { left: '88%', top: '22%', s: 5, dur: 3.8, dy: 0.2 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#05a855] shadow-[0_0_12px_#05a855]"
              style={{ left: p.left, top: p.top, width: p.s, height: p.s, opacity: 0.35 }}
              animate={{ y: [0, -22, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.dy }}
            />
          ))}
        </div>

        {/* Contenu Central : Titre, Slogan, Avatars, Boutons */}
        <div
          ref={heroMidRef}
          className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center transition-transform duration-100 ease-out"
        >
          {/* Slogan Cyclique */}
          <HeroSloganCycle index={sloganIndex} />

          {/* Paragraphe descriptif centré */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-white/75 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            Maison d'artisanat d'art béninois : sacs en macramé uniques, tissages traditionnels, agroalimentaire du terroir et formation d'excellence au CFP Dorcas.
          </motion.p>

          {/* AvatarGroup Réassurance Sociale */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="flex -space-x-2.5 overflow-hidden p-1">
              {HERO_AVATARS.map((c, i) => (
                <img
                  key={i}
                  src={c.img}
                  alt={c.name}
                  className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-black object-cover border border-white/20"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="font-black italic text-xs sm:text-sm text-white uppercase leading-tight tracking-tight">
                Artisanes & Maîtres d'art
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[#05a855]">
                150+ femmes formées & 500+ créations uniques
              </div>
            </div>
          </motion.div>

          {/* Boutons d'Action Néo-Brutalistes */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <a
              href="https://wa.me/2290197222880"
              target="_blank"
              rel="noreferrer"
              className="btn-raised btn-xl"
            >
              <FaWhatsapp className="w-5 h-5 text-white" />
              <span>Commander sur WhatsApp</span>
              <FiArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/boutique"
              className="btn-ghost btn-xl"
            >
              <span>Explorer la boutique</span>
            </Link>
          </motion.div>
        </div>

        {/* Galerie Circulaire 3D Ancrée en bas du Hero */}
        <div
          ref={heroGalleryRef}
          className="w-full relative z-20 mt-6 sm:mt-8 transition-transform duration-100 ease-out"
        >
          <CircularProjectsGallery />
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-20 flex flex-col items-center opacity-40 pointer-events-none mt-2">
          <span className="text-[9px] tracking-widest uppercase font-bold text-white mb-1">Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-0.5 h-6 bg-white/40 rounded-full"
          />
        </div>
      </section>

      {/* ── Marquee strip réassurance façon port 3002 en vert du logo AFI ── */}
      <div className="wappe-ticker bg-[#028444] text-white font-black italic uppercase py-3 overflow-hidden border-y-[3px] border-black shadow-[0_4px_24px_rgba(5,168,85,0.4)]">
        <div className="marquee-container">
          <div className="marquee-content text-xs sm:text-sm tracking-wider flex items-center gap-8">
            <span>✦ MACRAMÉ D'ART FAIT MAIN</span>
            <span>✦ 100% ARTISANAT BÉNINOIS</span>
            <span>✦ FORMATIONS CFP DORCAS INCLUSIVES</span>
            <span>✦ LIVRAISON 48H BÉNIN & AFRIQUE</span>
            <span>✦ PAIEMENT SÉCURISÉ MOBILE MONEY KKIAPAY</span>
            <span>✦ ATELIER ABOMEY-CALAVI</span>
            <span>✦ MACRAMÉ D'ART FAIT MAIN</span>
            <span>✦ 100% ARTISANAT BÉNINOIS</span>
            <span>✦ FORMATIONS CFP DORCAS INCLUSIVES</span>
            <span>✦ LIVRAISON 48H BÉNIN & AFRIQUE</span>
            <span>✦ PAIEMENT SÉCURISÉ MOBILE MONEY KKIAPAY</span>
            <span>✦ ATELIER ABOMEY-CALAVI</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION AVANTAGES (ALIGNÉS HORIZONTALEMENT SUR 1 SEULE LIGNE) */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-12 lg:py-16 pop-night relative overflow-hidden">
        <SectionBg src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441621/WhatsApp_Image_2026-05-03_at_13.03.09_2_cujxnk.jpg" />
        <div className="pop-halftone absolute inset-0 opacity-[0.06] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-12 relative">
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#028444]">Nos engagements</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase text-[#0f1f14] tracking-tight mt-3">
              <span className="pop-ghost-wrap">
                <span className="pop-ghost" aria-hidden="true">AFI Collection</span>
                Les engagements <span className="text-[#028444]">AFI Collection</span>
              </span>
            </h2>
            <p className="text-[#0f1f14]/60 mt-2 max-w-md mx-auto text-xs sm:text-sm">
              L'alliance de la qualité artisanale et de la satisfaction client
            </p>
          </div>

          {/* Horizontal Single Line Layout */}
          <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 lg:grid lg:grid-cols-4 lg:gap-5 -mx-4 px-4 sm:mx-0 sm:px-0">
            {advantages.map((a, index) => (
              <motion.div
                key={a.title}
                className="pop-card shrink-0 w-[240px] sm:w-[260px] lg:w-auto snap-center group relative p-4 sm:p-5 flex flex-col justify-between"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#028444] border-2 border-black shadow-[2px_2px_0px_#000] text-white flex items-center justify-center mb-3 group-hover:scale-105 group-hover:rotate-6 transition-transform">
                    <a.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0f1f14] group-hover:text-[#028444] transition-colors leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-[#0f1f14]/60 text-[11px] sm:text-xs mt-1.5 leading-relaxed line-clamp-3">
                    {a.text}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#0f1f14]/10 flex items-center text-[10px] sm:text-[11px] font-bold text-[#028444]">
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
      <section className="py-14 lg:py-20 bg-white text-[#0f1f14] relative overflow-hidden">
        <SectionBg src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573442/WhatsApp_Image_2026-08-01_at_08.30.47_w1owpu.jpg" />
        <WappeWord word="Impact" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#028444]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#05a855]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#028444] mb-2 inline-block">Engagement Citoyen</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic uppercase text-[#0f1f14] tracking-tight leading-tight mt-1">
              <span className="pop-ghost-wrap">
                <span className="pop-ghost" aria-hidden="true">Impact Social</span>
                {socialImpactStory.title}
              </span>
            </h2>
            <p className="text-[#0f1f14]/60 mt-2 text-xs sm:text-sm max-w-xl mx-auto">
              {socialImpactStory.subtitle}
            </p>
          </div>

          {/* Main Story Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            {/* Interactive Image Slider Box */}
            <motion.div 
              className="lg:col-span-6 relative group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#0f1f14]/15 h-[400px] sm:h-[460px] lg:h-[500px] bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={impactSlideIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full relative"
                  >
                    <img 
                      src={socialImpactStory.images[impactSlideIndex].url} 
                      alt={socialImpactStory.images[impactSlideIndex].alt} 
                      className={`w-full h-full ${socialImpactStory.images[impactSlideIndex].fit || 'object-cover object-center'}`}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-black/40" />

                {/* Top Controls & Navigation */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                  <button 
                    onClick={() => setImpactSlideIndex(0)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black italic uppercase transition-all backdrop-blur-md border ${
                      impactSlideIndex === 0 
                        ? 'bg-[#028444] text-white border-black shadow-[2px_2px_0px_#000]' 
                        : 'bg-black/50 text-white/70 border-white/20 hover:bg-black/80'
                    }`}
                  >
                    Atelier Macramé
                  </button>
                  <button 
                    onClick={() => setImpactSlideIndex(1)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black italic uppercase transition-all backdrop-blur-md border ${
                      impactSlideIndex === 1 
                        ? 'bg-[#028444] text-white border-black shadow-[2px_2px_0px_#000]' 
                        : 'bg-black/50 text-white/70 border-white/20 hover:bg-black/80'
                    }`}
                  >
                    Remise des dons
                  </button>
                </div>

                {/* Left/Right Arrow Navigation overlay */}
                <button 
                  onClick={() => setImpactSlideIndex((prev) => (prev - 1 + socialImpactStory.images.length) % socialImpactStory.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-[#028444] hover:text-white text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110"
                  aria-label="Image précédente"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => setImpactSlideIndex((prev) => (prev + 1) % socialImpactStory.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-[#028444] hover:text-white text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110"
                  aria-label="Image suivante"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>

                {/* Quote & Slide Indicator Overlay at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 bg-black/75 backdrop-blur-md rounded-2xl border border-white/15 space-y-2">
                  <p className="text-xs sm:text-sm font-medium text-white/95 italic leading-relaxed">
                    &ldquo;{socialImpactStory.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#05a855] font-bold pt-1 border-t border-white/10">
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
              <div className="space-y-4 text-[#0f1f14]/80 text-sm sm:text-base leading-relaxed">
                <p>
                  {socialImpactStory.text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#0f1f14]/10">
                  <p className="text-xl sm:text-2xl font-black text-[#028444]">100%</p>
                  <p className="text-xs text-[#0f1f14]/70 font-medium">Inclusion & Formation</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#0f1f14]/10">
                  <p className="text-xl sm:text-2xl font-black text-[#0f1f14]">Autonomie</p>
                  <p className="text-xs text-[#0f1f14]/70 font-medium">Financière & Sociale</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/formations"
                  className="btn-raised"
                >
                  <span>En savoir plus sur nos ateliers inclusifs</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Cards Showcase: Remise des créations & Fierté du fait main */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#0f1f14]/10">
            {socialImpactStory.cards.map((card) => (
              <motion.div
                key={card.id}
                className="pop-card flex flex-col sm:flex-row gap-4 p-4 items-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-full sm:w-2/5 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border border-[#0f1f14]/10">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-[#0f1f14] group-hover:text-[#028444] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#0f1f14]/60 leading-relaxed">
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
      <section className="py-14 lg:py-20 pop-night relative overflow-hidden">
        <SectionBg src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1785574438/WhatsApp_Image_2026-08-01_at_09.53.13_syzpyy.jpg" />
        <WappeWord word="Terroir" />
        <div className="pop-halftone absolute inset-0 opacity-[0.05] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#028444] mb-2 inline-block">Terroir Béninois</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic uppercase text-[#0f1f14] tracking-tight leading-tight mt-1">
              <span className="pop-ghost-wrap">
                <span className="pop-ghost" aria-hidden="true">Savoir-Faire</span>
                {terroirStory.title}
              </span>
            </h2>
            <p className="text-[#0f1f14]/60 mt-2 text-xs sm:text-sm max-w-xl mx-auto">
              {terroirStory.subtitle}
            </p>
          </div>

          {/* 3 Step Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {terroirStory.steps.map((step, idx) => (
              <motion.div
                key={step.number}
                className="pop-card flex flex-col justify-between group overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/40 border-b border-[#0f1f14]/10">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#028444] text-white text-xs font-black italic uppercase px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_#000]">
                      Étape {step.number}
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-[#028444]">
                      {step.subtitle}
                    </p>
                    <h3 className="text-lg font-black text-[#0f1f14] leading-snug group-hover:text-[#028444] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0f1f14]/60 leading-relaxed pt-1">
                      {step.text}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-[#0f1f14]/10 pt-3 flex items-center justify-between text-xs font-bold text-[#028444]">
                    <span>100% Naturel & Artisanal</span>
                    <FiCheckCircle className="w-4 h-4 text-[#028444]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/boutique"
              className="btn-raised"
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
      <section className="py-12 lg:py-16 pop-night relative overflow-hidden border-t border-[#0f1f14]/10">
        <SectionBg src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1785574438/WhatsApp_Image_2026-08-01_at_09.51.43_ykpwvs.jpg" />
        <div className="container mx-auto px-4 md:px-12 relative">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#028444] mb-2 inline-block">Maison d'Artisanat</span>
            <h2 className="text-2xl md:text-4xl font-black italic uppercase text-[#0f1f14] tracking-tight mt-1">
              <span className="pop-ghost-wrap">
                <span className="pop-ghost" aria-hidden="true">Histoire</span>
                Découvrez <span className="text-[#028444]">notre histoire</span>
              </span>
            </h2>
            <p className="text-[#0f1f14]/60 mt-1 max-w-lg mx-auto text-xs sm:text-sm">
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
      <section className="py-10 sm:py-14 lg:py-16 pop-night relative overflow-hidden border-t border-[#0f1f14]/10">
        <SectionBg src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1785573443/WhatsApp_Image_2026-08-01_at_08.31.11_1_mu9zgn.jpg" />
        <WappeWord word="Créations" />
        <div className="pop-halftone absolute inset-0 opacity-[0.05] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-12 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#028444] mb-2 inline-block">Fait main au Bénin</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase text-[#0f1f14] tracking-tight mt-1">
                <span className="pop-ghost-wrap">
                  <span className="pop-ghost" aria-hidden="true">Créations</span>
                  Nos <span className="text-[#028444]">créations artisanales</span>
                </span>
              </h2>
            </div>

            {/* Filter Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black italic uppercase tracking-wide shrink-0 transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#028444] text-white shadow-[2px_2px_0px_#000] scale-105'
                      : 'bg-[#0f1f14]/5 text-[#0f1f14]/60 hover:bg-[#028444]/10 hover:text-[#028444] border border-[#0f1f14]/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="pop-card animate-pulse overflow-hidden">
                  <div className="aspect-[4/5] bg-[#0f1f14]/5" />
                  <div className="p-3 space-y-2">
                    <div className="h-3.5 bg-[#0f1f14]/10 rounded w-3/4" />
                    <div className="h-3 bg-[#0f1f14]/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 pop-card p-8">
              <FiShoppingBag className="w-12 h-12 text-[#028444]/40 mx-auto mb-2" />
              <p className="text-xs font-bold text-[#0f1f14]">Aucun produit dans cette catégorie</p>
              <button 
                onClick={() => setActiveCategory('toutes')} 
                className="btn-raised btn-sm mt-3"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.25) }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/boutique"
              className="btn-raised"
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
      <section className="py-12 lg:py-16 pop-night relative overflow-hidden border-t border-[#0f1f14]/10">
        <SectionBg src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1785575610/WhatsApp_Image_2026-08-01_at_10.09.08_1_crzxkb.jpg" />
        <WappeWord word="Formations" />
        <div className="container mx-auto px-4 md:px-12 relative">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#028444] mb-2 inline-block">Transmission & Savoir-Faire</span>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase text-[#0f1f14] tracking-tight mt-1">
              <span className="pop-ghost-wrap">
                <span className="pop-ghost" aria-hidden="true">Formations</span>
                Nos filières de formation <span className="text-[#028444]">(CFP Dorcas)</span>
              </span>
            </h2>
            <p className="text-[#0f1f14]/60 mt-1 text-xs sm:text-sm max-w-lg mx-auto">
              Apprenez un métier d'art et devenez autonome grâce à nos modules certifiés.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trainings.slice(0, 4).map((t, index) => {
              const accent = t.color || '#05a855';
              const imgSrc =
                trainingNetImage(t.title) ??
                (t.image?.startsWith('/')
                  ? `http://localhost:5000${t.image}`
                  : t.image || AFI_FALLBACK_PHOTO);

              return (
                <motion.div
                  key={t.id}
                  className="pop-card flex flex-col justify-between group overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                      <img
                        src={imgSrc}
                        alt={t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            AFI_FALLBACK_PRODUCT;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/25" />
                      <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs rounded-full px-2.5 py-0.5 text-[10px] font-bold border border-white/10" style={{ color: accent }}>
                        ⏱ {t.duration || '3 mois'}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-bold text-[#0f1f14] mb-1 leading-snug group-hover:text-[#028444] transition-colors">{t.title}</h3>
                      <p className="text-xs text-[#0f1f14]/60 leading-relaxed line-clamp-2">{t.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-[#0f1f14]/10 mt-1">
                    <span className="text-xs font-bold text-[#0f1f14] font-mono">{t.price}</span>
                    <Link to="/formations" className="text-xs font-bold text-[#028444] flex items-center gap-1 hover:underline">
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
              className="btn-ghost"
            >
              En savoir plus sur le CFP Dorcas
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION TEMOIGNAGES ET PARTENAIRES EN COULEUR */}
      {/* ============================================================ */}
      <section className="py-12 lg:py-16 pop-night relative overflow-hidden border-t border-[#0f1f14]/10">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#028444] mb-2 inline-block">Avis Vérifiés</span>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase text-[#0f1f14] tracking-tight mt-1">
              <span className="pop-ghost-wrap">
                <span className="pop-ghost" aria-hidden="true">Témoignages</span>
                Ce qu'ils <span className="text-[#028444]">pensent de nous</span>
              </span>
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
                className="pop-card p-5 flex flex-col justify-between min-w-[260px] snap-center hover:border-[#05a855]/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <div>
                  <div className="flex items-center gap-1 mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-3.5 h-3.5 text-[#028444] fill-[#028444]" />
                    ))}
                  </div>
                  <p className="text-[#0f1f14]/80 text-xs leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-[#0f1f14]/10">
                  <div className="w-9 h-9 rounded-full bg-[#028444] flex items-center justify-center text-white text-xs font-black shrink-0 border-2 border-black">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0f1f14]">{t.name}</p>
                    <p className="text-[10px] text-[#0f1f14]/60">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PARTENAIRES EN COULEURS (SANS GREYSCALE) */}
          <div className="mt-14 pt-10 border-t border-[#0f1f14]/10 text-center">
            <p className="text-xs font-bold text-[#0f1f14]/50 uppercase tracking-widest mb-6">
              Nos partenaires institutionnels et associatifs
            </p>
            <div
              ref={partnerRef}
              className="flex md:grid md:grid-cols-6 gap-5 overflow-x-auto items-center justify-center snap-x snap-mandatory md:overflow-visible pb-2 scrollbar-hide"
            >
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-2xl p-4 flex items-center justify-center border border-[#0f1f14]/10 min-w-[130px] md:min-w-0 hover:border-[#05a855]/40 hover:shadow-md transition-all hover:scale-105">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 object-contain transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=028444&color=fff&size=80`;
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
      <section className="py-14 lg:py-20 pop-night relative overflow-hidden border-t border-[#0f1f14]/10">
        <div className="pop-halftone absolute inset-0 opacity-[0.05] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-12 relative">
          <motion.div
            className="max-w-5xl mx-auto text-center p-8 sm:p-12 lg:p-16 rounded-3xl relative overflow-hidden bg-white border-2 border-[#028444]/40 shadow-[4px_4px_0px_#000] text-[#0f1f14]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#028444]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#05a855]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#028444]">Rejoignez-nous</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic uppercase text-[#0f1f14] tracking-tight">
                Prêt à découvrir l'excellence <br />
                <span className="text-[#028444]">de l'artisanat béninois</span> ?
              </h2>
              <p className="text-[#0f1f14]/60 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Parcourez nos créations uniques ou rejoignez nos programmes de formation pour développer vos compétences.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
                <Link 
                  to="/boutique" 
                  className="btn-raised"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Accéder à la boutique</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/contact" 
                  className="btn-ghost btn-xl"
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

