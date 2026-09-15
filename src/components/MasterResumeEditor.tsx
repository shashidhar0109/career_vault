import React, { useState } from 'react';
import {
  MasterResumeData,
  ActiveResumeSelection,
  SummaryItem,
  ExperienceItem,
  ProjectItem,
  SkillCategory,
  EducationItem,
  CertificationItem,
} from '../types';
import {
  FileText,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  Plus,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Save,
  Palette,
  Linkedin,
  Github,
  Globe,
  Link as LinkIcon,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

interface MasterResumeEditorProps {
  masterData: MasterResumeData;
  setMasterData: React.Dispatch<React.SetStateAction<MasterResumeData>>;
  activeSelection: ActiveResumeSelection;
  setActiveSelection: React.Dispatch<React.SetStateAction<ActiveResumeSelection>>;
  isBuildingNewResume: boolean;
  setIsBuildingNewResume: (val: boolean) => void;
  onOpenLivePreview?: () => void;
}

export const MasterResumeEditor: React.FC<MasterResumeEditorProps> = ({
  masterData,
  setMasterData,
  activeSelection,
  setActiveSelection,
  isBuildingNewResume,
  setIsBuildingNewResume,
  onOpenLivePreview,
}) => {
  // Collapsible section state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summaries: true,
    experiences: true,
    projects: true,
    skills: true,
    education: true,
  });

  // Editing modal/drawer state
  const [activeEditTopic, setActiveEditTopic] = useState<string | null>(null);

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Toggle selection helpers for New Resume builder mode
  const selectSummary = (id: string) => {
    setActiveSelection((prev) => ({
      ...prev,
      selectedSummaryId: id,
    }));
  };

  const toggleExperience = (id: string) => {
    setActiveSelection((prev) => {
      const exists = prev.selectedExperienceIds.includes(id);
      return {
        ...prev,
        selectedExperienceIds: exists
          ? prev.selectedExperienceIds.filter((item) => item !== id)
          : [...prev.selectedExperienceIds, id],
      };
    });
  };

  const toggleProject = (id: string) => {
    setActiveSelection((prev) => {
      const exists = prev.selectedProjectIds.includes(id);
      return {
        ...prev,
        selectedProjectIds: exists
          ? prev.selectedProjectIds.filter((item) => item !== id)
          : [...prev.selectedProjectIds, id],
      };
    });
  };

  const toggleSkillCategory = (id: string) => {
    setActiveSelection((prev) => {
      const exists = prev.selectedSkillCategoryIds.includes(id);
      return {
        ...prev,
        selectedSkillCategoryIds: exists
          ? prev.selectedSkillCategoryIds.filter((item) => item !== id)
          : [...prev.selectedSkillCategoryIds, id],
      };
    });
  };

  const toggleEducation = (id: string) => {
    setActiveSelection((prev) => {
      const exists = prev.selectedEducationIds.includes(id);
      return {
        ...prev,
        selectedEducationIds: exists
          ? prev.selectedEducationIds.filter((item) => item !== id)
          : [...prev.selectedEducationIds, id],
      };
    });
  };

  const toggleCertification = (id: string) => {
    setActiveSelection((prev) => {
      const exists = prev.selectedCertificationIds.includes(id);
      return {
        ...prev,
        selectedCertificationIds: exists
          ? prev.selectedCertificationIds.filter((item) => item !== id)
          : [...prev.selectedCertificationIds, id],
      };
    });
  };

  // Handlers for adding new entries to Master Repository
  const handleAddSummary = () => {
    const newSummary: SummaryItem = {
      id: `sum-${Date.now()}`,
      title: 'New Specialized Summary',
      content: 'Highlight your primary technical strengths, leadership scope, and career milestones here.',
    };
    setMasterData((prev) => ({
      ...prev,
      summaries: [...prev.summaries, newSummary],
    }));
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'New Company Inc.',
      role: 'Senior Software Engineer',
      location: 'City, State (or Remote)',
      startDate: '2024-01',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Developed scalable features resulting in measurable performance improvement.',
        'Collaborated with cross-functional engineering teams to ship production software.',
      ],
    };
    setMasterData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
  };

  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'New Showcase Project',
      role: 'Lead Architect',
      link: 'github.com/yourhandle/project',
      techStack: ['TypeScript', 'React', 'Node.js'],
      bullets: [
        'Engineered high-performance web application solving user domain challenges.',
        'Deployed CI/CD pipeline with automated testing.',
      ],
    };
    setMasterData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const handleAddSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      category: 'New Domain Skills',
      skills: ['Skill A', 'Skill B', 'Skill C'],
    };
    setMasterData((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCat],
    }));
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University / College Name',
      degree: 'Degree / Program',
      field: 'Major / Field of Study',
      graduationYear: `${new Date().getFullYear()}`,
      gpa: '3.8',
      highlights: 'Dean’s Honors List, relevant coursework, or leadership activities.',
    };
    setMasterData((prev) => ({
      ...prev,
      educations: [newEdu, ...prev.educations],
    }));
    setActiveSelection((prev) => ({
      ...prev,
      selectedEducationIds: [newEdu.id, ...prev.selectedEducationIds],
    }));
  };

  const handleAddCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Certification Title (e.g. AWS Solutions Architect)',
      issuer: 'Issuing Organization (e.g. Amazon Web Services)',
      year: `${new Date().getFullYear()}`,
      credentialUrl: '',
    };
    setMasterData((prev) => ({
      ...prev,
      certifications: [newCert, ...prev.certifications],
    }));
    setActiveSelection((prev) => ({
      ...prev,
      selectedCertificationIds: [newCert.id, ...prev.selectedCertificationIds],
    }));
  };

  return (
    <div className="bg-slate-50 border-r border-slate-200 h-full flex flex-col">
      {/* Top Banner of the Left Section */}
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                Master Resume Vault
                <span className="text-[10px] uppercase font-semibold tracking-wide px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                  Word Doc Bank
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                All experiences, projects, summaries & skills topic-wise
              </p>
            </div>
          </div>

          <button
            id="btn-toggle-new-resume"
            onClick={() => setIsBuildingNewResume(!isBuildingNewResume)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isBuildingNewResume
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBuildingNewResume ? 'Builder Active' : 'New Resume Mode'}</span>
          </button>
        </div>

        {/* New Resume Mode Configuration Banner */}
        {isBuildingNewResume && (
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Custom Resume Configuration:
              </span>
              <span className="text-[11px] text-indigo-700 font-semibold">
                Click any section below to include/exclude
              </span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                Document Filename
              </label>
              <input
                type="text"
                value={activeSelection.resumeName}
                onChange={(e) =>
                  setActiveSelection((prev) => ({ ...prev, resumeName: e.target.value }))
                }
                className="w-full bg-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                placeholder="e.g., Senior_Engineer_Resume"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2.5 mt-2 border-t border-indigo-100/80 text-slate-600">
              <span className="font-medium">
                Selected: <strong>{activeSelection.selectedExperienceIds.length}</strong> exps &bull;{' '}
                <strong>{activeSelection.selectedProjectIds.length}</strong> projects &bull;{' '}
                <strong>{activeSelection.selectedSkillCategoryIds.length}</strong> skill stacks
              </span>
              {onOpenLivePreview && (
                <button
                  onClick={onOpenLivePreview}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1 cursor-pointer"
                >
                  View Paper Preview &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Word-Doc Content Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TOPIC 1: Personal Info & Contact */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('personal')}
            className="px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Contact & Identity
              </span>
            </div>
            {openSections.personal ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          {openSections.personal && (
            <div className="p-3.5 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={masterData.personalInfo.fullName}
                    onChange={(e) =>
                      setMasterData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Target Title</label>
                  <input
                    type="text"
                    value={masterData.personalInfo.targetTitle}
                    onChange={(e) =>
                      setMasterData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, targetTitle: e.target.value },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-indigo-700 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Email Address</label>
                  <input
                    type="email"
                    value={masterData.personalInfo.email}
                    onChange={(e) =>
                      setMasterData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Phone</label>
                  <input
                    type="text"
                    value={masterData.personalInfo.phone}
                    onChange={(e) =>
                      setMasterData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-500">Location</label>
                  <input
                    type="text"
                    value={masterData.personalInfo.location}
                    onChange={(e) =>
                      setMasterData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Profiles & Links with clear Add / Remove controls */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Online Profiles & Links
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Add or remove links anytime
                  </span>
                </div>

                {/* LinkedIn field */}
                {masterData.personalInfo.linkedin !== undefined && masterData.personalInfo.linkedin !== null && (
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-blue-800 flex items-center gap-1.5">
                        <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                        LinkedIn Profile
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isBuildingNewResume && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSelection((prev) => ({
                                ...prev,
                                hideLinkedin: !prev.hideLinkedin,
                              }))
                            }
                            className={`p-1 rounded text-[10.5px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                              activeSelection.hideLinkedin
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                            title={activeSelection.hideLinkedin ? 'Hidden from this resume' : 'Included in this resume'}
                          >
                            {activeSelection.hideLinkedin ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Excluded</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Included</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setMasterData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, linkedin: '' },
                            }))
                          }
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove LinkedIn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. linkedin.com/in/username"
                      value={masterData.personalInfo.linkedin}
                      onChange={(e) =>
                        setMasterData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, linkedin: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                )}

                {/* GitHub field */}
                {masterData.personalInfo.github !== undefined && masterData.personalInfo.github !== null && (
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-slate-700" />
                        GitHub Profile
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isBuildingNewResume && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSelection((prev) => ({
                                ...prev,
                                hideGithub: !prev.hideGithub,
                              }))
                            }
                            className={`p-1 rounded text-[10.5px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                              activeSelection.hideGithub
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                            }`}
                            title={activeSelection.hideGithub ? 'Hidden from this resume' : 'Included in this resume'}
                          >
                            {activeSelection.hideGithub ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Excluded</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Included</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setMasterData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, github: '' },
                            }))
                          }
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove GitHub"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. github.com/username"
                      value={masterData.personalInfo.github}
                      onChange={(e) =>
                        setMasterData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, github: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                )}

                {/* Portfolio / Website field */}
                {masterData.personalInfo.portfolio !== undefined && masterData.personalInfo.portfolio !== null && (
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-indigo-800 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        Portfolio / Website
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isBuildingNewResume && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSelection((prev) => ({
                                ...prev,
                                hidePortfolio: !prev.hidePortfolio,
                              }))
                            }
                            className={`p-1 rounded text-[10.5px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                              activeSelection.hidePortfolio
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                            }`}
                            title={activeSelection.hidePortfolio ? 'Hidden from this resume' : 'Included in this resume'}
                          >
                            {activeSelection.hidePortfolio ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Excluded</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Included</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setMasterData((prev) => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, portfolio: '' },
                            }))
                          }
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove Portfolio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. yourname.dev or myportfolio.com"
                      value={masterData.personalInfo.portfolio}
                      onChange={(e) =>
                        setMasterData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, portfolio: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                )}

                {/* Custom Links list */}
                {(masterData.personalInfo.customLinks || []).map((link) => (
                  <div key={link.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          setMasterData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              customLinks: (prev.personalInfo.customLinks || []).map((l) =>
                                l.id === link.id ? { ...l, label: e.target.value } : l
                              ),
                            },
                          }))
                        }
                        className="text-[11px] font-semibold text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 max-w-[120px]"
                        placeholder="Label"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMasterData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              customLinks: (prev.personalInfo.customLinks || []).filter(
                                (l) => l.id !== link.id
                              ),
                            },
                          }))
                        }
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                        title="Remove Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. leetcode.com/username or x.com/handle"
                      value={link.url}
                      onChange={(e) =>
                        setMasterData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            customLinks: (prev.personalInfo.customLinks || []).map((l) =>
                              l.id === link.id ? { ...l, url: e.target.value } : l
                            ),
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                ))}

                {/* Add Link / Profile Button */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {(!masterData.personalInfo.linkedin || masterData.personalInfo.linkedin.trim() === '') && (
                    <button
                      type="button"
                      onClick={() =>
                        setMasterData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            linkedin: 'linkedin.com/in/username',
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add LinkedIn</span>
                    </button>
                  )}

                  {(!masterData.personalInfo.github || masterData.personalInfo.github.trim() === '') && (
                    <button
                      type="button"
                      onClick={() =>
                        setMasterData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            github: 'github.com/username',
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add GitHub</span>
                    </button>
                  )}

                  {(!masterData.personalInfo.portfolio || masterData.personalInfo.portfolio.trim() === '') && (
                    <button
                      type="button"
                      onClick={() =>
                        setMasterData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            portfolio: 'myportfolio.dev',
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Portfolio</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const newId = `link-${Date.now()}`;
                      setMasterData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          customLinks: [
                            ...(prev.personalInfo.customLinks || []),
                            { id: newId, label: 'Custom Link', url: '' },
                          ],
                        },
                      }));
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Custom Link</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TOPIC 2: Summaries Bank */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('summaries')}
            className="px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Professional Summaries ({masterData.summaries.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddSummary();
                }}
                className="p-1 hover:bg-slate-200 text-indigo-700 rounded transition-colors"
                title="Add New Summary Variation"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {openSections.summaries ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          {openSections.summaries && (
            <div className="p-3.5 space-y-3">
              {isBuildingNewResume && masterData.summaries.length > 0 && (
                <p className="text-[11px] font-medium text-purple-800 bg-purple-50 p-2 rounded-lg border border-purple-100">
                  Select which summary angle fits the job posting:
                </p>
              )}
              {masterData.summaries.length === 0 && (
                <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs font-medium text-slate-600 mb-1">No summary variations yet</p>
                  <p className="text-[11px] text-slate-400 mb-3">Add tailored elevator pitches for different job roles.</p>
                  <button
                    onClick={handleAddSummary}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Summary</span>
                  </button>
                </div>
              )}
              {masterData.summaries.map((sum) => {
                const isSelected = activeSelection.selectedSummaryId === sum.id;
                return (
                  <div
                    key={sum.id}
                    onClick={() => {
                      if (isBuildingNewResume) selectSummary(sum.id);
                    }}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected && isBuildingNewResume
                        ? 'border-purple-500 bg-purple-50/70 shadow-xs ring-1 ring-purple-400'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    } ${isBuildingNewResume ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isBuildingNewResume && (
                          <div className="text-purple-600">
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 fill-purple-600 text-white" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                        )}
                        <input
                          type="text"
                          value={sum.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMasterData((prev) => ({
                              ...prev,
                              summaries: prev.summaries.map((s) =>
                                s.id === sum.id ? { ...s, title: val } : s
                              ),
                            }));
                          }}
                          className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-hidden"
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMasterData((prev) => ({
                            ...prev,
                            summaries: prev.summaries.filter((s) => s.id !== sum.id),
                          }));
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={sum.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMasterData((prev) => ({
                          ...prev,
                          summaries: prev.summaries.map((s) =>
                            s.id === sum.id ? { ...s, content: val } : s
                          ),
                        }));
                      }}
                      className="w-full text-xs text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-200 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-purple-400 leading-relaxed"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOPIC 3: Work Experience Bank */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('experiences')}
            className="px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Work Experience Repository ({masterData.experiences.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddExperience();
                }}
                className="p-1 hover:bg-slate-200 text-blue-700 rounded transition-colors"
                title="Add New Job Experience"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {openSections.experiences ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          {openSections.experiences && (
            <div className="p-3.5 space-y-3">
              {masterData.experiences.length === 0 && (
                <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs font-medium text-slate-600 mb-1">No work experiences added yet</p>
                  <p className="text-[11px] text-slate-400 mb-3">Add your previous roles, company names, and bullet achievements.</p>
                  <button
                    onClick={handleAddExperience}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Work Experience</span>
                  </button>
                </div>
              )}
              {masterData.experiences.map((exp) => {
                const isSelected = activeSelection.selectedExperienceIds.includes(exp.id);
                return (
                  <div
                    key={exp.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected && isBuildingNewResume
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-400'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        {isBuildingNewResume && (
                          <button
                            onClick={() => toggleExperience(exp.id)}
                            className="cursor-pointer"
                            title="Toggle in New Resume"
                          >
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 fill-blue-600 text-white" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                        )}
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMasterData((prev) => ({
                              ...prev,
                              experiences: prev.experiences.map((item) =>
                                item.id === exp.id ? { ...item, role: val } : item
                              ),
                            }));
                          }}
                          className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-hidden"
                          placeholder="Job Role"
                        />
                        <span className="text-slate-400 text-xs">@</span>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMasterData((prev) => ({
                              ...prev,
                              experiences: prev.experiences.map((item) =>
                                item.id === exp.id ? { ...item, company: val } : item
                              ),
                            }));
                          }}
                          className="text-xs font-semibold text-blue-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-hidden"
                          placeholder="Company"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>
                          {exp.startDate} &ndash; {exp.endDate}
                        </span>
                        <button
                          onClick={() =>
                            setMasterData((prev) => ({
                              ...prev,
                              experiences: prev.experiences.filter((item) => item.id !== exp.id),
                            }))
                          }
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Delete Experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 mt-2">
                      {exp.bullets.map((bullet, bIndex) => (
                        <div key={bIndex} className="flex items-start gap-1.5 text-xs group">
                          <span className="text-slate-400 mt-1 font-bold">&bull;</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMasterData((prev) => ({
                                ...prev,
                                experiences: prev.experiences.map((item) => {
                                  if (item.id !== exp.id) return item;
                                  const updatedBullets = [...item.bullets];
                                  updatedBullets[bIndex] = val;
                                  return { ...item, bullets: updatedBullets };
                                }),
                              }));
                            }}
                            className="w-full text-[11.5px] text-slate-700 bg-transparent hover:bg-slate-50 p-1 rounded border-transparent focus:border-slate-300 focus:bg-white focus:outline-hidden leading-snug"
                          />
                          <button
                            onClick={() => {
                              setMasterData((prev) => ({
                                ...prev,
                                experiences: prev.experiences.map((item) => {
                                  if (item.id !== exp.id) return item;
                                  return {
                                    ...item,
                                    bullets: item.bullets.filter((_, i) => i !== bIndex),
                                  };
                                }),
                              }));
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-0.5 mt-0.5"
                            title="Remove bullet"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setMasterData((prev) => ({
                            ...prev,
                            experiences: prev.experiences.map((item) => {
                              if (item.id !== exp.id) return item;
                              return {
                                ...item,
                                bullets: [
                                  ...item.bullets,
                                  'Led initiative delivering measurable impact on system efficiency.',
                                ],
                              };
                            }),
                          }));
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOPIC 4: Projects Bank */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('projects')}
            className="px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Key Projects ({masterData.projects.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddProject();
                }}
                className="p-1 hover:bg-slate-200 text-emerald-700 rounded transition-colors"
                title="Add New Project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {openSections.projects ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          {openSections.projects && (
            <div className="p-3.5 space-y-3">
              {masterData.projects.length === 0 && (
                <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs font-medium text-slate-600 mb-1">No projects added yet</p>
                  <p className="text-[11px] text-slate-400 mb-3">Add open-source tools, technical systems, or client projects.</p>
                  <button
                    onClick={handleAddProject}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Key Project</span>
                  </button>
                </div>
              )}
              {masterData.projects.map((proj) => {
                const isSelected = activeSelection.selectedProjectIds.includes(proj.id);
                return (
                  <div
                    key={proj.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected && isBuildingNewResume
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-400'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-1">
                        {isBuildingNewResume && (
                          <button
                            onClick={() => toggleProject(proj.id)}
                            className="cursor-pointer"
                            title="Toggle in New Resume"
                          >
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                        )}
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMasterData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === proj.id ? { ...p, name: val } : p
                              ),
                            }));
                          }}
                          className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-hidden"
                          placeholder="Project Name"
                        />
                      </div>
                      <button
                        onClick={() =>
                          setMasterData((prev) => ({
                            ...prev,
                            projects: prev.projects.filter((p) => p.id !== proj.id),
                          }))
                        }
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-2">
                      <span className="font-semibold text-slate-600">Tech Stack:</span>
                      <input
                        type="text"
                        value={proj.techStack.join(', ')}
                        onChange={(e) => {
                          const val = e.target.value.split(',').map((s) => s.trim());
                          setMasterData((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === proj.id ? { ...p, techStack: val } : p
                            ),
                          }));
                        }}
                        className="w-full text-[11px] text-emerald-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                        placeholder="React, TypeScript, Go"
                      />
                    </div>

                    <div className="space-y-1 pl-2 border-l-2 border-slate-200">
                      {proj.bullets.map((bullet, bIndex) => (
                        <div key={bIndex} className="flex items-start gap-1.5 text-xs group">
                          <span className="text-slate-400 mt-1 font-bold">&bull;</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMasterData((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => {
                                  if (p.id !== proj.id) return p;
                                  const updated = [...p.bullets];
                                  updated[bIndex] = val;
                                  return { ...p, bullets: updated };
                                }),
                              }));
                            }}
                            className="w-full text-[11.5px] text-slate-700 bg-transparent hover:bg-slate-50 p-1 rounded border-transparent focus:border-slate-300 focus:bg-white focus:outline-hidden leading-snug"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOPIC 5: Technical Skills Bank */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('skills')}
            className="px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                5. Tech Stacks & Skills ({masterData.skillCategories.length} categories)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddSkillCategory();
                }}
                className="p-1 hover:bg-slate-200 text-cyan-700 rounded transition-colors"
                title="Add New Skill Category"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {openSections.skills ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          {openSections.skills && (
            <div className="p-3.5 space-y-3">
              {masterData.skillCategories.length === 0 && (
                <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs font-medium text-slate-600 mb-1">No skill categories added yet</p>
                  <p className="text-[11px] text-slate-400 mb-3">Group your skills by Languages, Frameworks, Cloud, Databases, etc.</p>
                  <button
                    onClick={handleAddSkillCategory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill Category</span>
                  </button>
                </div>
              )}
              {masterData.skillCategories.map((cat) => {
                const isSelected = activeSelection.selectedSkillCategoryIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected && isBuildingNewResume
                        ? 'border-cyan-500 bg-cyan-50/50 shadow-xs ring-1 ring-cyan-400'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isBuildingNewResume && (
                          <button
                            onClick={() => toggleSkillCategory(cat.id)}
                            className="cursor-pointer"
                            title="Toggle in New Resume"
                          >
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 fill-cyan-600 text-white" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                        )}
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMasterData((prev) => ({
                              ...prev,
                              skillCategories: prev.skillCategories.map((c) =>
                                c.id === cat.id ? { ...c, category: val } : c
                              ),
                            }));
                          }}
                          className="text-xs font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-cyan-500 focus:outline-hidden"
                        />
                      </div>
                      <button
                        onClick={() =>
                          setMasterData((prev) => ({
                            ...prev,
                            skillCategories: prev.skillCategories.filter((c) => c.id !== cat.id),
                          }))
                        }
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={cat.skills.join(', ')}
                      onChange={(e) => {
                        const val = e.target.value.split(',').map((s) => s.trim());
                        setMasterData((prev) => ({
                          ...prev,
                          skillCategories: prev.skillCategories.map((c) =>
                            c.id === cat.id ? { ...c, skills: val } : c
                          ),
                        }));
                      }}
                      className="w-full text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TOPIC 6: Education & Certifications */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('education')}
            className="px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                6. Education & Certifications ({masterData.educations.length + masterData.certifications.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddEducation();
                }}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                title="Add New Degree / Education"
              >
                <Plus className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Education</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCertification();
                }}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                title="Add New Certification"
              >
                <Award className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Certification</span>
              </button>
              {openSections.education ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>

          {openSections.education && (
            <div className="p-3.5 space-y-4">
              {/* SUBSECTION A: Education Degrees */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Academic Degrees ({masterData.educations.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {masterData.educations.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center bg-slate-50 rounded-lg border border-slate-200">
                    No education items added yet. Click &ldquo;Education&rdquo; above to add one.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {masterData.educations.map((edu) => {
                      const isSelected = activeSelection.selectedEducationIds.includes(edu.id);
                      return (
                        <div
                          key={edu.id}
                          className={`p-3 rounded-xl border transition-all space-y-2 ${
                            isSelected && isBuildingNewResume
                              ? 'border-amber-500 bg-amber-50/40 shadow-xs ring-1 ring-amber-400'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {/* Row 1: Select Checkbox, Degree, Field, and Delete */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {isBuildingNewResume && (
                                <button
                                  type="button"
                                  onClick={() => toggleEducation(edu.id)}
                                  className="cursor-pointer shrink-0"
                                  title="Include/Exclude from active resume"
                                >
                                  {isSelected ? (
                                    <CheckCircle2 className="w-4 h-4 fill-amber-600 text-white" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-300" />
                                  )}
                                </button>
                              )}
                              <div className="flex flex-wrap items-center gap-1.5 flex-1 text-xs">
                                <input
                                  type="text"
                                  placeholder="Degree e.g. Bachelor of Science"
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setMasterData((prev) => ({
                                      ...prev,
                                      educations: prev.educations.map((item) =>
                                        item.id === edu.id ? { ...item, degree: val } : item
                                      ),
                                    }));
                                  }}
                                  className="font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 flex-1 min-w-[130px] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                                />
                                <span className="text-slate-400 font-semibold text-[11px]">in</span>
                                <input
                                  type="text"
                                  placeholder="Field e.g. Computer Science"
                                  value={edu.field}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setMasterData((prev) => ({
                                      ...prev,
                                      educations: prev.educations.map((item) =>
                                        item.id === edu.id ? { ...item, field: val } : item
                                      ),
                                    }));
                                  }}
                                  className="font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 flex-1 min-w-[130px] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setMasterData((prev) => ({
                                  ...prev,
                                  educations: prev.educations.filter((item) => item.id !== edu.id),
                                }));
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer shrink-0"
                              title="Delete Degree"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Row 2: Institution, Graduation Year, GPA */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <div className="sm:col-span-1">
                              <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                                Institution / University
                              </label>
                              <input
                                type="text"
                                placeholder="University Name"
                                value={edu.institution}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMasterData((prev) => ({
                                    ...prev,
                                    educations: prev.educations.map((item) =>
                                      item.id === edu.id ? { ...item, institution: val } : item
                                    ),
                                  }));
                                }}
                                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                                Class / Graduation Year
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 2019 or Class of 2024"
                                value={edu.graduationYear}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMasterData((prev) => ({
                                    ...prev,
                                    educations: prev.educations.map((item) =>
                                      item.id === edu.id ? { ...item, graduationYear: val } : item
                                    ),
                                  }));
                                }}
                                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                                GPA (optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 3.8 / 4.0"
                                value={edu.gpa || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMasterData((prev) => ({
                                    ...prev,
                                    educations: prev.educations.map((item) =>
                                      item.id === edu.id ? { ...item, gpa: val } : item
                                    ),
                                  }));
                                }}
                                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                          </div>

                          {/* Row 3: Highlights & Honors */}
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Highlights, Dean&apos;s List & Activities
                            </label>
                            <textarea
                              rows={2}
                              placeholder="e.g. Dean's Honors List, President of Software Engineering Society, Teaching Assistant..."
                              value={edu.highlights || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMasterData((prev) => ({
                                  ...prev,
                                  educations: prev.educations.map((item) =>
                                    item.id === edu.id ? { ...item, highlights: val } : item
                                  ),
                                }));
                              }}
                              className="w-full text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-amber-500 leading-relaxed"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3">
                {/* SUBSECTION B: Certifications */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Certifications & Accreditations ({masterData.certifications.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Certification</span>
                  </button>
                </div>

                {masterData.certifications.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center bg-slate-50 rounded-lg border border-slate-200">
                    No certifications added yet. Click &ldquo;Certification&rdquo; above to add one.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {masterData.certifications.map((cert) => {
                      const isSelected = activeSelection.selectedCertificationIds.includes(cert.id);
                      return (
                        <div
                          key={cert.id}
                          className={`p-3 rounded-xl border transition-all space-y-2 ${
                            isSelected && isBuildingNewResume
                              ? 'border-amber-500 bg-amber-50/40 shadow-xs ring-1 ring-amber-400'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {/* Row 1: Toggle Checkbox, Cert Name, and Delete */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {isBuildingNewResume && (
                                <button
                                  type="button"
                                  onClick={() => toggleCertification(cert.id)}
                                  className="cursor-pointer shrink-0"
                                  title="Include/Exclude from active resume"
                                >
                                  {isSelected ? (
                                    <CheckCircle2 className="w-4 h-4 fill-amber-600 text-white" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-300" />
                                  )}
                                </button>
                              )}
                              <input
                                type="text"
                                placeholder="Certification Name e.g. AWS Certified Solutions Architect"
                                value={cert.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMasterData((prev) => ({
                                    ...prev,
                                    certifications: prev.certifications.map((item) =>
                                      item.id === cert.id ? { ...item, name: val } : item
                                    ),
                                  }));
                                }}
                                className="font-bold text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 flex-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                              />
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              <button
                                type="button"
                                onClick={() => {
                                  setMasterData((prev) => ({
                                    ...prev,
                                    certifications: prev.certifications.filter(
                                      (item) => item.id !== cert.id
                                    ),
                                  }));
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                                title="Delete Certification"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Issuer and Year */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                                Issuing Organization
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Amazon Web Services, Linux Foundation, Google"
                                value={cert.issuer}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMasterData((prev) => ({
                                    ...prev,
                                    certifications: prev.certifications.map((item) =>
                                      item.id === cert.id ? { ...item, issuer: val } : item
                                    ),
                                  }));
                                }}
                                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                                Year Earned
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 2023"
                                value={cert.year}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setMasterData((prev) => ({
                                    ...prev,
                                    certifications: prev.certifications.map((item) =>
                                      item.id === cert.id ? { ...item, year: val } : item
                                    ),
                                  }));
                                }}
                                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                          </div>

                          {/* Row 3: Credential URL (Optional) */}
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                              Credential Verification URL or ID (optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. credly.com/badges/... or ID: 12345"
                              value={cert.credentialUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMasterData((prev) => ({
                                  ...prev,
                                  certifications: prev.certifications.map((item) =>
                                    item.id === cert.id ? { ...item, credentialUrl: val } : item
                                  ),
                                }));
                              }}
                              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
