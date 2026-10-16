import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Services } from './sections/Services';
import { Projects } from './sections/Projects';
import { HowItWorks } from './sections/HowItWorks';
import { Trust } from './sections/Trust';
import { FAQ } from './sections/FAQ';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { IdeaSubmissionModal } from './components/IdeaSubmissionModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Sync with window.location.hash for direct /admin routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenIdeaModal = (serviceTitle?: string) => {
    setPreselectedService(serviceTitle);
    setIsIdeaModalOpen(true);
  };

  const handleNavigateToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
  };

  const handleBackToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
  };

  if (currentView === 'admin') {
    return <AdminPage onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F9FAFB] flex flex-col font-sans overflow-x-hidden w-full">
      {/* 3-Zone Fixed Navbar */}
      <Navbar onOpenIdeaModal={() => handleOpenIdeaModal()} />

      {/* Main Public Content */}
      <main className="flex-grow">
        <Hero onOpenIdeaModal={() => handleOpenIdeaModal()} />
        <About />
        <Services onSelectService={(title) => handleOpenIdeaModal(title)} />
        <Projects />
        <HowItWorks onOpenIdeaModal={() => handleOpenIdeaModal()} />
        <Trust />
        <FAQ />
        <Contact onOpenIdeaModal={() => handleOpenIdeaModal()} />
      </main>

      {/* Accessible Floating Contact Widget */}
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

      {/* Footer */}
      <Footer
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onNavigateToAdmin={handleNavigateToAdmin}
      />
    </div>
  );
}
