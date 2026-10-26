export interface EnquiryCategoryConfig {
  slug: string;
  categoryName: string;
  badge: string;
  pageTitle: string;
  heading: string;
  subheading: string;
  defaultTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  focusHighlights: string[];
}

export const ENQUIRY_CATEGORIES: Record<string, EnquiryCategoryConfig> = {
  'general': {
    slug: 'general',
    categoryName: 'Other / Custom Requirement',
    badge: 'General Technology Enquiry',
    pageTitle: 'General Enquiry | Sajid Innovations',
    heading: 'Let’s Discuss Your Idea or Project',
    subheading: 'Tell us about your business goals, ideas, or questions. We will respond directly with honest technical guidance and practical next steps.',
    defaultTitle: 'General Project Enquiry',
    metaDescription: 'Send a general enquiry to Sajid Innovations. Get honest advice, practical technology architecture, and dependable digital solutions.',
    canonicalUrl: 'https://www.sajidinnovations.in/enquire/general',
    focusHighlights: [
      'Direct communication with founder & software developer Sajid Inamdar',
      'Realistic feasibility assessment, technology choices, and clear milestones',
      'Strictly confidential discussion with instant Reference ID tracking'
    ]
  },
  'website-development': {
    slug: 'website-development',
    categoryName: 'Website Design & Development',
    badge: 'Website Design & Development',
    pageTitle: 'Website Development Enquiry | Sajid Innovations',
    heading: 'Discuss Your Website Project',
    subheading: 'Looking for a fast, responsive, and conversion-focused business website? Share your requirements to get an agreed scope and timeline.',
    defaultTitle: 'Website Design & Development Project',
    metaDescription: 'Enquire about modern, responsive website design and development with Sajid Innovations.',
    canonicalUrl: 'https://www.sajidinnovations.in/enquire/website-development',
    focusHighlights: [
      'Mobile-, tablet-, and desktop-optimized responsive design',
      'High-performance, SEO-friendly architecture and clean code',
      'Integrated lead capture forms, WhatsApp messaging & admin tracking'
    ]
  },
  'custom-software': {
    slug: 'custom-software',
    categoryName: 'Custom Software Development',
    badge: 'Custom Software Development',
    pageTitle: 'Custom Software Enquiry | Sajid Innovations',
    heading: 'Discuss Custom Software Development',
    subheading: 'Need purpose-built software tailored around your unique business workflows? Let’s map out operational logic, databases, and requirements.',
    defaultTitle: 'Custom Software Development Project',
    metaDescription: 'Enquire about purpose-built custom software engineered specifically around your business workflows.',
    canonicalUrl: 'https://www.sajidinnovations.in/enquire/custom-software',
    focusHighlights: [
      'Engineered specifically around your operational processes and team roles',
      'Secure local/cloud relational database architecture and automated backups',
      'Eliminate spreadsheet bottlenecks with fast, intuitive internal dashboards'
    ]
  },
  'ai-solutions': {
    slug: 'ai-solutions',
    categoryName: 'AI Applications & Chatbots',
    badge: 'AI Applications & Chatbots',
    pageTitle: 'AI Solutions Enquiry | Sajid Innovations',
    heading: 'Discuss AI Applications & Chatbots',
    subheading: 'Want to implement practical conversational assistants, document querying tools, or automated lead routing? Tell us what you want to achieve.',
    defaultTitle: 'AI Application & Chatbot Project',
    metaDescription: 'Enquire about practical AI applications, chatbots, and document intelligence systems with Sajid Innovations.',
    canonicalUrl: 'https://www.sajidinnovations.in/enquire/ai-solutions',
    focusHighlights: [
      'Practical business utility with measurable operational value',
      'Context-aware conversational chatbots for 24/7 lead intake and support',
      'Internal document search assistants and FAQ knowledge querying'
    ]
  },
  'business-automation': {
    slug: 'business-automation',
    categoryName: 'Business Automation',
    badge: 'Business Automation',
    pageTitle: 'Business Automation Enquiry | Sajid Innovations',
    heading: 'Discuss Business Automation',
    subheading: 'Cut out repetitive manual tasks, data copy-pasting, and delayed follow-ups. Let’s automate your digital workflows smoothly.',
    defaultTitle: 'Business Workflow Automation Project',
    metaDescription: 'Enquire about workflow automation, notification pipelines, and business process automation.',
    canonicalUrl: 'https://www.sajidinnovations.in/enquire/business-automation',
    focusHighlights: [
      'Instant automated email, notification, and alert dispatches',
      'Reliable data synchronization between forms, spreadsheets, and databases',
      'Save productive team hours and eliminate human data entry errors'
    ]
  },
  'sajinova-lab-demo': {
    slug: 'sajinova-lab-demo',
    categoryName: 'Sajinova Lab Demo',
    badge: 'Sajinova Lab · Demo & Licensing',
    pageTitle: 'Request a Demo of Sajinova Lab | Sajid Innovations',
    heading: 'Request a Live Demo of Sajinova Lab',
    subheading: 'Experience our offline-first laboratory management software for diagnostic and pathology centers. Schedule a personalized walkthrough.',
    defaultTitle: 'Sajinova Lab Demonstration Request',
    metaDescription: 'Request a guided demonstration of Sajinova Lab laboratory management software for diagnostic and pathology centers.',
    canonicalUrl: 'https://www.sajidinnovations.in/enquire/sajinova-lab-demo',
    focusHighlights: [
      '100% Offline-first resilience on Windows workstations (zero cloud downtime)',
      'Dynamic multi-page clinical PDF reports & 1-click WhatsApp delivery',
      'Patient directory, doctor referral tracking & hardware-bound local encryption'
    ]
  }
};

export const ENQUIRY_SLUGS = Object.keys(ENQUIRY_CATEGORIES);

export function getEnquiryConfigBySlug(slug?: string): EnquiryCategoryConfig {
  if (slug && ENQUIRY_CATEGORIES[slug]) {
    return ENQUIRY_CATEGORIES[slug];
  }
  return ENQUIRY_CATEGORIES['general'];
}
