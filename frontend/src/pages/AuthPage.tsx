import { useState } from 'react';
import { API_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { email, password, name };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur d\'authentification');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(isLogin ? "Authentification Elite réussie." : "Accès au noyau Priora OS accordé.");
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-mesh flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#ffafcc]/30">
      
      {/* Background Elite Edition */}
      
      {/* Background Orbs Emerald */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[#ffc8dd]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-[#bde0fe]/15 blur-[120px] rounded-full" />
      </div>

      <div className="grid lg:grid-cols-2 gap-20 max-w-7xl w-full items-center relative z-10">
        
        {/* Left Side: Branding Elite */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col space-y-12"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#ffafcc] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#ffafcc]/40 border border-[#cdb4db]/30 transition-transform hover:rotate-3 cursor-pointer">
              <Zap className="text-[#2d1f3d] w-9 h-9" fill="currentColor" strokeWidth={3} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-[#2d1f3d]  uppercase">Priora OS</h1>
          </div>

          <div className="space-y-8">
            <h2 className="text-7xl font-black text-[#2d1f3d] leading-tight  uppercase tracking-tighter">
              Bâtir <br /> <span className="text-[#ffafcc]">L'Excellence</span> <br /> Opérationnelle.
            </h2>
            <p className="text-[#7a6188] text-xl max-w-lg font-bold leading-relaxed">
              L'outil de productivité ultime pour les professionnels exigeants. Intelligence synchronisée, focus absolu, résultats Elite.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            {[
              { icon: Zap, text: "Noyau IA Elite" },
              { icon: ShieldCheck, text: "Chiffrement Total" },
              { icon: Terminal, text: "Optimisé Performance" },
              { icon: Sparkles, text: "Intelligence Sémantique" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-[#7a6188] group cursor-default">
                <div className="w-8 h-8 rounded-xl bg-[#cdb4db]/15 flex items-center justify-center border border-[#cdb4db]/30 group-hover:bg-[#ffafcc]/10 group-hover:border-[#ffafcc]/20 transition-all">
                  <feature.icon size={16} className="group-hover:text-[#ffafcc] transition-colors" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Form Elite */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[460px] p-10 bg-white/70 border border-[#cdb4db]/20 rounded-3xl backdrop-blur-xl overflow-hidden relative shadow-xl shadow-[#cdb4db]/8">
            
            
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 relative z-10"
              >
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-[#2d1f3d] tracking-tighter uppercase ">
                    {isLogin ? 'Connexion' : 'Initialisation'}
                  </h3>
                  <p className="text-[11px] font-black text-[#7a6188] uppercase tracking-widest leading-relaxed">
                    Accès sécurisé au terminal de productivité Priora.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-[#9b85a8] tracking-[0.3em] uppercase ml-1">Identité Complète</label>
                       <Input 
                         placeholder="JEAN DUPONT" 
                         value={name} 
                         onChange={e => setName(e.target.value)}
                         className="bg-white/60 border-[#cdb4db]/20 h-16 pl-6 rounded-2xl focus-visible:ring-[#ffafcc] transition-all font-bold uppercase tracking-widest placeholder:opacity-30" 
                         required 
                       />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#9b85a8] tracking-[0.3em] uppercase ml-1">Vecteur d'Accès (Email)</label>
                    <Input 
                      type="email" 
                      placeholder="OPERATOR@PRIORA.IO" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      className="bg-white/60 border-[#cdb4db]/20 h-16 pl-6 rounded-2xl focus-visible:ring-[#ffafcc] transition-all font-bold uppercase tracking-widest placeholder:opacity-30" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#9b85a8] tracking-[0.3em] uppercase ml-1">Code de Cryptage (Pass)</label>
                    <Input 
                      type="password" 
                      placeholder="********" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      className="bg-white/60 border-[#cdb4db]/20 h-16 pl-6 rounded-2xl focus-visible:ring-[#ffafcc] transition-all font-bold" 
                      required 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#ffafcc] hover:bg-[#ffc8dd] text-[#2d1f3d] font-black py-8 rounded-2xl shadow-2xl shadow-[#ffafcc]/20 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.2em] text-[11px]"
                  >
                    {loading ? "SYNCHRONISATION..." : isLogin ? "ACTIVER LA SESSION" : "CRÉER L'ACCÈS"}
                  </Button>
                </form>

                <div className="relative pt-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#cdb4db]/20" />
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black">
                    <span className="bg-[#fef6fa] px-4 text-[#cdb4db]">ou</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-[#cdb4db]/20 bg-white/40 hover:bg-[#ffc8dd]/10 rounded-2xl py-8 grayscale opacity-40 cursor-not-allowed font-bold text-[10px] tracking-widest uppercase">
                  Google Workspace
                </Button>

                <p className="text-center text-[10px] font-black uppercase tracking-widest text-[#7a6188]">
                  {isLogin ? "PAS D'ACCÈS ?" : "DÉJÀ OPÉRATEUR ?"} {' '}
                  <button 
                    type="button" 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#ffafcc] hover:text-[#ffafcc]/80 transition-colors ml-2"
                  >
                    {isLogin ? "CRÉER UN COMPTE" : "SE CONNECTER"}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
