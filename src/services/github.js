import axios from 'axios';
import pRetry, { AbortError } from 'p-retry';
import { getToken } from '../utils/config.js';
import { apiCache } from './cache.js';
import {
  APIError,
  AuthError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from '../core/errors.js';

const BASE_URL = 'https://api.github.com';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

// Attach fresh token on every request (fixes the module-load-time bug).
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Translate HTTP error codes into typed domain errors.
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      throw new NetworkError(error.message);
    }

    const { status, data, headers } = error.response;

    if (status === 401) throw new AuthError();
    if (status === 404) throw new NotFoundError(error.config?.url ?? 'Resource');
    if (status === 429) {
      throw new RateLimitError(headers['x-ratelimit-reset']);
    }

    const msg = data?.message ?? error.message ?? 'Unknown GitHub API error';
    throw new APIError(msg, status, data);
  }
);

/** Build a deterministic cache key from method + url + params. */
function cacheKey(config) {
  return `${config.method}::${config.url}::${JSON.stringify(config.params ?? {})}`;
}

/**
 * Make a GitHub API request with automatic retry (on 5xx / network errors),
 * GET response caching, and rate-limit awareness.
 *
 * Options:
 *   skipCache: boolean — bypass read cache for this request
 *   cacheTtl:  number  — TTL in ms (default: 5 min)
 */
async function request(config, { skipCache = false, cacheTtl } = {}) {
  const isGet = (config.method ?? 'get').toLowerCase() === 'get';
  const key = isGet ? cacheKey(config) : null;

  // Cache read
  if (isGet && !skipCache && key) {
    const cached = apiCache.get(key);
    if (cached !== null) return cached;
  }

  const result = await pRetry(
    async () => {
      try {
        return await client(config);
      } catch (err) {
        // Never retry auth/not-found/validation errors
        if (
          err instanceof AuthError ||
          err instanceof NotFoundError ||
          err instanceof RateLimitError ||
          (err instanceof APIError && err.statusCode < 500)
        ) {
          throw new AbortError(err);
        }
        throw err;
      }
    },
    {
      retries: 3,
      minTimeout: 1_000,
      factor: 2,
    }
  );

  // Cache write
  if (isGet && key) {
    apiCache.set(key, result.data, cacheTtl);
  }

  return result.data;
}

// Convenience wrappers matching the axios API surface.
export const github = {
  get: (url, config) => request({ ...config, method: 'get', url }),
  post: (url, data, config) => request({ ...config, method: 'post', url, data }),
  patch: (url, data, config) => request({ ...config, method: 'patch', url, data }),
  put: (url, data, config) => request({ ...config, method: 'put', url, data }),
  delete: (url, config) => request({ ...config, method: 'delete', url }),

  /** Invalidate cached responses whose keys contain a given path segment. */
  invalidate: (pathPrefix) => apiCache.invalidatePrefix(pathPrefix),

  /** Raw axios instance for callers that need full Response objects (e.g. login). */
  raw: client,
};
