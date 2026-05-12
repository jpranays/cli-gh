import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, select, confirm } from '../../ui/prompt.js';
import { printSuccess, printWarn } from '../../ui/output.js';

export async function mergePullRequest() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const number = await ask('PR number:');

  const pr = await withSpinner(`Fetching PR #${number}…`, () =>
    github.get(`/repos/${owner}/${repo}/pulls/${number}`)
  );

  if (pr.state !== 'open') {
    printWarn(`PR #${number} is ${pr.state} and cannot be merged.`);
    return;
  }
  if (!pr.mergeable) {
    printWarn(`PR #${number} is not currently mergeable (possibly has conflicts).`);
    return;
  }

  const mergeMethod = await select('Merge method:', [
    { name: 'Merge commit', value: 'merge' },
    { name: 'Squash and merge', value: 'squash' },
    { name: 'Rebase and merge', value: 'rebase' },
  ]);

  const commitMsg = await ask('Commit message (blank for default):');
  const ok = await confirm(`Merge PR #${number} "${pr.title}"?`, true);

  if (!ok) {
    printWarn('Merge cancelled.');
    return;
  }

  const payload = { merge_method: mergeMethod };
  if (commitMsg.trim()) payload.commit_message = commitMsg.trim();

  await withSpinner(`Merging PR #${number}…`, () =>
    github.put(`/repos/${owner}/${repo}/pulls/${number}/merge`, payload)
  );

  github.invalidate(`/repos/${owner}/${repo}/pulls`);
  printSuccess(`PR #${number} "${pr.title}" merged via ${mergeMethod}.`);
}
