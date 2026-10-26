import React from 'react';
import { SEO } from '../components/SEO';
import { siteConfig } from '../config/siteConfig';
import { Hero } from '../sections/Hero';
import { Services } from '../sections/Services';
import { ProductsSection } from '../sections/ProductsSection';
import { HowItWorks } from '../sections/HowItWorks';
import { Trust } from '../sections/Trust';
import { About } from '../sections/About';
import { FAQ } from '../sections/FAQ';
import { Contact } from '../sections/Contact';

interface HomePageProps {
  onOpenIdeaModal: (serviceTitle?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenIdeaModal }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Sajid Innovations',
    'alternateName': 'Sajinova',
    'url': 'https://www.sajidinnovations.in/',
    'logo': 'https://www.sajidinnovations.in/logo.png',
    'founder': {
      '@type': 'Person',
      'name': 'Sajid Inamdar'
    },
    'description':
      'Sajid Innovations builds practical digital solutions for businesses—including websites, custom software, and AI applications—and develops in-house software products like Sajinova Lab for diagnostic laboratories.',
    'telephone': siteConfig.primaryPhone,
    'email': siteConfig.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Kharshindhe',
      'addressLocality': 'Sangamner',
      'addressRegion': 'Ahilyanagar, Maharashtra',
      'postalCode': '413738',
      'addressCountry': 'IN'
    },
    'sameAs': [
      'https://github.com/sajidinamdar',
      'https://www.instagram.com/sajidinamdar_/'
    ]
  };

  return (
    <>
      <SEO
        title="Sajid Innovations | Technology Solutions & Software Products"
        description="Sajid Innovations turns ideas into practical digital solutions. We build modern websites, custom business software, AI applications, and in-house products like Sajinova Lab."
        canonicalUrl="https://www.sajidinnovations.in/"
        schema={schema}
      />

      {/* Homepage Structure in exact order specified in Master Prompt Section 5 */}
      {/* 1. Hero */}
      <Hero onOpenIdeaModal={() => onOpenIdeaModal()} />

      {/* 2. Services Overview */}
      <Services onSelectService={(title) => onOpenIdeaModal(title)} />

      {/* 3. Products */}
      <ProductsSection onOpenDemoRequest={(product) => onOpenIdeaModal(`${product} Demo`)} />

      {/* 4. How It Works */}
      <HowItWorks onOpenIdeaModal={() => onOpenIdeaModal()} />

      {/* 5. Why Sajid Innovations */}
      <Trust />

      {/* 6. About Preview */}
      <About />

      {/* 7. FAQ */}
      <FAQ />

      {/* 8. Contact */}
      <Contact onOpenIdeaModal={(title) => onOpenIdeaModal(title)} />
    </>
  );
};
