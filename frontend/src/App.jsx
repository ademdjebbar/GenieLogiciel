import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { AI } from "./pages/AI";
import { Settings } from "./pages/Settings";
import { Layout } from "./components/layout/Layout";
import { Skeleton } from "./components/ui/Skeleton";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-10">
        <div className="w-full max-w-7xl space-y-10">
          <Skeleton className="h-10 w-48" variant="shimmer" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-32" variant="shimmer" />
            <Skeleton className="h-32" variant="shimmer" />
            <Skeleton className="h-32" variant="shimmer" />
            <Skeleton className="h-32" variant="shimmer" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-96 md:col-span-2" variant="shimmer" />
            <Skeleton className="h-96" variant="shimmer" />
          </div>
        </div>
      </div>
    );
  }
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin text-accent">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai"
            element={
              <PrivateRoute>
                <AI />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;