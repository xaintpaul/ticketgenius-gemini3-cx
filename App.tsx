import React, { useEffect, useState } from 'react';
import TicketList from './components/TicketList';
import TicketModal from './components/TicketModal';
import { Ticket } from './types';
import { getTickets, saveTicket, deleteTicket, seedInitialData } from './services/ticketService';
import { Plus, Layout, Settings, PieChart, Bell, Menu, Bot, Loader2, Sparkles } from 'lucide-react';
import { generateResolutionSummary } from './services/geminiService';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize data
  useEffect(() => {
    seedInitialData();
    refreshTickets();
  }, []);

  const refreshTickets = () => {
    setTickets(getTickets());
  };

  const handleSaveTicket = (ticket: Ticket) => {
    saveTicket(ticket);
    refreshTickets();
  };

  const handleDeleteTicket = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      deleteTicket(id);
      refreshTickets();
    }
  };

  const openCreateModal = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };
  
  const handleGenerateSummary = async () => {
      setSummary("Generating insights...");
      const textData = tickets.map(t => `[${t.status}] ${t.title}: ${t.description}`).join('\n');
      const result = await generateResolutionSummary(textData);
      setSummary(result);
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col shrink-0 z-30 border-r border-slate-800`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
           <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/50">
                 <Bot size={20} className="text-white"/>
              </div>
              {isSidebarOpen && <span className="font-bold text-lg tracking-tight">TicketGenius</span>}
           </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          <NavItem icon={<Layout size={20} />} label="Dashboard" active isOpen={isSidebarOpen} />
          <NavItem icon={<PieChart size={20} />} label="Analytics" isOpen={isSidebarOpen} />
          <NavItem icon={<Bell size={20} />} label="Notifications" isOpen={isSidebarOpen} count={3} />
          <NavItem icon={<Settings size={20} />} label="Settings" isOpen={isSidebarOpen} />
        </nav>
        
        {isSidebarOpen && (
            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-indigo-400" />
                        <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">AI Insights</h4>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 mb-3 max-h-48 overflow-y-auto custom-scrollbar">
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                            {summary || "Click below to generate a team status report based on active tickets."}
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleGenerateSummary}
                        disabled={summary === "Generating insights..."}
                        className="w-full flex items-center justify-center gap-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-900/20"
                    >
                         {summary === "Generating insights..." ? <Loader2 size={14} className="animate-spin" /> : (summary ? "Refresh Insights" : "Generate Report")}
                    </button>
                </div>
            </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-2">
                 <span className="text-sm font-medium text-slate-200">Support Team</span>
                 <span className="text-xs text-slate-500">Admin</span>
             </div>
             <div className="w-9 h-9 bg-slate-800 rounded-full border-2 border-slate-700 shadow-sm overflow-hidden">
                <img src="https://picsum.photos/200" alt="Avatar" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"/>
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">All Tickets</h1>
                        <p className="text-sm text-slate-400 mt-1">Manage and track your team's support requests.</p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-900/30 transition-all font-medium"
                    >
                        <Plus size={18} />
                        New Ticket
                    </button>
                </div>

                {/* Stats Cards (Mockup) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Total Tickets" value={tickets.length} color="border-indigo-500" />
                    <StatCard label="Unassigned" value={tickets.filter(t => t.status === 'Unassigned').length} color="border-slate-500" />
                    <StatCard label="Critical Priority" value={tickets.filter(t => t.priority === 'Critical').length} color="border-red-500" />
                    <StatCard label="Resolved" value={tickets.filter(t => t.status === 'Resolved').length} color="border-emerald-500" />
                </div>

                {/* Main List */}
                <TicketList 
                    tickets={tickets} 
                    onEdit={openEditModal} 
                    onDelete={handleDeleteTicket} 
                />
            </div>
        </div>

      </main>

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTicket}
        existingTicket={editingTicket}
      />
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, isOpen: boolean, count?: number }> = ({ icon, label, active, isOpen, count }) => (
  <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}>
    <span className={`${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{icon}</span>
    {isOpen && (
        <span className="flex-1 flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            {count && <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{count}</span>}
        </span>
    )}
  </a>
);

const StatCard: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
    <div className={`bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-800 border-l-4 ${color} flex items-center justify-between`}>
        <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
    </div>
)

export default App;