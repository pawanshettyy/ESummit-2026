// Extended Express Request type with user
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Pass types (Updated for E-Summit 2026)
export type PassType = 'Pixel Pass' | 'Silicon Pass' | 'Quantum Pass' | 'Exhibitors Pass' | 'TCET Student Pass' | 'Gold' | 'Silver' | 'Platinum' | 'Group';

export type PassStatus = 'Active' | 'Cancelled' | 'Refunded';

// Transaction types
// Transaction and payment method types removed (KonfHub handles payments)


// Event types (Updated for E-Summit 2026)
export type EventCategory = 'pitching' | 'competitions' | 'workshops' | 'networking' | 'speakers' | 'hackathon';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

// Audit log types
export type AuditAction = 'refund' | 'edit_pass' | 'create_event' | 'update_event' | 'delete_event';

export type EntityType = 'pass' | 'user' | 'event';

// Sponsor types
export type SponsorTier = 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
