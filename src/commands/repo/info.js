import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printBox } from '../../ui/output.js';
import { printKV } from '../../ui/table.js';
import { c } from '../../ui/colors.js';
import { fmtDate, fmtLang, fmtNum, fmtVisibility, timeAgo } from '../../utils/format.js';
import terminalLink from 'terminal-link';

export async function getRepositoryInfo() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  const r = await withSpinner(`Fetching ${owner}/${repo}…`, () =>
    github.get(`/repos/${owner}/${repo}`)
  );

  const link = terminalLink(r.html_url, r.html_url);

  printBox(`${c.bold(r.full_name)}\n${c.muted(r.description || 'No description')}`, {
    title: 'Repository',
    borderColor: 'cyan',
  });

  printKV({
    URL: link,
    Language: fmtLang(r.language),
    Stars: fmtNum(r.stargazers_count),
    Forks: fmtNum(r.forks_count),
    Watchers: fmtNum(r.watchers_count),
    'Open Issues': fmtNum(r.open_issues_count),
    Visibility: fmtVisibility(r.private),
    'Default Branch': r.default_branch,
    Created: fmtDate(r.created_at),
    Updated: timeAgo(r.updated_at),
    Homepage: r.homepage || c.muted('—'),
    License: r.license?.name ?? c.muted('—'),
    Topics: r.topics?.join(', ') || c.muted('—'),
  });
}
