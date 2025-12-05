import { Ticket, TicketStatus, TicketPriority } from "../types";

const STORAGE_KEY = 'ticket_genius_data';

export const getTickets = (): Ticket[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTicket = (ticket: Ticket): void => {
  const tickets = getTickets();
  const existingIndex = tickets.findIndex(t => t.id === ticket.id);
  
  if (existingIndex >= 0) {
    tickets[existingIndex] = ticket;
  } else {
    tickets.push(ticket);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const deleteTicket = (id: string): void => {
  const tickets = getTickets();
  const filtered = tickets.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const seedInitialData = (): void => {
  const current = getTickets();
  if (current.length === 0) {
    const initialTickets: Ticket[] = [
      {
        id: 'T-1001',
        title: 'Login Page Timeout',
        description: 'Users report the login page spins indefinitely on 3G networks.',
        owner: 'Sarah Engineer',
        status: TicketStatus.ASSIGNED,
        priority: TicketPriority.HIGH,
        nextAction: 'Check timeout configurations in load balancer.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['Performance', 'Auth']
      },
      {
        id: 'T-1002',
        title: 'Feature Request: Dark Mode',
        description: 'Client A wants a dark mode for the dashboard.',
        owner: 'Unassigned',
        status: TicketStatus.UNASSIGNED,
        priority: TicketPriority.LOW,
        nextAction: 'Discuss in next product roadmap meeting.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['UX', 'Feature']
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTickets));
  }
};
