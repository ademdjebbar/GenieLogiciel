import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative min-h-screen bg-background text-text-primary font-sans selection:bg-accent/40 selection:text-primary">
      {/* Decorative Blob backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-rose-100/60 blur-[100px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-pink-100/50 blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex-1 md:ml-72 flex flex-col min-w-0">
          <Header onToggleSidebar={toggleSidebar} />

          <main className="flex-1 p-6 md:p-10 lg:p-12">
            <div className="max-w-[1200px] mx-auto animate-in fade-in duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>

      <Toaster position="bottom-right" toastOptions={{
        className: 'bg-white text-text-primary border border-gray-100 shadow-soft rounded-[1.5rem] font-medium p-4',
      }} />
    </div>
  );
};

export { Layout };
