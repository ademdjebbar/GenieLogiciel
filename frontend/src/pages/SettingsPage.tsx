import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import { 
  User as UserIcon, 
  Bell, 
  Shield, 
  Palette, 
  Save, 
  Trash2,
  Mail,
  Smartphone,
  Circle,
  Plus,
  Terminal,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/store/useModalStore';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [name, setName] = useState(user.name || '');
  const [categories, setCategories] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem('token');
  const { openCategoryModal, categoryRefreshTrigger, openConfirmDelete } = useModalStore();

  useEffect(() => {
    fetchCategories();
  }, [categoryRefreshTrigger]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {}
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        const fullUser = { ...user, ...updatedUser };
        setUser(fullUser);
        localStorage.setItem('user', JSON.stringify(fullUser));
        toast.success("Configuration Elite synchronisée.");
      } else {
        toast.error("Échec de la synchronisation.");
      }
    } catch (e) {
      toast.error("Erreur serveur.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Espace supprimé avec succès.");
        fetchCategories();
      }
    } catch (err) {
      toast.error("Échec de la suppression de l'espace.");
    }
  };

  const handlePurge = () => {
     localStorage.clear();
     window.location.href = '/auth';
  };

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      
      {/* Header Settings Elite */}
      <header className="flex flex-col gap-3">
        <h1 className="text-5xl font-black text-[#2d1f3d] tracking-tighter uppercase ">Configuration OS</h1>
        <div className="flex items-center gap-3">
           <Zap size={14} className="text-[#ffafcc]" fill="currentColor" />
           <p className="text-[#7a6188] font-bold uppercase tracking-[0.3em] text-xs">Paramètres Noyau & Utilisateur</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Navigation Interne Elite */}
        <div className="lg:col-span-1 space-y-3">
          {[
            { name: "Profil Elite", icon: UserIcon, active: true },
            { name: "Notifications", icon: Bell },
            { name: "Sécurité & VPN", icon: Shield },
            { name: "Interface UI", icon: Palette },
            { name: "IA & Terminal", icon: Terminal },
          ].map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden group",
                item.active 
                  ? "bg-[#ffafcc]/10 text-[#ffafcc] border border-[#ffafcc]/20 shadow-lg shadow-[#ffafcc]/5" 
                  : "text-[#7a6188] hover:text-[#7a6188] hover:bg-[#cdb4db]/15 border border-transparent"
              )}
            >
              <item.icon size={16} className={cn("transition-transform group-hover:scale-110", item.active ? "text-[#ffafcc]" : "")} />
              {item.name}
              {item.active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ffafcc]" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area Elite */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* Section Profil Elite */}
          <div className="bg-[#ffc8dd]/20 border border-[#cdb4db]/20 rounded-3xl p-10 space-y-10 relative overflow-hidden">
            
            <div className="flex items-center justify-between z-10 relative">
              <h3 className="text-xl font-black text-[#2d1f3d] tracking-tight uppercase">Identité Opérationnelle</h3>
              <Button onClick={handleSaveProfile} disabled={isSaving || !name.trim()} className="bg-[#ffafcc] text-[#2d1f3d] hover:bg-[#ffc8dd] font-black px-8 h-12 rounded-2xl shadow-2xl shadow-[#ffafcc]/20 transition-all hover:scale-105 active:scale-95">
                 <Save size={18} className="mr-3" /> {isSaving ? "SYNCHRO..." : "ENREGISTRER"}
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start pt-4 z-10 relative">
               <div className="relative group">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#ffafcc] to-[#cdb4db] rounded-3xl flex items-center justify-center border-2 border-[#cdb4db]/20 shadow-2xl overflow-hidden transition-transform group-hover:rotate-3">
                     <span className="text-4xl font-black text-[#2d1f3d] uppercase ">{user.name?.charAt(0)}</span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-[#ffafcc] p-3 rounded-2xl text-[#2d1f3d] border border-[#cdb4db]/30 shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <Smartphone size={16} strokeWidth={3} />
                  </button>
               </div>

               <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#7a6188] uppercase tracking-[0.3em] px-1 flex items-center gap-3">
                       <UserIcon size={12} className="text-[#ffafcc]" /> NOM COMPLET
                    </label>
                    <Input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-[#fef6fa]/40 border-[#cdb4db]/20 h-14 pl-5 rounded-2xl focus-visible:ring-[#ffafcc] font-bold text-[#2d1f3d] shadow-inner"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#7a6188] uppercase tracking-[0.3em] px-1 flex items-center gap-3">
                       <Mail size={12} className="text-[#ffafcc]" /> EMAIL SYNC
                    </label>
                    <Input 
                      defaultValue={user.email} 
                      className="bg-[#fef6fa]/40 border-[#cdb4db]/20 h-14 pl-5 rounded-2xl focus-visible:ring-[#ffafcc] opacity-40 cursor-not-allowed font-bold"
                      readOnly
                    />
                  </div>
               </div>
            </div>
          </div>

          {/* Section Catégories Elite */}
          <div className="bg-[#ffc8dd]/20 border border-[#cdb4db]/20 rounded-3xl p-10 space-y-10 relative overflow-hidden">
             
             <div className="flex items-center justify-between px-2 z-10 relative">
                <div className="space-y-1">
                   <h3 className="text-xl font-black text-[#2d1f3d] tracking-tight uppercase flex items-center gap-4">
                      Espaces de Travail
                      <div className="skew-badge bg-[#ffc8dd]/10 border border-[#cdb4db]/30 text-[#7a6188]">
                         <div className="skew-badge-inner">{categories.length} SLOTS</div>
                      </div>
                   </h3>
                </div>
                <Button variant="ghost" onClick={() => openCategoryModal()} className="text-[#ffafcc] hover:text-[#ffc8dd] font-black text-[10px] uppercase tracking-[0.2em] bg-[#ffafcc]/5 hover:bg-[#ffafcc]/10 px-6 py-6 rounded-2xl">
                   CONFIGURER <Plus size={16} className="ml-2" />
                </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 z-10 relative">
                {categories.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#ffc8dd]/25 border border-[#cdb4db]/20 rounded-2xl group hover:border-[#ffafcc]/30 transition-all hover:translate-x-1">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[#cdb4db]/20 shadow-inner" style={{ backgroundColor: `${c.color}10` }}>
                          <Circle size={14} fill={c.color} stroke="none" className="shadow-lg" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-[#2d1f3d] uppercase tracking-tight">{c.name}</span>
                          <span className="text-[10px] font-bold text-[#7a6188] uppercase tracking-widest mt-1">Espace Actif</span>
                       </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(c.id)} className="opacity-0 group-hover:opacity-100 transition-all text-[#9b85a8] hover:text-red-500 hover:bg-red-500/5 rounded-xl">
                       <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
             </div>
          </div>

          {/* Danger Zone Elite */}
          <div className="bg-red-500/[0.01] border border-red-500/10 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between group overflow-hidden relative">
             <div className="absolute inset-0 bg-red-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             <div className="space-y-2 z-10">
                <h4 className="text-sm font-black text-red-500 uppercase tracking-[0.4em]">ZONE CRITIQUE</h4>
                <p className="text-xs text-[#7a6188] font-bold max-w-sm">La suppression du noyau utilisateur est définitive et irréversible. Les données seront purgées.</p>
             </div>
             <Button variant="outline" onClick={() => openConfirmDelete("Purge du Noyau", "Êtes-vous sûr de vouloir supprimer ce compte et purger ses données ?", handlePurge)} className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-[#2d1f3d] transition-all rounded-2xl font-black text-[10px] uppercase px-10 h-14 tracking-[0.2em] z-10 mt-6 md:mt-0">
                Purger le Système
             </Button>
          </div>

        </div>
      </div>

    </div>
  );
}
