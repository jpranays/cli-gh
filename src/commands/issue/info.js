import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printBox, printDivider } from '../../ui/output.js';
import { printKV } from '../../ui/table.js';
import { c } from '../../ui/colors.js';
import { fmtState, fmtDate, timeAgo } from '../../utils/format.js';
import terminalLink from 'terminal-link';

export async function getIssueInfo() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const number = await ask('Issue number:');

  const issue = await withSpinner(`Fetching issue #${number}…`, () =>
    github.get(`/repos/${owner}/${repo}/issues/${number}`)
  );

  printBox(
    `${c.bold(`#${issue.number}`)} — ${issue.title}\n${c.muted(issue.body?.slice(0, 300) ?? 'No description')}`,
    { title: 'Issue', borderColor: 'yellow' }
  );

  printKV({
    State: fmtState(issue.state),
    Author: c.user(issue.user.login),
    Assignees: issue.assignees?.map((a) => a.login).join(', ') || c.muted('—'),
    Labels: issue.labels?.map((l) => l.name).join(', ') || c.muted('—'),
    Milestone: issue.milestone?.title ?? c.muted('—'),
    Comments: String(issue.comments),
    Opened: fmtDate(issue.created_at),
    Updated: timeAgo(issue.updated_at),
    URL: terminalLink(issue.html_url, issue.html_url),
  });
}
