import { FAQItem, ProjectItem, ServiceItem } from '../types/index.ts';

export const siteConfig = {
  // Brand & Founder
  brandName: 'Sajid Innovations',
  brandSubtitle: 'Software & AI Solutions',
  brandTagline: 'Built by Sajid Inamdar',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.png',
  centralMessage: "Have an Idea? Let's Build It.",
  founderName: 'Sajid Inamdar',
  professionalTitle: 'Full-Stack Software Developer & AI Solutions Builder | Websites, Apps & Business Tools',
  
  // Contact details
  primaryPhone: '+91 8329465339',
  alternativePhone: '+91 7798779332',
  email: 'inamdarsajid46@gmail.com',
  whatsappNumber: '918329465339',
  
  // Social links
  instagramUsername: '@sajidinamdar_',
  instagramUrl: 'https://www.instagram.com/sajidinamdar_/',
  githubUrl: 'https://github.com/sajidinamdar',
  // Configurable placeholder: leave empty string if not configured yet. The UI will hide the button if empty.
  linkedinUrl: '', 

  // Location & Timezone
  location: 'Maharashtra, India',
  timezone: 'IST (UTC+5:30)',

  // Bio and philosophy
  heroSubtitle: 'Turn your business ideas and daily bottlenecks into working websites, custom apps, smart AI tools, and automated systems.',
  heroParagraph: "I'm Sajid Inamdar. I help business owners, startup founders, and individuals turn ideas into fast, reliable digital products. You work directly with me—the engineer designing and building your software—without agency middlemen or confusing jargon.",
  aboutParagraphs: [
    "I'm Sajid Inamdar, a software developer dedicated to building practical, reliable digital tools for real-world businesses and founders.",
    "Whether you need a high-converting business website, a custom web app, an automated WhatsApp notification system, or a smart AI assistant that answers questions from your documents, I handle the complete build from start to finish.",
    "You work directly with the person who actually builds your software. That means fast communication, transparent updates, no confusing tech jargon, and solutions tailored to your exact budget and timeline.",
    "I believe every great product begins with a real problem worth solving and a commitment to build something clean, fast, and easy to use."
  ],

  // Technology Groups for About Section (Expressed as Plain Business Capabilities)
  techStackGroups: [
    {
      category: 'Web & Mobile Screens',
      skills: ['Modern Web Design', 'Mobile-Friendly Layouts', 'Fast Page Speeds', 'Intuitive Navigation', 'Interactive Dashboards']
    },
    {
      category: 'Behind-the-Scenes Engines',
      skills: ['Secure User Login', 'Automated Notifications', 'Database Connections', 'Payment & Form Processing', 'Fast & Reliable Servers']
    },
    {
      category: 'Smart AI & Chatbots',
      skills: ['24/7 AI Chat Assistants', 'Instant Document & PDF Search', 'Accurate Question Answering', 'Knowledge Base Search', 'Custom AI Workflows']
    },
    {
      category: 'Safe Data Storage',
      skills: ['Permanent Cloud Storage', 'Customer Records Vault', 'Automatic Data Backups', 'Strict Data Privacy', 'Fast Search Retrieval']
    },
    {
      category: 'Hosting, Launch & Support',
      skills: ['Cloud Launch & Domain Setup', 'Security & SSL Certificates', 'Source Code Ownership', 'Maintenance & Support', 'Direct Collaboration']
    }
  ],

  // 6 Core Solutions & Services
  services: [
    {
      id: 'web-development',
      title: 'Business Websites & Web Applications',
      slug: 'website-development',
      shortDescription: 'Modern, fast, and mobile-friendly websites designed to build trust and turn visitors into paying customers.',
      fullDescription: 'Custom, clean, and easy-to-use websites and web apps that look great on any phone or laptop, load in seconds, and make contacting you effortless.',
      capabilities: [
        'Company & Business Websites',
        'High-Converting Landing Pages',
        'Customer Portals & Booking Systems',
        'Mobile-First Responsive Design',
        'Google Search (SEO) & Speed Optimization'
      ],
      typicalProblems: [
        'Outdated or slow website losing customer inquiries',
        'Need for a credible, professional online presence for a new business',
        'Desire to give clients a smooth online booking or inquiry experience'
      ],
      icon: 'Globe'
    },
    {
      id: 'python-backend',
      title: 'App Engines & System Connections',
      slug: 'python-backend',
      shortDescription: 'The engine that powers your software: user accounts, automatic calculations, notifications, and payment processing.',
      fullDescription: 'Reliable, secure behind-the-scenes systems that process your business operations, protect user data, and link your app to WhatsApp, SMS, or payments.',
      capabilities: [
        'Secure User Login & Account Systems',
        'WhatsApp, SMS & Email Notifications',
        'Payment Gateway & Online Form Processing',
        'Automatic Calculations & File Generation',
        'High-Speed Performance That Never Slows Down'
      ],
      typicalProblems: [
        'Your website or app needs a safe way to store records and process user actions',
        'Manual paperwork and disconnected tools needing a central engine',
        'Need to link your system directly to WhatsApp, email alerts, or payments'
      ],
      icon: 'Server'
    },
    {
      id: 'ai-genai-rag',
      title: 'Smart AI Assistants & Document Search',
      slug: 'ai-genai-rag',
      shortDescription: '24/7 digital assistants that read your PDFs, catalogs, or notes and answer customer or team questions accurately.',
      fullDescription: 'Custom artificial intelligence tools that act like an expert team member available around the clock. They answer questions directly from your company files with zero guesswork.',
      capabilities: [
        'Instant PDF & Document Question-Answering',
        '24/7 Smart Customer Support Chatbots',
        'Shows Exact Document Pages for Every Answer',
        'Private & Confidential Company Knowledge Search',
        'Automated Summary & Email Reply Drafting'
      ],
      typicalProblems: [
        'Staff spending hours searching through 500-page PDFs, manuals, or contracts',
        'Support team overwhelmed answering the same repetitive customer questions',
        'Desire to add smart, time-saving AI features into your business'
      ],
      icon: 'Bot'
    },
    {
      id: 'business-automation',
      title: 'Daily Business & Workflow Automation',
      slug: 'business-automation',
      shortDescription: 'Eliminate repetitive manual tasks. Automatically capture new leads, send WhatsApp alerts, and update records.',
      fullDescription: 'Automated helpers that work in the background 24/7 so you never have to waste hours copy-pasting data between spreadsheets and systems.',
      capabilities: [
        'Instant WhatsApp & Email Inbound Lead Alerts',
        'Automated Customer Reminders & Follow-Ups',
        'Elimination of Manual Copy-Paste Entry',
        'Connecting Your Disconnected Business Tools',
        'Automated Daily Business Summaries'
      ],
      typicalProblems: [
        'Missing customer inquiries because nobody checked the email inbox in time',
        'Staff wasting hours copy-pasting numbers across different spreadsheets',
        'Delayed customer follow-ups causing lost sales deals'
      ],
      icon: 'Cpu'
    },
    {
      id: 'startup-mvp',
      title: 'New Idea & Startup Prototypes (MVP)',
      slug: 'startup-mvp',
      shortDescription: 'Have a new business idea? Turn your concept into a working, clickable digital product to show customers and investors.',
      fullDescription: 'Fast, focused development centered on your core features. Get a real, working app into the hands of real users in weeks rather than months of delay.',
      capabilities: [
        'Clarifying Your Core Idea & User Flow',
        'Rapid Working Prototype Development',
        'Simple User Signup & Feedback Collection',
        'Fast Revisions Based on Real Feedback',
        'Investor & Partner-Ready Demonstrations'
      ],
      typicalProblems: [
        'Founders stuck in the "idea phase" with no working demo to show people',
        'Agencies quoting huge budgets or 6-month delays for early-stage ideas',
        'Need to test whether real customers will pay for an idea before spending big'
      ],
      icon: 'Rocket'
    },
    {
      id: 'custom-software',
      title: 'Custom Management Portals & Tools',
      slug: 'custom-software',
      shortDescription: 'Tailored administrative dashboards and management tools built around your exact daily business operations.',
      fullDescription: 'Say goodbye to messy spreadsheets and expensive off-the-shelf software with features you never use. Get a clean, custom portal built for your exact workflow.',
      capabilities: [
        'Custom Admin Dashboards & Team Portals',
        'Customer Lead & Inquiry Tracking Systems',
        'Task & Project Milestone Trackers',
        '1-Click Export to Excel & PDF Reports',
        'Private, Easy-to-Use Team Workspaces'
      ],
      typicalProblems: [
        "Existing software is too expensive, complicated, or doesn't fit your business",
        'Scattered spreadsheets leading to lost records, errors, and confusion',
        'Need for a single screen to see everything happening in your business'
      ],
      icon: 'Wrench'
    }
  ] as ServiceItem[],

  // Real Projects & Solutions Built (User's Genuine Projects Explained in Plain Business Language)
  projects: [
    {
      id: 'caterserv-hotel-catering',
      name: 'CaterServ: Hotel & Catering Booking Platform',
      category: 'Web Development',
      status: 'Completed',
      shortDescription: 'A modern, elegant website designed for hotels, restaurants, and catering businesses to showcase menus, banquet halls, and receive online bookings.',
      problemStatement: 'Hotel and catering businesses frequently lose high-value party and wedding orders because potential clients cannot browse event packages or get fast quotes on their phones.',
      solution: 'Developed an appetizing, responsive web platform featuring interactive catering packages, full banquet menu displays, online booking forms, and 1-click WhatsApp customer inquiries.',
      techStack: ['Online Menu Showcase', 'Event Reservation Forms', 'Mobile-Friendly Design', 'Instant WhatsApp Alerts'],
      features: [
        'Interactive food menu and event catering package showcase',
        'Direct online booking and guest estimate inquiry form',
        'Mobile-first responsive design that loads fast on all smartphones',
        '1-click WhatsApp button for instant custom quotation chats'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'harit-setu-farmer-platform',
      name: 'Harit Setu: Digital Platform for Farmers',
      category: 'Web Development',
      status: 'Completed',
      shortDescription: 'A simple agricultural portal connecting farmers directly with daily market crop prices, weather alerts, and farming guidance.',
      problemStatement: 'Rural farmers often face unfair middleman pricing, sudden crop losses due to unannounced weather changes, and difficulty finding trusted guidance for crop diseases.',
      solution: 'Built "Harit Setu" (Green Bridge)—a clear, high-contrast, local-language portal that enables farmers to check daily mandi crop rates, view weather advisories, and get direct farming support without technical complexity.',
      techStack: ['Farmer-Friendly Portal', 'Daily Mandi Crop Rates', 'Regional Language Support', 'Weather Advisories'],
      features: [
        'High-legibility interface designed specifically for rural smartphone users',
        'Daily agricultural market rates and fair crop pricing updates',
        'Crop disease troubleshooting and seasonal farming advisories',
        'Direct helpline and WhatsApp support integration'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'ai-email-sender-automator',
      name: 'AI Smart Email Writer & Automated Dispatcher',
      category: 'Automation',
      status: 'Completed',
      shortDescription: 'An intelligent AI assistant that automatically writes professional, personalized business emails and dispatches them with one click.',
      problemStatement: 'Business owners and sales executives waste 2 to 3 hours every single day writing repetitive outreach emails, customer follow-ups, and proposal letters from scratch.',
      solution: 'Created an automated email assistant that turns brief bullet points into polite, persuasive business emails in seconds, tailored to the customer and sent with one click.',
      techStack: ['Smart AI Email Writer', '1-Click Dispatch', 'Time-Saving Automation', 'Personalized Templates'],
      features: [
        'Generates polite, professional business emails in under 5 seconds',
        'Automatically adjusts tone for proposals, follow-ups, or inquiries',
        'One-click sending integration with zero manual copy-pasting',
        'Saves teams 15+ hours of repetitive typing every week'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'baap-teams-workspace',
      name: 'Baap Teams: Organization Workspace & Collaboration Hub',
      category: 'Backend',
      status: 'In Development',
      shortDescription: 'A streamlined team communication and task management workspace for companies to coordinate projects, deadlines, and daily logs.',
      problemStatement: 'Teams managing projects through scattered WhatsApp groups constantly lose important files, miss deadlines, and struggle to see what tasks coworkers are completing.',
      solution: 'Engineered a centralized team workspace with dedicated project channels, task assignment boards, daily check-in logs, and secure employee accounts.',
      techStack: ['Team Workspace', 'Task & Deadline Tracking', 'Secure Employee Logins', 'Project Activity Feeds'],
      features: [
        'Dedicated project channels to keep conversations neatly organized',
        'Task assignments with deadlines, priority levels, and progress tracking',
        'Clean daily team check-in and activity dashboard for managers',
        'Secure password logins and role-based permissions for staff'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'file-url-shortener',
      name: 'QuickShare: Secure File & Short Link Platform',
      category: 'Automation',
      status: 'Completed',
      shortDescription: 'A fast, secure tool to upload documents or files, generate clean short links, and share them effortlessly with clients over WhatsApp or SMS.',
      problemStatement: 'Sending heavy file attachments over email often fails or bounces, while long, messy cloud links look unprofessional and break in chat messages.',
      solution: 'Developed a lightweight file and link sharing tool that uploads documents in seconds, creates short branded links, tracks click counts, and offers password protection.',
      techStack: ['Instant File Uploads', 'Short Branded Links', 'Click Tracking', 'Password-Protected Links'],
      features: [
        'Fast drag-and-drop file upload with instant short link generation',
        'Clean, compact links perfect for sharing over WhatsApp and SMS',
        'Download analytics to see when and how many times files were opened',
        'Optional password protection and expiration dates on sensitive files'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    },
    {
      id: 'python-business-chatbot',
      name: 'Python 24/7 Smart Business Chatbot',
      category: 'AI Applications',
      status: 'Completed',
      shortDescription: 'An automated 24/7 customer assistant that greets website visitors, answers questions about your services or prices, and captures lead contact info.',
      problemStatement: 'Visitors who land on websites outside business hours often leave immediately without buying if they cannot get quick answers to basic questions.',
      solution: 'Created an intelligent automated chatbot that operates 24/7, understands natural customer inquiries, provides instant helpful answers, and collects phone numbers for follow-up.',
      techStack: ['24/7 Customer Chatbot', 'Lead Contact Capture', 'Instant Answers', 'Mobile-Friendly Widget'],
      features: [
        'Greets visitors and answers questions about prices, timing, and services',
        'Captures visitor name and phone number for the sales team',
        'Instantly alerts the business owner via WhatsApp when a new lead is captured',
        'Lightweight chat bubble that loads smoothly on all phone screens'
      ],
      githubUrl: 'https://github.com/sajidinamdar'
    }
  ] as ProjectItem[],

  // 5 Step Process
  processSteps: [
    {
      step: '01',
      title: 'Share Your Idea or Problem',
      description: 'Tell me about your business challenge, startup idea, or what you want to automate—either through the form or directly on WhatsApp.'
    },
    {
      step: '02',
      title: 'Friendly Discussion & Feasibility',
      description: 'We connect directly on your preferred channel (WhatsApp, phone, or email) to explore practical ways to build it and ensure it fits your needs.'
    },
    {
      step: '03',
      title: 'Clear Scope, Timeline & Price',
      description: 'You receive a clear breakdown of what will be built, realistic delivery dates, and an itemized cost. No hidden fees or confusing jargon.'
    },
    {
      step: '04',
      title: 'Building & Regular Working Demos',
      description: 'Your solution is built in phases. You receive regular progress updates and test links to try out features as they are completed.'
    },
    {
      step: '05',
      title: 'Testing, Launch & Handover',
      description: 'We test everything thoroughly, launch your site or tool live on the web, and provide simple instructions for day-to-day use.'
    }
  ],

  // Frequently Asked Questions (Clear English, zero technical jargon, short and easy to understand)
  faqs: [
    {
      question: 'What types of projects can I discuss with you?',
      answer: 'You can discuss any business website, booking platform, online store, custom web app, automated email or file system, or smart AI chatbot. Whether you have a complete plan or just an idea, we can discuss how to build it.'
    },
    {
      question: 'Will my website work on mobile phones, tablets, and desktops?',
      answer: 'Yes, 100%. Every website and application I build automatically adjusts to look great and work smoothly on all screen sizes, including phones, tablets, laptops, and desktop computers.'
    },
    {
      question: 'I am not a technical person. Can you help me understand what I need?',
      answer: 'Absolutely! You do not need any technical knowledge. You just describe your business problem or goal, and I will recommend the right solution and handle all the design and coding for you in simple, plain terms.'
    },
    {
      question: 'Do you build both the frontend and backend of an application?',
      answer: 'Yes. I handle everything end-to-end—from the visible screens and buttons your customers interact with, to the behind-the-scenes systems that manage user accounts, databases, and secure payments.'
    },
    {
      question: 'How does the project discussion process work?',
      answer: 'After you reach out, I review your idea and message you directly on WhatsApp or email. We then have a friendly, no-pressure chat or quick call to clarify your goals and map out a simple plan before starting.'
    },
    {
      question: 'How is the project budget and pricing decided?',
      answer: 'Pricing is transparent and based strictly on the features you need, without hidden fees or expensive agency markups. We agree on a clear, fixed quote before starting any work.'
    },
    {
      question: 'How long does a typical project take to build?',
      answer: 'A standard business website usually takes 1 to 2 weeks, while custom applications, booking platforms, or smart AI tools typically take 3 to 5 weeks depending on the features.'
    },
    {
      question: 'Can you update or fix an existing website or application?',
      answer: 'Yes. If you already have a website that needs bug fixes, new features, speed improvements, or a fresh modern look, I can review and upgrade it for you.'
    },
    {
      question: 'How do you protect my business data and project information?',
      answer: 'Your data and project ideas are kept strictly confidential. I follow industry standard security practices, use encrypted connections, and never share your business details or ideas with anyone.'
    },
    {
      question: 'Do you provide hosting, domain setup, deployment, and maintenance?',
      answer: 'Yes. I handle the entire launch process—connecting your custom domain, setting up secure hosting, making the website live, and providing ongoing support and maintenance whenever needed.'
    },
    {
      question: 'What happens after I submit an inquiry through your website?',
      answer: 'You receive an instant confirmation on screen with a unique inquiry ID, a copy is sent to your email, and I will personally reach out to you within a few hours to discuss next steps.'
    }
  ] as FAQItem[],

  // Service options for form dropdown (Plain English)
  serviceCategories: [
    'Business Website or Landing Page',
    'Web Application / Client Portal',
    'Custom App Engine & User Accounts',
    'Smart AI Chatbot & Customer Support',
    'Smart Document Search (PDF Q&A Assistant)',
    'Business Process & WhatsApp Automation',
    'New Startup Idea / Prototype (MVP)',
    'Custom Business Management Dashboard',
    'General Question or Other'
  ],

  // Indicative budget bands
  budgetOptions: [
    'Not decided yet',
    'Under ₹10,000',
    '₹10,000 – ₹25,000',
    '₹25,000 – ₹50,000',
    '₹50,000 – ₹1,00,000',
    'Above ₹1,00,000',
    'Prefer to discuss custom budget'
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
    const text = customMessage || "Hi Sajid! I visited your portfolio and would like to discuss a project idea.";
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  getServiceWhatsAppUrl(serviceTitle: string): string {
    const text = `Hi Sajid! I visited your portfolio and would like to discuss a project regarding ${serviceTitle}.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  getInquiryWhatsAppUrl(refId: string, projectTitle: string): string {
    const text = `Hi Sajid! I just submitted an idea on your website for "${projectTitle}". My reference ID is ${refId}.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
};
