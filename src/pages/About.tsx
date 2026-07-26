import SEO from '../components/SEO';
import { FiHeart, FiUsers, FiAward, FiEye, FiArrowRight, FiMapPin, FiCalendar, FiShoppingBag, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    <div className="bg-[#f8faf8] min-h-screen text-gray-900 pb-20">
      <SEO title="À Propos | AFI Collection" description="Découvrez l'histoire d'AFI Collection, notre mission de valoriser l'artisanat béninois et notre communauté d'artisans talentueux." />

      {/* ===== HERO ===== */}
      <div className="relative bg-gradient-to-r from-[#07170d] via-[#1a6b3c] to-[#0a2314] py-16 md:py-20 text-white overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              À Propos de <span className="text-[#4ade80]">AFI Collection</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base font-medium max-w-md mx-auto pt-1">
              L'excellence de l'artisanat béninois, entre passion, tradition et modernité.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20 space-y-10">
        
        {/* ===== HISTOIRE AVEC IMAGE ===== */}
        <motion.div 
          className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                L'Histoire & la Vision <br />
                <span className="text-[#1a6b3c]">AFI Collection</span>
              </h2>
              
              <div className="space-y-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900 font-bold">AFI Collection</strong> est née d'une conviction profonde : 
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
                <div className="flex items-center gap-2 bg-emerald-50 text-[#1a6b3c] px-4 py-2 rounded-2xl text-xs font-bold border border-emerald-100">
                  <FiMapPin className="w-4 h-4" />
                  <span>Abomey-Calavi, Bénin</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-2xl text-xs font-bold border border-amber-100">
                  <FiCalendar className="w-4 h-4" />
                  <span>Fondée en 2024</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-lg bg-[#1a6b3c]/5 border border-gray-100 flex items-center justify-center p-2 sm:p-3">
                <img
                  src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1781005605/WhatsApp_Image_2026-06-04_at_09.55.33_1_e5jtjs.jpg"
                  alt="AFI Collection - Artisanat béninois"
                  className="w-full h-auto rounded-2xl object-contain hover:scale-102 transition duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';
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
              <div key={st.label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">{st.value}</p>
                <p className="text-xs font-bold text-gray-500">{st.label}</p>
              </div>
            );
          })}
        </div>

        {/* ===== NOS VALEURS ===== */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center">Nos Engagements & Valeurs</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, index) => {
              const Icon = v.icon;
              return (
                <motion.div 
                  key={v.title} 
                  className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition flex items-start gap-4"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{v.title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{v.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===== CALL TO ACTION ===== */}
        <motion.div 
          className="bg-gradient-to-r from-[#07170d] via-[#1a6b3c] to-[#0a2314] rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 shadow-lg"
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
              className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-[#1a6b3c] font-bold px-8 py-3.5 rounded-full transition-all shadow-lg hover:scale-105 text-xs sm:text-sm"
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

