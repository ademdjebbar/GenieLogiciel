import { useState, useRef, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Zap, 
  BrainCircuit, 
  RefreshCw,
  Terminal,
  Sparkles,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const initialMessages = [
  { role: 'assistant', content: "Connecté à Priora OS Elite. Intelligence opérationnelle active. Quelle analyse souhaitez-vous lancer ?" },
];

export default function AIStudio() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string | React.MouseEvent | React.KeyboardEvent) => {
    const finalInput = typeof text === "string" ? text : input;
    if (!finalInput.trim()) return;

    const userMessage = { role: 'user', content: finalInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages: newMessages })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        toast.success("Intelligence Elite Synchronisée.");
      } else {
        toast.error("Analyse échouée.");
        setMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion au noyau IA." }]);
      }
    } catch (err) {
      toast.error("Connexion perdue avec le serveur IA.");
      setMessages(prev => [...prev, { role: 'assistant', content: "Système hors ligne." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-10">
      
      {/* Sidebar AI Insights Elite */}
      <div className="hidden lg:flex flex-col w-80 gap-8">
        <div className="bg-[#ffc8dd]/20 border border-[#cdb4db]/20 rounded-3xl p-8 h-full flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] blur-3xl -rotate-12 pointer-events-none">
            <BrainCircuit size={180} className="text-[#ffafcc]" />
          </div>

          <div className="space-y-10 z-10 overflow-y-auto min-h-0 flex-1 pr-2 scrollbar-hide">
            <div>
              <h3 className="text-sm font-black text-[#2d1f3d] uppercase tracking-[0.3em] flex items-center gap-3">
                <Terminal size={16} className="text-[#ffafcc]" />
                PRIORA KERNEL
              </h3>
              <p className="text-[10px] text-[#7a6188] font-bold uppercase tracking-[0.2em] mt-2">v2.0 Elite Alpha // Active</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Core Model", val: "Omni-v2", icon: Bot },
                { label: "Focus Rank", val: "S-Tier", icon: Zap },
                { label: "Latency", val: "12ms", icon: RefreshCw },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#cdb4db]/5 border border-[#cdb4db]/20 rounded-2xl text-[11px] group transition-all hover:bg-[#cdb4db]/15">
                  <span className="text-[#7a6188] font-bold uppercase tracking-widest flex items-center gap-3">
                    <item.icon size={14} className="text-[#ffafcc] group-hover:scale-110 transition-transform" />
                    {item.label}
                  </span>
                  <span className="text-[#ffafcc] font-black">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="space-y-5 pt-4">
               <h4 className="text-[10px] font-black text-[#9b85a8] uppercase tracking-[0.3em]">RECOMMANDATIONS</h4>
               {[
                 "Prioriser Audit Sécurité",
                 "Rapport Hebdo (Gen IA)",
                 "Bloc Focus 2h (Demain)"
               ].map((s, i) => (
                 <button key={i} onClick={() => handleSend(s)} className="w-full text-left text-[11px] font-bold p-4 rounded-xl border border-[#cdb4db]/20 hover:border-[#ffafcc]/20 text-[#7a6188] hover:text-[#2d1f3d] transition-all bg-white/40 relative group overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffafcc] scale-y-0 group-hover:scale-y-100 transition-transform" />
                    {s}
                 </button>
               ))}
            </div>
          </div>

          <Button variant="ghost" onClick={() => toast.success("Accès aux logs complets temporairement restreint.")} className="w-full justify-between text-[#7a6188] hover:text-[#ffafcc] py-8 border border-[#cdb4db]/20 rounded-2xl hover:bg-[#cdb4db]/15 transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Full Log Access</span>
            <Search size={14} />
          </Button>
        </div>
      </div>

      {/* Main Chat Interface Elite */}
      <div className="flex-1 flex flex-col gap-8 h-full min-w-0">
        <div className="bg-[#ffc8dd]/20 border border-[#cdb4db]/20 rounded-3xl flex-1 p-0 flex flex-col overflow-hidden relative">
          
          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-12 space-y-10 scroll-smooth relative z-10"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex gap-6 max-w-[80%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border transition-all shadow-2xl",
                    msg.role === 'assistant' 
                      ? "bg-[#ffc8dd]/10 border-[#cdb4db]/20 text-[#ffafcc]" 
                      : "bg-[#ffafcc] border-[#ffc8dd]/20 text-[#2d1f3d] shadow-[#ffafcc]/20"
                  )}>
                    {msg.role === 'assistant' ? <Bot size={24} /> : <UserIcon size={24} />}
                  </div>

                  <div className={cn(
                    "space-y-3 p-6 rounded-3xl text-sm leading-relaxed relative font-medium",
                    msg.role === 'assistant' 
                      ? "bg-white/80 border border-[#cdb4db]/20 text-[#7a6188] rounded-tl-none" 
                      : "bg-[#ffc8dd]/10 border border-[#cdb4db]/30 text-[#2d1f3d] rounded-tr-none"
                  )}>
                    {msg.content}
                    {msg.role === 'assistant' && (
                      <div className="flex gap-2 items-center mt-4 opacity-50">
                        <Sparkles size={10} className="text-[#ffafcc]" />
                        <span className="text-[9px] text-[#7a6188] font-black uppercase tracking-[0.2em]">ANALYSE TERMINÉE</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-[#cdb4db]/20 flex items-center justify-center animate-pulse">
                   <Bot size={24} className="text-[#b4a0be]" />
                 </div>
                 <div className="bg-white/80 p-6 rounded-3xl rounded-tl-none flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-[#ffafcc] rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-[#ffafcc] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-[#ffafcc] rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
              </motion.div>
            )}
          </div>

          {/* Input Area Elite */}
          <div className="p-10 bg-white/60 border-t border-[#cdb4db]/20 z-20 overflow-hidden relative">
            <div className="relative group z-10 max-w-5xl mx-auto">
              <Input
                placeholder="Initialiser une commande Priora..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="w-full bg-white/90 backdrop-blur-xl border-[#cdb4db]/30 h-20 pl-8 pr-20 rounded-2xl focus-visible:ring-[#ffafcc] focus-visible:border-[#ffafcc]/50 text-lg font-bold tracking-tight shadow-2xl transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#ffafcc] hover:bg-[#ffc8dd] disabled:opacity-50 disabled:grayscale rounded-xl flex items-center justify-center text-[#2d1f3d] shadow-2xl shadow-[#ffafcc]/30 transition-all active:scale-95"
              >
                <Send size={22} strokeWidth={3} />
              </button>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4 items-center justify-center z-10">
              <span className="text-[10px] font-black text-[#9b85a8] uppercase tracking-[0.2em] px-3">Protocoles Rapides :</span>
              {[
                "Optimisation Hebdo",
                "Audit des Urgences",
                "Rapport de Focus"
              ].map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(s)}
                  className="text-[10px] font-black text-[#7a6188] hover:text-[#ffafcc] bg-[#cdb4db]/5 border border-[#cdb4db]/20 px-6 py-2.5 rounded-full transition-all hover:bg-[#cdb4db]/15 uppercase tracking-widest"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
