import { useEffect, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { adminApi, type Message } from '../../lib/api';
import toast from 'react-hot-toast';

export function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getMessages();
      setMessages(data.messages);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openMessage = async (m: Message) => {
    setSelected(m);
    if (!m.read) {
      try {
        await adminApi.markMessageAsRead(m.id);
        setMessages((prev) => prev.map((msg) => (msg.id === m.id ? { ...msg, read: true } : msg)));
      } catch {
        // silencieux
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white/85">Messages</h1>
        <p className="text-sm text-white/40 mt-1">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
          {unreadCount > 0 && <span className="text-red-500 font-semibold"> · {unreadCount} non lu{unreadCount > 1 ? 's' : ''}</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="bg-[#1c1917] rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-white/40 px-5 py-6">Chargement...</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-white/40 px-5 py-6">Aucun message pour l'instant.</p>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors ${selected?.id === m.id ? 'bg-[#4ade80]/10' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {m.read ? <FiMail className="w-3.5 h-3.5 text-white/50 shrink-0" /> : <FiMail className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />}
                  <p className={`text-sm truncate ${m.read ? 'text-white/60' : 'font-bold text-white/85'}`}>{m.name}</p>
                </div>
                <p className="text-xs text-white/40 mt-0.5 truncate">{m.subject || m.message}</p>
                <p className="text-[10px] text-white/50 mt-1">{new Date(m.createdAt).toLocaleDateString('fr-FR')}</p>
              </button>
            ))
          )}
        </div>

        <div className="bg-[#1c1917] rounded-2xl shadow-sm p-6">
          {!selected ? (
            <p className="text-sm text-white/40">Sélectionnez un message pour le lire.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-white/85">{selected.name}</p>
                  <p className="text-sm text-white/40">{selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</p>
                </div>
                <p className="text-xs text-white/50">{new Date(selected.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              {selected.subject && <p className="text-sm font-semibold text-white/60">Sujet : {selected.subject}</p>}
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap border-t border-white/10 pt-4">{selected.message}</p>
              <a
                href={`mailto:${selected.email}`}
                className="inline-flex items-center gap-2 btn-raised text-black! text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Répondre par email
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
