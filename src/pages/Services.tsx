import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiRefreshCw, FiHeadphones, FiShield, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function Services() {
  const services = [
    { icon: FiTruck, title: 'Livraison rapide', desc: 'Livraison en 24-48h à Abomey-Calavi et 3-7 jours dans tout le Bénin. Suivi de commande en temps réel.' },
    { icon: FiPackage, title: 'Emballage soigné', desc: 'Chaque produit est emballé avec soin dans un écrin aux couleurs d\'AFI Collection.' },
    { icon: FiRefreshCw, title: 'Retours faciles', desc: 'Vous disposez de 7 jours pour retourner un produit qui ne vous conviendrait pas.' },
    { icon: FiHeadphones, title: 'Service client', desc: 'Notre équipe est disponible du lundi au samedi pour répondre à toutes vos questions.' },
    { icon: FiShield, title: 'Paiement sécurisé', desc: 'Tous vos paiements sont sécurisés via notre partenaire Kkiapay.' },
    { icon: FiStar, title: 'Produits authentiques', desc: 'Des créations artisanales uniques, certifiées et faites main par des artisans béninois.' },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <SEO title="Services" description="Découvrez tous nos services : livraison rapide au Bénin, retours faciles, service client et paiement sécurisé." />
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container mx-auto px-6 md:px-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Nos services
            </h1>
            <p className="text-white/70 text-base max-w-md mt-3">
              Tout ce que nous mettons en œuvre pour votre satisfaction.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((s, index) => {
            const Icon = s.icon;
            return (
              <motion.div 
                key={s.title}
                className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-6 shadow-sm hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#1a6b3c]" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="bg-gradient-to-br from-[#0d2818] to-[#1a6b3c] rounded-3xl p-8 md:p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Prêt à découvrir nos <span className="text-[#4ade80]">créations</span> ?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto text-sm md:text-base mb-6">
            Parcourez notre boutique et trouvez la pièce unique qui vous correspond.
          </p>
          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1a6b3c] font-bold px-8 py-3.5 rounded-full transition-colors duration-300 shadow-lg shadow-black/20"
          >
            Explorer la boutique
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
