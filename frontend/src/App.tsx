import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import StatsPage from './pages/StatsPage';
import AIStudio from './pages/AIStudio';
import SettingsPage from './pages/SettingsPage';
import DashboardLayout from './components/layout/DashboardLayout';
import { CommandPalette } from './components/layout/CommandPalette';
import { TaskModal } from './components/modals/TaskModal';
import { CategoryModal } from './components/modals/CategoryModal';
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal';
import { Toaster } from 'sonner';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Toaster theme="light" position="top-center" expand={true} richColors />
      <CommandPalette />
      <TaskModal />
      <CategoryModal />
      <ConfirmDeleteModal />
      
      <Routes>
        {/* Auth Route - Sans Layout */}
        <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />} />
        
        {/* Protected Routes - Sous DashboardLayout */}
        <Route path="/" element={
          isAuthenticated ? (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          ) : (
            <Navigate to="/auth" />
          )
        } />

        <Route path="/tasks" element={
          isAuthenticated ? (
            <DashboardLayout>
              <TasksPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/auth" />
          )
        } />

        <Route path="/calendar" element={
          isAuthenticated ? (
            <DashboardLayout>
              <CalendarPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/auth" />
          )
        } />

        <Route path="/ai" element={
          isAuthenticated ? (
            <DashboardLayout>
              <AIStudio />
            </DashboardLayout>
          ) : (
            <Navigate to="/auth" />
          )
        } />

        <Route path="/stats" element={
          isAuthenticated ? (
            <DashboardLayout>
              <StatsPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/auth" />
          )
        } />

        <Route path="/settings" element={
          isAuthenticated ? (
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
