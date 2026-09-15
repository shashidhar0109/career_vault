import React, { useState } from 'react';
import { TeamMemberContact } from '../types';
import { UserPlus, X, Mail, Briefcase, User, Trash2 } from 'lucide-react';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  existingMembers: TeamMemberContact[];
  onSaveMembers: (members: TeamMemberContact[]) => void;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  companyName,
  existingMembers,
  onSaveMembers,
}) => {
  const [members, setMembers] = useState<TeamMemberContact[]>(existingMembers);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newContact: TeamMemberContact = {
      id: `tm-${Date.now()}`,
      name: newName.trim(),
      title: newTitle.trim() || 'Team Member',
      email: newEmail.trim(),
      notes: newNotes.trim(),
    };

    const updated = [...members, newContact];
    setMembers(updated);
    onSaveMembers(updated);

    // Reset inputs
    setNewName('');
    setNewTitle('');
    setNewEmail('');
    setNewNotes('');
  };

  const handleDelete = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    onSaveMembers(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Company Members & Recruiters</h3>
              <p className="text-xs text-slate-400">Manage contacts at {companyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Members List */}
        <div className="p-6 space-y-4 max-h-[320px] overflow-y-auto">
          {members.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No specific team members logged yet. Add recruiters, hiring managers, or interviewers below!
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Contacts ({members.length})
              </span>
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{m.name}</span>
                      <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        {m.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <a href={`mailto:${m.email}`} className="hover:underline text-blue-600">
                        {m.email}
                      </a>
                    </div>
                    {m.notes && <div className="text-[11px] text-slate-500 italic mt-0.5">{m.notes}</div>}
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Form */}
          <form onSubmit={handleAdd} className="pt-4 border-t border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              Add New Team Member / Recruiter:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Job Title / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Technical Recruiter / Staff Eng"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="e.g. alex.rivera@company.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Notes / Context</label>
              <input
                type="text"
                placeholder="e.g. Hiring Manager, scheduled 45m screen"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
