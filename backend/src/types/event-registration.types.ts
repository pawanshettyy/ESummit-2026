// Event Registration Form Types
export interface TenMinuteMillionForm {
  registrationType: 'ten_minute_million';
  startupName: string;
  cin?: string;
  dpiitCertified?: 'yes' | 'no' | 'applied';
  startupStage?: 'idea' | 'mvp' | 'early_revenue' | 'growth' | 'mature';
  problemStatement: string;
  solution: string;
  usp: string;
  demoLink?: string;
  pitchDeckLink?: string;
}

export interface AngelRoundtableForm {
  registrationType: 'angel_roundtable';
  attendeeType: 'student' | 'entrepreneur' | 'company';
  startupStage?: 'idea' | 'mvp' | 'early_revenue' | 'growth' | 'mature';
  problemStatement: string;
  solution: string;
  usp: string;
  demoLink?: string;
  pitchDeckLink?: string;
}

export interface PitchArenaForm {
  registrationType: 'pitch_arena';
  attendeeType: 'student' | 'startup';
  ideaBrief: string;
  documentLink?: string;
  pitchDeckLink?: string;
}

export type EventRegistrationFormData =
  | TenMinuteMillionForm
  | AngelRoundtableForm
  | PitchArenaForm;