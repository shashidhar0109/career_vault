import React, { useState, useRef } from 'react';
import {
  MasterResumeData,
  ActiveResumeSelection,
  JobApplication,
} from '../types';
import {
  exportResumeToWord,
  exportResumeToPDF,
  printResumeAsPdf,
} from '../utils/exportUtils';
import {
  Download,
  Printer,
  FileCheck,
  Link as LinkIcon,
  FileText,
  ZoomIn,
  ZoomOut,
  Loader2,
  Sparkles,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResumeLinkUploadModal } from './ResumeLinkUploadModal';
import { readFileAsDataUrl } from '../utils/fileUploadUtils';

interface ResumeLivePreviewProps {
  masterData: MasterResumeData;
  activeSelection: ActiveResumeSelection;
  setActiveSelection: React.Dispatch<React.SetStateAction<ActiveResumeSelection>>;
  applications: JobApplication[];
  onLinkToJobApplication: (
    jobId: string,
    resumeDocName: string,
    extra?: { resumeSource?: 'built' | 'uploaded'; resumeFileData?: string; resumeFileSize?: string }
  ) => void;
}

export const ResumeLivePreview: React.FC<ResumeLivePreviewProps> = ({
  masterData,
  activeSelection,
  setActiveSelection,
  applications,
  onLinkToJobApplication,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [selectedJobToLink, setSelectedJobToLink] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfStatusMessage, setPdfStatusMessage] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isLinkUploadModalOpen, setIsLinkUploadModalOpen] = useState<boolean>(false);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  const selectedSummary = masterData.summaries.find(
    (s) => s.id === activeSelection.selectedSummaryId
  );
  const selectedExps = masterData.experiences.filter((e) =>
    activeSelection.selectedExperienceIds.includes(e.id)
  );
  const selectedProjs = masterData.projects.filter((p) =>
    activeSelection.selectedProjectIds.includes(p.id)
  );
  const selectedSkills = masterData.skillCategories.filter((s) =>
    activeSelection.selectedSkillCategoryIds.includes(s.id)
  );
  const selectedEdus = masterData.educations.filter((ed) =>
    activeSelection.selectedEducationIds.includes(ed.id)
  );
  const selectedCerts = masterData.certifications.filter((c) =>
    activeSelection.selectedCertificationIds.includes(c.id)
  );

  const { personalInfo } = masterData;

  const hasAnySection =
    Boolean(selectedSummary) ||
    selectedExps.length > 0 ||
    selectedProjs.length > 0 ||
    selectedSkills.length > 0 ||
    selectedEdus.length > 0 ||
    selectedCerts.length > 0;

  const hasPersonalContact =
    Boolean(personalInfo.email) ||
    Boolean(personalInfo.phone) ||
    Boolean(personalInfo.location) ||
    Boolean(personalInfo.linkedin) ||
    Boolean(personalInfo.github) ||
    Boolean(personalInfo.portfolio) ||
    (personalInfo.customLinks && personalInfo.customLinks.length > 0);

  // Theme styling based on activeSelection.themeColor
  const themeClasses = {
    indigo: {
      primary: 'text-indigo-950',
      heading: 'text-indigo-900 border-indigo-600',
      accent: 'text-indigo-600',
      border: 'border-indigo-600',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    blue: {
      primary: 'text-blue-950',
      heading: 'text-blue-900 border-blue-600',
      accent: 'text-blue-600',
      border: 'border-blue-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    emerald: {
      primary: 'text-emerald-950',
      heading: 'text-emerald-900 border-emerald-600',
      accent: 'text-emerald-600',
      border: 'border-emerald-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    violet: {
      primary: 'text-purple-950',
      heading: 'text-purple-900 border-purple-600',
      accent: 'text-purple-600',
      border: 'border-purple-600',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    rose: {
      primary: 'text-rose-950',
      heading: 'text-rose-900 border-rose-600',
      accent: 'text-rose-600',
      border: 'border-rose-600',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    amber: {
      primary: 'text-amber-950',
      heading: 'text-amber-900 border-amber-600',
      accent: 'text-amber-600',
      border: 'border-amber-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  }[activeSelection.themeColor || 'indigo'];

  // Handle direct Word download
  const handleDownloadWord = () => {
    exportResumeToWord(masterData, activeSelection, activeSelection.resumeName);
    setDownloadSuccess('Microsoft Word document (.docx) downloaded!');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch {
      // safe fallback
    }
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Handle direct PDF generation and download
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfStatusMessage('Initializing PDF document generation...');
    try {
      const docName = activeSelection.resumeName.endsWith('.pdf')
        ? activeSelection.resumeName
        : `${activeSelection.resumeName}.pdf`;

      const success = await exportResumeToPDF(
        'printable-resume-document',
        docName,
        (msg) => setPdfStatusMessage(msg)
      );

      if (success) {
        setDownloadSuccess('PDF document downloaded successfully!');
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
        } catch {
          // safe fallback
        }
      }
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      printResumeAsPdf();
    } finally {
      setIsGeneratingPdf(false);
      setPdfStatusMessage('');
      setTimeout(() => setDownloadSuccess(null), 3500);
    }
  };

  const activeDocName = activeSelection.resumeName.endsWith('.docx')
    ? activeSelection.resumeName
    : `${activeSelection.resumeName}.docx`;

  const linkedJobs = applications.filter(
    (app) =>
      app.resumeUsedName &&
      (app.resumeUsedName === activeDocName ||
        app.resumeUsedName === activeSelection.resumeName ||
        app.resumeUsedName === `${activeSelection.resumeName}.pdf`)
  );

  const handlePrintPdf = () => {
    printResumeAsPdf();
  };

  const handleLinkResume = () => {
    if (!selectedJobToLink) return;
    onLinkToJobApplication(selectedJobToLink, activeDocName, { resumeSource: 'built' });
    setDownloadSuccess(`Linked "${activeDocName}" to selected job application!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleQuickUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const res = await readFileAsDataUrl(file);
        if (selectedJobToLink) {
          onLinkToJobApplication(selectedJobToLink, res.name, {
            resumeSource: 'uploaded',
            resumeFileData: res.dataUrl,
            resumeFileSize: res.size,
          });
          setDownloadSuccess(`Uploaded and linked "${res.name}" to application!`);
        } else {
          setIsLinkUploadModalOpen(true);
        }
      } catch (err: any) {
        alert(err.message || 'Failed to read file');
      }
    }
  };

  // Header Contact renderer
  const renderContactLine = () => {
    if (!hasPersonalContact) {
      return (
        <div className="text-[11px] text-slate-400 mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 italic">
          <span>email@example.com</span>
          <span>&bull;</span>
          <span>(555) 000-0000</span>
          <span>&bull;</span>
          <span>City, State</span>
        </div>
      );
    }

    return (
      <div className="text-[11px] text-slate-600 mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && (
          <>
            <span>&bull;</span>
            <span>{personalInfo.phone}</span>
          </>
        )}
        {personalInfo.location && (
          <>
            <span>&bull;</span>
            <span>{personalInfo.location}</span>
          </>
        )}
        {!activeSelection.hideLinkedin && personalInfo.linkedin && personalInfo.linkedin.trim() !== '' && (
          <>
            <span>&bull;</span>
            <span className={`font-medium ${themeClasses.accent}`}>{personalInfo.linkedin}</span>
          </>
        )}
        {!activeSelection.hideGithub && personalInfo.github && personalInfo.github.trim() !== '' && (
          <>
            <span>&bull;</span>
            <span className="text-slate-700 font-medium">{personalInfo.github}</span>
          </>
        )}
        {!activeSelection.hidePortfolio && personalInfo.portfolio && personalInfo.portfolio.trim() !== '' && (
          <>
            <span>&bull;</span>
            <span className={`font-medium ${themeClasses.accent}`}>{personalInfo.portfolio}</span>
          </>
        )}
        {(personalInfo.customLinks || []).map((link) =>
          link.url && link.url.trim() !== '' ? (
            <React.Fragment key={link.id}>
              <span>&bull;</span>
              <span className={`font-medium ${themeClasses.accent}`}>
                {link.label ? `${link.label}: ${link.url}` : link.url}
              </span>
            </React.Fragment>
          ) : null
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden font-serif">
      {/* Control Header for Document Preview */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{activeSelection.resumeName}</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Word & PDF Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Times New Roman &bull; Standard Document Flow &bull; ATS Optimized
            </p>
          </div>
        </div>

        {/* Action Controls & Downloads */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 text-xs px-1.5 py-1 gap-1 text-slate-600">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-0.5 hover:text-slate-900 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-mono font-medium px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              className="p-0.5 hover:text-slate-900 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Link / Upload to Job Button */}
          <button
            id="btn-open-link-upload"
            onClick={() => setIsLinkUploadModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              linkedJobs.length > 0
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-100'
                : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Link built resume or upload custom resume file"
          >
            <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>{linkedJobs.length > 0 ? `Linked (${linkedJobs.length})` : 'Link to Job'}</span>
            {linkedJobs.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          {/* Quick Upload button */}
          <input
            ref={quickFileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleQuickUploadFile}
            className="hidden"
          />
          <button
            id="btn-quick-upload-resume"
            onClick={() => quickFileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
            title="Upload custom resume file (.pdf, .docx, .doc, .txt)"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Upload Resume</span>
          </button>

          {/* PRIMARY DOWNLOAD BUTTON 1: Word */}
          <button
            id="btn-download-word-doc"
            onClick={handleDownloadWord}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer transform active:scale-95"
            title="Download formatted Microsoft Word document (.docx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Word (.docx)</span>
          </button>

          {/* PRIMARY DOWNLOAD BUTTON 2: PDF */}
          <button
            id="btn-download-pdf-resume"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer transform active:scale-95 ${
              isGeneratingPdf
                ? 'bg-slate-700 cursor-wait'
                : 'bg-emerald-700 hover:bg-emerald-600'
            }`}
            title="Download formatted PDF document (.pdf)"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF (.pdf)'}</span>
          </button>

          {/* Secondary Print button */}
          <button
            id="btn-print-resume"
            onClick={handlePrintPdf}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
            title="Open system print dialog"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Generating PDF progress toast banner */}
      {isGeneratingPdf && (
        <div className="bg-indigo-600 text-white text-xs py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{pdfStatusMessage || 'Rendering high-resolution document...'}</span>
        </div>
      )}

      {/* Download success banner */}
      {downloadSuccess && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-semibold shadow-inner flex items-center justify-center gap-2 transition-all">
          <FileCheck className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Document Canvas Container with authentic Word Desk backdrop */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center bg-slate-200/90 print:p-0 print:bg-white">
        <div
          id="printable-resume-document"
          style={{
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="w-full max-w-[800px] flex flex-col items-center"
        >
          {/* Unified Clean Document Sheet */}
          <div className="resume-paper-page bg-white w-full shadow-xl border border-slate-300/90 rounded-xs p-8 sm:p-12 text-slate-800 font-serif transition-all print:shadow-none print:border-none print:p-0">
            {/* Header */}
            <header className="text-center pb-3 mb-4 border-b border-slate-300">
              <h1
                className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeClasses.primary}`}
              >
                {personalInfo.fullName || 'Your Full Name'}
              </h1>
              <p
                className={`text-sm sm:text-base font-semibold mt-1 ${themeClasses.accent}`}
              >
                {personalInfo.targetTitle || 'Target Professional Title'}
              </p>
              {renderContactLine()}
            </header>

            {/* Empty Resume Guided Placeholder */}
            {!hasAnySection && (
              <div className="my-8 p-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-800 mb-1">Your resume sheet is ready</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Use the <strong>Master Vault</strong> on the left to add your personal details, work history, skills, projects, and education. Check the boxes beside the items you wish to include, and they will automatically render here in Times New Roman format ready for Word and PDF export.
                </p>
              </div>
            )}

            {/* Section: Professional Summary */}
            {selectedSummary && (
              <section className="mb-4">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider pb-1 border-b ${themeClasses.border} ${themeClasses.heading} mb-2`}
                >
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {selectedSummary.content}
                </p>
              </section>
            )}

            {/* Section: Technical Skills */}
            {selectedSkills.length > 0 && (
              <section className="mb-4">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider pb-1 border-b ${themeClasses.border} ${themeClasses.heading} mb-2`}
                >
                  Technical Skills & Competencies
                </h2>
                <div className="space-y-1.5 text-xs">
                  {selectedSkills.map((cat) => (
                    <div key={cat.id} className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 text-[11.5px] min-w-[150px] shrink-0">
                        {cat.category}:
                      </span>
                      <span className="text-slate-700 text-xs leading-tight">
                        {cat.skills.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section: Professional Work Experience */}
            {selectedExps.length > 0 && (
              <section className="mb-4">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider pb-1 border-b ${themeClasses.border} ${themeClasses.heading} mb-2.5`}
                >
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {selectedExps.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                        <div className="text-xs font-bold text-slate-900">
                          <span>{exp.role}</span>
                          <span className="text-slate-400 font-normal mx-1">&mdash;</span>
                          <span className={themeClasses.accent}>{exp.company}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {exp.startDate} &ndash; {exp.endDate} | {exp.location}
                        </div>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 leading-normal">
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section: Selected Key Projects */}
            {selectedProjs.length > 0 && (
              <section className="mb-4">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider pb-1 border-b ${themeClasses.border} ${themeClasses.heading} mb-2.5`}
                >
                  Selected Key Projects
                </h2>
                <div className="space-y-3.5">
                  {selectedProjs.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
                        <div className="text-xs font-bold text-slate-900">
                          <span>{proj.name}</span>
                          <span className="text-slate-500 font-normal text-[11px] ml-1">
                            ({proj.role})
                          </span>
                        </div>
                        {proj.link && (
                          <div className={`text-[11px] font-medium ${themeClasses.accent}`}>
                            {proj.link}
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 italic mb-1">
                        Tech Stack: {proj.techStack.join(', ')}
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700 leading-normal">
                        {proj.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section: Education */}
            {selectedEdus.length > 0 && (
              <section className="mb-4">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider pb-1 border-b ${themeClasses.border} ${themeClasses.heading} mb-2`}
                >
                  Education
                </h2>
                <div className="space-y-2">
                  {selectedEdus.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>
                          {edu.degree} in {edu.field}
                        </span>
                        <span className="font-normal text-slate-500 text-[11px]">
                          Graduated: {edu.graduationYear}
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11.5px]">
                        {edu.institution} {edu.gpa && `&bull; GPA: ${edu.gpa}`}
                      </div>
                      {edu.highlights && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{edu.highlights}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section: Certifications & Accreditations */}
            {selectedCerts.length > 0 && (
              <section className="mb-2">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider pb-1 border-b ${themeClasses.border} ${themeClasses.heading} mb-1.5`}
                >
                  Certifications & Accreditations
                </h2>
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                  {selectedCerts.map((cert) => (
                    <li key={cert.id}>
                      <strong>{cert.name}</strong> &ndash; {cert.issuer} ({cert.year})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Subtle Document Footer */}
            <div className="pt-4 mt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
              <span>{personalInfo.fullName || 'Resume'}</span>
              <span>{activeSelection.resumeName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Linking or Uploading Resume */}
      <ResumeLinkUploadModal
        isOpen={isLinkUploadModalOpen}
        onClose={() => setIsLinkUploadModalOpen(false)}
        activeResumeName={activeSelection.resumeName}
        applications={applications}
        onLinkBuiltResume={(jobId, docName) => {
          onLinkToJobApplication(jobId, docName, { resumeSource: 'built' });
        }}
        onLinkUploadedResume={(jobId, uploaded) => {
          onLinkToJobApplication(jobId, uploaded.name, {
            resumeSource: 'uploaded',
            resumeFileData: uploaded.dataUrl,
            resumeFileSize: uploaded.size,
          });
        }}
      />
    </div>
  );
};
