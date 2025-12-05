import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { analyzeTicketDescription } from '../services/geminiService';
import { X, Sparkles, Loader2, Save } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Ticket) => void;
  existingTicket?: Ticket | null;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, onSave, existingTicket }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<TicketStatus>(TicketStatus.UNASSIGNED);
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [nextAction, setNextAction] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (existingTicket) {
      setTitle(existingTicket.title);
      setDescription(existingTicket.description);
      setOwner(existingTicket.owner);
      setStatus(existingTicket.status);
      setPriority(existingTicket.priority);
      setNextAction(existingTicket.nextAction);
      setTags(existingTicket.tags || []);
    } else {
      resetForm();
    }
  }, [existingTicket, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setOwner('');
    setStatus(TicketStatus.UNASSIGNED);
    setPriority(TicketPriority.MEDIUM);
    setNextAction('');
    setTags([]);
  };

  const handleAnalyze = async () => {
    if (!description) return;
    setIsAnalyzing(true);
    try {
      const suggestion = await analyzeTicketDescription(description);
      if (suggestion) {
        setTitle(suggestion.title);
        setNextAction(suggestion.nextAction);
        setPriority(suggestion.priority);
        setTags(suggestion.tags);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket: Ticket = {
      id: existingTicket?.id || `T-${Math.floor(Math.random() * 10000)}`,
      title,
      description,
      owner: owner || 'Unassigned',
      status,
      priority,
      nextAction,
      tags,
      createdAt: existingTicket?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(ticket);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col border border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-slate-100">
            {existingTicket ? `Edit Ticket ${existingTicket.id}` : 'Create New Ticket'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description / Issue</label>
              <div className="relative">
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none text-sm placeholder-slate-600"
                  placeholder="Describe the issue or request in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!description || isAnalyzing}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-md text-xs font-medium hover:bg-indigo-500/20 disabled:opacity-50 transition-colors border border-indigo-500/20"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Auto-Fill Details
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Tip: Type the description and click "Auto-Fill" to let AI suggest the title, priority, and next steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm placeholder-slate-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Owner</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm placeholder-slate-600"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TicketStatus)}
                >
                  {Object.values(TicketStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                >
                  {Object.values(TicketPriority).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Next Action</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm placeholder-slate-600"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="What needs to happen next?"
              />
            </div>
            
            {tags.length > 0 && (
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                {tag}
                                <button 
                                    type="button"
                                    onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                                    className="ml-1 text-slate-500 hover:text-slate-300"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 transition-all"
            >
              <Save size={16} />
              Save Ticket
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TicketModal;