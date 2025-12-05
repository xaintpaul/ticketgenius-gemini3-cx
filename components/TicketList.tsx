import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../types';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Filters Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search tickets by ID, title, or owner..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-700 bg-slate-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all text-slate-200 placeholder-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-500" />
          <select
            className="px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 bg-slate-950 focus:border-indigo-500 outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticket ID</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-1/3">Subject & Description</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Next Action</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-medium text-slate-300">{ticket.id}</span>
                    <div className="text-xs text-slate-500 mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-200 mb-1">{ticket.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-2">{ticket.description}</div>
                    {ticket.tags && ticket.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                            {ticket.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[10px] uppercase font-bold tracking-wide">{tag}</span>
                            ))}
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center text-xs font-bold">
                            {ticket.owner.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-400 truncate max-w-[100px]">{ticket.owner}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400 line-clamp-2" title={ticket.nextAction}>
                      {ticket.nextAction || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(ticket)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition-colors"
                        title="Edit Ticket"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(ticket.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                         title="Delete Ticket"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                        <Search size={24} className="text-slate-600"/>
                    </div>
                    <p className="text-sm">No tickets found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-xl text-xs text-slate-500 flex justify-between">
           <span>Showing {filteredTickets.length} tickets</span>
           <span>Last updated: {new Date().toLocaleTimeString()}</span>
       </div>
    </div>
  );
};

export default TicketList;