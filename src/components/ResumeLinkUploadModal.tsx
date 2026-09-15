import React, { useState, useRef } from 'react';
import { JobApplication } from '../types';
import { readFileAsDataUrl, downloadBase64File, previewBase64File, UploadedResumeResult } from '../utils/fileUploadUtils';
import {
  X,
  UploadCloud,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  Download,
  AlertCircle,
  FileCheck,
  Building,
  Briefcase,
  Layers,
  Eye,
} from 'lucide-react';

interface ResumeLinkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeResumeName: string;
  applications: JobApplication[];
  onLinkBuiltResume: (jobId: string, resumeDocName: string) => void;
  onLinkUploadedResume: (jobId: string, uploaded: UploadedResumeResult) => void;
  onUnlinkResume?: (jobId: string) => void;
}

export const ResumeLinkUploadModal: React.FC<ResumeLinkUploadModalProps> = ({
  isOpen,
  onClose,
  activeResumeName,
  applications,
  onLinkBuiltResume,
  onLinkUploadedResume,
  onUnlinkResume,
}) => {
  const [activeTab, setActiveTab] = useState<'link-built' | 'upload-custom'>('link-built');
  const [selectedJobId, setSelectedJobId] = useState<string>(
    applications.length > 0 ? applications[0].id : ''
  );
  const [uploadedFile, setUploadedFile] = useState<UploadedResumeResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const activeDocName = activeResumeName.endsWith('.docx')
    ? activeResumeName
    : `${activeResumeName}.docx`;

  const selectedJob = applications.find((a) => a.id === selectedJobId);

  // Filter applications that are linked to the current built resume
  const linkedJobs = applications.filter(
    (app) =>
      app.resumeUsedName &&
      (app.resumeUsedName === activeDocName ||
        app.resumeUsedName === activeResumeName ||
        app.resumeUsedName === `${activeResumeName}.pdf`)
  );

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const result = await readFileAsDataUrl(file);
      setUploadedFile(result);
      setActiveTab('upload-custom');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to read resume file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmLinkBuilt = () => {
    if (!selectedJobId) {
      setErrorMessage('Please select a job application to link.');
      return;
    }
    onLinkBuiltResume(selectedJobId, activeDocName);
    setSuccessMessage(`Linked "${activeDocName}" to ${selectedJob?.companyName || 'selected job'}!`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  const handleConfirmLinkUploaded = () => {
    if (!uploadedFile) {
      setErrorMessage('Please select or drag a resume file to upload.');
      return;
    }
    if (!selectedJobId) {
      setErrorMessage('Please select a job application to link.');
      return;
    }
    onLinkUploadedResume(selectedJobId, uploadedFile);
    setSuccessMessage(
      `Uploaded and attached "${uploadedFile.name}" to ${
        selectedJob?.companyName || 'selected job'
      }!`
    );
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div
      id="resume-link-upload-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-serif"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Resume Association &amp; Upload</h3>
              <p className="text-[11px] text-slate-300">
                Link your active built resume or upload an existing custom document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('link-built')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'link-built'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link Built Resume</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload-custom')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload-custom'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload External Resume (PDF/Word)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Job Selection Target */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Select Target Job Application:</span>
            </label>
            {applications.length === 0 ? (
              <p className="text-slate-500 italic p-2 bg-slate-50 rounded border border-slate-200">
                No job applications in the tracker yet. Add an application in the tracker to link.
              </p>
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.appNumber} &bull; {app.companyName || 'Untitled Company'} &mdash;{' '}
                    {app.jobTitle || 'No Title'} (Currently: {app.resumeUsedName || 'No resume'})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* TAB 1: Link Current Built Resume */}
          {activeTab === 'link-built' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-indigo-950 text-xs">{activeDocName}</p>
                    <p className="text-[11px] text-indigo-800 mt-0.5">
                      ATS-Optimized Times New Roman document generated from Master Vault.
                    </p>
                    <div className="mt-2 text-[10.5px] text-indigo-700 flex items-center gap-2">
                      <span className="font-semibold">Format:</span> Word (.docx) &amp; PDF (.pdf)
                    </div>
                  </div>
                </div>
              </div>

              {/* Already linked jobs notice */}
              {linkedJobs.length > 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="font-bold text-slate-700 text-[11px] mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Currently linked to {linkedJobs.length} job
                    {linkedJobs.length > 1 ? 's' : ''}:
                  </p>
                  <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-600">
                    {linkedJobs.map((j) => (
                      <li key={j.id}>
                        <span className="font-medium text-slate-800">
                          {j.companyName || 'Company'}
                        </span>{' '}
                        ({j.jobTitle || 'Role'})
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  This resume is not currently associated with any job applications.
                </p>
              )}

              <button
                type="button"
                onClick={handleConfirmLinkBuilt}
                disabled={applications.length === 0}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link "{activeDocName}" to Selected Job</span>
              </button>
            </div>
          )}

          {/* TAB 2: Upload External Resume */}
          {activeTab === 'upload-custom' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
                    : uploadedFile
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/20'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="font-bold text-slate-800 text-xs mb-1">
                  Click to browse or drag &amp; drop resume file
                </p>
                <p className="text-[11px] text-slate-500">
                  Supports PDF (.pdf), Microsoft Word (.docx, .doc), or Text (.txt) up to 3.5 MB
                </p>
              </div>

              {/* Uploaded File preview */}
              {uploadedFile && (
                <div className="bg-white border border-emerald-200 rounded-lg p-3 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{uploadedFile.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Size: <span className="font-semibold text-slate-700">{uploadedFile.size}</span>{' '}
                        &bull; Ready to attach
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => previewBase64File(uploadedFile.dataUrl, uploadedFile.name)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                      title="Preview / Open File in browser"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadBase64File(uploadedFile.dataUrl, uploadedFile.name)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmLinkUploaded}
                disabled={!uploadedFile || applications.length === 0}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <FileCheck className="w-4 h-4" />
                <span>
                  {uploadedFile
                    ? `Attach "${uploadedFile.name}" to Selected Job`
                    : 'Choose a File to Attach'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Files are safely stored in your local browser sandbox</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
