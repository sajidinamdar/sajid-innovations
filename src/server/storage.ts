import { AdminStats, InquiryStatus, ProjectInquiry } from '../types/index.ts';

// In-memory + persistent store helper
export class InquiryStore {
  private inquiries: ProjectInquiry[] = [];
  private static instance: InquiryStore;

  private constructor() {
    this.seedInitialData();
  }

  public static getInstance(): InquiryStore {
    if (!InquiryStore.instance) {
      InquiryStore.instance = new InquiryStore();
    }
    return InquiryStore.instance;
  }

  private seedInitialData() {
    this.inquiries = [
      {
        id: 'inq-seed-1',
        ref_id: 'SI-2026-849201',
        name: 'Arjun Mehta',
        email: 'arjun.mehta@fintechlabs.io',
        phone: '+91 9820123456',
        company: 'FinTech Labs India',
        title: 'Enterprise Document AI & Compliance Q&A System',
        service_category: 'RAG Application (Document Intelligence)',
        problem_description: 'Our compliance analysts spend 15+ hours a week searching through 500-page regulatory PDFs and SEBI circulars to answer audit questions. We need an accurate semantic search and question-answering tool that provides exact page citations and never hallucinates.',
        target_users: '12 internal compliance officers and legal analysts',
        desired_solution: 'A private RAG pipeline using LangChain, vector database, and local or cloud LLM with role-based access.',
        requested_features: 'PDF upload, semantic vector search, source page citation highlighting, export audit answer to PDF',
        budget_range: '₹50,000 – ₹1,00,000',
        timeline: 'Within 2–4 weeks',
        preferred_contact: 'whatsapp',
        additional_details: 'Data privacy is strict; documents cannot be shared outside our private AWS account.',
        consent: true,
        status: 'new',
        internal_notes: 'Promising lead. Need to discuss vector database hosting choices (Chroma vs PGVector). Schedule a call on WhatsApp.',
        follow_up_date: '2026-10-18',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'inq-seed-2',
        ref_id: 'SI-2026-391048',
        name: 'Rohan Deshmukh',
        email: 'rohan@swiftlogix.in',
        phone: '+91 9765432109',
        company: 'SwiftLogix Delivery',
        title: 'FastAPI Backend & Dispatch Route API',
        service_category: 'Python Backend / API Development',
        problem_description: 'Our logistics mobile app has outgrown its legacy PHP backend. We need a high-performance Python FastAPI service with asynchronous database handling to calculate delivery time slots, handle rider assignments, and process webhook events from tracking devices.',
        target_users: 'Fleet dispatch managers and 50+ delivery drivers',
        desired_solution: 'FastAPI REST architecture with PostgreSQL, Alembic migrations, JWT tokens, and Redis cache.',
        requested_features: 'Asynchronous SQLAlchemy, route optimization endpoint, rider status socket/polling, automated unit tests',
        budget_range: '₹25,000 – ₹50,000',
        timeline: 'Within 1–2 months',
        preferred_contact: 'email',
        consent: true,
        status: 'contacted',
        internal_notes: 'Sent initial discovery email and asked for their current API swagger documentation.',
        follow_up_date: '2026-10-19',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 20).toISOString()
      },
      {
        id: 'inq-seed-3',
        ref_id: 'SI-2026-772184',
        name: 'Pooja Sharma',
        email: 'pooja.sharma@healthfirst.org',
        phone: '+91 8888776655',
        company: 'HealthFirst Clinic',
        title: 'Patient Appointment Booking & WhatsApp Automation',
        service_category: 'Startup MVP Development',
        problem_description: 'Our clinic reception gets overwhelmed with phone calls for booking doctor consultations. We want a simple patient portal that lets patients choose a doctor, pick a slot, and automatically receive a WhatsApp confirmation with a clinic location map and calendar link.',
        target_users: 'Clinic patients and front-desk reception staff',
        desired_solution: 'Clean responsive web app with automated WhatsApp notification trigger.',
        requested_features: 'Doctor availability calendar, instant booking form, automated WhatsApp trigger on booking',
        budget_range: '₹10,000 – ₹25,000',
        timeline: 'Within 2–4 weeks',
        preferred_contact: 'phone',
        consent: true,
        status: 'discussion_scheduled',
        internal_notes: 'Call scheduled for Friday afternoon at 3 PM to review the clinic calendar flow.',
        follow_up_date: '2026-10-17',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ];
  }

  public generateRefId(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SI-2026-${randomPart}`;
  }

  public getAll(options?: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): { items: ProjectInquiry[]; total: number; page: number; totalPages: number } {
    let result = [...this.inquiries];

    if (options?.status && options.status !== 'all') {
      result = result.filter(item => item.status === options.status);
    }

    if (options?.category && options.category !== 'all') {
      result = result.filter(item => item.service_category === options.category);
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.ref_id.toLowerCase().includes(q) ||
          (item.company && item.company.toLowerCase().includes(q))
      );
    }

    // Sort descending by created_at
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = result.length;
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 10);
    const startIndex = (page - 1) * limit;
    const paginatedItems = result.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  public getById(id: string): ProjectInquiry | undefined {
    return this.inquiries.find(item => item.id === id || item.ref_id === id);
  }

  public create(data: Omit<ProjectInquiry, 'id' | 'ref_id' | 'status' | 'created_at' | 'updated_at'>): ProjectInquiry {
    const now = new Date().toISOString();
    const newInquiry: ProjectInquiry = {
      ...data,
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ref_id: this.generateRefId(),
      status: 'new',
      created_at: now,
      updated_at: now
    };

    this.inquiries.unshift(newInquiry);
    return newInquiry;
  }

  public update(id: string, updates: Partial<Pick<ProjectInquiry, 'status' | 'internal_notes' | 'follow_up_date'>>): ProjectInquiry | null {
    const index = this.inquiries.findIndex(item => item.id === id);
    if (index === -1) return null;

    const existing = this.inquiries[index];
    const updated: ProjectInquiry = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.inquiries[index] = updated;
    return updated;
  }

  public delete(id: string): boolean {
    const initialLength = this.inquiries.length;
    this.inquiries = this.inquiries.filter(item => item.id !== id);
    return this.inquiries.length < initialLength;
  }

  public getStats(): AdminStats {
    return {
      total: this.inquiries.length,
      newCount: this.inquiries.filter(i => i.status === 'new').length,
      contactedCount: this.inquiries.filter(i => i.status === 'contacted' || i.status === 'discussion_scheduled').length,
      inProgressCount: this.inquiries.filter(i => i.status === 'in_progress' || i.status === 'proposal_sent').length,
      completedCount: this.inquiries.filter(i => i.status === 'completed').length
    };
  }
}
