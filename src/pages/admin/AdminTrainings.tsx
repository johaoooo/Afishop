import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { adminApi } from '../../services/api/modules/admin';
import toast from 'react-hot-toast';

const EMPTY_FORM = { title: '', description: '', duration: '', price: '', image: '', color: '#1a6b3c', modulesText: '' };

export function AdminTrainings() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setTrainings(await adminApi.getTrainings());
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

  const openEdit = (t: any) => {
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
          <h1 className="text-2xl font-black text-gray-800">Formations</h1>
          <p className="text-sm text-gray-400 mt-1">{trainings.length} formation{trainings.length !== 1 ? 's' : ''} proposée{trainings.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors">
          <FiPlus className="w-4 h-4" /> Ajouter une formation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm text-gray-400 col-span-full">Chargement...</p>
        ) : trainings.length === 0 ? (
          <p className="text-sm text-gray-400 col-span-full">Aucune formation pour l'instant.</p>
        ) : (
          trainings.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-2" style={{ backgroundColor: t.color }} />
              <div className="p-5">
                <h3 className="font-bold text-gray-800">{t.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>{t.duration}</span>
                  <span className="font-semibold text-gray-800">{t.price}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{t.students} inscrit{t.students !== 1 ? 's' : ''}</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => openEdit(t)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-[#1a6b3c] hover:bg-green-50 rounded-lg transition-colors">
                    <FiEdit2 className="w-3.5 h-3.5" /> Modifier
                  </button>
                  <button onClick={() => handleDelete(t.id, t.title)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editingId ? 'Modifier la formation' : 'Nouvelle formation'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Titre</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Durée</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1 mois" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Prix</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="50 000 FCFA" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Image (chemin ou URL)</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/afi2.jpeg" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Couleur d'accent</label>
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-16 h-9 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Modules (un par ligne)</label>
                <textarea value={form.modulesText} onChange={(e) => setForm({ ...form, modulesText: e.target.value })} rows={4} placeholder={'Module 1\nModule 2\nModule 3'} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50">
                {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
