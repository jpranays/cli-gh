import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, select } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import { fmtState, truncate, timeAgo } from '../../utils/format.js';

export async function listPullRequests() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const state = await select('Filter by state:', [
    { name: 'Open', value: 'open' },
    { name: 'Closed', value: 'closed' },
    { name: 'All', value: 'all' },
  ]);

  const prs = await withSpinner(`Fetching pull requests for ${owner}/${repo}…`, () =>
    github.get(`/repos/${owner}/${repo}/pulls`, {
      params: { state, per_page: 50 },
    })
  );

  if (!prs.length) {
    printInfo(`No ${state} pull requests found.`);
    return;
  }

  const draftLabel = (pr) => (pr.draft ? c.muted(' [draft]') : '');

  const table = createTable(
    ['#', 'Title', 'Author', 'Base ← Head', 'State', 'Updated'],
    prs.map((pr) => [
      c.muted(`#${pr.number}`),
      truncate(pr.title, 40) + draftLabel(pr),
      c.user(pr.user.login),
      `${c.branch(pr.base.ref)} ← ${c.branch(pr.head.ref)}`,
      fmtState(pr.merged_at ? 'merged' : pr.state),
      timeAgo(pr.updated_at),
    ])
  );

  console.log(table.toString());
  printInfo(`${prs.length} pull request(s)  [${state}]`);
}
