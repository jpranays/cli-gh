import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm } from '../../ui/prompt.js';
import { printSuccess, printWarn } from '../../ui/output.js';

export async function deleteRepository() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  printWarn(`This will permanently delete ${owner}/${repo}.`);
  const confirmed = await confirm(
    `Type repository name to confirm (${repo}):`,
    false
  );

  if (!confirmed) {
    printWarn('Deletion cancelled.');
    return;
  }

  await withSpinner(`Deleting ${owner}/${repo}…`, () =>
    github.delete(`/repos/${owner}/${repo}`)
  );

  github.invalidate(`/repos/${owner}/${repo}`);
  printSuccess(`Repository ${owner}/${repo} deleted.`);
}
