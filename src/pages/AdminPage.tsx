import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Search, 
  Filter, 
  LogOut, 
  RefreshCw, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  X,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import { api, authStorage } from '../services/api';
import { AdminStats, InquiryStatus, ProjectInquiry } from '../types';
import { siteConfig } from '../config/siteConfig';

interface AdminPageProps {
  onBackToHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Detail Drawer state
  const [inspectingInquiry, setInspectingInquiry] = useState<ProjectInquiry | null>(null);
  const [editStatus, setEditStatus] = useState<InquiryStatus>('new');
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string | null>(null);

  // Check existing token on mount
  useEffect(() => {
    const verifyToken = async () => {
      setIsCheckingAuth(true);
      const ok = await api.checkAuth();
      setIsAuthenticated(ok);
      setIsCheckingAuth(false);
    };
    verifyToken();
  }, []);

  // Fetch dashboard data when authenticated or filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, searchQuery, selectedStatus, selectedCategory, currentPage]);

  const loadDashboardData = async () => {
    setIsLoadingData(true);
    setDataError(null);
    try {
      const [statsData, inquiriesData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminInquiries({
          search: searchQuery,
          status: selectedStatus,
          category: selectedCategory,
          page: currentPage,
          limit: 10
        })
      ]);
      setStats(statsData);
      setInquiries(inquiriesData.items);
      setTotalCount(inquiriesData.total);
      setTotalPages(inquiriesData.totalPages);
    } catch (err: any) {
      setDataError(err?.message || 'Failed to fetch admin data.');
      if (err?.message?.includes('expired')) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await api.login(username, password);
      setIsAuthenticated(true);
      setPassword('');
    } catch (err: any) {
      setLoginError(err?.message || 'Invalid username or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    setInspectingInquiry(null);
  };

  const openInspector = (inquiry: ProjectInquiry) => {
    setInspectingInquiry(inquiry);
    setEditStatus(inquiry.status);
    setEditNotes(inquiry.internal_notes || '');
    setEditFollowUp(inquiry.follow_up_date || '');
    setUpdateSuccessMsg(null);
  };

  const handleSaveInquiryUpdates = async () => {
    if (!inspectingInquiry) return;
    setIsUpdating(true);
    setUpdateSuccessMsg(null);
    try {
      const updated = await api.updateAdminInquiry(inspectingInquiry.id, {
        status: editStatus,
        internal_notes: editNotes,
        follow_up_date: editFollowUp || undefined
      });
      setInspectingInquiry(updated);
      setUpdateSuccessMsg('Inquiry updated successfully');
      loadDashboardData();
      setTimeout(() => setUpdateSuccessMsg(null), 3000);
    } catch (err: any) {
      alert('Error updating inquiry: ' + err?.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteInquiry = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete inquiry "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteAdminInquiry(id);
      setInspectingInquiry(null);
      loadDashboardData();
    } catch (err: any) {
      alert('Failed to delete: ' + err?.message);
    }
  };

  const statusOptions: { value: InquiryStatus; label: string }[] = [
    { value: 'new', label: 'New Inquiry' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'discussion_scheduled', label: 'Discussion Scheduled' },
    { value: 'proposal_sent', label: 'Proposal Sent' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'declined', label: 'Declined' },
    { value: 'archived', label: 'Archived' }
  ];

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return 'text-blue-400 bg-blue-950/60 border-blue-800/60';
      case 'reviewed':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60';
      case 'contacted':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'discussion_scheduled':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'proposal_sent':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
      case 'in_progress':
        return 'text-teal-400 bg-teal-950/60 border-teal-800/60';
      case 'completed':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'declined':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      case 'archived':
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="text-slate-400 text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Administrator Portal
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Sign in to manage client project inquiries and internal triage.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="bg-[#111827] border border-slate-800 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-3.5 rounded-lg bg-rose-950/50 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-lg text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-lg text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Default demo password: <span className="text-slate-300">sajidtech2026!</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <button
                onClick={onBackToHome}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Return to Public Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200">
      {/* Top Admin Bar */}
      <header className="bg-[#111827] border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Public Site
            </button>
            <span className="text-slate-600">/</span>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-white tracking-tight">
                {siteConfig.brandName} Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Logged in as <strong className="text-slate-200">admin</strong>
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Inquiries</span>
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                {stats.total}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-xs text-blue-400 block mb-1">New Unread</span>
              <span className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
                {stats.newCount}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-xs text-amber-400 block mb-1">Contacted</span>
              <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {stats.contactedCount}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-xs text-teal-400 block mb-1">In Progress</span>
              <span className="text-2xl font-bold font-mono text-teal-400 tabular-nums">
                {stats.inProgressCount}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
              <span className="text-xs text-emerald-400 block mb-1">Completed</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {stats.completedCount}
              </span>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, title, or ref ID..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={e => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Category:</span>
              <select
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 max-w-[150px] truncate"
              >
                <option value="all">All Categories</option>
                {siteConfig.serviceCategories.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadDashboardData}
              title="Refresh"
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Ref ID</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Project Title & Category</th>
                  <th className="py-3.5 px-4">Budget / Timeline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoadingData && inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Loading inquiries...
                    </td>
                  </tr>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No project inquiries found matching filters.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq: ProjectInquiry) => (
                    <tr
                      key={inq.id}
                      onClick={() => openInspector(inq)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-blue-400 whitespace-nowrap">
                        {inq.ref_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{inq.name}</div>
                        <div className="text-slate-400 text-[11px]">{inq.email}</div>
                        {inq.company && (
                          <div className="text-slate-500 text-[10px]">{inq.company}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-200 truncate">{inq.title}</div>
                        <div className="text-[11px] text-slate-400">{inq.service_category}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-300 font-mono text-[11px]">{inq.budget_range}</div>
                        <div className="text-slate-500 text-[10px]">{inq.timeline}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${getStatusBadge(inq.status)}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openInspector(inq)}
                          className="px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-900/40 rounded transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {inquiries.length} of {totalCount} inquiries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-slate-900 border border-slate-800 rounded disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1 bg-slate-900 border border-slate-800 rounded disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Inspector Drawer */}
      {inspectingInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-xl bg-[#0F172A] border-l border-slate-800 h-full overflow-y-auto flex flex-col justify-between p-6 space-y-6">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-mono text-blue-400 font-bold">{inspectingInquiry.ref_id}</span>
                    <span>·</span>
                    <span>{new Date(inspectingInquiry.created_at).toLocaleString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {inspectingInquiry.title}
                  </h3>
                </div>

                <button
                  onClick={() => setInspectingInquiry(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Alert */}
              {updateSuccessMsg && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{updateSuccessMsg}</span>
                </div>
              )}

              {/* Status Triage Controls */}
              <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-300 block">
                  Inquiry Triage & State Management
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as InquiryStatus)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-white"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={editFollowUp}
                      onChange={e => setEditFollowUp(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                </div>

                {/* Internal Notes (Strictly Private) */}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Private Internal Notes <span className="text-slate-500">(Never exposed to submitter)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Add meeting notes, technical assessment, or proposal status..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleSaveInquiryUpdates}
                  disabled={isUpdating}
                  className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded transition-colors cursor-pointer"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Triage Updates'}
                </button>
              </div>

              {/* Submitter Info */}
              <div className="mt-6 space-y-4 text-xs">
                <h4 className="font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                  Submitter Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{inspectingInquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <a href={`mailto:${inspectingInquiry.email}`} className="text-blue-400 hover:underline">
                      {inspectingInquiry.email}
                    </a>
                  </div>
                  {inspectingInquiry.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <a href={`tel:${inspectingInquiry.phone}`} className="hover:underline">
                        {inspectingInquiry.phone}
                      </a>
                    </div>
                  )}
                  {inspectingInquiry.company && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{inspectingInquiry.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Problem Description */}
              <div className="mt-6 space-y-2 text-xs">
                <h4 className="font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                  Problem Description
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {inspectingInquiry.problem_description}
                </p>
              </div>

              {/* Detailed Specs */}
              <div className="mt-6 space-y-3 text-xs">
                <h4 className="font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                  Project Scope & Preferences
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Service:</span>
                    <span className="text-slate-300 font-medium">{inspectingInquiry.service_category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Preferred Contact:</span>
                    <span className="text-slate-300 capitalize font-medium">{inspectingInquiry.preferred_contact}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Budget Range:</span>
                    <span className="text-slate-300 font-mono">{inspectingInquiry.budget_range}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Timeline:</span>
                    <span className="text-slate-300">{inspectingInquiry.timeline}</span>
                  </div>
                </div>

                {inspectingInquiry.desired_solution && (
                  <div className="mt-2">
                    <span className="text-slate-500 block mb-1">Desired Solution:</span>
                    <p className="text-slate-300 bg-slate-900/40 p-2.5 rounded border border-slate-800/80">
                      {inspectingInquiry.desired_solution}
                    </p>
                  </div>
                )}

                {inspectingInquiry.requested_features && (
                  <div className="mt-2">
                    <span className="text-slate-500 block mb-1">Features Requested:</span>
                    <p className="text-slate-300 bg-slate-900/40 p-2.5 rounded border border-slate-800/80">
                      {inspectingInquiry.requested_features}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone: Delete */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDeleteInquiry(inspectingInquiry.id, inspectingInquiry.title)}
                className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>

              <button
                onClick={() => setInspectingInquiry(null)}
                className="px-4 py-1.5 text-xs text-slate-400 hover:text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
