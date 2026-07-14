import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiSend, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { contactApi, ApiError } from '../lib/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      toast.success('Message envoyé avec succès ! ✅');
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FiMapPin, label: 'Adresse', value: 'Cotonou, Bénin', href: null },
    { icon: FiPhone, label: 'Téléphone', value: '+229 01 96 06 22 87', href: 'tel:+2290196062287' },
    { icon: FiMail, label: 'Email', value: 'maisonaficollections@gmail.com', href: 'mailto:maisonaficollections@gmail.com' },
  ];

  return (
    <div className="bg-[#f5f8f5] min-h-screen">
      <SEO title="Contact" description="Contactez AFI Collection pour toute question sur nos produits artisanaux, commandes personnalisées ou partenariats." />
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
              Contactez-nous
            </h1>
            <p className="text-white/70 text-base max-w-md mt-3">
              Nous sommes à votre écoute pour toute question ou demande.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== CONTENU ===== */}
      <div className="container mx-auto px-6 md:px-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <motion.div 
            className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-6 md:p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-black text-gray-800 mb-6">Envoyez-nous un message</h2>
            
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Message envoyé ! ✅</h3>
                <p className="text-gray-500 text-sm mt-1">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jean@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01 96 06 22 87"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sujet</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Demande d'information"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Votre message..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-[#1a6b3c] hover:bg-[#14532d] disabled:opacity-60 text-white font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1a6b3c]/20 hover:shadow-xl"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  <FiSend className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Informations de contact */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Informations</h3>
              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#1a6b3c]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{info.label}</p>
                        {info.href ? (
                          <a href={info.href} className="text-sm font-semibold text-gray-800 hover:text-[#1a6b3c] transition">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold text-gray-800">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0d2818] to-[#1a6b3c] rounded-3xl p-6 text-white">
              <h3 className="font-bold mb-2">Horaires d'ouverture</h3>
              <div className="space-y-1 text-sm text-white/80">
                <p>Lundi - Vendredi: 8h - 18h</p>
                <p>Samedi: 9h - 13h</p>
                <p>Dimanche: Fermé</p>
              </div>
            </div>

            <Link
              to="/boutique"
              className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-3xl border border-green-100 p-4 hover:shadow-lg transition"
            >
              <span className="font-semibold text-gray-800">Découvrir la boutique</span>
              <FiArrowRight className="w-4 h-4 text-[#1a6b3c]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
