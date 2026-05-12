import crypto from 'node:crypto';
import os from 'node:os';

/** Derives a 32-byte AES key from machine-specific material. */
function getKey() {
  const material = `cli-gh-v1::${os.hostname()}::${os.userInfo().username}`;
  return crypto.createHash('sha256').update(material).digest();
}

export function encrypt(plaintext) {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(encoded) {
  try {
    const [ivHex, tagHex, encHex] = encoded.split(':');
    const key = getKey();
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    const decrypted =
      decipher.update(Buffer.from(encHex, 'hex')) + decipher.final('utf8');
    return decrypted;
  } catch {
    return null; // decryption failed (e.g. different machine or corrupt data)
  }
}

/** Returns a masked version of a secret for safe display. */
export function maskSecret(secret, visible = 4) {
  if (!secret || secret.length <= visible) return '****';
  return `${'*'.repeat(secret.length - visible)}${secret.slice(-visible)}`;
}
