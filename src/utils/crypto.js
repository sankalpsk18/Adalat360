/**
 * Encryption utilities for ADALAT360
 * AES-256-GCM for file encryption, SHA-256 for hashing
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const TAG_LENGTH = 16; // 128 bits
const KEY_LENGTH = 32; // 256 bits

/**
 * Get master encryption key from environment
 * In production, this should come from a proper key management system (AWS KMS, HashiCorp Vault, etc.)
 */
function getMasterKey() {
  const key = process.env.MASTER_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('MASTER_ENCRYPTION_KEY not set in environment');
  }
  // Ensure key is exactly 32 bytes
  return crypto.createHash('sha256').update(key).digest();
}

/**
 * Encrypt data using AES-256-GCM
 * @param {Buffer|string} data - Data to encrypt
 * @returns {Object} { encrypted: Buffer, iv: Buffer, tag: Buffer }
 */
export function encrypt(data) {
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv,
    tag,
  };
}

/**
 * Decrypt data using AES-256-GCM
 * @param {Buffer} encrypted - Encrypted data
 * @param {Buffer} iv - Initialization vector
 * @param {Buffer} tag - Authentication tag
 * @returns {Buffer} Decrypted data
 */
export function decrypt(encrypted, iv, tag) {
  const key = getMasterKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted;
}

/**
 * Compute SHA-256 hash of data
 * @param {Buffer|string} data - Data to hash
 * @returns {string} Hex-encoded SHA-256 hash
 */
export function sha256(data) {
  const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  return crypto.createHash('sha256').update(dataBuffer).digest('hex');
}

/**
 * Compute SHA-256 hash of multiple values (for custody chain)
 * @param {...string} values - Values to hash together
 * @returns {string} Hex-encoded SHA-256 hash
 */
export function sha256Chain(...values) {
  return crypto.createHash('sha256').update(values.join('|')).digest('hex');
}

/**
 * Generate random bytes
 * @param {number} length - Number of bytes
 * @returns {Buffer} Random bytes
 */
export function randomBytes(length) {
  return crypto.randomBytes(length);
}

/**
 * Generate ECDSA key pair for digital signatures
 * @returns {Object} { publicKey: string, privateKey: string } in PEM format
 */
export function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}

/**
 * Sign data with ECDSA private key
 * @param {string} privateKeyPem - Private key in PEM format
 * @param {string|Buffer} data - Data to sign
 * @returns {string} Base64-encoded signature
 */
export function sign(privateKeyPem, data) {
  const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  const sign = crypto.createSign('SHA256');
  sign.update(dataBuffer);
  sign.end();
  return sign.sign(privateKeyPem, 'base64');
}

/**
 * Verify ECDSA signature
 * @param {string} publicKeyPem - Public key in PEM format
 * @param {string|Buffer} data - Data that was signed
 * @param {string} signature - Base64-encoded signature
 * @returns {boolean} True if valid
 */
export function verify(publicKeyPem, data, signature) {
  const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
  const verify = crypto.createVerify('SHA256');
  verify.update(dataBuffer);
  verify.end();
  return verify.verify(publicKeyPem, Buffer.from(signature, 'base64'));
}

/**
 * Encrypt private key with master key for storage
 * @param {string} privateKeyPem - Private key in PEM format
 * @returns {string} Encrypted private key (base64)
 */
export function encryptPrivateKey(privateKeyPem) {
  const { encrypted, iv, tag } = encrypt(privateKeyPem);
  // Store as: iv:tag:encrypted (all base64)
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

/**
 * Decrypt private key from storage
 * @param {string} encryptedKey - Encrypted key string (iv:tag:encrypted)
 * @returns {string} Private key in PEM format
 */
export function decryptPrivateKey(encryptedKey) {
  const [ivB64, tagB64, encryptedB64] = encryptedKey.split(':');
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const encrypted = Buffer.from(encryptedB64, 'base64');
  const decrypted = decrypt(encrypted, iv, tag);
  return decrypted.toString('utf8');
}