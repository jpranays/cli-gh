import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printBox } from '../../ui/output.js';
import { printKV } from '../../ui/table.js';
import { c } from '../../ui/colors.js';
import { fmtDate, fmtNum, timeAgo } from '../../utils/format.js';
import terminalLink from 'terminal-link';

export async function getPullRequestInfo() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const number = await ask('PR number:');

  const pr = await withSpinner(`Fetching PR #${number}…`, () =>
    github.get(`/repos/${owner}/${repo}/pulls/${number}`)
  );

  const stateColor = pr.merged
    ? c.merged('merged')
    : pr.draft
    ? c.draft('draft')
    : pr.state === 'open'
    ? c.open('open')
    : c.closed('closed');

  printBox(
    `${c.bold(`#${pr.number}`)} — ${pr.title}\n${c.muted(pr.body?.slice(0, 300) ?? 'No description')}`,
    { title: 'Pull Request', borderColor: 'magenta' }
  );

  printKV({
    State: stateColor,
    Author: c.user(pr.user.login),
    'Base ← Head': `${c.branch(pr.base.ref)} ← ${c.branch(pr.head.ref)}`,
    Reviewers: pr.requested_reviewers?.map((r) => r.login).join(', ') || c.muted('—'),
    Assignees: pr.assignees?.map((a) => a.login).join(', ') || c.muted('—'),
    Labels: pr.labels?.map((l) => l.name).join(', ') || c.muted('—'),
    Commits: fmtNum(pr.commits),
    'Files Changed': fmtNum(pr.changed_files),
    Additions: c.success(`+${fmtNum(pr.additions)}`),
    Deletions: c.error(`-${fmtNum(pr.deletions)}`),
    'Merge Ready': pr.mergeable ? c.success('Yes') : c.error('No'),
    Opened: fmtDate(pr.created_at),
    Updated: timeAgo(pr.updated_at),
    URL: terminalLink(pr.html_url, pr.html_url),
  });
}
