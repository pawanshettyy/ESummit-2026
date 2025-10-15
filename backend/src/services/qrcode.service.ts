import QRCode from 'qrcode';
import logger from '../utils/logger.util';
import { encrypt, decrypt } from '../utils/crypto.util';

const QR_SECRET_KEY = process.env.QR_SECRET_KEY || '';
if (process.env.NODE_ENV !== 'test' && !QR_SECRET_KEY) {
  // don't throw in tests; in production warn if missing
  logger.warn('QR_SECRET_KEY is not set. Encrypted QR functions will not be available.');
}

/**
 * Generate QR code data URL for a pass
 * @param passId - Unique pass identifier
 * @returns Data URL of the QR code image
 */
export const generateQRCode = async (passId: string): Promise<string> => {
  try {
    // Create QR code data object with pass information
    const qrData = {
      passId,
      type: 'ESUMMIT_2026_PASS',
      timestamp: new Date().toISOString(),
      version: '1.0',
    };

    // Convert to JSON string
    const qrString = JSON.stringify(qrData);

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'H', // High error correction
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    logger.info(`QR code generated for pass: ${passId}`);
    return qrCodeDataURL;
  } catch (error: any) {
    logger.error('QR code generation error:', error);
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

/**
 * Verify QR code data
 * @param qrData - QR code data string (JSON)
 * @returns Parsed and validated QR data
 */
export const verifyQRCode = (qrData: string): {
  passId: string;
  type: string;
  timestamp: string;
  version: string;
} => {
  try {
    const parsed = JSON.parse(qrData);

    // Validate required fields
    if (!parsed.passId || !parsed.type || parsed.type !== 'ESUMMIT_2026_PASS') {
      throw new Error('Invalid QR code format');
    }

    return {
      passId: parsed.passId,
      type: parsed.type,
      timestamp: parsed.timestamp,
      version: parsed.version,
    };
  } catch (error: any) {
    logger.error('QR code verification error:', error);
    throw new Error('Invalid QR code');
  }
};

/**
 * Generate QR code as buffer (for file storage)
 * @param passId - Unique pass identifier
 * @returns Buffer of the QR code image
 */
export const generateQRCodeBuffer = async (passId: string): Promise<Buffer> => {
  try {
    const qrData = {
      passId,
      type: 'ESUMMIT_2026_PASS',
      timestamp: new Date().toISOString(),
      version: '1.0',
    };

    const qrString = JSON.stringify(qrData);

    // Generate QR code as buffer
    const buffer = await QRCode.toBuffer(qrString, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    logger.info(`QR code buffer generated for pass: ${passId}`);
    return buffer;
  } catch (error: any) {
    logger.error('QR code buffer generation error:', error);
    throw new Error(`Failed to generate QR code buffer: ${error.message}`);
  }
};

/**
 * Generate an encrypted QR code data URL using AES-256-GCM
 * @param passId unique pass identifier
 */
export const generateEncryptedQRCode = async (passId: string): Promise<string> => {
  if (!QR_SECRET_KEY) throw new Error('QR_SECRET_KEY not configured');

  const qrData = {
    passId,
    type: 'ESUMMIT_2026_PASS',
    timestamp: new Date().toISOString(),
    version: '1.0',
  };

  const plaintext = JSON.stringify(qrData);
  const encrypted = encrypt(plaintext, QR_SECRET_KEY);

  // Generate QR code for the encrypted payload
  const dataUrl = await QRCode.toDataURL(encrypted, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 2,
    width: 300,
  });

  logger.info(`Encrypted QR code generated for pass: ${passId}`);
  return dataUrl;
};

/**
 * Generate an encrypted QR code as buffer (for storage)
 */
export const generateEncryptedQRCodeBuffer = async (passId: string): Promise<Buffer> => {
  if (!QR_SECRET_KEY) throw new Error('QR_SECRET_KEY not configured');

  const qrData = {
    passId,
    type: 'ESUMMIT_2026_PASS',
    timestamp: new Date().toISOString(),
    version: '1.0',
  };

  const plaintext = JSON.stringify(qrData);
  const encrypted = encrypt(plaintext, QR_SECRET_KEY);

  const buffer = await QRCode.toBuffer(encrypted, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 2,
    width: 300,
  });

  logger.info(`Encrypted QR code buffer generated for pass: ${passId}`);
  return buffer;
};

/**
 * Verify and decrypt an encrypted QR payload string
 * @param encryptedData string (base64 produced by encrypt)
 * @param maxAgeMinutes maximum age of the QR code in minutes (default: 5)
 */
export const verifyEncryptedQRCode = (
  encryptedData: string,
  maxAgeMinutes: number = 5
): { passId: string; type: string; timestamp: string; version: string } => {
  if (!QR_SECRET_KEY) throw new Error('QR_SECRET_KEY not configured');
  try {
    const decrypted = decrypt(encryptedData, QR_SECRET_KEY);
    const parsed = JSON.parse(decrypted);
    
    // Validate required fields
    if (!parsed.passId || parsed.type !== 'ESUMMIT_2026_PASS') {
      throw new Error('Invalid encrypted QR payload');
    }

    // Validate timestamp (replay protection)
    if (parsed.timestamp) {
      const qrTimestamp = new Date(parsed.timestamp).getTime();
      const now = Date.now();
      const ageMinutes = (now - qrTimestamp) / (1000 * 60);

      if (ageMinutes > maxAgeMinutes) {
        logger.warn(`QR code expired for pass ${parsed.passId} (age: ${ageMinutes.toFixed(1)} minutes)`);
        throw new Error('QR code expired');
      }

      if (ageMinutes < 0) {
        logger.warn(`QR code timestamp is in the future for pass ${parsed.passId}`);
        throw new Error('Invalid QR code timestamp');
      }
    }

    return {
      passId: parsed.passId,
      type: parsed.type,
      timestamp: parsed.timestamp,
      version: parsed.version,
    };
  } catch (err: any) {
    logger.error('Encrypted QR verification failed', err);
    throw new Error(err.message || 'Invalid encrypted QR');
  }
};
