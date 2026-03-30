import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, UserPlus, ArrowRight, Eye, EyeOff } from "lucide-react";
import { register } from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../hooks/useToast";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nom: "",
    prenom: "",
    horaire_travail_debut: "09:00",
    horaire_travail_fin: "18:00",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      showToast("Compte créé avec succès ! Connectez-vous.");
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Échec de l'inscription";
      showToast(Array.isArray(errorMsg) ? errorMsg[0].msg : errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950 font-sans">
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
          <h2 className="text-5xl font-bold text-white leading-tight mb-8">Rejoignez la nouvelle ère de la gestion de tâches.</h2>
          <p className="text-xl text-white/80 leading-relaxed mb-10">Créez votre compte en quelques secondes et commencez à optimiser votre productivité.</p>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl text-white italic">
            "Priora a littéralement transformé ma façon de travailler."
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-10">
          <div>
            <h3 className="text-3xl font-extrabold text-text-primary dark:text-text-light mb-3">Créer votre compte</h3>
            <p className="text-text-secondary dark:text-gray-400 font-medium">C'est gratuit et ça ne prend qu'une minute.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prénom" placeholder="Jean" icon={User} required value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
              <Input label="Nom" placeholder="Dupont" required value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
            </div>
            <Input label="Adresse e-mail" type="email" placeholder="jean.dupont@exemple.com" icon={Mail} required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <div className="relative">
              <Input label="Mot de passe" type={showPassword ? "text" : "password"} placeholder="••••••••" icon={Lock} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-400 hover:text-accent transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Button type="submit" className="w-full h-12" size="lg" isLoading={loading}><UserPlus className="mr-2" size={20} /> Créer mon compte</Button>
          </form>
          <p className="text-center text-sm font-medium text-text-secondary dark:text-gray-400">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-accent hover:text-accent-hover font-bold transition-all inline-flex items-center gap-1 group">
              Se connecter <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { Register };
