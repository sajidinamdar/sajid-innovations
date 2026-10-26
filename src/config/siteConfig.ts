import { FAQItem, ProductItem, ProjectItem, ServiceItem } from '../types/index.ts';

export const siteConfig = {
  // Brand & Founder
  brandName: 'Sajid Innovations',
  brandPositioning: 'Technology & Innovation · Client Solutions & Software Products',
  brandSubtitle: 'Technology Solutions & Software Products',
  brandTagline: 'Turning Ideas Into Powerful Digital Solutions.',
  centralMessage: 'Built for businesses. Driven by innovation.',
  brandDescription:
    'Sajid Innovations is a technology brand founded by Sajid Inamdar. We turn ideas into practical digital solutions that help businesses grow and solve real-world problems through technology and innovation.',
  founderName: 'Sajid Inamdar',
  founderRole: 'Founder & Software Developer',
  professionalTitle: 'Software Developer & Technology Solutions Builder',

  // Contact details (Verified)
  primaryPhone: '+91 8329465339',
  alternativePhone: '+91 7798779332',
  email: 'contact@sajidinnovations.in',
  contactEmail: 'contact@sajidinnovations.in',
  whatsappNumber: '918329465339',

  // Social links (Verified)
  instagramUsername: '@sajidinamdar_',
  instagramUrl: 'https://www.instagram.com/sajidinamdar_/',
  githubUrl: 'https://github.com/sajidinamdar',
  linkedinUrl: '',

  // Location & Timezone
  location: 'Kharshindhe, Sangamner, Ahilyanagar, Maharashtra 413738, India',
  shortLocation: 'Ahilyanagar, Maharashtra, India',
  businessAddress: 'Kharshindhe, Sangamner, Ahilyanagar, Maharashtra 413738, India',
  timezone: 'IST (UTC+5:30)',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.png',

  // Hero Section Copy (Prompt Section 3 Specification)
  heroEyebrow: 'SAJID INNOVATIONS · TECHNOLOGY & INNOVATION',
  heroTitle: 'Turning Ideas Into Powerful Digital Solutions.',
  heroSubtitle:
    'We turn ideas into practical digital solutions that help businesses grow and solve real-world problems through technology and innovation.',
  heroMicrocopy: 'Built for businesses. Driven by innovation.',
  heroKeywords: ['Ideas', 'Technology', 'Innovation'],

  // About Preview Copy (Prompt Section 5.6)
  aboutHeading: 'Innovation With a Purpose',
  aboutParagraphs: [
    'Sajid Innovations is a technology brand founded by Sajid Inamdar, focused on building digital solutions for businesses and developing software products that address real-world problems.',
    'We operate with two distinct, complementary focus areas: delivering custom software, websites, AI applications, and automations for clients, while developing specialized in-house software products like Sajinova Lab for specific industry workflows.',
    'Our approach is grounded in practical thinking, clear communication, and choosing reliable technology tailored to genuine operational needs rather than unnecessary complexity.'
  ],

  // Technology Groups for About Page
  techStackGroups: [
    {
      category: 'Web & User Interfaces',
      skills: ['Modern Web Applications', 'Responsive Web Design', 'Interactive Admin Portals', 'Performance Optimization', 'Clean UI/UX Architecture']
    },
    {
      category: 'Software & Backend Systems',
      skills: ['Custom Business Logic', 'Secure Relational Databases', 'RESTful API Engineering', 'Authentication & Access Control', 'Desktop & Web Applications']
    },
    {
      category: 'AI & Workflow Automation',
      skills: ['Conversational Chatbots', 'Document Q&A & Search', 'Automated Notifications', 'Process Streamlining', 'Data Transformation']
    },
    {
      category: 'Reliability & Security',
      skills: ['Local Database Encryption', 'Automated Hot Backups', 'Audit Trails', 'Clean Handover & Documentation', 'Direct Technical Support']
    }
  ],

  // 4 Core Client Services (Prompt Section 5.2 Specification)
  services: [
    {
      id: 'website-development',
      title: 'Website Design & Development',
      slug: 'website-development',
      shortDescription:
        'Modern, responsive websites designed to present your business professionally and help customers take action.',
      fullDescription:
        'We build fast, secure, and mobile-optimized websites tailored to your brand identity. From business profile websites to interactive inquiry platforms, every site is crafted with clear navigation, accessible layouts, and conversion-oriented layouts.',
      capabilities: [
        'Corporate & business showcase websites',
        'High-converting landing pages',
        'Booking and inquiry collection portals',
        'Responsive mobile, tablet, and desktop layouts',
        'SEO-friendly structure and fast page speed'
      ],
      typicalProblems: [
        'Outdated or non-responsive websites that lose prospective mobile visitors',
        'Lack of an authentic digital presence for an emerging or established business',
        'Need to capture customer inquiries and booking leads directly online'
      ],
      icon: 'Globe'
    },
    {
      id: 'custom-software-development',
      title: 'Custom Software Development',
      slug: 'custom-software-development',
      shortDescription:
        'Purpose-built software designed around your workflows, requirements, and business operations.',
      fullDescription:
        'When off-the-shelf software is too rigid or expensive, we engineer custom systems built specifically for how your business works. We focus on clear interfaces, reliable databases, and practical features that eliminate operational friction.',
      capabilities: [
        'Internal business management systems',
        'Administrative control dashboards & portals',
        'Secure database-driven applications',
        'Customer, patient, or order record management',
        'Custom web applications and backend APIs'
      ],
      typicalProblems: [
        'Disorganized spreadsheets causing data errors, duplicate entries, and lost hours',
        'Commercial SaaS tools with recurring fees for bloated features you never use',
        'Need for a single, dependable dashboard where teams can manage operational records'
      ],
      icon: 'Server'
    },
    {
      id: 'ai-applications',
      title: 'AI Applications & Chatbots',
      slug: 'ai-applications',
      shortDescription:
        'Useful AI-powered applications and conversational experiences designed around real business needs.',
      fullDescription:
        'We develop practical artificial intelligence solutions that provide immediate utility. Whether enabling 24/7 customer inquiry support or allowing team members to query internal documents and FAQs, our AI tools focus on accuracy and reliability.',
      capabilities: [
        '24/7 business inquiry chatbots',
        'Document and PDF question-answering tools',
        'Knowledge base and catalog search assistants',
        'Automated query routing and customer lead intake',
        'Context-aware conversational workflows'
      ],
      typicalProblems: [
        'Customer inquiries arriving outside business hours without prompt answers',
        'Staff spending excessive time manually looking up repetitive questions in documents',
        'Desire to adopt modern AI capabilities with measurable, practical business value'
      ],
      icon: 'Bot'
    },
    {
      id: 'business-automation',
      title: 'Business Automation',
      slug: 'business-automation',
      shortDescription:
        'Reduce repetitive manual work by connecting processes and creating smarter digital workflows.',
      fullDescription:
        'Manual data entry and repetitive communication drain productive hours. We build automated routines that connect your tools, send timely alerts, process incoming submissions, and keep your business running smoothly behind the scenes.',
      capabilities: [
        'Instant email and notification dispatch',
        'Customer inquiry and follow-up workflows',
        'Data synchronization between web forms and databases',
        'Automated report compilation and file generation',
        'Custom alerts for critical operational events'
      ],
      typicalProblems: [
        'Missed business opportunities caused by delayed manual email follow-ups',
        'Hours wasted copying and re-entering customer information across systems',
        'Lack of systematic alerts when important actions or inquiries take place'
      ],
      icon: 'Cpu'
    }
  ] as ServiceItem[],

  // Our Software Products (Prompt Section 5.3 & Section 8 Specification)
  products: [
    {
      id: 'sajinova-lab',
      name: 'Sajinova Lab',
      tagline: 'Laboratory Management Software for Diagnostic & Pathology Centers',
      slug: 'sajinova-lab',
      category: 'Healthcare & Clinical Diagnostics',
      description:
        'A laboratory management software product designed for diagnostic and pathology laboratory workflows.',
      targetAudience:
        'Clinical pathology laboratories, diagnostic testing centers, and medical practitioners seeking a reliable, offline-first reporting system.',
      keyFeatures: [
        '100% Offline-First Resilience — Full operational workflow runs reliably on local Windows workstations without requiring continuous internet connectivity.',
        'Patient & Doctor Management — Patient demographics, registration directory, and referring doctor profiles with commission / referral tracking.',
        'Clinical Test Catalog & Reference Rules — Configurable clinical parameters with age- and gender-specific reference intervals, including automatic HIGH, LOW, and CRITICAL flags.',
        'Professional Multi-Page PDF Reports — Automated diagnostic report generation featuring custom laboratory header, logo, pathologist digital signature, and tamper-evident SHA-256 audit hashes.',
        'Direct WhatsApp Sharing — Send diagnostic reports to patients and doctors with one click via WhatsApp, complete with pre-filled message templates.',
        'Hardware-Bound Security ("DB Lock") — Enterprise-grade encrypted local database bound to the authorized workstation to prevent unauthorized file copying or illicit data extraction.',
        'Hot SQLite Backups & Disaster Recovery — Non-blocking online database backups and automatic pre-restore safety snapshots to safeguard clinical history.',
        'Cryptographic Licensing — Secure offline activation keys supporting flexible subscription plans with permanent, tamper-proof data preservation.'
      ],
      specs: {
        platform: 'Windows Desktop Application (Windows 10 / 11)',
        offlineCapability: '100% Offline-First Resilience',
        database: 'Local Encrypted SQLite (17 Relational Tables)',
        security: 'Hardware-Bound Workstation Encryption',
        reporting: 'ReportLab Dynamic 2-Pass Multi-Page Clinical PDF Engine'
      },
      status: 'Commercial Release'
    }
  ] as ProductItem[],

  // Verified Projects / Software Showcase
  projects: [] as ProjectItem[],

  // How It Works (4 Steps - Prompt Section 5.4 Specification)
  processSteps: [
    {
      step: '01',
      title: 'Connect',
      description: 'Tell us about your idea, business challenge, or interest in our software products.'
    },
    {
      step: '02',
      title: 'Understand',
      description: 'We clarify your exact requirements, operational priorities, and project scope.'
    },
    {
      step: '03',
      title: 'Build or Demonstrate',
      description: 'We work on the agreed custom solution or arrange a comprehensive product demonstration.'
    },
    {
      step: '04',
      title: 'Deliver & Support',
      description: 'We hand over the tested solution and provide agreed documentation and support arrangements.'
    }
  ],

  // Why Sajid Innovations (Prompt Section 5.5 Specification)
  whyPrinciples: [
    {
      title: 'Solutions Shaped Around Actual Requirements',
      description: 'Every solution is designed to resolve genuine operational bottlenecks rather than adding unnecessary features or complexity.'
    },
    {
      title: 'Clear Communication About Scope & Progress',
      description: 'Transparent discussions from day one regarding deliverables, realistic timelines, technical boundaries, and ongoing milestones.'
    },
    {
      title: 'A Focus on Practical, Usable Technology',
      description: 'We build with proven, modern technologies that deliver dependable performance, intuitive usability, and straightforward maintenance.'
    },
    {
      title: 'Continuous Improvement & Thoughtful Implementation',
      description: 'We care deeply about software craftsmanship, rigorous verification, clean architectures, and long-term customer trust.'
    }
  ],

  // Verified FAQs (Prompt Section 5.7 Specification)
  faqs: [
    {
      question: 'What services does Sajid Innovations offer?',
      answer:
        'Sajid Innovations provides four core client services: Website Design & Development, Custom Software Development, AI Applications & Chatbots, and Business Automation. In addition, we develop in-house software products such as Sajinova Lab for diagnostic laboratories.'
    },
    {
      question: 'Can I request a custom website or software solution?',
      answer:
        'Yes. We build purpose-built websites, internal management dashboards, and web applications tailored to your specific business workflows. We begin by discussing your requirements and recommending a practical technical approach.'
    },
    {
      question: 'Does Sajid Innovations develop AI applications?',
      answer:
        'Yes. We build practical AI applications and conversational chatbots designed around specific business needs, such as 24/7 customer inquiry assistants and intelligent search tools for business documents and catalogs.'
    },
    {
      question: 'What is Sajinova Lab?',
      answer:
        'Sajinova Lab is our proprietary laboratory management software product engineered for clinical pathology and diagnostic laboratories. It provides 100% offline-first operation, patient and doctor records, clinical test catalogs, dynamic multi-page PDF report generation, WhatsApp report sharing, and hardware-locked database security.'
    },
    {
      question: 'Can I request a Sajinova Lab demonstration?',
      answer:
        'Yes. You can request a demonstration through our contact form or by reaching out directly on WhatsApp. We will arrange a walkthrough of the clinical workflows, test reporting features, and installation requirements.'
    },
    {
      question: 'How can I discuss a project?',
      answer:
        'You can start a conversation by submitting our project inquiry form on the Contact page, messaging directly on WhatsApp at +91 8329465339, or emailing contact@sajidinnovations.in with an outline of your requirements.'
    },
    {
      question: 'How are project scope and pricing determined?',
      answer:
        'Pricing and timelines are determined transparently based on your specific feature requirements, technical complexity, integrations, and delivery expectations. We discuss all parameters openly and agree on scope and milestones before work begins.'
    },
    {
      question: 'Will I receive the source code for custom projects?',
      answer:
        'For bespoke client software and websites, source-code ownership and handover arrangements are clearly defined and agreed upon in the project scope before development begins.'
    },
    {
      question: 'Do you provide post-delivery support?',
      answer:
        'Yes. We provide handover documentation and clearly scoped post-delivery support, maintenance, and feature updates as agreed for each individual engagement.'
    }
  ] as FAQItem[],

  // Service categories for inquiry form dropdown
  serviceCategories: [
    'Website Design & Development',
    'Custom Software Development',
    'AI Applications & Chatbots',
    'Business Automation',
    'Sajinova Lab Demo',
    'Other / Custom Requirement'
  ],

  // Indicative budget bands
  budgetOptions: [
    'Not decided yet',
    'Under ₹20,000',
    '₹20,000 – ₹50,000',
    '₹50,000 – ₹1,00,000',
    '₹1,00,000 – ₹2,50,000',
    'Above ₹2,50,000',
    'Prefer custom proposal'
  ],

  // Timeline preferences
  timelineOptions: [
    'As soon as possible',
    'Within 2–4 weeks',
    'Within 1–2 months',
    'Flexible',
    'Planning stage'
  ],

  // Helper for generating encoded WhatsApp links
  getWhatsAppUrl(customMessage?: string): string {
    const text = customMessage || "Hi Sajid! I visited Sajid Innovations and would like to discuss a project.";
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  getServiceWhatsAppUrl(serviceTitle: string): string {
    const text = `Hi Sajid! I visited Sajid Innovations and would like to discuss a project regarding ${serviceTitle}.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  getSajinovaLabWhatsAppUrl(): string {
    const text = "Hi Sajid! I am interested in Sajinova Lab for my diagnostic laboratory and would like to schedule a demonstration.";
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  getInquiryWhatsAppUrl(refId: string, projectTitle: string): string {
    const text = `Hi Sajid! I just submitted an inquiry on your website for "${projectTitle}". My reference ID is ${refId}.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
};
