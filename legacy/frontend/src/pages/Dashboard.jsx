import { useEffect } from "react";
import { Trophy, CheckCircle2, Clock3, AlertCircle, Sparkles, ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTaskStore } from "../store/taskStore";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { TaskCard } from "../components/tasks/TaskCard";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 350, damping: 25 } }
};

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, overdueTasks, loading, fetchInitialData, updateTaskStatus } = useTaskStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const stats = [
    { label: "Total", value: tasks.length, icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
    { label: "En cours", value: tasks.filter(t => t.statut === "en_cours").length, icon: Clock3, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Terminées", value: tasks.filter(t => t.statut === "termine").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "En retard", value: overdueTasks.length, icon: AlertCircle, color: "text-danger", bg: "bg-danger/10" },
  ];

  const todayTasks = tasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.date_echeance.split('T')[0] === today && t.statut !== 'termine';
  }).slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-12"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">
            Bonjour, {user?.prenom}
          </h2>
          <p className="text-text-secondary font-medium text-lg">Voici votre tableau de bord pour aujourd'hui.</p>
        </div>
        <Link to="/tasks">
          <Button variant="primary" size="lg">
            <Plus className="mr-2" size={20} /> Nouvelle Tâche
          </Button>
        </Link>
      </motion.div>

      {overdueTasks.length > 0 && (
        <motion.div variants={itemVariants} className="bg-rose-50 border border-danger/20 p-5 rounded-[1.5rem] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[1rem] bg-danger/10 flex items-center justify-center">
              <AlertCircle className="text-danger" size={24} />
            </div>
            <div>
              <p className="font-bold text-danger text-base">Vous avez {overdueTasks.length} tâches en retard.</p>
            </div>
          </div>
          <Link to="/tasks?filter=overdue" className="text-sm font-bold text-danger hover:text-white transition-colors border-2 border-danger/30 hover:border-danger hover:bg-danger px-4 py-2 rounded-[1rem]">
            Voir tout
          </Link>
        </motion.div>
      )}

      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-[2rem] bg-white border border-gray-100" />) : stats.map((stat, i) => (
          <motion.div variants={itemVariants} key={i}>
            <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Card className="flex flex-col justify-between h-40 border-2 border-transparent hover:border-rose-100 group transition-all duration-300 shadow-soft hover:shadow-premium overflow-hidden bg-white/90">
                <CardHeader className="p-6 pb-2 relative z-10">
                  <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-to-br from-transparent to-rose-50/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[1rem] ${stat.bg} flex items-center justify-center shadow-sm`}>
                      <stat.icon className={stat.color} size={24} />
                    </div>
                    <CardDescription className="uppercase tracking-wider font-bold">
                      {stat.label}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 relative z-10 mt-auto">
                  <p className="text-4xl font-extrabold text-text-primary tracking-tight">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-text-primary">
              Les Tâches du Jour
            </h3>
            <Link to="/tasks" className="text-base font-bold text-primary hover:text-accent transition-colors flex items-center gap-2">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>

          <motion.div variants={containerVariants} className="space-y-4">
            {loading && tasks.length === 0 ? (
              Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-[2rem] bg-white shadow-soft border border-gray-100" />)
            ) : todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <motion.div variants={itemVariants} key={task.id}>
                  <TaskCard
                    task={task}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    onStatusChange={updateTaskStatus}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-rose-100 rounded-[2rem] bg-rose-50/30">
                <div className="w-16 h-16 bg-emerald-100 rounded-[1.2rem] flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h4 className="text-xl font-extrabold text-text-primary">Tout est à jour !</h4>
                <p className="text-text-secondary text-base mt-2">Profitez de votre journée, aucune tâche prévue aujourd'hui.</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-text-primary">
              Assistant IA
            </h3>
          </div>
          <Card className="bg-gradient-to-br from-primary to-accent border-none shadow-soft hover:shadow-rose-glow text-white flex flex-col justify-between h-[300px] relative overflow-hidden group p-0">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/20 blur-3xl rounded-full group-hover:bg-white/30 transition-all duration-700"></div>
            <CardHeader className="relative z-10 p-8">
              <div className="w-12 h-12 rounded-[1rem] bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-sm mb-6">
                <Sparkles size={24} />
              </div>
              <CardTitle className="text-white text-2xl font-extrabold mb-2 tracking-tight">Besoin de focus ?</CardTitle>
              <CardDescription className="text-white/90 text-base leading-relaxed font-medium">
                Laissez l'IA analyser vos tâches et générer un emploi du temps optimal pour booster votre journée.
              </CardDescription>
            </CardHeader>
            <CardFooter className="relative z-10 p-8 pt-0 mt-auto">
              <Link to="/ai" className="w-full mt-auto">
                <Button variant="outline" size="md" className="w-full justify-between items-center group/btn border-none bg-white text-primary hover:bg-rose-50 shadow-soft">
                  Lancer l'Analyse
                  <ArrowRight size={20} className="text-primary group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
export { Dashboard };
