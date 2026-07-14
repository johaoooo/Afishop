import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShield, FiAlertCircle } from 'react-icons/fi';

export default function Terms() {
  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <SEO title="Conditions d'Utilisation" description="Conditions d'utilisation d'AFI Collection. Règles et obligations pour l'utilisation de notre boutique en ligne." />
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container mx-auto px-6 md:px-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Conditions d'utilisation
            </h1>
            <p className="text-white/70 text-base max-w-md mt-3">
              Les règles d'utilisation de la plateforme AFI Collection.
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
                <FiCheckCircle className="w-5 h-5 text-[#1a6b3c]" />
                Acceptation des conditions
              </h2>
              <p>
                En accédant et en utilisant le site <strong className="text-[#1a6b3c]">AFI Collection</strong>, 
                vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas 
                ces conditions, veuillez ne pas utiliser notre site.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Compte utilisateur</h2>
              <p>Lors de la création d'un compte, vous vous engagez à :</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Fournir des informations exactes et à jour
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Maintenir la confidentialité de votre mot de passe
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Nous informer de toute utilisation non autorisée de votre compte
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Ne pas créer de comptes multiples de façon abusive
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiShield className="w-5 h-5 text-[#1a6b3c]" />
                Propriété intellectuelle
              </h2>
              <p>
                Tout le contenu présent sur le site (textes, images, logos, marques, etc.) est 
                la propriété exclusive d'AFI Collection. Toute reproduction ou utilisation sans 
                autorisation est strictement interdite.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-[#1a6b3c]" />
                Limitation de responsabilité
              </h2>
              <p>
                AFI Collection ne saurait être tenue responsable des dommages directs ou indirects 
                résultant de l'utilisation du site. Nous nous efforçons de maintenir le site 
                accessible 24h/24, mais ne garantissons pas une disponibilité continue.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Modifications</h2>
              <p>
                Nous nous réservons le droit de modifier les présentes conditions d'utilisation 
                à tout moment. Les modifications prennent effet dès leur publication sur le site. 
                Il vous incombe de consulter régulièrement cette page.
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Contact</h2>
              <p className="mb-3">
                Pour toute question relative à ces conditions, contactez-nous :
              </p>
              <p className="text-sm">
                <strong>Email :</strong> maisonaficollections@gmail.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
