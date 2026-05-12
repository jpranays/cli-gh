import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';

export async function listBranches() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  const [branches, repoData] = await withSpinner(`Fetching branches for ${owner}/${repo}…`, () =>
    Promise.all([
      github.get(`/repos/${owner}/${repo}/branches`, { params: { per_page: 100 } }),
      github.get(`/repos/${owner}/${repo}`),
    ])
  );

  if (!branches.length) {
    printInfo('No branches found.');
    return;
  }

  const defaultBranch = repoData.default_branch;

  const table = createTable(
    ['Branch', 'Type', 'SHA (short)', 'Protected'],
    branches.map((b) => [
      b.name === defaultBranch ? `${c.branch(b.name)} ${c.muted('(default)')}` : c.branch(b.name),
      b.name === defaultBranch ? c.info('default') : '',
      c.muted(b.commit.sha.slice(0, 7)),
      b.protected ? c.warn('✔ Protected') : c.muted('—'),
    ])
  );

  console.log(table.toString());
  printInfo(`${branches.length} branch(es)`);
}
