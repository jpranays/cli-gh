import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, select } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import { fmtState, truncate, timeAgo } from '../../utils/format.js';

export async function listIssues() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const state = await select('Filter by state:', [
    { name: 'Open', value: 'open' },
    { name: 'Closed', value: 'closed' },
    { name: 'All', value: 'all' },
  ]);

  const issues = await withSpinner(`Fetching issues for ${owner}/${repo}…`, () =>
    github.get(`/repos/${owner}/${repo}/issues`, {
      params: { state, per_page: 50 },
    })
  );

  // Issues endpoint also returns PRs; filter them out
  const filtered = issues.filter((i) => !i.pull_request);

  if (!filtered.length) {
    printInfo(`No ${state} issues found.`);
    return;
  }

  const table = createTable(
    ['#', 'Title', 'Author', 'State', 'Labels', 'Opened'],
    filtered.map((i) => [
      c.muted(`#${i.number}`),
      truncate(i.title, 45),
      c.user(i.user.login),
      fmtState(i.state),
      i.labels.map((l) => l.name).join(', ') || c.muted('—'),
      timeAgo(i.created_at),
    ])
  );

  console.log(table.toString());
  printInfo(`${filtered.length} issue(s)  [${state}]`);
}
