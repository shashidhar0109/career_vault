export interface SummaryItem {
  id: string;
  title: string;
  content: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  link?: string;
  techStack: string[];
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa?: string;
  highlights?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

export interface PersonalInfo {
  fullName: string;
  targetTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  customLinks?: { id: string; label: string; url: string }[];
}

export interface MasterResumeData {
  personalInfo: PersonalInfo;
  summaries: SummaryItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  educations: EducationItem[];
  certifications: CertificationItem[];
}

export interface ActiveResumeSelection {
  resumeName: string;
  selectedSummaryId: string;
  selectedExperienceIds: string[];
  selectedProjectIds: string[];
  selectedSkillCategoryIds: string[];
  selectedEducationIds: string[];
  selectedCertificationIds: string[];
  themeColor: 'blue' | 'emerald' | 'indigo' | 'violet' | 'rose' | 'amber';
  hideLinkedin?: boolean;
  hideGithub?: boolean;
  hidePortfolio?: boolean;
}

export interface TeamMemberContact {
  id: string;
  name: string;
  title: string;
  email: string;
  linkedin?: string;
  notes?: string;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Phone Screen'
  | 'Technical Interview'
  | 'Final Round'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface JobApplication {
  id: string;
  appNumber: string;
  dateApplied: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeUsedName: string;
  resumeUsedId?: string;
  resumeSource?: 'built' | 'uploaded';
  resumeFileData?: string;
  resumeFileSize?: string;
  companyHrEmail: string;
  teamMembers: TeamMemberContact[];
  status: ApplicationStatus;
  followedUp: boolean;
  lastFollowUpDate?: string;
  followUpNote?: string;
  portalUrl?: string;
  salaryExpectation?: string;
  locationType?: 'Remote' | 'Hybrid' | 'On-site';
  notes?: string;
}

export const INITIAL_MASTER_RESUME: MasterResumeData = {
  personalInfo: {
    fullName: '',
    targetTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    customLinks: [],
  },
  summaries: [],
  experiences: [],
  projects: [],
  skillCategories: [],
  educations: [],
  certifications: [],
};

export const INITIAL_DEFAULT_SELECTION: ActiveResumeSelection = {
  resumeName: 'My_Resume',
  selectedSummaryId: '',
  selectedExperienceIds: [],
  selectedProjectIds: [],
  selectedSkillCategoryIds: [],
  selectedEducationIds: [],
  selectedCertificationIds: [],
  themeColor: 'indigo',
  hideLinkedin: false,
  hideGithub: false,
  hidePortfolio: false,
};

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [];
