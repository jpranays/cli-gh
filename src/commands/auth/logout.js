import { isAuthenticated, clearToken, invalidateCache } from '../../utils/config.js';
import { confirm } from '../../ui/prompt.js';
import { printSuccess, printWarn } from '../../ui/output.js';

export async function logout() {
  if (!isAuthenticated()) {
    printWarn('Not currently logged in.');
    return;
  }

  const ok = await confirm('Remove stored GitHub credentials?', true);
  if (!ok) {
    printWarn('Logout cancelled.');
    return;
  }

  clearToken();
  invalidateCache();
  printSuccess('Logged out. Credentials cleared.');
}
