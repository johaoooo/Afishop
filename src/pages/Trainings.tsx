import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trainingsApi, type Training } from '../lib/api';

export default function Trainings() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trainingsApi
      .getAll()
      .then((data) => setTrainings(data.trainings))
      .catch(() => setTrainings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-24 text-gray-400">Chargement…</div>;
  }

  return (
    <div className="bg-[#f8faf8] min-h-screen">
      <div className="bg-forest py-10">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-3xl md:text-4xl font-black text-white">Nos formations</h1>
          <p className="text-white/70 text-sm mt-1">Développez vos compétences artisanales</p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-8">
        {trainings.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-16">Aucune formation disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-50" style={{ backgroundColor: t.color || '#1a6b3c' }}>
                  <img
                    src={t.image || 'https://placehold.co/600x400/1a6b3c/ffffff?text=AFI'}
                    alt={t.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black text-gray-800">{t.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{t.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">📚 {t.modules?.length || 0} modules</span>
                    <span className="font-bold text-forest">{t.price}</span>
                  </div>
                  <Link
                    to={`/formations/${t.id}`}
                    className="mt-4 w-full inline-block text-center bg-forest hover:bg-forest-dark text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
