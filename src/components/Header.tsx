import React from 'react';
import { Split, TableProperties, Eye } from 'lucide-react';

interface HeaderProps {
  activeView: 'split' | 'tracker' | 'resume';
  setActiveView: (view: 'split' | 'tracker' | 'resume') => void;
  setIsBuildingNewResume?: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  setIsBuildingNewResume,
}) => {
  return (
    <header
      id="main-header"
      className="bg-slate-900 border-b border-slate-800 py-2.5 px-4 flex items-center justify-center shrink-0 z-30 shadow-md"
    >
      {/* Exactly the 3 requested buttons: Split, Applications Tracker, Resume Builder & Preview */}
      <nav
        aria-label="Main View Navigation"
        className="inline-flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/90 shadow-inner gap-1 sm:gap-2"
      >
        {/* 1. Split Button */}
        <button
          id="btn-view-split"
          type="button"
          onClick={() => {
            setActiveView('split');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeView === 'split'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Split className="w-4 h-4" />
          <span>Split</span>
        </button>

        {/* 2. Applications Tracker Button */}
        <button
          id="btn-view-tracker"
          type="button"
          onClick={() => {
            setActiveView('tracker');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeView === 'tracker'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <TableProperties className="w-4 h-4" />
          <span>Applications Tracker</span>
        </button>

        {/* 3. Resume Builder & Preview Button */}
        <button
          id="btn-view-resume"
          type="button"
          onClick={() => {
            setActiveView('resume');
            setIsBuildingNewResume?.(true);
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeView === 'resume'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Resume Builder &amp; Preview</span>
        </button>
      </nav>
    </header>
  );
};
