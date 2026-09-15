import React, { useState } from 'react';
import { JobApplication } from '../types';
import { MailCheck, Copy, ExternalLink, X, Check, Sparkles } from 'lucide-react';

interface FollowUpEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication | null;
  candidateName: string;
  onMarkFollowedUp: (appId: string) => void;
}

export const FollowUpEmailModal: React.FC<FollowUpEmailModalProps> = ({
  isOpen,
  onClose,
  application,
  candidateName,
  onMarkFollowedUp,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !application) return null;

  const recruiterRecipient =
    application.teamMembers.length > 0
      ? application.teamMembers[0].name
      : 'Hiring Team';
  const targetEmail =
    application.teamMembers.length > 0
      ? application.teamMembers[0].email
      : application.companyHrEmail;

  const subject = `Following up: Application for ${application.jobTitle} - ${candidateName}`;
  const body = `Hi ${recruiterRecipient},

I hope you are having a wonderful week!

I am reaching out to politely follow up on my application for the ${application.jobTitle} position at ${application.companyName}, submitted on ${application.dateApplied}.

I remain very enthusiastic about ${application.companyName}'s mission and the opportunity to bring my technical experience to your engineering team. I wanted to check in and see if you need any additional information or work samples from my end.

Thank you again for your time and consideration, and I look forward to hearing from you.

Warm regards,
${candidateName}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMailto = () => {
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    onMarkFollowedUp(application.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <MailCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Follow-Up Email Drafter</h3>
              <p className="text-xs text-amber-100">
                Tailored for {application.companyName} &bull; {application.jobTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">To Recipient:</span>
              <span className="font-bold text-slate-800">
                {targetEmail} ({recruiterRecipient})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Subject Line:</span>
              <span className="font-medium text-slate-700">{subject}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Generated Email Message:
            </label>
            <textarea
              rows={11}
              readOnly
              value={body}
              className="w-full text-xs font-mono bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-700 leading-relaxed select-all focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={() => {
                onMarkFollowedUp(application.id);
                onClose();
              }}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
            >
              Mark as Followed Up in Tracker
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Email'}</span>
              </button>

              <button
                onClick={handleMailto}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Email App & Mark</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
