import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, select } from '../../ui/prompt.js';
import { printSuccess } from '../../ui/output.js';

export async function updateIssue() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const number = await ask('Issue number:');
  const title = await ask('New title (blank to keep):');
  const body = await ask('New body (blank to keep):');
  const state = await select('State:', [
    { name: 'Keep current', value: '' },
    { name: 'Open', value: 'open' },
    { name: 'Closed', value: 'closed' },
  ]);

  const payload = {};
  if (title.trim()) payload.title = title.trim();
  if (body.trim()) payload.body = body;
  if (state) payload.state = state;

  if (!Object.keys(payload).length) {
    printSuccess('Nothing to update.');
    return;
  }

  await withSpinner(`Updating issue #${number}…`, () =>
    github.patch(`/repos/${owner}/${repo}/issues/${number}`, payload)
  );

  github.invalidate(`/repos/${owner}/${repo}/issues`);
  printSuccess(`Issue #${number} updated.`);
}
