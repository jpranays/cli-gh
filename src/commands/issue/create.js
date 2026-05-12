import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, editor } from '../../ui/prompt.js';
import { printSuccess, printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import terminalLink from 'terminal-link';

export async function createIssue() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const title = await ask('Issue title:', {
    validate: (v) => (v?.trim() ? true : 'Title is required'),
  });
  const body = await editor('Issue body (opens editor):');

  const issue = await withSpinner('Creating issue…', () =>
    github.post(`/repos/${owner}/${repo}/issues`, {
      title: title.trim(),
      body,
    })
  );

  github.invalidate(`/repos/${owner}/${repo}/issues`);
  printSuccess(`Issue created: ${c.bold(`#${issue.number}`)} — ${issue.title}`);
  printInfo(`URL: ${terminalLink(issue.html_url, issue.html_url)}`);
}
