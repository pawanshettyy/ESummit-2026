// Extended Express Request type with user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Pass types (Updated for E-Summit 2026)
export type PassType = 'Pixel Pass' | 'Silicon Pass' | 'Quantum Pass' | 'Gold' | 'Silver' | 'Platinum' | 'Group';

export type PassStatus = 'Active' | 'Cancelled' | 'Refunded';

// Transaction types
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

// Event types (Updated for E-Summit 2026)
export type EventCategory = 'pitching' | 'competitions' | 'workshops' | 'networking' | 'speakers' | 'hackathon';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type EventRegistrationStatus = 'registered' | 'attended' | 'cancelled';

// Check-in types
export type CheckInType = 'venue_entry' | 'event_entry';

// Admin types (Updated for E-Summit 2025)
export type AdminRole = 'Core' | 'JC' | 'OC';

export interface AdminPermissions {
  participants?: boolean;
  scanner?: boolean;
  analytics?: boolean;
  eventIds?: boolean;
  export?: boolean;
  edit?: boolean;
}

// Audit log types
export type AuditAction = 'check_in' | 'refund' | 'edit_pass' | 'create_event' | 'update_event' | 'delete_event';

export type EntityType = 'pass' | 'user' | 'event' | 'transaction' | 'admin';

// Sponsor types
export type SponsorTier = 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
