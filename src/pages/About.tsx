import SEO from '../components/SEO';
import { FiHeart, FiUsers, FiAward, FiEye, FiArrowRight, FiMapPin, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    { icon: FiHeart, title: 'Passion', text: 'Chaque création est le fruit d\'une passion transmise de génération en génération.' },
    { icon: FiUsers, title: 'Communauté', text: 'Nous soutenons une communauté d\'artisans talentueux à travers le Bénin.' },
    { icon: FiAward, title: 'Excellence', text: 'Nous sélectionnons les meilleurs artisans pour vous offrir des pièces d\'exception.' },
    { icon: FiEye, title: 'Vision', text: 'Faire rayonner l\'artisanat béninois sur le marché international.' },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <SEO title="À Propos" description="Découvrez l'histoire d'AFI Collection, notre mission de valoriser l'artisanat béninois et notre communauté d'artisans talentueux." />
      {/* ===== HERO ===== */}
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container mx-auto px-6 md:px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              À propos de nous
            </h1>
            <p className="text-white/70 text-base max-w-md mt-3">
              Découvrez l'histoire et les valeurs qui animent AFI Collection.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENU ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20">
        
        {/* ===== HISTOIRE AVEC IMAGE ===== */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-8 md:p-10 shadow-sm mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#1a6b3c] text-xs font-bold tracking-widest uppercase">
                Notre histoire
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-800 mt-3 mb-4">
                L'aventure <span className="text-[#1a6b3c]">AFI Collection</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-[#1a6b3c]">AFI Collection</strong> est née d'une conviction profonde : 
                  l'artisanat africain mérite d'être célébré et valorisé. Fondée à Cotonou, notre entreprise 
                  s'est donné pour mission de mettre en lumière le savoir-faire exceptionnel des artisans 
                  béninois.
                </p>
                <p>
                  Chaque pièce que nous proposons raconte une histoire — celle d'un artisan qui perpétue 
                  des techniques ancestrales, celle d'une tradition qui se réinvente au fil du temps, celle 
                  d'une culture riche et vibrante.
                </p>
                <p>
                  Aujourd'hui, nous collaborons avec plus de <strong className="text-[#1a6b3c]">50 artisans</strong> 
                  à travers tout le Bénin, et nous sommes fiers de proposer des créations uniques qui allient 
                  tradition et modernité.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <FiMapPin className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="text-sm text-gray-600">Cotonou, Bénin</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                  <FiCalendar className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="text-sm text-gray-600">Depuis 2024</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dzxesa3wi/image/upload/v1781005605/WhatsApp_Image_2026-06-04_at_09.55.33_1_e5jtjs.jpg"
                  alt="AFI Collection - Artisanat béninois"
                  className="w-full h-auto max-h-[500px] object-contain hover:scale-105 transition duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#1a6b3c] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4" />
                Artisanat certifié
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== VALEURS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {values.map((v, index) => {
            const Icon = v.icon;
            return (
              <motion.div 
                key={v.title} 
                className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-6 shadow-sm hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[#1a6b3c]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{v.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{v.text}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ===== CTA ===== */}
        <motion.div 
          className="bg-gradient-to-br from-[#0d2818] to-[#1a6b3c] rounded-3xl p-8 md:p-10 text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Rejoignez l'aventure <span className="text-[#4ade80]">AFI</span>
          </h2>
          <p className="text-white/70 max-w-lg mx-auto text-sm md:text-base mb-6">
            Découvrez nos créations uniques et soutenez l'artisanat béninois.
          </p>
          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1a6b3c] font-bold px-8 py-3.5 rounded-full transition-colors duration-300 shadow-lg shadow-black/20 hover:shadow-[#4ade80]/20"
          >
            Explorer la boutique
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
