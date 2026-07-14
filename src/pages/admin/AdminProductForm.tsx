import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload, FiArrowLeft, FiSave } from 'react-icons/fi';
import { adminApi, type Product } from '../../lib/api';
import toast from 'react-hot-toast';

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

const CATEGORY_OPTIONS = [
  { value: 'sac-macrame', label: 'Sac Macramé' },
  { value: 'sandale-macrame', label: 'Sandale Macramé' },
  { value: 'tricotage', label: 'Tricotage' },
  { value: 'agroalimentaire', label: 'Agroalimentaire' },
  { value: 'decoration', label: 'Décoration' },
  { value: 'ameublement', label: 'Ameublement' },
  { value: 'teinture-pagne', label: 'Teinture de Pagne' },
  { value: 'tissage-pagne', label: 'Tissage de Pagne' },
  { value: 'mode-accessoires', label: 'Mode et Accessoires' },
  { value: 'couture', label: 'Couture' },
];

export function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    adminApi
      .getProducts()
      .then((data) => {
        const product = data.products.find((p: Product) => String(p.id) === id);
        if (!product) {
          toast.error('Produit introuvable');
          navigate('/admin/produits');
          return;
        }
        setForm({
          name: product.name, description: product.description, price: String(product.price),
          category: product.category, brand: product.brand, image: product.image, stock: String(product.stock),
        });
      })
      .catch(() => toast.error('Erreur lors du chargement du produit'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur upload');
      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success('Image téléchargée');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.price || !form.category || !form.brand || !form.image) {
      toast.error('Tous les champs sauf le stock sont requis');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock || 0) };
      if (isEdit) {
        await adminApi.updateProduct(Number(id), payload);
        toast.success('Produit mis à jour');
      } else {
        await adminApi.createProduct(payload);
        toast.success('Produit créé');
      }
      navigate('/admin/produits');
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof ProductForm, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#1a6b3c] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/produits')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-800">{isEdit ? 'Modifier le produit' : 'Nouveau produit'}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isEdit ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit au catalogue'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nom du produit</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="ex: Sac en macramé" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} placeholder="Description détaillée du produit..." className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Prix (FCFA)</label>
            <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="15000" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Stock</label>
            <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} placeholder="10" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Catégorie</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all bg-white">
              <option value="">Sélectionner une catégorie</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Marque</label>
            <input value={form.brand} onChange={(e) => update('brand', e.target.value)} placeholder="ex: AFI Collection" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Image</label>
            <div className="flex gap-2">
              <input value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="Lien URL de l'image" className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c] transition-all" />
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
                <FiUpload className="w-4 h-4" /> {uploading ? 'Upload...' : 'Upload'}
              </button>
            </div>
            {form.image && (
              <img src={form.image} alt="" className="mt-3 h-28 w-28 rounded-xl object-cover border border-gray-200 shadow-sm" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={() => navigate('/admin/produits')} className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a6b3c] hover:bg-[#14532d] text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50">
            <FiSave className="w-4 h-4" />
            {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
          </button>
        </div>
      </div>
    </div>
  );
}
