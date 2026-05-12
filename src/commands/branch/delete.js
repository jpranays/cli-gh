import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm } from '../../ui/prompt.js';
import { printSuccess, printWarn } from '../../ui/output.js';
import { c } from '../../ui/colors.js';

export async function deleteBranch() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const branch = await ask('Branch to delete:');

  printWarn(`This will delete the branch ${c.branch(branch)} from ${owner}/${repo}.`);
  const ok = await confirm('Confirm deletion?', false);

  if (!ok) {
    printWarn('Cancelled.');
    return;
  }

  await withSpinner(`Deleting branch ${branch}…`, () =>
    github.delete(`/repos/${owner}/${repo}/git/refs/heads/${branch}`)
  );

  github.invalidate(`/repos/${owner}/${repo}/branches`);
  printSuccess(`Branch ${c.branch(branch)} deleted.`);
}
