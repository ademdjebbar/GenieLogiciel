import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";
import { login, getMe } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../hooks/useToast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loginRes = await login(formData);
      const token = loginRes.data.access_token;
      
      // Store token temporarily to allow getMe() call via interceptor
      localStorage.setItem("token", token);
      
      const userRes = await getMe();
      loginUser(token, userRes.data);
      
      showToast("Connexion réussie !");
      navigate("/");
    } catch (err) {
      localStorage.removeItem("token");
      const errorMsg = err.response?.data?.detail || "Échec de la connexion";
      showToast(Array.isArray(errorMsg) ? errorMsg[0].msg : errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950 font-sans">
      {/* Sidebar Branding - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-indigo-900 opacity-90" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <Sparkles className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Priora</h1>
          </div>
          <h2 className="text-5xl font-bold text-white leading-tight mb-8">Productivité décuplée par l'Intelligence Artificielle.</h2>
          <p className="text-xl text-white/80 leading-relaxed mb-10">Gérez vos tâches intelligemment, priorisez l'essentiel et laissez l'IA organiser votre journée.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl text-white">
              <p className="text-3xl font-bold mb-1">98%</p>
              <p className="text-sm opacity-60">Satisfaction</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl text-white">
              <p className="text-3xl font-bold mb-1">2h</p>
              <p className="text-sm opacity-60">Gagnées / jour</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-10">
          <div>
            <h3 className="text-3xl font-extrabold text-text-primary dark:text-text-light mb-3">Ravi de vous revoir !</h3>
            <p className="text-text-secondary dark:text-gray-400 font-medium">Connectez-vous pour accéder à votre tableau de bord intelligent.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Adresse e-mail" type="email" placeholder="nom@exemple.com" icon={Mail} required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <div className="relative">
              <Input label="Mot de passe" type={showPassword ? "text" : "password"} placeholder="••••••••" icon={Lock} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-400 hover:text-accent transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button type="submit" className="w-full h-12" size="lg" isLoading={loading}><LogIn className="mr-2" size={20} /> Se connecter</Button>
          </form>
          <p className="text-center text-sm font-medium text-text-secondary dark:text-gray-400">
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" className="text-accent hover:text-accent-hover font-bold transition-all inline-flex items-center gap-1 group">
              Créer un compte <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { Login };
