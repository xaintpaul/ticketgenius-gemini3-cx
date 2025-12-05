import React from 'react';
import { TicketStatus, TicketPriority } from '../types';

interface StatusBadgeProps {
  status: TicketStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = (s: TicketStatus) => {
    switch (s) {
      case TicketStatus.RESOLVED:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case TicketStatus.DELAYED:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case TicketStatus.ASSIGNED:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case TicketStatus.UNASSIGNED:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(status)}`}>
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
    const getStyles = (p: TicketPriority) => {
        switch (p) {
            case TicketPriority.CRITICAL:
                return 'text-red-400 bg-red-400/10 ring-red-400/20';
            case TicketPriority.HIGH:
                return 'text-orange-400 bg-orange-400/10 ring-orange-400/20';
            case TicketPriority.MEDIUM:
                return 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/20';
            case TicketPriority.LOW:
                return 'text-slate-400 bg-slate-400/10 ring-slate-400/20';
        }
    }
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStyles(priority)}`}>
            {priority}
        </span>
    )
}