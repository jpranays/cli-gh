import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { confirm } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printInfo, printSuccess } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import { truncate, timeAgo } from '../../utils/format.js';

const reasonColor = (reason) => {
  switch (reason) {
    case 'mention': return c.warn(reason);
    case 'assign': return c.info(reason);
    case 'review_requested': return c.pr(reason);
    default: return c.muted(reason);
  }
};

const subjectIcon = (type) => {
  switch (type) {
    case 'PullRequest': return '⟶';
    case 'Issue': return '●';
    case 'Release': return '⬆';
    case 'Commit': return '◆';
    default: return '○';
  }
};

export async function listNotifications() {
  requireAuth();

  const notifications = await withSpinner('Fetching notifications…', () =>
    github.get('/notifications', {
      params: { per_page: 50, all: false },
      skipCache: true,
    })
  );

  if (!notifications.length) {
    printInfo('No unread notifications. You\'re all caught up!');
    return;
  }

  const table = createTable(
    ['Type', 'Repository', 'Subject', 'Reason', 'Updated'],
    notifications.map((n) => [
      subjectIcon(n.subject.type),
      c.muted(n.repository.full_name),
      truncate(n.subject.title, 45),
      reasonColor(n.reason),
      timeAgo(n.updated_at),
    ])
  );

  console.log(table.toString());
  printInfo(`${notifications.length} unread notification(s)`);

  const markAll = await confirm('\nMark all as read?', false);
  if (markAll) {
    await withSpinner('Marking all as read…', () =>
      github.put('/notifications', { last_read_at: new Date().toISOString() })
    );
    printSuccess('All notifications marked as read.');
  }
}
