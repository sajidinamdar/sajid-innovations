import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContactWidget } from './components/FloatingContactWidget';
// Synchronous core homepage component
import { HomePage } from './pages/HomePage';

// Lazy-loaded secondary pages (code-split for optimal initial bundle & FCP)
const ServicesPage = React.lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const SajinovaLabPage = React.lazy(() => import('./pages/SajinovaLabPage').then(m => ({ default: m.SajinovaLabPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const EnquiryPage = React.lazy(() => import('./pages/EnquiryPage').then(m => ({ default: m.EnquiryPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));

// Lazy-loaded on-demand interactive modals
const IdeaSubmissionModal = React.lazy(() => import('./components/IdeaSubmissionModal').then(m => ({ default: m.IdeaSubmissionModal })));
const PrivacyModal = React.lazy(() => import('./components/PrivacyModal').then(m => ({ default: m.PrivacyModal })));

function AppLayout() {
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Handle #admin legacy hash navigation cleanly by redirecting to /admin
  useEffect(() => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
      navigate('/admin');
    }
  }, [navigate]);

  const handleOpenIdeaModal = (serviceTitle?: string) => {
    setPreselectedService(serviceTitle);
    setIsIdeaModalOpen(true);
  };

  if (isAdminRoute) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-[#070A10] flex items-center justify-center"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>}>
        <Routes>
          <Route path="/admin" element={<AdminPage onBackToHome={() => navigate('/')} />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F9FAFB] flex flex-col font-sans overflow-x-hidden w-full selection:bg-cyan-500/30 selection:text-white">
      {/* Fixed Navigation Bar */}
      <Navbar onOpenIdeaModal={() => handleOpenIdeaModal()} />

      {/* Public Routed Content */}
      <main className="flex-grow">
        <React.Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            <Route path="/" element={<HomePage onOpenIdeaModal={handleOpenIdeaModal} />} />
            <Route path="/services" element={<ServicesPage onOpenIdeaModal={handleOpenIdeaModal} />} />
            <Route path="/products" element={<ProductsPage onOpenIdeaModal={handleOpenIdeaModal} />} />
            <Route
              path="/sajinova-lab"
              element={
                <SajinovaLabPage
                  onOpenDemoRequest={() => handleOpenIdeaModal('Sajinova Lab Demo')}
                />
              }
            />
            <Route path="/about" element={<AboutPage onOpenIdeaModal={handleOpenIdeaModal} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/enquire/:category" element={<EnquiryPage />} />
            <Route path="/enquire" element={<Navigate to="/enquire/general" replace />} />
            <Route path="/admin" element={<AdminPage onBackToHome={() => navigate('/')} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </main>

      {/* Floating Contact Widget */}
      <FloatingContactWidget onOpenIdeaModal={() => handleOpenIdeaModal()} />

      {/* Interactive Modals */}
      <React.Suspense fallback={null}>
        {isIdeaModalOpen && (
          <IdeaSubmissionModal
            isOpen={isIdeaModalOpen}
            onClose={() => setIsIdeaModalOpen(false)}
            preselectedService={preselectedService}
          />
        )}
        {isPrivacyModalOpen && (
          <PrivacyModal
            isOpen={isPrivacyModalOpen}
            onClose={() => setIsPrivacyModalOpen(false)}
          />
        )}
      </React.Suspense>

      {/* Global Footer */}
      <Footer
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onNavigateToAdmin={() => navigate('/admin')}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}
