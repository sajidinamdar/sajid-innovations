import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { IdeaSubmissionModal } from './components/IdeaSubmissionModal';
import { PrivacyModal } from './components/PrivacyModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProductsPage } from './pages/ProductsPage';
import { SajinovaLabPage } from './pages/SajinovaLabPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { EnquiryPage } from './pages/EnquiryPage';
import { AdminPage } from './pages/AdminPage';

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
      <Routes>
        <Route path="/admin" element={<AdminPage onBackToHome={() => navigate('/')} />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F9FAFB] flex flex-col font-sans overflow-x-hidden w-full selection:bg-cyan-500/30 selection:text-white">
      {/* Fixed Navigation Bar */}
      <Navbar onOpenIdeaModal={() => handleOpenIdeaModal()} />

      {/* Public Routed Content */}
      <main className="flex-grow">
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
      </main>

      {/* Floating Contact Widget */}
      <FloatingContactWidget onOpenIdeaModal={() => handleOpenIdeaModal()} />

      {/* Interactive Modals */}
      <IdeaSubmissionModal
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
        preselectedService={preselectedService}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

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
