import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiUsers, 
  FiAward, 
  FiClock, 
  FiBookOpen, 
  FiMapPin, 
  FiCalendar
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { trainingsApi, type Training } from '../lib/api';
import { AFI_IMAGES, AFI_FALLBACK_PRODUCT, AFI_FALLBACK_PHOTO } from '../lib/images';

const stats = [
  { value: '150+', label: 'Étudiants formés', icon: FiUsers },
  { value: '98%', label: 'Taux de satisfaction', icon: FiAward },
  { value: '4', label: 'Filières disponibles', icon: FiBookOpen },
  { value: '12', label: 'Places par session', icon: FiUsers }
];

export default function Formations() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainingsApi
      .getAll()
      .then((data) => setTrainings(data.trainings || []))
      .catch(() => setTrainings([]))
      .finally(() => setLoading(false));
  }, []);

  const defaultTrainings = [
    {
      id: 1,
      title: 'Macramé et Tricotage',
      description: 'Apprenez les techniques de macramé et de tricotage pour créer des objets décoratifs et accessoires uniques.',
      duration: '3 mois',
      price: 150000,
      modules: ['Techniques de base du macramé', 'Création de sacs et accessoires', 'Réalisation de rideaux et suspensions'],
      students: 12,
      image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441677/WhatsApp_Image_2026-05-03_at_13.08.20_m5mbxc.jpg',
      color: '#1a6b3c',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Teinture de Pagne',
      description: 'Maîtrisez l\'art de la teinture artisanale pour transformer les tissus en œuvres d\'art traditionnelles.',
      duration: '2 mois',
      price: 120000,
      modules: ['Techniques de teinture artisanale', 'Création de motifs traditionnels', 'Personnalisation des couleurs'],
      students: 15,
      image: 'https://res.cloudinary.com/dzxesa3wi/image/upload/v1782717374/WhatsApp_Image_2026-06-29_at_08.14.08_afi42z.jpg',
      color: '#0d2818',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const displayTrainings = trainings.length > 0 ? trainings : defaultTrainings;

  return (
    <div className="bg-[#070b08] min-h-screen text-white pb-20">
      <SEO title="Formations Artisanales | AFI Collection" description="Découvrez nos formations artisanales : macramé, tissage, fabrication de sandales et teinture au Bénin avec le CFP Dorcas & AFI Collection." />

      {/* ===== HERO ===== */}
      <div className="relative py-14 sm:py-20 md:py-32 text-white overflow-hidden shadow-md">
        <img
          src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1782717374/WhatsApp_Image_2026-06-29_at_08.08.43_jc7ddz.jpg"
          alt="Formation artisanale"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              AFI_IMAGES.atelierCadre;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-[#070b08]/80" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <span className="pop-sticker mb-4 inline-block">Académie des Métiers</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
              Nos Formations <span className="text-[#05a855]">Artisanales</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-medium max-w-md mx-auto pt-1 drop-shadow-sm">
              Développez des compétences professionnelles et maîtrisez un métier d'art au Bénin.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENEUR PRINCIPAL ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20 space-y-10">
        
        {/* ===== BANDEAU PRÉSENTATION CFP DORCAS ===== */}
        <motion.div
          className="bg-[#121914] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Le Centre de Formation <br />
                <span className="text-[#05a855]">CFP Dorcas</span>
              </h2>
              
              <div className="space-y-3 text-xs sm:text-sm text-white/60 leading-relaxed">
                <p>
                  Le <strong className="text-white font-bold">Centre de Formation Professionnelle (CFP) Dorcas</strong> est 
                  une institution dédiée à la transmission des savoir-faire artisanaux et à la professionnalisation 
                  des métiers d'art au Bénin.
                </p>
                <p>
                  Créé par des maîtres artisans passionnés, le CFP Dorcas forme chaque année des jeunes et des adultes 
                  aux métiers du macramé, du tricotage, de la teinture et du travail du cuir, alliant tradition et innovation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 bg-[#028444]/20 text-[#05a855] px-4 py-2 rounded-2xl text-xs font-bold border border-[#028444]/30">
                  <FiMapPin className="w-4 h-4" />
                  <span>Abomey-Calavi, Bénin</span>
                </div>
                <div className="flex items-center gap-2 bg-[#028444]/20 text-[#05a855] px-4 py-2 rounded-2xl text-xs font-bold border border-[#028444]/30">
                  <FiCalendar className="w-4 h-4" />
                  <span>Inscriptions Ouvertes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-lg bg-black/40 border border-white/10 flex items-center justify-center p-3">
                <img
                  src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441633/WhatsApp_Image_2026-05-03_at_13.13.55_xrgmtq.jpg"
                  alt="CFP Dorcas - Centre de formation"
                  className="w-full h-auto max-h-[380px] rounded-2xl object-contain hover:scale-102 transition duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      AFI_FALLBACK_PHOTO;
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== STATS GRID ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-[#121914] rounded-3xl p-6 border border-white/10 shadow-xs text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#028444]/20 text-[#05a855] flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">{stat.value}</p>
                <p className="text-xs font-bold text-white/50">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ===== LISTE DES FORMATIONS ===== */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Filières & Programmes de Formation
            </h2>
            <p className="text-xs text-white/50">Des programmes pratiques encadrés par des professionnels</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-[#121914] rounded-3xl border border-white/10 animate-pulse overflow-hidden p-6 space-y-4">
                  <div className="h-48 bg-white/10 rounded-2xl" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : displayTrainings.length === 0 ? (
            <div className="bg-[#121914] rounded-3xl border border-white/10 p-12 text-center shadow-xs">
              <FiBookOpen className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-lg font-black text-white">Aucune formation enregistrée</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayTrainings.map((training, index) => {
                const imgSrc = training.image?.startsWith('/')
                  ? `http://localhost:5000${training.image}`
                  : training.image || AFI_FALLBACK_PRODUCT;

                return (
                  <motion.div
                    key={training.id}
                    className="group bg-[#121914] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-white/10 flex flex-col justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="space-y-4 p-5 sm:p-6">
                      {/* Image */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                        <img
                          src={imgSrc}
                          alt={training.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              AFI_FALLBACK_PRODUCT;
                          }}
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-xs font-bold bg-[#070b08]/90 backdrop-blur-md rounded-full px-3 py-1 text-[#05a855] border border-white/10 shadow-xs">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>{training.duration || '3 mois'}</span>
                        </div>

                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#070b08]/90 backdrop-blur-md rounded-full px-3 py-1 shadow-xs text-xs font-bold text-white border border-white/10">
                          <FiUsers className="w-3.5 h-3.5 text-[#05a855]" />
                          <span>{training.students} places</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-white group-hover:text-[#05a855] transition-colors">
                          {training.title}
                        </h3>

                        <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                          {training.description}
                        </p>

                        <div className="pt-2 flex items-center gap-2">
                          <FiAward className="w-4 h-4 text-[#05a855]" />
                          <span className="text-sm font-black text-[#05a855] font-mono">
                            {typeof training.price === 'number' ? `${training.price.toLocaleString('fr-FR')} FCFA` : training.price}
                          </span>
                        </div>

                        {/* Modules */}
                        {training.modules && training.modules.length > 0 && (
                          <div className="pt-2 space-y-1.5">
                            {training.modules.slice(0, 3).map((mod, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-white/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#028444] shrink-0" />
                                <span className="truncate">{mod}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 pt-0">
                      <Link
                        to="/contact"
                        className="btn-raised w-full"
                      >
                        <span>S'inscrire à cette formation</span>
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== CALL TO ACTION ===== */}
        <motion.div
          className="p-8 sm:p-12 rounded-3xl text-center bg-gradient-to-r from-[#070b08] via-[#0d2818] to-[#070b08] border border-[#028444]/30 text-white space-y-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Prêt à démarrer votre formation ?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Rejoignez le CFP Dorcas et développez des compétences artisanales de haut niveau au Bénin.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              to="/contact"
              className="btn-raised inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm"
            >
              <span>Nous contacter</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/boutique"
              className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3.5 rounded-full transition text-xs sm:text-sm"
            >
              <span>Découvrir la boutique</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
