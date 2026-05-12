import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import { fmtVisibility, truncate, timeAgo } from '../../utils/format.js';
import terminalLink from 'terminal-link';

export async function listGists() {
  requireAuth();

  const forUser = await ask('GitHub username (blank for your gists):');

  const endpoint = forUser.trim() ? `/users/${forUser.trim()}/gists` : '/gists';

  const gists = await withSpinner('Fetching gists…', () =>
    github.get(endpoint, { params: { per_page: 50 } })
  );

  if (!gists.length) {
    printInfo('No gists found.');
    return;
  }

  const table = createTable(
    ['ID (short)', 'Description', 'Files', 'Visibility', 'Updated'],
    gists.map((g) => [
      terminalLink(g.id.slice(0, 8), g.html_url),
      truncate(g.description || c.muted('(no description)'), 45),
      String(Object.keys(g.files).length),
      fmtVisibility(!g.public),
      timeAgo(g.updated_at),
    ])
  );

  console.log(table.toString());
  printInfo(`${gists.length} gist(s)`);
}
