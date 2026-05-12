import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { encrypt, decrypt } from './crypto.js';

const CONFIG_DIR = path.join(os.homedir(), '.cli-gh');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const CONFIG_VERSION = 2;

let _cache = null;

function ensureDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function readConfig() {
  if (_cache) return _cache;

  ensureDir();
  if (!fs.existsSync(CONFIG_FILE)) return {};

  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));

    // Migrate v1 plaintext tokens to v2 encrypted format
    if (raw.githubToken && !raw._version) {
      raw.githubToken = encrypt(raw.githubToken);
      raw._version = CONFIG_VERSION;
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(raw, null, 2), 'utf8');
    }

    _cache = raw;
    return raw;
  } catch {
    return {};
  }
}

export function writeConfig(data) {
  ensureDir();
  const existing = readConfig();
  const merged = { ...existing, ...data, _version: CONFIG_VERSION };
  _cache = merged;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf8');
}

/** Returns the raw decrypted token, or null if not set. */
export function getToken() {
  const cfg = readConfig();
  if (!cfg.githubToken) return null;
  // Handle both encrypted (contains ':') and legacy plaintext formats
  if (cfg.githubToken.includes(':')) {
    return decrypt(cfg.githubToken);
  }
  return cfg.githubToken;
}

/** Stores the token encrypted. */
export function setToken(token) {
  writeConfig({ githubToken: encrypt(token) });
  invalidateCache();
}

export function clearToken() {
  const cfg = { ...readConfig() };
  delete cfg.githubToken;
  _cache = null;
  ensureDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
}

export function isAuthenticated() {
  return Boolean(getToken());
}

/** Invalidate the in-memory config cache (call after login/logout). */
export function invalidateCache() {
  _cache = null;
}
