import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiMail, FiMapPin, FiPhone, FiSend, FiCheckCircle, FiArrowRight, 
  FiUser, FiMessageSquare, FiClock, FiMessageCircle, FiShoppingBag, FiZap, FiBriefcase, FiAward
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { contactApi, ApiError } from '../lib/api';
import toast from 'react-hot-toast';

const SUBJECT_OPTIONS = [
  'Commande sur-mesure',
  'Information produit',
  'Suivi de commande',
  'Formation & Atelier',
  'Partenariat & Presse',
  'Autre demande'
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECT_OPTIONS[0],
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.send(form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: SUBJECT_OPTIONS[0], message: '' });
      toast.success('Message envoyé avec succès ! Nous vous répondrons très vite. 🎉');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = "https://wa.me/2290196062287?text=" + encodeURIComponent("Bonjour AFI Collection, je souhaiterais obtenir des informations.");

  return (
    <div className="bg-[#f8faf8] min-h-screen text-gray-900 pb-20">
      <SEO title="Contactez-nous | AFI Collection" description="Contactez l'équipe AFI Collection pour toute question sur nos créations artisanales, commandes sur-mesure ou partenariats." />

      {/* ===== HERO BANNER ===== */}
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
              Contactez-nous
            </h1>
            <p className="text-white/80 text-sm sm:text-base font-medium max-w-md mx-auto pt-1">
              Nous sommes à votre entière disposition pour répondre à toutes vos questions.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20">
        {/* 4 Feature Commitment Cards (Replaces redundant contact info under hero) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center shrink-0">
              <FiZap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-gray-900 text-xs sm:text-sm">Réponse sous 24h</p>
              <p className="text-[11px] text-gray-400 font-medium">Traitement garanti 6j/7</p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl p-5 shadow-md hover:shadow-lg transition group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FiMessageCircle className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-white text-xs sm:text-sm">Support WhatsApp</p>
              <p className="text-[11px] text-emerald-100 font-medium">Échange rapide en 1 clic</p>
            </div>
          </a>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center shrink-0">
              <FiAward className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-gray-900 text-xs sm:text-sm">Sur-Mesure</p>
              <p className="text-[11px] text-gray-400 font-medium">Créations personnalisées</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center shrink-0">
              <FiBriefcase className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-gray-900 text-xs sm:text-sm">Devis & Pros</p>
              <p className="text-[11px] text-gray-400 font-medium">Partenariats & Vente en gros</p>
            </div>
          </div>
        </div>

        {/* Main Grid: Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <motion.div 
            className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">Envoyez-nous un message</h2>
            <p className="text-xs text-gray-500 mb-6">
              Remplissez le formulaire ci-dessous et recevez une réponse sous 24 heures ouvrées.
            </p>

            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1a6b3c] flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-gray-900">Message transmis avec succès ! 🎉</h3>
                <p className="text-gray-600 text-xs max-w-md mx-auto">
                  Merci de contacter AFI Collection. Notre équipe va étudier votre message et vous répondre au plus vite.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 bg-[#1a6b3c] text-white font-bold text-xs px-6 py-2.5 rounded-full hover:bg-[#14532d] transition"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Subject Selector Pills */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Objet de votre demande</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((sub) => (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => setForm({ ...form, subject: sub })}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                          form.subject === sub
                            ? 'bg-[#1a6b3c] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nom complet <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ex: Koffi Mensah"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Adresse Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Ex: koffi@email.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Numéro de Téléphone (WhatsApp)</label>
                  <div className="relative">
                    <FiPhone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Ex: +229 01 96 06 22 87"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Votre Message <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Décrivez votre demande en quelques détails..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200/80 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/30 focus:border-[#1a6b3c] resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#1a6b3c] hover:bg-[#14532d] disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1a6b3c]/20 hover:scale-105 text-xs"
                  >
                    <span>{loading ? 'Envoi en cours…' : 'Envoyer mon message'}</span>
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Direct Contact Details Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100">
                Nos Coordonnées Directes
              </h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center shrink-0">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Adresse</span>
                    <span className="font-bold text-gray-900">Abomey-Calavi, Bénin</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center shrink-0">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Téléphone</span>
                    <a href="tel:+2290196062287" className="font-bold text-gray-900 font-mono hover:text-[#1a6b3c]">
                      +229 01 96 06 22 87
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center shrink-0">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Officiel</span>
                    <a href="mailto:maisonaficollections@gmail.com" className="font-bold text-gray-900 font-mono text-xs break-all hover:text-[#1a6b3c]">
                      maisonaficollections@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-gradient-to-br from-[#07170d] to-[#1a6b3c] rounded-3xl p-6 text-white space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
                  <FiClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Horaires d'Ouverture</h3>
                  <p className="text-[11px] text-emerald-200/80">Atelier & Service Client</p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Lundi - Vendredi</span>
                  <span className="font-bold text-emerald-300">8h00 - 18h00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Samedi</span>
                  <span className="font-bold text-emerald-300">9h00 - 13h00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Dimanche</span>
                  <span className="font-bold text-rose-300">Fermé</span>
                </div>
              </div>
            </div>

            {/* Shop Promo Card */}
            <Link
              to="/boutique"
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs hover:shadow-md hover:border-emerald-500/20 transition group block space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1a6b3c] flex items-center justify-center">
                <FiShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-sm group-hover:text-[#1a6b3c] transition-colors">
                  Explorer nos collections
                </h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Découvrez nos créations uniques teintes et façonnées à la main par nos artisans.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a6b3c]">
                <span>Accéder à la boutique</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
