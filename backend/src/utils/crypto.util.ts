import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Recommended for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypt a utf8 string using AES-256-GCM and a hex key
 * @param plaintext string to encrypt
 * @param hexKey 64-char hex string (32 bytes)
 */
export const encrypt = (plaintext: string, hexKey: string): string => {
  const key = Buffer.from(hexKey, 'hex');
  if (key.length !== 32) throw new Error('Invalid key length, expected 32 bytes (hex)');

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Return iv + authTag + ciphertext as base64
  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
};

/**
 * Decrypt a base64 string produced by encrypt()
 * @param data base64 string containing iv(12) + authTag(16) + ciphertext
 * @param hexKey 64-char hex string (32 bytes)
 */
export const decrypt = (data: string, hexKey: string): string => {
  const key = Buffer.from(hexKey, 'hex');
  if (key.length !== 32) throw new Error('Invalid key length, expected 32 bytes (hex)');

  const buffer = Buffer.from(data, 'base64');
  const iv = buffer.slice(0, IV_LENGTH);
  const authTag = buffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = buffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
};
