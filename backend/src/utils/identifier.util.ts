import crypto from 'crypto';

/**
 * Generate unique Invoice Number
 * Format: INV-2026-XXXXXXXX
 * Example: INV-2026-A3F7B2C9
 */
export function generateInvoiceNumber(): string {
  const year = '2026';
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `INV-${year}-${randomPart}`;
}

/**
 * Generate unique Transaction Number
 * Format: TXN-2026-XXXXXXXX
 * Example: TXN-2026-D5E8F1A4
 */
export function generateTransactionNumber(): string {
  const year = '2026';
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TXN-${year}-${randomPart}`;
}

/**
 * Generate unique Pass ID
 * Format: ESUMMIT-2026-XXXXX
 * Example: ESUMMIT-2026-K7M2P
 */
export function generatePassId(): string {
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase().substring(0, 5);
  return `ESUMMIT-2026-${randomPart}`;
}

/**
 * Generate all unique identifiers at once
 * Ensures all are unique and properly formatted
 */
export function generateUniqueIdentifiers() {
  return {
    passId: generatePassId(),
    invoiceNumber: generateInvoiceNumber(),
    transactionNumber: generateTransactionNumber(),
  };
}

/**
 * Validate invoice number format
 */
export function isValidInvoiceNumber(invoiceNumber: string): boolean {
  const pattern = /^INV-2026-[A-F0-9]{8}$/;
  return pattern.test(invoiceNumber);
}

/**
 * Validate transaction number format
 */
export function isValidTransactionNumber(transactionNumber: string): boolean {
  const pattern = /^TXN-2026-[A-F0-9]{8}$/;
  return pattern.test(transactionNumber);
}

/**
 * Validate pass ID format
 */
export function isValidPassId(passId: string): boolean {
  const pattern = /^ESUMMIT-2026-[A-Z0-9]{5}$/;
  return pattern.test(passId);
}
