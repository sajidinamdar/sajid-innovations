import { AdminStats, CreateInquiryInput, ProjectInquiry, ProjectItem } from '../types';

const TOKEN_KEY = 'sajidtech_admin_token';

export const authStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error(e);
    }
  },
  clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error(e);
    }
  }
};

function getAuthHeaders(): HeadersInit {
  const token = authStorage.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  async submitIdea(data: CreateInquiryInput): Promise<{ success: boolean; ref_id: string; message: string }> {
    const res = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.details ? Object.values(json.details).join(' ') : json.error || 'Failed to submit idea');
    }
    return json;
  },

  async getProjects(): Promise<ProjectItem[]> {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to load projects');
    const data = await res.json();
    return data.projects || [];
  },

  async login(username: string, password: string): Promise<{ token: string; user: { id: string; username: string; role: string } }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Invalid credentials');
    }

    if (json.token) {
      authStorage.setToken(json.token);
    }
    return json;
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } finally {
      authStorage.clearToken();
    }
  },

  async checkAuth(): Promise<boolean> {
    const token = authStorage.getToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async getAdminInquiries(params?: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: ProjectInquiry[]; total: number; page: number; totalPages: number }> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
    if (params?.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const res = await fetch(`/api/admin/ideas?${searchParams.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      if (res.status === 401) {
        authStorage.clearToken();
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error('Failed to fetch inquiries');
    }
    return res.json();
  },

  async getAdminInquiryById(id: string): Promise<ProjectInquiry> {
    const res = await fetch(`/api/admin/ideas/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch inquiry details');
    return res.json();
  },

  async updateAdminInquiry(
    id: string,
    updates: Partial<Pick<ProjectInquiry, 'status' | 'internal_notes' | 'follow_up_date'>>
  ): Promise<ProjectInquiry> {
    const res = await fetch(`/api/admin/ideas/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update inquiry');
    return res.json();
  },

  async deleteAdminInquiry(id: string): Promise<void> {
    const res = await fetch(`/api/admin/ideas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete inquiry');
  }
};
