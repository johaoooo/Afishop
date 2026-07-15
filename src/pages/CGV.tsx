import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { FiFileText, FiShoppingBag, FiRefreshCw, FiCreditCard, FiTruck } from 'react-icons/fi';

export default function CGV() {
  return (
    <div className="bg-[#faf8f5] min-h-screen">
      <SEO title="Conditions Générales de Vente" description="Conditions générales de vente d'AFI Collection. Informations sur les commandes, livraisons et retours." />
      <div className="relative bg-gradient-to-r from-[#0d2818] to-[#1a6b3c] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 50%, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container mx-auto px-6 md:px-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Conditions générales de vente
            </h1>
            <p className="text-white/70 text-base max-w-md mt-3">
              Les conditions qui régissent nos ventes en ligne.
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
                <FiFileText className="w-5 h-5 text-[#1a6b3c]" />
                Article 1 - Champ d'application
              </h2>
              <p>
                Les présentes Conditions Générales de Vente régissent les relations contractuelles 
                entre <strong className="text-[#1a6b3c]">AFI Collection</strong> et tout client 
                effectuant un achat sur le site www.aficollection.com. La validation d'une commande 
                implique l'acceptation sans réserve des présentes conditions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiShoppingBag className="w-5 h-5 text-[#1a6b3c]" />
                Article 2 - Produits
              </h2>
              <p>
                Les produits proposés à la vente sont des créations artisanales béninoises. 
                Chaque pièce est unique et peut présenter de légères variations par rapport aux 
                photos présentées sur le site. Les caractéristiques essentielles des produits 
                sont décrites dans leurs fiches respectives.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Article 3 - Prix</h2>
              <p>
                Les prix sont indiqués en francs CFA (FCFA) toutes taxes comprises. Ils 
                s'entendent hors frais de livraison, qui sont indiqués avant la validation 
                définitive de la commande. AFI Collection se réserve le droit de modifier 
                ses prix à tout moment, les produits étant facturés au tarif en vigueur 
                lors de la validation de la commande.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5 text-[#1a6b3c]" />
                Article 4 - Paiement
              </h2>
              <p>
                Le paiement s'effectue en ligne via notre partenaire Kkiapay. Les moyens 
                de paiement acceptés sont :
              </p>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Cartes bancaires (Visa, Mastercard)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Mobile money (MTN, Moov, Celtiis)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] mt-2 shrink-0" />
                  Orange Money
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiTruck className="w-5 h-5 text-[#1a6b3c]" />
                Article 5 - Livraison
              </h2>
              <p>
                Les commandes sont livrées à l'adresse indiquée par le client lors de la commande. 
                Les délais de livraison sont de 24 à 48 heures pour Abomey-Calavi et de 3 à 7 jours 
                pour les autres villes du Bénin. AFI Collection ne saurait être tenue responsable 
                des retards indépendants de sa volonté.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FiRefreshCw className="w-5 h-5 text-[#1a6b3c]" />
                Article 6 - Droit de rétractation
              </h2>
              <p>
                Conformément à la législation en vigueur, le client dispose d'un délai de 
                7 jours à compter de la réception de sa commande pour exercer son droit de 
                rétractation, sans motif ni pénalité. Les produits doivent être retournés 
                dans leur état d'origine, complets et accompagnés de leur facture.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Article 7 - Service client</h2>
              <p>
                Pour toute question ou réclamation, notre service client est disponible :</p>
              <ul className="mt-2 space-y-1">
                <li>Par email : maisonaficollections@gmail.com</li>
                <li>Par téléphone : +229 97 00 00 00</li>
                <li>Du lundi au samedi, de 8h à 18h</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
