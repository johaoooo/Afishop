import SEO from '../components/SEO';
import { FiHeart, FiUsers, FiAward, FiEye, FiArrowRight, FiMapPin, FiCalendar, FiShoppingBag, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AFI_IMAGES } from '../lib/images';

export default function About() {
  const values = [
    { icon: FiHeart, title: 'Passion & Authenticité', text: 'Chaque création est le fruit d\'une passion transmise de génération en génération par nos maîtres artisans.' },
    { icon: FiUsers, title: 'Communauté d\'Artisans', text: 'Nous soutenons plus de 1 000 artisans talentueux à travers toutes les régions du Bénin.' },
    { icon: FiAward, title: 'Qualité d\'Exception', text: 'Nous sélectionnons rigoureusement des matières nobles et durables pour chaque produit.' },
    { icon: FiEye, title: 'Rayonnement International', text: 'Faire briller la richesse de la culture et de la maroquinerie béninoise dans le monde entier.' },
  ];

  const stats = [
    { icon: FiUsers, value: '500+', label: 'Clients Satisfaits' },
    { icon: FiShoppingBag, value: '500+', label: 'Produits Fait-Main' },
    { icon: FiAward, value: '1 000+', label: 'Artisans Partenaires' },
    { icon: FiStar, value: '98%', label: 'Taux de Satisfaction' },
  ];

  return (
    <div className="bg-[#070b08] min-h-screen text-white pb-20">
      <SEO title="À Propos | AFI Collection" description="Découvrez l'histoire d'AFI Collection, notre mission de valoriser l'artisanat béninois et notre communauté d'artisans talentueux." />

      {/* ===== HERO ===== */}
      <div className="relative py-14 sm:py-20 md:py-32 text-white overflow-hidden shadow-md">
        <img
          src={AFI_IMAGES.atelierCadre}
          alt="AFI Collection - Artisanat béninois"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-[#070b08]/80" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <span className="pop-sticker mb-4 inline-block">Notre Histoire</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
              À Propos de <span className="text-[#05a855]">AFI Collection</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-medium max-w-md mx-auto pt-1 drop-shadow-sm">
              L'excellence de l'artisanat béninois, entre passion, tradition et modernité.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20 space-y-10">
        
        {/* ===== HISTOIRE AVEC IMAGE ===== */}
        <motion.div 
          className="bg-[#121914] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                L'Histoire & la Vision <br />
                <span className="text-[#05a855]">AFI Collection</span>
              </h2>
              
              <div className="space-y-3.5 text-xs sm:text-sm text-white/60 leading-relaxed">
                <p>
                  <strong className="text-white font-bold">AFI Collection</strong> est née d'une conviction profonde : 
                  l'artisanat africain possède un potentiel d'élégance unique qui mérite d'être célébré à sa juste valeur. 
                  Fondée à Abomey-Calavi, notre maison met en lumière le savoir-faire ancestral des artisans béninois.
                </p>
                <p>
                  Chaque création raconte une histoire vivante : celle d'un maître artisan qui façonne la matière 
                  avec passion, de teintures végétales naturelles aux teintes vibrantes, et d'un patrimoine culturel qui 
                  se réinvente avec modernité.
                </p>
                <p>
                  Aujourd'hui, nous faisons le pont entre nos communautés d'artisans locaux et les passionnés d'objets 
                  d'art uniques à travers le monde.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 bg-[#028444]/20 text-[#05a855] px-4 py-2 rounded-2xl text-xs font-bold border border-[#028444]/30">
                  <FiMapPin className="w-4 h-4" />
                  <span>Abomey-Calavi, Bénin</span>
                </div>
                <div className="flex items-center gap-2 bg-[#028444]/20 text-[#05a855] px-4 py-2 rounded-2xl text-xs font-bold border border-[#028444]/30">
                  <FiCalendar className="w-4 h-4" />
                  <span>Fondée en 2024</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-lg bg-black/40 border border-white/10 flex items-center justify-center p-2 sm:p-3">
                <img
                  src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1781005605/WhatsApp_Image_2026-06-04_at_09.55.33_1_e5jtjs.jpg"
                  alt="AFI Collection - Artisanat béninois"
                  className="w-full h-auto rounded-2xl object-contain hover:scale-102 transition duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      AFI_IMAGES.exposition;
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== STATS COUNTER GRID ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st) => {
            const Icon = st.icon;
            return (
              <div key={st.label} className="bg-[#121914] rounded-3xl p-6 border border-white/10 shadow-xs text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#028444]/20 text-[#05a855] flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">{st.value}</p>
                <p className="text-xs font-bold text-white/50">{st.label}</p>
              </div>
            );
          })}
        </div>

        {/* ===== NOS VALEURS ===== */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white text-center">Nos Engagements & Valeurs</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, index) => {
              const Icon = v.icon;
              return (
                <motion.div 
                  key={v.title} 
                  className="bg-[#121914] rounded-3xl border border-white/10 p-6 shadow-xs hover:shadow-md transition flex items-start gap-4"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#028444]/20 text-[#05a855] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm sm:text-base">{v.title}</h3>
                    <p className="text-white/50 text-xs sm:text-sm leading-relaxed">{v.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===== CALL TO ACTION ===== */}
        <motion.div 
          className="bg-gradient-to-r from-[#070b08] via-[#0d2818] to-[#070b08] border border-[#028444]/30 rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Découvrez nos créations uniques
          </h2>
          <p className="text-white/80 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            Parcourez notre catalogue complet de maroquinerie, bijoux et pièces d'exception faites à la main.
          </p>
          <div className="pt-2">
            <Link
              to="/boutique"
              className="btn-raised"
            >
              <span>Accéder à la boutique</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

