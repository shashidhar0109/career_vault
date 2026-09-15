import React, { useState } from 'react';
import {
  JobApplication,
  ApplicationStatus,
  TeamMemberContact,
  MasterResumeData,
} from '../types';
import {
  Search,
  Plus,
  Download,
  Mail,
  UserPlus,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Trash2,
  Copy,
  Eye,
  Filter,
  Check,
  Send,
  Calendar,
  Sparkles,
  ArrowUpDown,
  X,
  ChevronDown,
  Upload,
  Paperclip,
} from 'lucide-react';
import { exportApplicationsToCSV } from '../utils/exportUtils';
import { readFileAsDataUrl, downloadBase64File, previewBase64File } from '../utils/fileUploadUtils';
import { TeamMemberModal } from './TeamMemberModal';
import { FollowUpEmailModal } from './FollowUpEmailModal';
import confetti from 'canvas-confetti';

interface ApplicationTrackerGridProps {
  applications: JobApplication[];
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  masterData: MasterResumeData;
  activeResumeName?: string;
  onPreviewResumeForJob?: (resumeDocName: string) => void;
  onAddNewRow: () => void;
}

export const ApplicationTrackerGrid: React.FC<ApplicationTrackerGridProps> = ({
  applications,
  setApplications,
  masterData,
  activeResumeName,
  onPreviewResumeForJob,
  onAddNewRow,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modals state
  const [selectedAppForMembers, setSelectedAppForMembers] = useState<JobApplication | null>(null);
  const [selectedAppForFollowUp, setSelectedAppForFollowUp] = useState<JobApplication | null>(null);

  // Quick inline member addition state
  const [inlineMemberAppId, setInlineMemberAppId] = useState<string | null>(null);
  const [inlineMemberName, setInlineMemberName] = useState('');
  const [inlineMemberEmail, setInlineMemberEmail] = useState('');

  // Status styling map with vibrant colors
  const statusStyles: Record<
    ApplicationStatus,
    { bg: string; text: string; border: string; dot: string }
  > = {
    Applied: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
    },
    'Under Review': {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      dot: 'bg-cyan-500',
    },
    'Phone Screen': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      dot: 'bg-purple-500',
    },
    'Technical Interview': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
    },
    'Final Round': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-300',
      dot: 'bg-indigo-500',
    },
    Offer: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-900',
      border: 'border-emerald-300 ring-2 ring-emerald-400/40',
      dot: 'bg-emerald-600 animate-ping',
    },
    Rejected: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    Withdrawn: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      dot: 'bg-slate-400',
    },
  };

  // Helper to update any single field of an application
  const updateField = (appId: string, field: keyof JobApplication, value: any) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, [field]: value } : app))
    );
  };

  // Handle status update
  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    updateField(appId, 'status', newStatus);
    if (newStatus === 'Offer') {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // safe fallback
      }
    }
  };

  // Toggle follow-up status
  const handleToggleFollowedUp = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const nextVal = !app.followedUp;
          return {
            ...app,
            followedUp: nextVal,
            lastFollowUpDate: nextVal ? new Date().toISOString().slice(0, 10) : undefined,
          };
        }
        return app;
      })
    );
  };

  // Delete an application row
  const handleDeleteApp = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
  };

  // Upload external resume file directly for an application row
  const handleRowFileUpload = async (jobId: string, file: File) => {
    try {
      const result = await readFileAsDataUrl(file);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === jobId
            ? {
                ...app,
                resumeUsedName: result.name,
                resumeSource: 'uploaded',
                resumeFileData: result.dataUrl,
                resumeFileSize: result.size,
              }
            : app
        )
      );
    } catch (err: any) {
      alert(err.message || 'Failed to upload resume file.');
    }
  };

  // Quick link current built resume to an application row
  const handleLinkBuiltResumeToRow = (jobId: string) => {
    const docName = activeResumeName
      ? activeResumeName.endsWith('.docx')
        ? activeResumeName
        : `${activeResumeName}.docx`
      : 'Master_Resume.docx';
    setApplications((prev) =>
      prev.map((app) =>
        app.id === jobId
          ? {
              ...app,
              resumeUsedName: docName,
              resumeSource: 'built',
            }
          : app
      )
    );
  };

  // Duplicate an application row
  const handleDuplicateApp = (app: JobApplication) => {
    const duplicated: JobApplication = {
      ...app,
      id: `job-${Date.now()}`,
      appNumber: `APP-${100 + applications.length + 1}`,
      companyName: `${app.companyName} (Copy)`,
      dateApplied: new Date().toISOString().slice(0, 10),
      status: 'Applied',
      followedUp: false,
    };
    setApplications((prev) => [duplicated, ...prev]);
  };

  // Remove a team member contact from a job
  const handleRemoveTeamMember = (appId: string, memberId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            teamMembers: app.teamMembers.filter((m) => m.id !== memberId),
          };
        }
        return app;
      })
    );
  };

  // Add inline team member
  const handleAddInlineMember = (appId: string) => {
    if (!inlineMemberName.trim() && !inlineMemberEmail.trim()) {
      setInlineMemberAppId(null);
      return;
    }
    const newMember: TeamMemberContact = {
      id: `tm-${Date.now()}`,
      name: inlineMemberName.trim() || 'Recruiter/Engineer',
      email: inlineMemberEmail.trim(),
      title: 'Contact',
    };
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            teamMembers: [...app.teamMembers, newMember],
          };
        }
        return app;
      })
    );
    setInlineMemberName('');
    setInlineMemberEmail('');
    setInlineMemberAppId(null);
  };

  // Save team members from modal
  const handleSaveMembers = (appId: string, members: TeamMemberContact[]) => {
    updateField(appId, 'teamMembers', members);
  };

  // Filter and sort applications
  const filteredApps = applications
    .filter((app) => {
      const matchesSearch =
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.appNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.companyHrEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.jobDescription && app.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateApplied).getTime();
      const dateB = new Date(b.dateApplied).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate days since applied
  const getDaysAgo = (dateStr: string) => {
    const applied = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - applied.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Search & Actions Toolbar */}
      <div className="p-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center flex-wrap gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, job role, recruiter email, or app #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Statuses ({applications.length})</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="Final Round">Final Round</option>
              <option value="Offer">Offer 🎉</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            title="Sort by Date Applied"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={() => exportApplicationsToCSV(applications)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          {/* Direct New Row Generator with no popup */}
          <button
            id="btn-add-application-cell"
            onClick={onAddNewRow}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer transform active:scale-95"
            title="Adds a new editable row directly to the spreadsheet"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application Row</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Instructions Hint */}
      <div className="px-4 py-1.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span><strong>Inline Editing Active:</strong> Every cell is directly editable in the grid. Changes save automatically.</span>
        </span>
        <span className="text-slate-500 font-mono text-[10.5px]">
          {filteredApps.length} applications tracked
        </span>
      </div>

      {/* High Density Cells / Table Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-xs bg-white min-w-[1300px]">
          {/* Table Headers */}
          <thead className="sticky top-0 z-10 bg-slate-900 text-slate-200 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold shadow-xs select-none">
            <tr>
              <th className="py-2.5 px-3 w-24">App #</th>
              <th className="py-2.5 px-3 w-32">Date Applied</th>
              <th className="py-2.5 px-3 w-52">Company & Setup</th>
              <th className="py-2.5 px-3 w-60">Job Title & Salary</th>
              <th className="py-2.5 px-3 w-48">Job Description</th>
              <th className="py-2.5 px-3 w-44">Resume Used</th>
              <th className="py-2.5 px-3 w-48">Company HR Email</th>
              <th className="py-2.5 px-3 w-56">Company Members Email</th>
              <th className="py-2.5 px-3 w-40">Status</th>
              <th className="py-2.5 px-3 w-60">Follow-Up with HR/Team?</th>
              <th className="py-2.5 px-2 text-center w-20">Actions</th>
            </tr>
          </thead>

          {/* Table Rows (Each Row = A Job with Editable Cells) */}
          <tbody className="divide-y divide-slate-200">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-16 text-slate-400">
                  <div className="max-w-sm mx-auto space-y-2">
                    <p className="font-semibold text-slate-600">No matching applications found.</p>
                    <p className="text-xs text-slate-500">
                      Click &ldquo;Add Application Row&rdquo; above to immediately create a new editable row.
                    </p>
                    <button
                      onClick={onAddNewRow}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Row</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                const daysAgo = getDaysAgo(app.dateApplied);
                const isOverdueFollowUp =
                  !app.followedUp &&
                  daysAgo >= 5 &&
                  !['Rejected', 'Withdrawn', 'Offer'].includes(app.status);

                return (
                  <tr
                    key={app.id}
                    className="hover:bg-blue-50/30 transition-colors group text-slate-700 focus-within:bg-blue-50/40"
                  >
                    {/* 1. App Number (Inline Editable) */}
                    <td className="py-2 px-2.5 align-top">
                      <input
                        type="text"
                        value={app.appNumber}
                        onChange={(e) => updateField(app.id, 'appNumber', e.target.value)}
                        className="w-20 font-mono font-bold text-indigo-700 bg-indigo-50/70 border border-indigo-200/80 rounded px-1.5 py-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        title="Edit Application ID"
                      />
                    </td>

                    {/* 2. Date Applied (Inline Editable Date Picker) */}
                    <td className="py-2 px-2.5 align-top whitespace-nowrap">
                      <input
                        type="date"
                        value={app.dateApplied}
                        onChange={(e) => updateField(app.id, 'dateApplied', e.target.value)}
                        className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 w-32 focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="text-[10.5px] text-slate-400 flex items-center gap-1 mt-1 pl-1">
                        <Clock className="w-3 h-3" />
                        <span>{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
                      </div>
                    </td>

                    {/* 3. Company Name & Work Setup (Inline Editable) */}
                    <td className="py-2 px-2.5 align-top">
                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="e.g. Google, Stripe..."
                          value={app.companyName}
                          onChange={(e) => updateField(app.id, 'companyName', e.target.value)}
                          className="w-full font-bold text-slate-900 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 bg-white placeholder:font-normal placeholder:text-slate-400"
                        />
                        <div className="flex items-center gap-1.5">
                          <select
                            value={app.locationType || 'Remote'}
                            onChange={(e) => updateField(app.id, 'locationType', e.target.value)}
                            className="text-[10.5px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded px-1.5 py-0.5 cursor-pointer focus:outline-hidden"
                          >
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="On-site">On-site</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* 4. Job Title & Salary Expectation (Inline Editable) */}
                    <td className="py-2 px-2.5 align-top">
                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="e.g. Senior Full Stack Engineer"
                          value={app.jobTitle}
                          onChange={(e) => updateField(app.id, 'jobTitle', e.target.value)}
                          className="w-full font-semibold text-slate-900 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 bg-white placeholder:font-normal placeholder:text-slate-400"
                        />
                        <input
                          type="text"
                          placeholder="Compensation e.g. $180k - $210k"
                          value={app.salaryExpectation || ''}
                          onChange={(e) => updateField(app.id, 'salaryExpectation', e.target.value)}
                          className="w-full text-[11px] text-emerald-800 placeholder:text-slate-400 border border-slate-200 rounded px-2 py-0.5 bg-emerald-50/40 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                        />
                      </div>
                    </td>

                    {/* 5. Job Description (Inline Quick Edit) */}
                    <td className="py-2 px-2.5 align-top">
                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="Brief notes / requirements..."
                          value={app.jobDescription || ''}
                          onChange={(e) => updateField(app.id, 'jobDescription', e.target.value)}
                          className="w-full text-[11px] text-slate-700 border border-slate-200 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>

                    {/* 6. Resume Used (Inline Editable + Preview Doc + Upload Resume) */}
                    <td className="py-2 px-2.5 align-top">
                      <div className="space-y-1.5 min-w-[150px]">
                        {app.resumeUsedName ? (
                          <>
                            <div className="flex items-center gap-1">
                              <FileText
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  app.resumeSource === 'uploaded' || app.resumeFileData
                                    ? 'text-emerald-600'
                                    : 'text-blue-600'
                                }`}
                              />
                              <input
                                type="text"
                                placeholder="e.g. Resume_2026.docx"
                                value={app.resumeUsedName || ''}
                                onChange={(e) => updateField(app.id, 'resumeUsedName', e.target.value)}
                                className="w-full font-medium text-[11px] text-slate-800 border border-slate-200 rounded px-1.5 py-1 bg-white focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 pl-4 text-[10.5px]">
                              {/* Badge: Built vs Uploaded */}
                              <span
                                className={`px-1.5 py-0.5 rounded font-bold text-[9.5px] ${
                                  app.resumeSource === 'uploaded' || app.resumeFileData
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {app.resumeSource === 'uploaded' || app.resumeFileData
                                  ? `Uploaded${app.resumeFileSize ? ` (${app.resumeFileSize})` : ''}`
                                  : 'Built'}
                              </span>

                              {/* Action: If uploaded, Preview or Download */}
                              {(app.resumeSource === 'uploaded' || app.resumeFileData) &&
                                app.resumeFileData && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        previewBase64File(app.resumeFileData!, app.resumeUsedName)
                                      }
                                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-0.5 cursor-pointer"
                                      title="Preview or open this uploaded resume file"
                                    >
                                      <Eye className="w-2.5 h-2.5" />
                                      <span>Preview</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        downloadBase64File(app.resumeFileData!, app.resumeUsedName)
                                      }
                                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-0.5 cursor-pointer"
                                      title="Download this uploaded resume file"
                                    >
                                      <Download className="w-2.5 h-2.5" />
                                      <span>Download</span>
                                    </button>
                                  </>
                                )}

                              {/* Action: If built, Preview Doc */}
                              {app.resumeSource !== 'uploaded' &&
                                !app.resumeFileData &&
                                onPreviewResumeForJob && (
                                  <button
                                    type="button"
                                    onClick={() => onPreviewResumeForJob(app.resumeUsedName)}
                                    className="text-indigo-600 hover:text-indigo-800 font-semibold underline flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Eye className="w-2.5 h-2.5" />
                                    <span>Preview</span>
                                  </button>
                                )}

                              {/* Action: Replace / Upload new */}
                              <label className="text-slate-500 hover:text-slate-800 font-medium underline flex items-center gap-0.5 cursor-pointer">
                                <Upload className="w-2.5 h-2.5" />
                                <span>Replace</span>
                                <input
                                  type="file"
                                  accept=".pdf,.docx,.doc,.txt"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleRowFileUpload(app.id, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => handleLinkBuiltResumeToRow(app.id)}
                              className="w-full text-left text-[10.5px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded border border-indigo-200 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Link the currently active built resume"
                            >
                              <FileText className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span className="truncate">Link Built Resume</span>
                            </button>

                            <label className="w-full text-left text-[10.5px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-2 py-1 rounded border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors">
                              <Upload className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>Upload Resume</span>
                              <input
                                type="file"
                                accept=".pdf,.docx,.doc,.txt"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleRowFileUpload(app.id, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 7. Company HR Email (Inline Editable + Mailto Link) */}
                    <td className="py-2 px-2.5 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <input
                            type="email"
                            placeholder="recruiter@company.com"
                            value={app.companyHrEmail || ''}
                            onChange={(e) => updateField(app.id, 'companyHrEmail', e.target.value)}
                            className="w-full text-[11px] border border-slate-200 rounded px-2 py-1 bg-white text-blue-700 focus:ring-2 focus:ring-blue-500"
                          />
                          {app.companyHrEmail && (
                            <a
                              href={`mailto:${app.companyHrEmail}`}
                              className="p-1 text-blue-600 hover:text-blue-800 shrink-0"
                              title="Send email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 8. Company Members Email Directory (Inline Chips + Add Button) */}
                    <td className="py-2 px-2.5 align-top">
                      <div className="space-y-1.5">
                        {app.teamMembers.length > 0 && (
                          <div className="flex flex-wrap gap-1 max-w-[210px]">
                            {app.teamMembers.map((member) => (
                              <span
                                key={member.id}
                                className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[10.5px] px-1.5 py-0.5 rounded border border-slate-200 max-w-full truncate"
                                title={`${member.name} (${member.title || 'Team'}): ${member.email}`}
                              >
                                <span className="font-semibold truncate max-w-[70px]">{member.name}:</span>
                                <a
                                  href={`mailto:${member.email}`}
                                  className="text-indigo-600 hover:underline truncate max-w-[90px]"
                                >
                                  {member.email}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTeamMember(app.id, member.id)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer ml-0.5"
                                  title="Remove this contact"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Inline quick add contact input toggle */}
                        {inlineMemberAppId === app.id ? (
                          <div className="p-2 bg-indigo-50/80 border border-indigo-200 rounded-lg space-y-1.5 text-xs">
                            <input
                              type="text"
                              placeholder="Name / Role"
                              value={inlineMemberName}
                              onChange={(e) => setInlineMemberName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px]"
                              autoFocus
                            />
                            <input
                              type="email"
                              placeholder="email@company.com"
                              value={inlineMemberEmail}
                              onChange={(e) => setInlineMemberEmail(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px]"
                            />
                            <div className="flex items-center gap-1 pt-0.5">
                              <button
                                type="button"
                                onClick={() => handleAddInlineMember(app.id)}
                                className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10.5px] font-bold hover:bg-indigo-500 cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setInlineMemberAppId(null);
                                  setInlineMemberName('');
                                  setInlineMemberEmail('');
                                }}
                                className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10.5px] font-medium hover:bg-slate-300 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setInlineMemberAppId(app.id);
                                setInlineMemberName('');
                                setInlineMemberEmail('');
                              }}
                              className="inline-flex items-center gap-1 text-[10.5px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Quick Add</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedAppForMembers(app)}
                              className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              Directory
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 9. Status (Inline Editable Dropdown with Vibrant Colors) */}
                    <td className="py-2 px-2.5 align-top">
                      <div className="relative inline-block w-full">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value as ApplicationStatus)
                          }
                          className={`w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border appearance-none pr-6 cursor-pointer transition-all ${
                            statusStyles[app.status]?.bg || 'bg-slate-100'
                          } ${statusStyles[app.status]?.text || 'text-slate-700'} ${
                            statusStyles[app.status]?.border || 'border-slate-300'
                          }`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Phone Screen">Phone Screen</option>
                          <option value="Technical Interview">Technical Interview</option>
                          <option value="Final Round">Final Round</option>
                          <option value="Offer">Offer 🎉</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </select>
                        <span
                          className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                            statusStyles[app.status]?.dot || 'bg-slate-400'
                          }`}
                        />
                      </div>
                    </td>

                    {/* 10. Follow-Up with HR/Team? (Checkbox, Status, and Inline Notes) */}
                    <td className="py-2 px-2.5 align-top">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={app.followedUp}
                              onChange={() => handleToggleFollowedUp(app.id)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-slate-800">
                              {app.followedUp ? 'Followed Up' : 'No Follow-up Yet'}
                            </span>
                          </label>
                        </div>

                        {/* Status Note Indicator */}
                        {app.followedUp ? (
                          <div className="flex items-center gap-1 text-[10.5px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle className="w-3 h-3 shrink-0 text-emerald-600" />
                            <span>Done {app.lastFollowUpDate || 'recently'} &bull; Waiting for reply</span>
                          </div>
                        ) : isOverdueFollowUp ? (
                          <div className="flex items-center gap-1 text-[10.5px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-semibold">
                            <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600" />
                            <span>Follow-up recommended ({daysAgo}d passed)</span>
                          </div>
                        ) : (
                          <span className="text-[10.5px] text-slate-400 italic block">
                            Within normal window
                          </span>
                        )}

                        {/* Inline Follow-Up Note Input */}
                        <input
                          type="text"
                          placeholder="Follow-up note e.g. Emailed John..."
                          value={app.followUpNote || ''}
                          onChange={(e) => updateField(app.id, 'followUpNote', e.target.value)}
                          className="w-full text-[10.5px] text-slate-700 border border-slate-200 rounded px-1.5 py-0.5 bg-white focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                        />

                        {/* Quick Draft Email Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedAppForFollowUp(app)}
                          className="text-[10.5px] font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Send className="w-2.5 h-2.5 text-amber-700" />
                          <span>Draft Follow-Up Email</span>
                        </button>
                      </div>
                    </td>

                    {/* 11. Actions (Duplicate & Delete Row) */}
                    <td className="py-2 px-2 text-center align-top">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateApp(app)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Duplicate this row"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteApp(app.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete application row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Embedded Modals for Deep Actions */}
      {selectedAppForMembers && (
        <TeamMemberModal
          isOpen={!!selectedAppForMembers}
          onClose={() => setSelectedAppForMembers(null)}
          companyName={selectedAppForMembers.companyName}
          existingMembers={selectedAppForMembers.teamMembers}
          onSaveMembers={(members) => {
            handleSaveMembers(selectedAppForMembers.id, members);
            setSelectedAppForMembers((prev) => (prev ? { ...prev, teamMembers: members } : null));
          }}
        />
      )}

      {selectedAppForFollowUp && (
        <FollowUpEmailModal
          isOpen={!!selectedAppForFollowUp}
          onClose={() => setSelectedAppForFollowUp(null)}
          application={selectedAppForFollowUp}
          candidateName={masterData.personalInfo.fullName}
          onMarkFollowedUp={(appId) => {
            handleToggleFollowedUp(appId);
          }}
        />
      )}
    </div>
  );
};
