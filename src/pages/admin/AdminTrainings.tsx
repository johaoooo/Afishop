import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { adminApi, type Training } from '../../lib/api';
import toast from 'react-hot-toast';

interface TrainingForm {
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  color: string;
  modulesText: string;
}

const EMPTY_FORM: TrainingForm = { title: '', description: '', duration: '', price: '', image: '', color: '#1a6b3c', modulesText: '' };

export function AdminTrainings() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TrainingForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getTrainings();
      setTrainings(data.trainings);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (t: Training) => {
    setEditingId(t.id);
    setForm({
      title: t.title, description: t.description, duration: t.duration, price: t.price,
      image: t.image, color: t.color || '#1a6b3c', modulesText: (t.modules || []).join('\n'),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.duration || !form.price) {
      toast.error('Titre, description, durée et prix sont requis');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description, duration: form.duration,
        price: form.price, image: form.image, color: form.color,
        modules: form.modulesText.split('\n').map((m) => m.trim()).filter(Boolean),
      };
      if (editingId) {
        await adminApi.updateTraining(editingId, payload);
        toast.success('Formation mise à jour');
      } else {
        await adminApi.createTraining(payload);
        toast.success('Formation créée');
      }
      setModalOpen(false);
      load();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return;
    try {
      await adminApi.deleteTraining(id);
      toast.success('Formation supprimée');
      setTrainings((prev) => prev.filter((t) => t.id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0f1f14]">Formations</h1>
          <p className="text-sm text-[#0f1f14]/50 mt-1">{trainings.length} formation{trainings.length !== 1 ? 's' : ''} proposée{trainings.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 btn-raised text-black! text-sm font-semibold px-4 py-2.5 rounded-full transition-colors">
          <FiPlus className="w-4 h-4" /> Ajouter une formation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm text-[#0f1f14]/50 col-span-full">Chargement...</p>
        ) : trainings.length === 0 ? (
          <p className="text-sm text-[#0f1f14]/50 col-span-full">Aucune formation pour l'instant.</p>
        ) : (
          trainings.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#0f1f14]/10">
              <div className="h-2" style={{ backgroundColor: t.color }} />
              <div className="p-5">
                <h3 className="font-bold text-[#0f1f14]">{t.title}</h3>
                <p className="text-xs text-[#0f1f14]/50 mt-1 line-clamp-2">{t.description}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-[#0f1f14]/60">
                  <span>{t.duration}</span>
                  <span className="font-semibold text-[#0f1f14]">{t.price}</span>
                </div>
                <p className="text-xs text-[#0f1f14]/50 mt-1">{t.students} inscrit{t.students !== 1 ? 's' : ''}</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#0f1f14]/10">
                  <button onClick={() => openEdit(t)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#0f1f14]/50 hover:text-[#028444] hover:bg-[#028444]/10 rounded-lg transition-colors">
                    <FiEdit2 className="w-3.5 h-3.5" /> Modifier
                  </button>
                  <button onClick={() => handleDelete(t.id, t.title)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#0f1f14]/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#0f1f14]/10">
              <h2 className="font-bold text-[#0f1f14]">{editingId ? 'Modifier la formation' : 'Nouvelle formation'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#0f1f14]/50 hover:text-[#0f1f14]/70"><FiX className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0f1f14]/60 mb-1">Titre</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-[#0f1f14]/15 bg-white text-[#0f1f14] placeholder-[#0f1f14]/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0f1f14]/60 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[#0f1f14]/15 bg-white text-[#0f1f14] placeholder-[#0f1f14]/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0f1f14]/60 mb-1">Durée</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1 mois" className="w-full px-3 py-2 border border-[#0f1f14]/15 bg-white text-[#0f1f14] placeholder-[#0f1f14]/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0f1f14]/60 mb-1">Prix</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="50 000 FCFA" className="w-full px-3 py-2 border border-[#0f1f14]/15 bg-white text-[#0f1f14] placeholder-[#0f1f14]/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0f1f14]/60 mb-1">Image (URL)</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/afi2.jpeg" className="w-full px-3 py-2 border border-[#0f1f14]/15 bg-white text-[#0f1f14] placeholder-[#0f1f14]/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0f1f14]/60 mb-1">Couleur d'accent</label>
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-16 h-9 border border-[#0f1f14]/10 rounded-lg bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0f1f14]/60 mb-1">Modules (un par ligne)</label>
                <textarea value={form.modulesText} onChange={(e) => setForm({ ...form, modulesText: e.target.value })} rows={4} placeholder={'Module 1\nModule 2\nModule 3'} className="w-full px-3 py-2 border border-[#0f1f14]/15 bg-white text-[#0f1f14] placeholder-[#0f1f14]/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#0f1f14]/10 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-[#0f1f14]/50 hover:text-[#0f1f14]/70">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 btn-raised text-black! text-sm font-semibold rounded-full transition-colors disabled:opacity-50">
                {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
