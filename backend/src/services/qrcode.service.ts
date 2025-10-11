import QRCode from 'qrcode';
import logger from '../utils/logger.util';

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
      type: 'ESUMMIT_2025_PASS',
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
    if (!parsed.passId || !parsed.type || parsed.type !== 'ESUMMIT_2025_PASS') {
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
      type: 'ESUMMIT_2025_PASS',
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
