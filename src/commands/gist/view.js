import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, select } from '../../ui/prompt.js';
import { printBox, printDivider } from '../../ui/output.js';
import { printKV } from '../../ui/table.js';
import { c } from '../../ui/colors.js';
import { fmtDate, fmtVisibility, timeAgo } from '../../utils/format.js';
import terminalLink from 'terminal-link';
import axios from 'axios';

export async function viewGist() {
  requireAuth();

  const gistId = await ask('Gist ID (full or partial):');

  const gist = await withSpinner(`Fetching gist ${gistId}…`, () =>
    github.get(`/gists/${gistId}`)
  );

  printBox(
    `${c.bold(gist.description || '(no description)')}\n` +
    `${c.muted('by')} ${c.user(gist.owner?.login ?? 'unknown')}  ${fmtVisibility(!gist.public)}`,
    { title: 'Gist', borderColor: 'cyan' }
  );

  const files = Object.keys(gist.files);

  printKV({
    ID: gist.id,
    URL: terminalLink(gist.html_url, gist.html_url),
    Created: fmtDate(gist.created_at),
    Updated: timeAgo(gist.updated_at),
    Comments: String(gist.comments),
    Files: files.join(', '),
  });

  if (files.length > 0) {
    const chosen = files.length === 1
      ? files[0]
      : await select('View file contents:', files.map((f) => ({ name: f, value: f })));

    const rawUrl = gist.files[chosen]?.raw_url;
    if (rawUrl) {
      const { data: rawContent } = await withSpinner('Loading file…', () => axios.get(rawUrl));
      printDivider(chosen);
      console.log(rawContent);
      printDivider();
    }
  }
}
