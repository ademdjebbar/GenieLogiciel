import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Clock, 
  Bell, 
  Settings as SettingsIcon, 
  Save, 
  Moon, 
  Sun,
  Shield,
  Monitor,
  CheckCircle
} from "lucide-react";
import { getMe, getPreferences, updatePreferences } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Toggle } from "../components/ui/Toggle";
import { Badge } from "../components/ui/Badge";
import { useToast } from "../hooks/useToast";
import { cn } from "../utils/cn";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    categories_favorites: [],
    notifications_actives: true,
    heure_resume_quotidien: "09:00",
  });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading(true);
      try {
        const res = await getPreferences();
        setPreferences(res.data);
      } catch (err) {
        showToast("Impossible de charger les préférences", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePreferences(preferences);
      showToast("Préférences sauvegardées !");
    } catch (err) {
      showToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary dark:text-text-light flex items-center gap-3">
            <SettingsIcon className="text-primary" size={32} />
            Paramètres
          </h2>
          <p className="text-text-secondary dark:text-gray-400 font-medium mt-1">
            Personnalisez votre expérience Priora.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-4">
          <nav className="space-y-1">
            {[
              { label: "Profil", icon: User, active: true },
              { label: "Préférences", icon: SettingsIcon },
              { label: "Notifications", icon: Bell },
              { label: "Sécurité", icon: Shield },
              { label: "Apparence", icon: Monitor },
            ].map((item, i) => (
              <button
                key={i}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  item.active 
                    ? "bg-accent text-white shadow-premium shadow-accent/20" 
                    : "text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-900"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-none p-6 text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl font-bold shadow-xl shadow-accent/20">
                {user?.prenom?.[0]}
              </div>
              <div>
                <p className="text-lg font-bold">{user?.prenom} {user?.nom}</p>
                <Badge variant="ai" className="bg-white/10 border-white/20 text-white mt-1">Utilisateur Pro</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold text-text-primary dark:text-text-light">
              <User className="text-accent" size={24} />
              <h3>Mon Profil</h3>
            </div>
            
            <Card className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Prénom" value={user?.prenom || ""} disabled icon={User} />
                  <Input label="Nom" value={user?.nom || ""} disabled />
                </div>
                <Input label="Adresse e-mail" value={user?.email || ""} disabled icon={Mail} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Début de journée" type="time" value={user?.horaire_travail_debut || "09:00"} disabled icon={Clock} />
                  <Input label="Fin de journée" type="time" value={user?.horaire_travail_fin || "18:00"} disabled />
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex gap-4">
                  <Monitor className="text-blue-500 shrink-0" size={20} />
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                    Les informations de profil sont gérées par votre administrateur. Contactez-nous pour toute modification.
                  </p>
                </div>
              </form>
            </Card>
          </section>

          {/* Preferences Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold text-text-primary dark:text-text-light">
              <SettingsIcon className="text-accent" size={24} />
              <h3>Préférences de l'application</h3>
            </div>
            
            <Card className="p-8">
              <form onSubmit={handleSavePreferences} className="space-y-8">
                <div className="space-y-6">
                  <Toggle 
                    label="Notifications actives" 
                    checked={preferences.notifications_actives}
                    onChange={(checked) => setPreferences({ ...preferences, notifications_actives: checked })}
                  />
                  <div className="h-[1px] bg-gray-100 dark:bg-gray-800" />
                  <Toggle 
                    label="Mode Sombre" 
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                  <div className="h-[1px] bg-gray-100 dark:bg-gray-800" />
                  <div className="flex flex-col gap-4">
                    <label className="text-sm font-medium text-text-primary dark:text-text-light/80">
                      Heure du résumé quotidien
                    </label>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="time" 
                        value={preferences.heure_resume_quotidien}
                        onChange={(e) => setPreferences({ ...preferences, heure_resume_quotidien: e.target.value })}
                        className="w-32"
                      />
                      <p className="text-xs text-text-secondary font-medium italic">
                        L'IA vous enverra un récapitulatif de vos tâches chaque matin à cette heure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto px-10 h-12 shadow-premium"
                    isLoading={saving}
                  >
                    <Save className="mr-2" size={20} />
                    Sauvegarder les préférences
                  </Button>
                </div>
              </form>
            </Card>
          </section>

          {/* Account Danger Zone */}
          <section className="space-y-6 pt-10">
            <div className="flex items-center gap-2 text-xl font-bold text-danger">
              <Shield size={24} />
              <h3>Zone de danger</h3>
            </div>
            <Card className="border-danger/20 p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="max-w-sm text-center sm:text-left">
                  <p className="font-bold text-text-primary dark:text-text-light mb-1">Supprimer mon compte</p>
                  <p className="text-sm text-text-secondary">
                    Cette action supprimera définitivement toutes vos tâches, préférences et analyses IA.
                  </p>
                </div>
                <Button variant="danger" className="w-full sm:w-auto bg-transparent hover:bg-danger text-danger hover:text-white border-2 border-danger shadow-none">
                  Désactiver mon compte
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export { Settings };
