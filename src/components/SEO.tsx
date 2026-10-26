import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://www.sajidinnovations.in/logo.png',
  schema,
  noindex = false
}) => {
  const serializedSchema = schema ? JSON.stringify(schema) : '';

  useEffect(() => {
    // 1. Page Title
    document.title = title;

    // Helper to update or create meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 2. Standard Meta Tags & Robots
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

    // 3. Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'Sajid Innovations');

    // 4. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Schema
    const scriptId = 'structured-data-script';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (serializedSchema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = serializedSchema;
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, canonicalUrl, ogType, ogImage, serializedSchema, noindex]);

  return null;
};
