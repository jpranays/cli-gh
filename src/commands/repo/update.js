import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm } from '../../ui/prompt.js';
import { printSuccess } from '../../ui/output.js';

export async function updateRepository() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const name = await ask('New name (leave blank to keep):');
  const description = await ask('New description (leave blank to keep):');
  const homepage = await ask('New homepage URL (leave blank to keep):');
  const makePrivate = await confirm('Make repository private?', false);

  const payload = {};
  if (name.trim()) payload.name = name.trim();
  if (description.trim()) payload.description = description;
  if (homepage.trim()) payload.homepage = homepage;
  payload.private = makePrivate;

  await withSpinner(`Updating ${owner}/${repo}…`, () =>
    github.patch(`/repos/${owner}/${repo}`, payload)
  );

  printSuccess(`Repository ${owner}/${name.trim() || repo} updated.`);
  github.invalidate(`/repos/${owner}/${repo}`);
}
