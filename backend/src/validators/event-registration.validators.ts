import { z } from 'zod';

// Base registration form schema
const baseRegistrationSchema = z.object({
  registrationType: z.enum(['ten_minute_million', 'angel_roundtable', 'pitch_arena', 'simple']),
});

// Ten Minute Deal form validation
export const tenMinuteMillionSchema = baseRegistrationSchema.extend({
  registrationType: z.literal('ten_minute_million'),
  attendeeType: z.enum(['participant', 'audience']),
  startupName: z.string().min(1, 'Startup name is required').max(255).optional(),
  udhyamRegistrationNumber: z.string().min(1, 'UDHYAM Registration Number is required'),
  dpiitCertified: z.enum(['yes', 'no', 'applied']).optional(),
  startupStage: z.enum(['idea', 'mvp', 'early_revenue', 'growth', 'mature']).optional(),
  problemStatement: z.string().min(1, 'Problem statement is required').max(1000).optional(),
  solution: z.string().min(1, 'Solution is required').max(1000).optional(),
  usp: z.string().min(1, 'Unique selling proposition is required').max(500).optional(),
  demoLink: z.string().optional(),
  pitchDeckLink: z.string().optional(),
});

// Angel Roundtable form validation
export const angelRoundtableSchema = baseRegistrationSchema.extend({
  registrationType: z.literal('angel_roundtable'),
  attendeeType: z.enum(['student', 'entrepreneur', 'company', 'audience']),
  startupStage: z.enum(['idea', 'mvp', 'early_revenue', 'growth', 'mature']).optional(),
  problemStatement: z.string().min(1, 'Problem statement is required').max(1000).optional(),
  solution: z.string().min(1, 'Solution is required').max(1000).optional(),
  usp: z.string().min(1, 'Unique selling proposition is required').max(500).optional(),
  demoLink: z.string().optional(),
  pitchDeckLink: z.string().optional(),
});

// Pitch Arena form validation - simplified for discriminated union
export const pitchArenaSchema = baseRegistrationSchema.extend({
  registrationType: z.literal('pitch_arena'),
  attendeeType: z.enum(['student', 'startup', 'audience']),
  startupName: z.string().min(1, 'Startup name is required').max(255).optional(),
  ideaBrief: z.string().optional(),
  documentLink: z.string().optional(),
  pitchDeckLink: z.string().optional(),
});

// Simple registration form validation (for events that don't require detailed forms)
export const simpleRegistrationSchema = baseRegistrationSchema.extend({
  registrationType: z.literal('simple'),
});

// Union type for all registration forms
export const eventRegistrationFormSchema = z.discriminatedUnion('registrationType', [
  tenMinuteMillionSchema,
  angelRoundtableSchema,
  pitchArenaSchema,
  simpleRegistrationSchema,
]);

// Type exports
export type TenMinuteMillionForm = z.infer<typeof tenMinuteMillionSchema>;
export type AngelRoundtableForm = z.infer<typeof angelRoundtableSchema>;
export type PitchArenaForm = z.infer<typeof pitchArenaSchema>;
export type SimpleRegistrationForm = z.infer<typeof simpleRegistrationSchema>;
export type EventRegistrationFormData = z.infer<typeof eventRegistrationFormSchema>;