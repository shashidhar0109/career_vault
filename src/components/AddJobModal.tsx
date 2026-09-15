import React, { useState, useRef } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import {
  PlusCircle,
  X,
  Briefcase,
  Building,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  MapPin,
  Upload,
  CheckCircle,
  Paperclip,
} from 'lucide-react';
import { readFileAsDataUrl, UploadedResumeResult } from '../utils/fileUploadUtils';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextAppNumber: string;
  defaultResumeName: string;
  onAddApplication: (newApp: JobApplication) => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  nextAppNumber,
  defaultResumeName,
  onAddApplication,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dateApplied, setDateApplied] = useState(new Date().toISOString().slice(0, 10));
  const [resumeMode, setResumeMode] = useState<'built' | 'uploaded'>('built');
  const [resumeUsedName, setResumeUsedName] = useState(defaultResumeName || 'My_Resume.docx');
  const [uploadedResumeFile, setUploadedResumeFile] = useState<UploadedResumeResult | null>(null);
  const [companyHrEmail, setCompanyHrEmail] = useState('');
  const [firstContactName, setFirstContactName] = useState('');
  const [firstContactTitle, setFirstContactTitle] = useState('Recruiter / Talent Partner');
  const [firstContactEmail, setFirstContactEmail] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [locationType, setLocationType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [followedUp, setFollowedUp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const result = await readFileAsDataUrl(e.target.files[0]);
        setUploadedResumeFile(result);
        setResumeUsedName(result.name);
        setResumeMode('uploaded');
      } catch (err: any) {
        alert(err.message || 'Failed to read file');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim()) return;

    const teamMembers = firstContactName.trim()
      ? [
          {
            id: `tm-${Date.now()}`,
            name: firstContactName.trim(),
            title: firstContactTitle.trim(),
            email: firstContactEmail.trim() || companyHrEmail.trim(),
          },
        ]
      : [];

    const newApp: JobApplication = {
      id: `job-${Date.now()}`,
      appNumber: nextAppNumber,
      dateApplied,
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      jobDescription: jobDescription.trim(),
      resumeUsedName: resumeUsedName.trim() || defaultResumeName || 'My_Resume.docx',
      resumeSource: resumeMode === 'uploaded' ? 'uploaded' : 'built',
      resumeFileData: resumeMode === 'uploaded' ? uploadedResumeFile?.dataUrl : undefined,
      resumeFileSize: resumeMode === 'uploaded' ? uploadedResumeFile?.size : undefined,
      companyHrEmail: companyHrEmail.trim(),
      teamMembers,
      status,
      followedUp,
      lastFollowUpDate: followedUp ? dateApplied : undefined,
      followUpNote: followedUp ? 'Followed up during application submission.' : 'Waiting for recruiter review.',
      salaryExpectation: salaryExpectation.trim(),
      locationType,
    };

    onAddApplication(newApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">New Job Application Row</h3>
              <p className="text-xs text-blue-100">Tracking identifier: {nextAppNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Company & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Name *</label>
              <div className="relative">
                <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Google, Linear"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Job Title / Role *</label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date Applied</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={dateApplied}
                  onChange={(e) => setDateApplied(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden bg-white"
              >
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Phone Screen">Phone Screen</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="Final Round">Final Round</option>
                <option value="Offer">Offer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Work Setup</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as any)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden bg-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Row 3: Resume Used & Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Resume File Used</label>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setResumeMode('built');
                      setResumeUsedName(defaultResumeName || 'My_Resume.docx');
                    }}
                    className={`font-semibold cursor-pointer ${
                      resumeMode === 'built'
                        ? 'text-indigo-600 underline'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Use Built
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeMode('uploaded');
                      fileInputRef.current?.click();
                    }}
                    className={`font-semibold cursor-pointer flex items-center gap-0.5 ${
                      resumeMode === 'uploaded'
                        ? 'text-emerald-600 underline'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Upload className="w-2.5 h-2.5" />
                    Upload File
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />

              {resumeMode === 'uploaded' && uploadedResumeFile ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-900 truncate">
                      {uploadedResumeFile.name}
                    </span>
                    <span className="text-[10px] text-emerald-700">
                      ({uploadedResumeFile.size})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] text-emerald-800 font-bold underline hover:text-emerald-950 shrink-0 ml-1"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. My_Resume.docx"
                    value={resumeUsedName}
                    onChange={(e) => setResumeUsedName(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Salary / Compensation Target</label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. $180,000 - $200,000"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Company HR Email */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Company HR / Recruiter Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="e.g. jobs@company.com or recruiter@company.com"
                value={companyHrEmail}
                onChange={(e) => setCompanyHrEmail(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row 5: Initial Team Contact (Optional) */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11.5px] font-bold text-slate-700 block">
              Initial Team Member / Recruiter Contact (Optional):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Contact Name"
                value={firstContactName}
                onChange={(e) => setFirstContactName(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="Title / Role"
                value={firstContactTitle}
                onChange={(e) => setFirstContactTitle(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={firstContactEmail}
                onChange={(e) => setFirstContactEmail(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Row 6: Job Description Snippet */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Job Description Snippet</label>
            <textarea
              rows={3}
              placeholder="Paste key responsibilities or tech stack from the job posting..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
            />
          </div>

          {/* Followed up checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="new-app-followed-up"
              checked={followedUp}
              onChange={(e) => setFollowedUp(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <label htmlFor="new-app-followed-up" className="text-xs font-semibold text-slate-700 cursor-pointer">
              I already followed up with the HR or team directly
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Save Application Row
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
