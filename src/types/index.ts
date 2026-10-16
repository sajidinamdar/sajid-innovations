export type InquiryStatus = 
  | 'new'
  | 'reviewed'
  | 'contacted'
  | 'discussion_scheduled'
  | 'proposal_sent'
  | 'in_progress'
  | 'completed'
  | 'declined'
  | 'archived';

export interface ProjectInquiry {
  id: string;
  ref_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title: string;
  service_category: string;
  problem_description: string;
  target_users?: string;
  desired_solution?: string;
  requested_features?: string;
  existing_url?: string;
  budget_range?: string;
  timeline?: string;
  preferred_contact: 'email' | 'whatsapp' | 'phone';
  additional_details?: string;
  consent: boolean;
  status: InquiryStatus;
  internal_notes?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export type CreateInquiryInput = Omit<
  ProjectInquiry,
  'id' | 'ref_id' | 'status' | 'internal_notes' | 'follow_up_date' | 'created_at' | 'updated_at'
> & {
  honeypot?: string;
};

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  capabilities: string[];
  typicalProblems: string[];
  icon: string;
}

export type ProjectStatus = 'Completed' | 'In Development' | 'Prototype' | 'Concept';

export interface ProjectItem {
  id: string;
  name: string;
  category: 'Web Development' | 'Backend' | 'AI Applications' | 'Automation' | 'Experiments';
  status: ProjectStatus;
  shortDescription: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin';
  token: string;
}

export interface AdminStats {
  total: number;
  newCount: number;
  contactedCount: number;
  inProgressCount: number;
  completedCount: number;
}
