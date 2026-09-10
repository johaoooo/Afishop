import SEO from '../components/SEO';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, FiMapPin, FiPhone, FiSend, FiCheckCircle, 
  FiUser, FiMessageSquare, FiClock, FiMessageCircle, FiArrowRight,
  FiHeadphones, FiHeart, FiShield
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { contactApi, ApiError } from '../lib/api';
import toast from 'react-hot-toast';
import { AFI_IMAGES } from '../lib/images';

const SUBJECT_OPTIONS = [
  'Information produit',
  'Commande sur-mesure',
  'Suivi de commande',
  'Formation & Atelier',
  'Partenariat & Devis',
  'Autre demande'
];

const stats = [
  { value: '24h', label: 'Réponse garantie', icon: FiClock },
  { value: '4.9/5', label: 'Satisfaction client', icon: FiHeart },
  { value: '100%', label: 'Créations sur-mesure', icon: FiShield },
  { value: 'WhatsApp', label: 'Réponse instantanée', icon: FiMessageCircle }
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
      toast.success('Message envoyé avec succès ! 🎉');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = "https://wa.me/2290196062287?text=" + encodeURIComponent("Bonjour AFI Collection, je souhaiterais obtenir des informations.");

  return (
    <div className="bg-[#070b08] min-h-screen text-white pb-20">
      <SEO title="Contactez-nous | AFI Collection" description="Contactez l'équipe AFI Collection pour toute question sur nos créations artisanales, commandes sur-mesure ou formations." />

      {/* ===== HERO ===== */}
      <div className="relative py-14 sm:py-20 md:py-32 text-white overflow-hidden shadow-md">
        <img
          src={AFI_IMAGES.exposition}
          alt="Contact AFI Collection"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-[#070b08]/80" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <span className="pop-sticker mb-4 inline-block">Contact & Écoute</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
              Contactez-<span className="text-[#05a855]">nous</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-medium max-w-md mx-auto pt-1 drop-shadow-sm">
              Une question sur une création, une commande sur-mesure ou nos formations ? Notre équipe est à votre écoute.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENEUR PRINCIPAL ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20 space-y-10 max-w-5xl">
        
        {/* ===== STATS ===== */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORMULAIRE (7 COLS) */}
          <motion.div 
            className="lg:col-span-7 bg-[#121914] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-black text-white mb-1">Envoyez-nous un message</h2>
            <p className="text-xs text-white/40 mb-6">Réponse garantie sous 24h ouvrées</p>

            {sent ? (
              <div className="bg-[#028444]/20 border border-[#028444]/40 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#028444]/30 text-[#05a855] flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Message envoyé !</h3>
                <p className="text-white/60 text-xs max-w-sm mx-auto">
                  Merci ! Notre équipe étudie votre demande et vous répondra au plus vite.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 text-xs font-bold text-[#05a855] hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">
                      Nom complet <span className="text-[#f43f5e]/100">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Koffi Mensah"
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="koffi@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Téléphone (WhatsApp)</label>
                    <div className="relative">
                      <FiPhone className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+229 01 96 06 22 87"
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Objet de la demande</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#121914] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60"
                    >
                      {SUBJECT_OPTIONS.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">
                    Votre message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Expliquez-nous votre besoin..."
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#05a855]/30 focus:border-[#028444]/60 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-raised w-full mt-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Envoi…' : 'Envoyer le message'}</span>
                  <FiSend className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </motion.div>

          {/* INFORMATIONS PRATIQUES (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* BOUTON RAPIDE WHATSAPP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#028444] hover:bg-[#05a855] text-white rounded-2xl p-5 shadow-sm transition flex items-center gap-4 group border border-[#05a855]/30"
            >
              <div className="w-11 h-11 rounded-xl bg-black/20 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FiMessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">Discuter sur WhatsApp</p>
                <p className="text-xs text-white/80">Réponse instantanée avec notre équipe</p>
              </div>
            </a>

            {/* CARD COORDONNÉES */}
            <div className="bg-[#121914] rounded-3xl border border-white/10 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-white/40">
                Nos Coordonnées
              </h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#028444]/20 text-[#05a855] flex items-center justify-center shrink-0">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Atelier AFI Collection</span>
                    <span className="text-white/50">Abomey-Calavi, Bénin</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#028444]/20 text-[#05a855] flex items-center justify-center shrink-0">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Téléphone / WhatsApp</span>
                    <a href="tel:+2290196062287" className="text-white/60 hover:text-[#05a855] font-mono">
                      +229 01 96 06 22 87
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#028444]/20 text-[#05a855] flex items-center justify-center shrink-0">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-white block">Email</span>
                    <a href="mailto:maisonaficollections@gmail.com" className="text-white/60 hover:text-[#05a855] font-mono break-all">
                      maisonaficollections@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD HORAIRES */}
            <div className="bg-[#121914] rounded-3xl border border-white/10 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-white font-bold text-xs">
                <FiClock className="w-4 h-4 text-[#05a855]" />
                <span>Horaires d'Ouverture</span>
              </div>
              <div className="space-y-1.5 text-xs text-white/60 pt-1">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold text-white">8h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-semibold text-white">9h00 - 13h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="text-red-400 font-medium">Fermé</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ===== CALL TO ACTION ===== */}
        <motion.div
          className="p-8 sm:p-12 rounded-3xl text-center bg-gradient-to-r from-[#070b08] via-[#0d2818] to-[#070b08] border border-[#028444]/30 text-white space-y-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <FiHeadphones className="w-10 h-10 mx-auto text-[#05a855]" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Vous préférez qu'on vous appelle ?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Laissez-nous votre numéro et un créneau horaire, et un conseiller AFI Collection vous rappellera sous 24h.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <a
              href="tel:+2290196062287"
              className="inline-flex items-center gap-2 bg-[#121914] hover:bg-[#028444]/20 border border-[#028444]/40 text-[#05a855] font-bold px-8 py-3.5 rounded-full transition-all shadow-lg hover:scale-105 text-xs sm:text-sm"
            >
              <FiPhone className="w-4 h-4" />
              <span>+229 01 96 06 22 87</span>
            </a>
            <Link
              to="/boutique"
              className="btn-raised inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm"
            >
              <span>Découvrir la boutique</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

