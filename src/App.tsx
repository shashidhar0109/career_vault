import React, { useState, useEffect } from 'react';
import {
  MasterResumeData,
  ActiveResumeSelection,
  JobApplication,
  INITIAL_MASTER_RESUME,
  INITIAL_DEFAULT_SELECTION,
  INITIAL_JOB_APPLICATIONS,
} from './types';
import { Header } from './components/Header';
import { MasterResumeEditor } from './components/MasterResumeEditor';
import { ResumeLivePreview } from './components/ResumeLivePreview';
import { ApplicationTrackerGrid } from './components/ApplicationTrackerGrid';
import { AddJobModal } from './components/AddJobModal';
import { Sparkles } from 'lucide-react';

const STORAGE_KEYS = {
  MASTER_RESUME: 'careervault_master_resume_v2',
  SELECTION: 'careervault_active_selection_v2',
  APPLICATIONS: 'careervault_job_applications_v2',
};

// Purge legacy demo keys from prior sessions
try {
  localStorage.removeItem('careervault_master_resume_v1');
  localStorage.removeItem('careervault_active_selection_v1');
  localStorage.removeItem('careervault_job_applications_v1');
} catch {}

export default function App() {
  // 1. Master Resume Bank State (persisted to localStorage)
  const [masterData, setMasterData] = useState<MasterResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MASTER_RESUME);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If legacy demo name is present, clear it
        if (parsed?.personalInfo?.fullName === 'Sai Shashidhar') {
          return INITIAL_MASTER_RESUME;
        }
        return parsed;
      }
      return INITIAL_MASTER_RESUME;
    } catch {
      return INITIAL_MASTER_RESUME;
    }
  });

  // 2. Active New Resume Selection State
  const [activeSelection, setActiveSelection] = useState<ActiveResumeSelection>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTION);
      return saved ? JSON.parse(saved) : INITIAL_DEFAULT_SELECTION;
    } catch {
      return INITIAL_DEFAULT_SELECTION;
    }
  });

  // 3. Job Applications Tracker State (persisted to localStorage)
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_JOB_APPLICATIONS;
    } catch {
      return INITIAL_JOB_APPLICATIONS;
    }
  });

  // 4. View Mode:
  // 'split': Left is Master Resume bank; Right is Live Preview (if building) or Tracker Grid (if not)
  // 'tracker': Full screen Applications Tracker
  // 'resume': Full screen Resume Builder & Preview
  const [activeView, setActiveView] = useState<'split' | 'tracker' | 'resume'>('split');

  // 5. Is currently building a new resume?
  const [isBuildingNewResume, setIsBuildingNewResume] = useState<boolean>(true);

  // 6. Modals
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MASTER_RESUME, JSON.stringify(masterData));
    } catch {}
  }, [masterData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTION, JSON.stringify(activeSelection));
    } catch {}
  }, [activeSelection]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  // Handler for linking a resume version to an application
  const handleLinkResumeToJob = (
    jobId: string,
    resumeDocName: string,
    extra?: { resumeSource?: 'built' | 'uploaded'; resumeFileData?: string; resumeFileSize?: string }
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === jobId
          ? {
              ...app,
              resumeUsedName: resumeDocName,
              resumeSource: extra?.resumeSource || 'built',
              resumeFileData: extra?.resumeFileData !== undefined ? extra.resumeFileData : app.resumeFileData,
              resumeFileSize: extra?.resumeFileSize !== undefined ? extra.resumeFileSize : app.resumeFileSize,
            }
          : app
      )
    );
  };

  // Handler for adding a new job application
  const handleAddApplication = (newApp: JobApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleAddNewRowDirectly = () => {
    const nextNum = `APP-${100 + applications.length + 1}`;
    const newJob: JobApplication = {
      id: `job-${Date.now()}`,
      appNumber: nextNum,
      dateApplied: new Date().toISOString().slice(0, 10),
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      resumeUsedName: `${activeSelection.resumeName}.docx`,
      companyHrEmail: '',
      teamMembers: [],
      status: 'Applied',
      followedUp: false,
      followUpNote: 'Awaiting recruiter response',
      salaryExpectation: '',
      locationType: 'Remote',
    };
    setApplications((prev) => [newJob, ...prev]);
    if (activeView === 'resume') {
      setActiveView('split');
    }
    setIsBuildingNewResume(false);
  };

  const nextAppNumber = `APP-${100 + applications.length + 1}`;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-serif select-text">
      {/* Top Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        setIsBuildingNewResume={setIsBuildingNewResume}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* VIEW MODE 1: Split View (User's primary dual-pane workflow) */}
        {activeView === 'split' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
            {/* Left Section: Master Resume Bank & Click-to-Add Builder */}
            <section className="w-full md:w-[46%] lg:w-[42%] h-1/2 md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-slate-300">
              <MasterResumeEditor
                masterData={masterData}
                setMasterData={setMasterData}
                activeSelection={activeSelection}
                setActiveSelection={setActiveSelection}
                isBuildingNewResume={isBuildingNewResume}
                setIsBuildingNewResume={setIsBuildingNewResume}
                onOpenLivePreview={() => setActiveView('resume')}
              />
            </section>

            {/* Right Section: Conditional based on whether user is actively selecting a resume */}
            <section className="w-full md:w-[54%] lg:w-[58%] h-1/2 md:h-full overflow-hidden">
              {isBuildingNewResume ? (
                <div className="h-full flex flex-col">
                  <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs">
                    <span className="text-amber-900 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Live Resume Preview Active &bull; Click items on the left to toggle
                    </span>
                    <button
                      onClick={() => setIsBuildingNewResume(false)}
                      className="text-slate-700 hover:text-slate-900 underline font-semibold text-xs cursor-pointer"
                    >
                      Switch to Tracker Grid &rarr;
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ResumeLivePreview
                      masterData={masterData}
                      activeSelection={activeSelection}
                      setActiveSelection={setActiveSelection}
                      applications={applications}
                      onLinkToJobApplication={handleLinkResumeToJob}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="bg-blue-50 border-b border-blue-200 px-4 py-1.5 flex items-center justify-between text-xs">
                    <span className="text-blue-900 font-semibold">
                      Job Applications Tracker &bull; Cell Spreadsheet Mode
                    </span>
                    <button
                      onClick={() => setIsBuildingNewResume(true)}
                      className="text-indigo-700 hover:text-indigo-900 underline font-semibold text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Switch to Resume Live Preview &rarr;
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ApplicationTrackerGrid
                      applications={applications}
                      setApplications={setApplications}
                      masterData={masterData}
                      activeResumeName={activeSelection.resumeName}
                      onPreviewResumeForJob={() => {
                        setIsBuildingNewResume(true);
                      }}
                      onAddNewRow={handleAddNewRowDirectly}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW MODE 2: Full-screen Tracker */}
        {activeView === 'tracker' && (
          <div className="flex-1 h-full w-full overflow-hidden">
            <ApplicationTrackerGrid
              applications={applications}
              setApplications={setApplications}
              masterData={masterData}
              activeResumeName={activeSelection.resumeName}
              onPreviewResumeForJob={() => {
                setIsBuildingNewResume(true);
                setActiveView('resume');
              }}
              onAddNewRow={handleAddNewRowDirectly}
            />
          </div>
        )}

        {/* VIEW MODE 3: Full-screen Resume Builder & Preview */}
        {activeView === 'resume' && (
          <div className="flex-1 flex flex-col md:flex-row h-full w-full overflow-hidden">
            <section className="w-full md:w-[38%] h-1/3 md:h-full overflow-hidden border-r border-slate-300">
              <MasterResumeEditor
                masterData={masterData}
                setMasterData={setMasterData}
                activeSelection={activeSelection}
                setActiveSelection={setActiveSelection}
                isBuildingNewResume={true}
                setIsBuildingNewResume={setIsBuildingNewResume}
              />
            </section>
            <section className="w-full md:w-[62%] h-2/3 md:h-full overflow-hidden">
              <ResumeLivePreview
                masterData={masterData}
                activeSelection={activeSelection}
                setActiveSelection={setActiveSelection}
                applications={applications}
                onLinkToJobApplication={handleLinkResumeToJob}
              />
            </section>
          </div>
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500 z-10">
        <div className="flex items-center gap-3">
          <span>Local Storage: Auto-synced</span>
          <span>&bull;</span>
          <span>
            {applications.length} jobs tracked &bull; {masterData.experiences.length} master experiences &bull;{' '}
            {masterData.projects.length} master projects
          </span>
        </div>
      </footer>

      {/* Add Job Modal */}
      {isAddJobModalOpen && (
        <AddJobModal
          isOpen={isAddJobModalOpen}
          onClose={() => setIsAddJobModalOpen(false)}
          nextAppNumber={nextAppNumber}
          defaultResumeName={`${activeSelection.resumeName}.docx`}
          onAddApplication={handleAddApplication}
        />
      )}
    </div>
  );
}
