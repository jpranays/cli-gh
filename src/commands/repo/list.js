import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { createTable } from '../../ui/table.js';
import { printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import { fmtLang, fmtNum, fmtVisibility, timeAgo } from '../../utils/format.js';
import { select } from '../../ui/prompt.js';

export async function listRepositories() {
  requireAuth();

  const sort = await select('Sort by:', [
    { name: 'Recently updated', value: 'updated' },
    { name: 'Name', value: 'full_name' },
    { name: 'Most stars', value: 'stars' },
    { name: 'Recently created', value: 'created' },
  ]);

  const repos = await withSpinner('Fetching repositories…', () =>
    github.get('/user/repos', {
      params: { per_page: 100, sort, affiliation: 'owner,collaborator,organization_member' },
    })
  );

  if (!repos.length) {
    printInfo('No repositories found.');
    return;
  }

  const table = createTable(
    ['Repository', 'Language', '★ Stars', 'Forks', 'Visibility', 'Updated'],
    repos.map((r) => [
      c.repo(r.name),
      fmtLang(r.language),
      fmtNum(r.stargazers_count),
      fmtNum(r.forks_count),
      fmtVisibility(r.private),
      timeAgo(r.updated_at),
    ])
  );

  console.log(table.toString());
  printInfo(`${repos.length} repositories`);
}
