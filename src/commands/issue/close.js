import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm } from '../../ui/prompt.js';
import { printSuccess, printWarn } from '../../ui/output.js';

export async function closeIssue() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const number = await ask('Issue number:');

  const ok = await confirm(`Close issue #${number}?`, true);
  if (!ok) {
    printWarn('Cancelled.');
    return;
  }

  await withSpinner(`Closing issue #${number}…`, () =>
    github.patch(`/repos/${owner}/${repo}/issues/${number}`, { state: 'closed' })
  );

  github.invalidate(`/repos/${owner}/${repo}/issues`);
  printSuccess(`Issue #${number} closed.`);
}
