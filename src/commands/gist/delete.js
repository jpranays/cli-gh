import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm } from '../../ui/prompt.js';
import { printSuccess, printWarn } from '../../ui/output.js';

export async function deleteGist() {
  requireAuth();

  const gistId = await ask('Gist ID to delete:');
  const ok = await confirm(`Permanently delete gist ${gistId}?`, false);

  if (!ok) {
    printWarn('Cancelled.');
    return;
  }

  await withSpinner(`Deleting gist…`, () => github.delete(`/gists/${gistId}`));

  github.invalidate('/gists');
  printSuccess(`Gist ${gistId} deleted.`);
}
