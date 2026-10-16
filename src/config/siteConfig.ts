import { FAQItem, ProjectItem, ServiceItem } from '../types/index.ts';

export const siteConfig = {
  // Brand & Founder
  brandName: 'Sajid Innovations',
  brandPositioning: 'Custom Software Development & AI Solutions',
  brandSubtitle: 'Custom Software Development & AI Solutions',
  brandTagline: "Have a Problem? Let's Build the Solution.",
  centralMessage: "Have a Business Idea? Let's Build It.",
  brandDescription:
    'Sajid Innovations is a software development brand focused on building custom websites, web applications, AI-powered tools, business automation systems, and digital products based on individual requirements. We aim to turn ideas and real-world problems into practical, reliable, and user-friendly software solutions.',
  founderName: 'Sajid Inamdar',
  founderRole: 'Founder & Software Developer',
  professionalTitle: 'Software Developer & AI Solutions Builder | Websites, Apps & Business Tools',
  
  // Contact details
  primaryPhone: '+91 8329465339',
  alternativePhone: '+91 7798779332',
  email: 'inamdarsajid46@gmail.com',
  whatsappNumber: '918329465339',
  
  // Social links
  instagramUsername: '@sajidinamdar_',
  instagramUrl: 'https://www.instagram.com/sajidinamdar_/',
  githubUrl: 'https://github.com/sajidinamdar',
  linkedinUrl: '', 

  // Location & Timezone
  location: 'Maharashtra, India',
  timezone: 'IST (UTC+5:30)',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.png',

  // Hero Section Copy
  heroTitle: "Have a Business Idea? Let's Build It.",
  heroSubtitle:
    'Sajid Innovations builds custom websites, web applications, business software, AI-powered tools, and automation systems tailored to your requirements.',
  heroParagraph:
    "Whether you need a website for your business, a custom management system, an AI chatbot, or a software product built from scratch, let's discuss your requirements and find the right solution.",
  heroSupportingText:
    'Direct communication with the developer, clear project requirements, transparent pricing, and solutions designed around your needs.',

  // About Section Copy
  aboutHeading: 'About Sajid Innovations',
  aboutParagraphs: [
    "I'm Sajid Inamdar, a software developer passionate about turning ideas and business problems into practical digital solutions.",
    'Through Sajid Innovations, I aim to build websites, custom software, AI applications, automation tools, and digital products that help businesses and individuals solve real-world problems.',
    'My approach focuses on understanding requirements, choosing suitable technologies, building user-friendly applications, and delivering solutions with clear communication throughout the development process.',
    'Sajid Innovations is at the beginning of its journey, with a focus on developing practical projects, improving technical capabilities, and building long-term relationships with customers.'
  ],

  // Technology Groups for About Section
  techStackGroups: [
    {
      category: 'Web & Mobile Screens',
      skills: ['Modern Web Design', 'Mobile-Friendly Layouts', 'Fast Page Speeds', 'Intuitive Navigation', 'Interactive Dashboards']
    },
    {
      category: 'Behind-the-Scenes Engines',
      skills: ['Secure User Login', 'Automated Notifications', 'Database Connections', 'Payment & Form Processing', 'Fast & Reliable APIs']
    },
    {
      category: 'Smart AI & Chatbots',
      skills: ['AI Chat Assistants', 'Document & PDF Search', 'Retrieval-Augmented Generation (RAG)', 'Knowledge Base Search', 'Custom AI Workflows']
    },
    {
      category: 'Data Storage & Integrations',
      skills: ['Cloud Databases', 'Customer Records Vault', 'Automatic Data Backups', 'Strict Data Privacy', 'Third-Party Tool Connections']
    },
    {
      category: 'Hosting, Launch & Support',
      skills: ['Domain & Cloud Setup', 'Security & SSL Certificates', 'Source Code Handover', 'Bug Fixes & Maintenance', 'Direct Developer Collaboration']
    }
  ],

  // 6 Services (What Can I Build for You?)
  services: [
    {
      id: 'website-development',
      title: 'Website Development',
      slug: 'website-development',
      shortDescription: 'Custom, fast, and responsive websites designed to present your business clearly and turn visitors into inquiries.',
      fullDescription: 'Custom website development designed to match your brand, load quickly, and function seamlessly across phones, tablets, and computers.',
      capabilities: [
        'Business and company websites',
        'Landing pages and portfolio websites',
        'Booking and inquiry websites',
        'E-commerce websites',
        'Responsive and mobile-friendly interfaces'
      ],
      typicalProblems: [
        'Needing a clean, professional online presence for a new or established business',
        'Existing website is slow, outdated, or hard to use on mobile phones',
        'Wanting to collect customer inquiries or bookings directly online'
      ],
      icon: 'Globe'
    },
    {
      id: 'custom-software-development',
      title: 'Custom Software Development',
      slug: 'custom-software-development',
      shortDescription: 'Tailored management systems, administrative dashboards, and database applications built for your specific workflow.',
      fullDescription: 'Reliable custom software that manages operations, stores records securely, and provides clear admin dashboards tailored to your daily tasks.',
      capabilities: [
        'Business management systems',
        'Admin dashboards and portals',
        'Database-driven applications',
        'Customer and employee management systems',
        'Custom web applications and APIs'
      ],
      typicalProblems: [
        'Spreadsheets and manual processes causing errors and lost records',
        'Off-the-shelf software is overly complex, rigid, or too expensive',
        'Need for a secure, central portal where team members can manage data'
      ],
      icon: 'Server'
    },
    {
      id: 'ai-llm-solutions',
      title: 'AI & LLM Solutions',
      slug: 'ai-llm-solutions',
      shortDescription: 'Intelligent AI chatbots, document Q&A tools, and search workflows to help teams and customers get instant answers.',
      fullDescription: 'Practical artificial intelligence tools that answer questions from your company documents, assist customers around the clock, and speed up research.',
      capabilities: [
        'AI chatbots and virtual assistants',
        'Document and PDF question-answering systems',
        'Retrieval-Augmented Generation (RAG) applications',
        'AI-powered search tools',
        'Custom AI workflows and agents'
      ],
      typicalProblems: [
        'Staff spending excessive time searching through lengthy manuals, PDFs, or contracts',
        'Repetitive customer inquiries taking up valuable team hours',
        'Desire to implement smart, helpful AI capabilities into business workflows'
      ],
      icon: 'Bot'
    },
    {
      id: 'business-automation',
      title: 'Business Automation',
      slug: 'business-automation',
      shortDescription: 'Automated email alerts, follow-up workflows, and data processing that save hours of manual repetitive effort.',
      fullDescription: 'Streamlined automations that connect your tools, dispatch instant notifications, and run repetitive routines automatically behind the scenes.',
      capabilities: [
        'Automated email and notification systems',
        'Customer follow-up workflows',
        'Lead management automation',
        'Data processing and report generation',
        'Integrations between business tools'
      ],
      typicalProblems: [
        'Inbound customer inquiries missed due to delayed manual email checks',
        'Time wasted manually re-entering data across different systems',
        'Lack of automated customer follow-ups and notifications'
      ],
      icon: 'Cpu'
    },
    {
      id: 'startup-mvp-prototype',
      title: 'Startup MVP & Prototype Development',
      slug: 'startup-mvp-prototype',
      shortDescription: 'Transform concepts into working prototypes and minimum viable products to test with users and stakeholders.',
      fullDescription: 'Fast, focused development centered on the essential features your product needs so you can demonstrate it, gather real feedback, and iterate quickly.',
      capabilities: [
        'Turning ideas into working prototypes',
        'Building minimum viable products (MVPs)',
        'Developing essential application features',
        'Creating demonstration products',
        'Improving products through feedback'
      ],
      typicalProblems: [
        'Stuck in the idea phase with no tangible demo to present to partners or customers',
        'Large agency quotes and extended timelines for early-stage validation',
        'Need to build core features first without unnecessary complications'
      ],
      icon: 'Rocket'
    },
    {
      id: 'existing-software-support',
      title: 'Existing Software & Technical Support',
      slug: 'existing-software-support',
      shortDescription: 'Website fixes, feature updates, hosting and domain setup, performance tuning, and scoped technical maintenance.',
      fullDescription: 'Hands-on technical support to keep your digital tools running smoothly, resolve bugs, introduce new features, and handle deployment.',
      capabilities: [
        'Website improvements and bug fixes',
        'Feature additions and integrations',
        'Deployment and hosting setup',
        'Performance improvements',
        'Maintenance based on an agreed scope'
      ],
      typicalProblems: [
        'Existing site or app has bugs, broken forms, or performance slowdowns',
        'Need assistance setting up domains, cloud hosting, and secure SSL',
        'Requiring ongoing technical support on a clear, agreed-upon scope'
      ],
      icon: 'Wrench'
    }
  ] as ServiceItem[],

  // Personal Projects & Demonstrations
  projects: [
    {
      id: 'caterserv-hotel-catering',
      name: 'CaterServ — Hotel & Catering Booking Platform',
      category: 'Web Development',
      status: 'Working Demo',
      shortDescription: 'A website concept for hotel and catering businesses to present services, display packages, and collect booking inquiries.',
      problemStatement: 'Hotel and catering businesses frequently lose bookings when potential customers cannot easily browse event packages or submit inquiries on mobile phones.',
      solution: 'Developed a clean, responsive booking platform concept showcasing event menus, banquet packages, and direct reservation inquiries.',
      techStack: ['Event Booking Concept', 'Package Showcase', 'Responsive UI', 'WhatsApp Link'],
      features: [
        'Interactive food menu and event catering package showcase',
        'Direct online booking and guest estimate inquiry form',
        'Mobile-first responsive design that loads quickly on all smartphones',
        'Direct WhatsApp contact option for custom quotation inquiries'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'harit-setu-farmer-platform',
      name: 'Harit Setu — Digital Platform for Farmers',
      category: 'Web Development',
      status: 'Prototype',
      shortDescription: 'An agricultural platform concept designed to help farmers access crop prices, weather information, and farming guidance.',
      problemStatement: 'Farmers often face challenges accessing daily market crop rates, timely weather updates, and practical guidance for crop health.',
      solution: 'Built a digital platform prototype featuring high-contrast readability, daily market rate information, and accessible farming advisories.',
      techStack: ['Agricultural Platform', 'Daily Mandi Rates', 'Weather Advisories', 'Accessible Design'],
      features: [
        'High-legibility interface designed for rural and mobile users',
        'Daily agricultural market rates and fair crop pricing updates',
        'Crop health troubleshooting and seasonal farming advisories',
        'Direct helpline and WhatsApp support integration'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'ai-smart-email-writer',
      name: 'AI Smart Email Writer',
      category: 'Automation',
      status: 'Working Demo',
      shortDescription: 'An AI-powered tool concept for generating professional emails and supporting email workflows.',
      problemStatement: 'Drafting repetitive business proposals, customer follow-ups, and professional replies manually consumes hours of work each week.',
      solution: 'Created an intelligent assistant concept that transforms brief notes into polished, tailored business emails ready for dispatch.',
      techStack: ['AI Email Drafting', 'Tone Customization', 'Workflow Automation', 'Template Generation'],
      features: [
        'Rapid business email generation from brief bullet points',
        'Custom tone adjustments for proposals, inquiries, and follow-ups',
        'Time-saving templates for common business communication',
        'Integrated email workflow demonstration'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'baap-teams-collaboration',
      name: 'BAAP Teams — Collaboration Platform',
      category: 'Backend',
      status: 'In Development',
      shortDescription: 'A team collaboration application involving communication, task management, and project coordination.',
      problemStatement: 'Teams managing projects across scattered chat groups struggle to track task ownership, deadlines, and project status.',
      solution: 'Engineering a centralized team collaboration application with structured communication channels, task tracking boards, and activity logs.',
      techStack: ['Team Workspace', 'Task Coordination', 'Project Tracking', 'User Authentication'],
      features: [
        'Project communication channels to keep conversations organized',
        'Task assignments with deadlines, priority levels, and progress tracking',
        'Team activity overview and daily progress tracking',
        'Secure user authentication and workspace roles'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'quickshare-file-link-sharing',
      name: 'QuickShare — File & Link Sharing Tool',
      category: 'Automation',
      status: 'Prototype',
      shortDescription: 'A tool concept for uploading files and sharing links with useful access and sharing features.',
      problemStatement: 'Sending large file attachments over email often fails, while long, messy cloud links look unprofessional in quick messages.',
      solution: 'Developed a streamlined file upload and link shortening tool prototype allowing fast uploads, compact links, and access controls.',
      techStack: ['File Uploads', 'Link Shortening', 'Access Control', 'Download Management'],
      features: [
        'Fast file upload with clean, compact link generation',
        'Easy sharing formatted for WhatsApp, email, and messaging',
        'Download access options and simple link management',
        'Lightweight, responsive interface'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'python-business-chatbot',
      name: 'Python Business Chatbot',
      category: 'AI Applications',
      status: 'Working Demo',
      shortDescription: 'A chatbot demonstration designed to answer common business questions and support customer inquiries.',
      problemStatement: 'Visitors landing on websites outside regular hours often leave if they cannot get quick answers to basic service or pricing questions.',
      solution: 'Built an automated chatbot demonstration that answers frequent customer questions and gathers contact details for follow-up.',
      techStack: ['Customer Inquiries', 'Automated Answers', 'Lead Capture', '24/7 Availability'],
      features: [
        'Answers common questions about services, pricing, and timing',
        'Captures visitor contact details for team follow-up',
        'Lightweight widget designed to operate smoothly on all screen sizes',
        'Direct inquiry notification trigger'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    }
  ] as ProjectItem[],

  // Development Process (From Idea to Working Solution)
  processSteps: [
    {
      step: '01',
      title: 'Share Your Requirements',
      description: 'Explain your idea, business problem, required features, and expected outcome.'
    },
    {
      step: '02',
      title: 'Discuss the Solution',
      description: 'Review the requirements and identify a practical technical approach.'
    },
    {
      step: '03',
      title: 'Receive a Proposal',
      description: 'Agree on project scope, deliverables, estimated timeline, price, and payment milestones before development starts.'
    },
    {
      step: '04',
      title: 'Development & Testing',
      description: 'Build the agreed features, test the application, and provide progress updates according to the project plan.'
    },
    {
      step: '05',
      title: 'Deployment & Handover',
      description: 'Deploy the solution when applicable, provide the agreed source code and documentation, and discuss any ongoing support requirements.'
    }
  ],

  // Trust & Transparency Principles
  trustPrinciples: [
    {
      title: 'Direct Communication',
      description: 'Discuss your requirements directly with Sajid.'
    },
    {
      title: 'Clear Project Scope',
      description: 'Understand the agreed features, deliverables, and limitations before development begins.'
    },
    {
      title: 'Transparent Pricing',
      description: 'Receive a proposal based on your project requirements.'
    },
    {
      title: 'Progress Updates',
      description: 'Stay informed about development progress as agreed.'
    },
    {
      title: 'Practical Development',
      description: 'Focus on the features your project actually needs.'
    },
    {
      title: 'Defined Handover',
      description: 'Agree on deployment, documentation, source code, and support arrangements before starting.'
    }
  ],

  // 9 Concise, Honest FAQs
  faqs: [
    {
      question: 'What types of projects can you build?',
      answer: 'I work on business websites, custom web applications, management systems, AI chatbots, automation tools, and software prototypes. The solution depends on your requirements.'
    },
    {
      question: 'Do you accept projects based on new ideas?',
      answer: 'Yes. You can share an idea even if you do not have a complete technical plan. We can discuss the requirements, features, and a practical development approach.'
    },
    {
      question: 'Have you worked with clients before?',
      answer: 'Sajid Innovations is a new brand, and its current portfolio focuses on personal projects and software demonstrations. You can review the available work to understand my approach and technical capabilities.'
    },
    {
      question: 'How much does a project cost?',
      answer: 'Pricing depends on the scope, features, integrations, complexity, and delivery requirements. I provide a proposal after understanding the project.'
    },
    {
      question: 'How long does development take?',
      answer: 'The timeline depends on the project scope and complexity. An estimated schedule will be discussed before development begins.'
    },
    {
      question: 'Can you build both frontend and backend systems?',
      answer: 'Yes, depending on the project requirements, I can work on user interfaces, backend APIs, databases, integrations, and deployment.'
    },
    {
      question: 'Will I receive the source code?',
      answer: 'Source-code ownership and handover terms will be agreed upon before development begins, including any applicable third-party licences.'
    },
    {
      question: 'Do you provide maintenance?',
      answer: 'Maintenance, updates, bug fixes, and technical support can be discussed as part of the project or a separate agreement.'
    },
    {
      question: 'How can I start a project?',
      answer: 'Use the project inquiry form or contact me directly. Share your idea, expected features, estimated budget, and preferred timeline.'
    }
  ] as FAQItem[],

  // Service options for inquiry form dropdown
  serviceCategories: [
    'Website Development',
    'Custom Software Development',
    'AI & LLM Solutions',
    'Business Automation',
    'Startup MVP & Prototype Development',
    'Existing Software & Technical Support',
    'Other / Custom Requirement'
  ],

  // Indicative budget bands
  budgetOptions: [
    'Not decided yet',
    'Under ₹15,000',
    '₹15,000 – ₹35,000',
    '₹35,000 – ₹75,000',
    '₹75,000 – ₹1,50,000',
    'Above ₹1,50,000',
    'Prefer to discuss custom proposal'
  ],

  // Timeline preferences
  timelineOptions: [
    'As soon as possible',
    'Within 2–4 weeks',
    'Within 1–2 months',
    'Flexible',
    'Not decided yet'
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

  getInquiryWhatsAppUrl(refId: string, projectTitle: string): string {
    const text = `Hi Sajid! I just submitted an inquiry on your website for "${projectTitle}". My reference ID is ${refId}.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
};
