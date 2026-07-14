import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { FiLock, FiDatabase, FiEye, FiTrash2, FiMail } from 'react-icons/fi';

export default function Privacy() {
  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <SEO title="Politique de Confidentialité" description="Politique de confidentialité d'AFI Collection. Comment nous protégeons vos données personnelles." />
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container mx-auto px-6 md:px-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Politique de confidentialité
            </h1>
            <p className="text-white/70 text-base max-w-md mt-3">
              Comment nous protégeons vos données personnelles.
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
                <FiLock className="w-5 h-5 text-[#1a6b3c]" />
                Introduction
              </h2>
              <p>
                Chez <strong className="text-[#1a6b3c]">AFI Collection</strong>, nous accordons une 
                importance capitale à la protection de vos données personnelles. La présente politique 
                vous informe de la manière dont nous collectons, utilisons et protégeons vos 
                informations lorsque vous utilisez notre site.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiDatabase className="w-5 h-5 text-[#1a6b3c]" />
                Données collectées
              </h2>
              <p>Nous pouvons collecter les données suivantes :</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Nom et prénom
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Adresse email
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Adresse de livraison
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Numéro de téléphone
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Historique de commandes
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiEye className="w-5 h-5 text-[#1a6b3c]" />
                Utilisation des données
              </h2>
              <p>Vos données sont utilisées pour :</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Traiter et expédier vos commandes
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Vous informer de l'état de vos commandes
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Répondre à vos demandes via le formulaire de contact
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Améliorer notre service client
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Vous envoyer des offres promotionnelles (avec votre consentement)
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Protection des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles 
                appropriées pour protéger vos données contre tout accès non autorisé, modification, 
                divulgation ou destruction. Vos mots de passe sont chiffrés et nos connexions 
                sont sécurisées via HTTPS.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiTrash2 className="w-5 h-5 text-[#1a6b3c]" />
                Vos droits
              </h2>
              <p>Conformément à la réglementation, vous disposez des droits suivants :</p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Droit d'accès à vos données
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Droit de rectification
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Droit à l'effacement
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Droit à la limitation du traitement
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Droit d'opposition
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Contact</h2>
              <p>
                Pour toute question concernant vos données, vous pouvez nous contacter à :
              </p>
              <div className="mt-3 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full w-fit">
                <FiMail className="w-4 h-4 text-[#1a6b3c]" />
                <span className="text-sm">maisonaficollections@gmail.com</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
