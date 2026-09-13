import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSend, FiX } from 'react-icons/fi';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { assistantApi, type ChatMessage } from '../lib/api';

const SUGGESTIONS = [
  'Quels sont vos produits ?',
  'Quelles formations proposez-vous ?',
  'Quels sont les délais de livraison ?',
  'Comment commander ?',
];

const WELCOME: ChatMessage = {
  role: 'assistant',
  content: "Bonjour 👋 Je suis l'assistant AFI Collection. Posez-moi vos questions sur nos créations, nos formations, la livraison ou vos commandes !",
};

/**
 * Widget flottant de l'assistant IA (Gemini via le backend).
 * Bouton en bas à gauche pour ne pas masquer WhatsApp (droite).
 */
export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: content.slice(0, 1000) };
    const history = [...messages, userMsg].slice(-11);
    setMessages(history);
    setInput('');
    setLoading(true);
    try {
      const { reply } = await assistantApi.chat(
        userMsg.content,
        history.slice(0, -1).slice(-10)
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Désolé, je suis momentanément indisponible 😔 Réessayez dans un instant ou contactez-nous sur WhatsApp au 0196 06 22 87.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant AFI"}
        className="fixed left-4 bottom-4 z-[70] w-14 h-14 rounded-full bg-[#028444] hover:bg-[#05a855] text-white border-[3px] border-white shadow-[4px_4px_0px_#050505] flex items-center justify-center transition-all hover:scale-105"
      >
        {open ? <FiX className="w-6 h-6" /> : <RiCustomerService2Fill className="w-7 h-7" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed left-4 bottom-20 z-[70] w-[calc(100vw-2rem)] max-w-sm h-[480px] max-h-[65vh] bg-white rounded-3xl border-2 border-[#028444]/30 shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Assistant AFI Collection"
          >
            <div className="px-4 py-3.5 bg-[#028444] text-white flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
                <RiCustomerService2Fill className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-black italic uppercase leading-tight">Assistant AFI</p>
                <p className="text-[11px] text-white/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse inline-block" />
                  En ligne — répond instantanément
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 bg-[#f3f6f3]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <p
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#028444] text-white rounded-br-md'
                        : 'bg-white text-[#0f1f14] border border-[#0f1f14]/10 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {m.content}
                  </p>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#0f1f14]/10 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 shadow-sm">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-2 h-2 rounded-full bg-[#028444]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 2 && !loading && (
              <div className="px-3.5 pt-2 pb-1 flex flex-wrap gap-1.5 bg-[#f3f6f3]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#028444]/30 text-[11px] font-bold text-[#028444] hover:bg-[#028444] hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-2.5 bg-white border-t border-[#0f1f14]/10 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message…"
                maxLength={1000}
                aria-label="Votre message"
                className="flex-1 min-w-0 bg-[#f3f6f3] rounded-full px-4 py-2.5 text-[13px] text-[#0f1f14] placeholder-[#0f1f14]/40 border border-transparent focus:outline-none focus:border-[#028444]/50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Envoyer"
                className="w-10 h-10 shrink-0 rounded-full bg-[#028444] hover:bg-[#05a855] disabled:opacity-40 text-white flex items-center justify-center transition-colors"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
