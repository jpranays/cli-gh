import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printSuccess } from '../../ui/output.js';
import { c } from '../../ui/colors.js';

export async function createBranch() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const newBranch = await ask('New branch name:');
  const baseBranch = await ask('Base branch:', { default: 'main' });

  // Resolve the SHA of the base branch
  const baseRef = await withSpinner(`Resolving ${baseBranch}…`, () =>
    github.get(`/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`)
  );
  const sha = baseRef.object.sha;

  await withSpinner(`Creating branch ${newBranch}…`, () =>
    github.post(`/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${newBranch}`,
      sha,
    })
  );

  github.invalidate(`/repos/${owner}/${repo}/branches`);
  printSuccess(`Branch ${c.branch(newBranch)} created from ${c.branch(baseBranch)}`);
}
