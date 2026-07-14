import { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage } from 'react-icons/fi';
import { adminApi, type Product } from '../../lib/api';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    cloudinary?: {
      createMediaLibrary: (config: Record<string, unknown>, options: { insertHandler: (data: { assets: Array<{ secure_url: string; public_id: string }> }) => void }) => {
        show: () => void;
      };
    };
  }
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  image: string;
  stock: string;
}

const EMPTY_FORM: ProductForm = { name: '', description: '', price: '', category: '', brand: '', image: '', stock: '' };

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts();
      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des produits');
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

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      category: p.category, brand: p.brand, image: p.image, stock: String(p.stock),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.price || !form.category || !form.brand || !form.image) {
      toast.error('Tous les champs sauf le stock sont requis');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock || 0) };
      if (editingId) {
        await adminApi.updateProduct(editingId, payload);
        toast.success('Produit mis à jour');
      } else {
        await adminApi.createProduct(payload);
        toast.success('Produit créé');
      }
      setModalOpen(false);
      load();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const openCloudinary = useCallback(() => {
    const scriptId = 'cloudinary-media-library';
    const loadWidget = async () => {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://media-library.cloudinary.com/global/all.js';
        document.head.appendChild(script);
        await new Promise((resolve) => { script.onload = resolve; });
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cloudinary/sign`);
      const { signature, timestamp, cloudName, apiKey } = await res.json();

      const ml = window.cloudinary!.createMediaLibrary(
        { cloud_name: cloudName, api_key: apiKey, timestamp, signature },
        {
          insertHandler: (data) => {
            if (data.assets?.length > 0) {
              setForm((prev) => ({ ...prev, image: data.assets[0].secure_url }));
            }
          },
        },
      );
      ml.show();
    };
    loadWidget();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success('Produit supprimé');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Produits</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} produit{products.length !== 1 ? 's' : ''} au catalogue</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Ajouter un produit
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-sm text-gray-400 px-5 py-6">Chargement...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-gray-400 px-5 py-6">Aucun produit pour l'instant.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Produit</th>
                <th className="px-5 py-3 font-semibold">Catégorie</th>
                <th className="px-5 py-3 font-semibold">Prix</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800 font-mono">{p.price.toLocaleString('fr-FR')} F</td>
                  <td className="px-5 py-3">
                    <span className={`font-mono ${p.stock <= 3 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-[#1a6b3c] hover:bg-green-50 rounded-lg transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editingId ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nom</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Prix (FCFA)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Catégorie</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Marque</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Image</label>
                <div className="flex gap-2">
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL ou sélectionner depuis Cloudinary" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]" />
                  <button type="button" onClick={openCloudinary} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
                    <FiImage className="w-4 h-4" /> Cloudinary
                  </button>
                </div>
                {form.image && (
                  <img src={form.image} alt="" className="mt-2 h-20 w-20 rounded-lg object-cover border border-gray-200" />
                )}
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
