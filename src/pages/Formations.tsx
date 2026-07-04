import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiUsers, 
  FiAward, 
  FiClock, 
  FiCheckCircle, 
  FiBookOpen, 
  FiMapPin, 
  FiCalendar,
  
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { trainingsApi, type Training } from '../lib/api';

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
      .then((data) => setTrainings(data.trainings))
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
    <div className="bg-[#f5f8f5] min-h-screen">
      {/* ===== HERO ===== */}
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-20 md:py-28 overflow-hidden">
        {/* Image de fond */}
        <img
          src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1782717374/WhatsApp_Image_2026-06-29_at_08.08.43_jc7ddz.jpg"
          alt="Formation artisanale"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200';
          }}
        />
        
        {/* Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Nos formations
            </h1>
            <p className="text-white/80 text-base max-w-md mt-3">
              Développez vos compétences artisanales avec nos formations professionnelles.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENEUR PRINCIPAL ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20">
        {/* ===== BANDEAU PRÉSENTATION ===== */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 border border-green-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#1a6b3c] text-xs font-bold tracking-widest uppercase">
                CFP Dorcas
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-3 mb-4">
                L'excellence au service <br />
                <span className="text-[#1a6b3c]">de la formation</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Le Centre de Formation Professionnelle (CFP) Dorcas est une institution dédiée à la transmission 
                des savoir-faire artisanaux et à la professionnalisation des métiers d'art au Bénin.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Créé par des artisans passionnés, le CFP Dorcas forme chaque année des dizaines de jeunes 
                talents aux métiers de l'artisanat traditionnel, alliant techniques ancestrales et innovation.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <FiMapPin className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="text-sm text-gray-600">Cotonou, Bénin</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                  <FiCalendar className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="text-sm text-gray-600">Inscriptions ouvertes</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl h-72 bg-gray-100 flex items-center justify-center p-4">
                <img
                  src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1779441633/WhatsApp_Image_2026-05-03_at_13.13.55_xrgmtq.jpg"
                  alt="CFP Dorcas - Centre de formation"
                  className="w-full h-full object-contain hover:scale-105 transition duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600';
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#1a6b3c] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4" />
                Certifié
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== STATS ===== */}
        <motion.div
          className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 text-center border border-green-100 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center gap-2">
                <stat.icon className="w-5 h-5 text-[#1a6b3c]" />
                <p className="text-2xl font-black text-gray-800">{stat.value}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== LISTE DES FORMATIONS ===== */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <span className="text-[#1a6b3c] text-xs font-bold tracking-widest uppercase">
              Nos formations
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-3">
              Filières <span className="text-[#1a6b3c]">disponibles</span>
            </h2>
            <p className="text-gray-500 mt-1">Des formations professionnelles pour tous les niveaux</p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-green-100 animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-1 h-64 md:h-auto bg-gray-200" />
                    <div className="md:col-span-2 p-6 md:p-8 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-20" />
                        <div className="h-6 bg-gray-200 rounded w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayTrainings.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border border-green-100">
              <FiBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800">Aucune formation disponible</h3>
              <p className="text-gray-400 text-sm mt-2">Revenez plus tard pour découvrir nos formations.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayTrainings.map((training, index) => (
                <motion.div
                  key={training.id}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Image */}
                    <div className="md:col-span-1 h-64 md:h-auto relative overflow-hidden">
                      <img
                        src={training.image || 'https://placehold.co/600x400/1a6b3c/ffffff?text=AFI'}
                        alt={training.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/30 md:via-transparent md:to-transparent" />
                      
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-[#1a6b3c] flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {training.duration || '3 mois'}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="md:col-span-2 p-6 md:p-8">
                      <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">
                        {training.title}
                      </h2>

                      <p className="text-gray-600 mb-4 leading-relaxed">{training.description}</p>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 text-xs bg-[#1a6b3c]/10 text-[#1a6b3c] font-semibold px-3 py-1.5 rounded-full">
                          <FiUsers className="w-3 h-3" />
                          {training.students || 12} places
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-600 font-semibold px-3 py-1.5 rounded-full">
                          <FiAward className="w-3 h-3" />
                          {training.price.toLocaleString('fr-FR')} FCFA
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1.5 rounded-full">
                          <FiBookOpen className="w-3 h-3" />
                          {training.modules?.length || 0} modules
                        </span>
                      </div>

                      {training.modules && training.modules.length > 0 && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                          {training.modules.slice(0, 4).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-[#1a6b3c] font-bold mt-0.5">✦</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                          {training.modules.length > 4 && (
                            <li className="flex items-start gap-2 text-sm text-gray-400">
                              <span className="text-[#1a6b3c] font-bold mt-0.5">✦</span>
                              <span>+ {training.modules.length - 4} modules supplémentaires</span>
                            </li>
                          )}
                        </ul>
                      )}

                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white font-semibold px-6 py-2.5 rounded-full transition-colors duration-300 text-sm"
                      >
                        S'inscrire
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ===== CTA FINAL ===== */}
        <motion.div
          className="p-8 md:p-12 rounded-3xl text-center bg-[#1a6b3c] relative overflow-hidden mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Prêt à <span className="text-green-300">démarrer</span> votre formation ?
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto leading-relaxed mb-6">
              Rejoignez le CFP Dorcas et développez des compétences professionnelles 
              dans l'artisanat traditionnel béninois.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1a6b3c] font-bold px-8 py-3.5 rounded-full transition-colors duration-300"
              >
                Nous contacter
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/boutique"
                className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3.5 rounded-full transition-colors duration-300"
              >
                Découvrir la boutique
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
