import { isAuthenticated } from '../utils/config.js';
import { AuthError } from '../core/errors.js';

/**
 * Throws AuthError if no token is stored.
 * Call at the top of any command that requires authentication.
 */
export function requireAuth() {
  if (!isAuthenticated()) {
    throw new AuthError();
  }
}
