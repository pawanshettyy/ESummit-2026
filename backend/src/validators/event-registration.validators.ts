import { z } from 'zod';

// Base registration form schema
const baseRegistrationSchema = z.object({
  registrationType: z.enum(['ten_minute_million', 'angel_roundtable', 'pitch_arena']),
});

// Ten Minute Deal form validation
export const tenMinuteMillionSchema = baseRegistrationSchema.extend({
  registrationType: z.literal('ten_minute_million'),
  attendeeType: z.enum(['participant', 'audience']),
  startupName: z.string().min(1, 'Startup name is required').max(255).optional(),
  cin: z.string().optional(),
  dpiitCertified: z.enum(['yes', 'no', 'applied']).optional(),
  startupStage: z.enum(['idea', 'mvp', 'early_revenue', 'growth', 'mature']).optional(),
  problemStatement: z.string().min(1, 'Problem statement is required').max(1000).optional(),
  solution: z.string().min(1, 'Solution is required').max(1000).optional(),
  usp: z.string().min(1, 'Unique selling proposition is required').max(500).optional(),
  demoLink: z.string().url('Invalid demo link').optional().or(z.literal('')),
  pitchDeckLink: z.string().url('Invalid pitch deck link').optional().or(z.literal('')),
});

// Angel Roundtable form validation
export const angelRoundtableSchema = baseRegistrationSchema.extend({
  registrationType: z.literal('angel_roundtable'),
  attendeeType: z.enum(['student', 'entrepreneur', 'company', 'audience']),
  startupStage: z.enum(['idea', 'mvp', 'early_revenue', 'growth', 'mature']).optional(),
  problemStatement: z.string().min(1, 'Problem statement is required').max(1000).optional(),
  solution: z.string().min(1, 'Solution is required').max(1000).optional(),
  usp: z.string().min(1, 'Unique selling proposition is required').max(500).optional(),
  demoLink: z.string().url('Invalid demo link').optional().or(z.literal('')),
  pitchDeckLink: z.string().url('Invalid pitch deck link').optional().or(z.literal('')),
});

// Pitch Arena form validation
export const pitchArenaSchema = baseRegistrationSchema.extend({
  registrationType: z.literal('pitch_arena'),
  attendeeType: z.enum(['student', 'startup', 'audience']),
  ideaBrief: z.string().min(1, 'Idea brief is required').max(500).optional(),
  documentLink: z.string().url('Invalid document link').optional().or(z.literal('')),
  pitchDeckLink: z.string().url('Invalid pitch deck link').optional().or(z.literal('')),
});

// Union type for all registration forms
export const eventRegistrationFormSchema = z.discriminatedUnion('registrationType', [
  tenMinuteMillionSchema,
  angelRoundtableSchema,
  pitchArenaSchema,
]);

// Type exports
export type TenMinuteMillionForm = z.infer<typeof tenMinuteMillionSchema>;
export type AngelRoundtableForm = z.infer<typeof angelRoundtableSchema>;
export type PitchArenaForm = z.infer<typeof pitchArenaSchema>;
export type EventRegistrationFormData = z.infer<typeof eventRegistrationFormSchema>;