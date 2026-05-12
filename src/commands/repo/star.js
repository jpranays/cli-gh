import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printSuccess } from '../../ui/output.js';

export async function starRepository() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  await withSpinner(`Starring ${owner}/${repo}…`, () =>
    github.put(`/user/starred/${owner}/${repo}`, undefined)
  );

  printSuccess(`Starred ${owner}/${repo}`);
}

export async function unstarRepository() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  await withSpinner(`Unstarring ${owner}/${repo}…`, () =>
    github.delete(`/user/starred/${owner}/${repo}`)
  );

  printSuccess(`Unstarred ${owner}/${repo}`);
}
