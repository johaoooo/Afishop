import { motion } from 'framer-motion';
import { FiShield, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function LegalMentions() {
  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container mx-auto px-6 md:px-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Mentions légales
            </h1>
            <p className="text-white/70 text-base max-w-md mt-3">
              Informations légales relatives à AFI Collection.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20 pb-16">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-8 md:p-10 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiShield className="w-5 h-5 text-[#1a6b3c]" />
                Éditeur du site
              </h2>
              <p>Le site <strong className="text-[#1a6b3c]">AFI Collection</strong> est édité par :</p>
              <ul className="mt-2 space-y-1">
                <li><strong>Raison sociale :</strong> AFI Collection SARL</li>
                <li><strong>Siège social :</strong> Cotonou, Bénin</li>
                <li><strong>Email :</strong> contact@aficollection.com</li>
                <li><strong>Téléphone :</strong> +229 97 00 00 00</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Directeur de la publication</h2>
              <p>La directrice de la publication est Madame Honorine Tossa, fondatrice d'AFI Collection.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Hébergement</h2>
              <p>Le site est hébergé par :</p>
              <ul className="mt-2 space-y-1">
                <li><strong>Vercel Inc.</strong></li>
                <li>440 N Barranca Ave #4133</li>
                <li>Covina, CA 91723, États-Unis</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Propriété intellectuelle</h2>
              <p>
                L'ensemble des contenus présents sur le site (textes, images, logos, vidéos, etc.) 
                est la propriété exclusive d'AFI Collection ou de ses partenaires. Toute reproduction, 
                représentation, modification ou exploitation, totale ou partielle, sans autorisation 
                préalable est interdite.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Contact</h2>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <FiMail className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="text-sm">contact@aficollection.com</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <FiPhone className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="text-sm">+229 97 00 00 00</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <FiMapPin className="w-4 h-4 text-[#1a6b3c]" />
                  <span className="text-sm">Cotonou, Bénin</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
