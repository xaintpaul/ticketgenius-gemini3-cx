export enum TicketStatus {
  UNASSIGNED = 'Unassigned',
  ASSIGNED = 'Assigned',
  DELAYED = 'Delayed',
  RESOLVED = 'Resolved'
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  owner: string; // Could be a user name or 'Unassigned'
  status: TicketStatus;
  priority: TicketPriority;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface TicketSuggestion {
  title: string;
  nextAction: string;
  priority: TicketPriority;
  tags: string[];
}
