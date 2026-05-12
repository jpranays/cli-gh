import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm, editor } from '../../ui/prompt.js';
import { printSuccess, printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import terminalLink from 'terminal-link';

export async function createPullRequest() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const title = await ask('PR title:', {
    validate: (v) => (v?.trim() ? true : 'Title is required'),
  });
  const head = await ask('Head branch (your changes):');
  const base = await ask('Base branch (merge target):', { default: 'main' });
  const body = await editor('PR description (opens editor):');
  const draft = await confirm('Open as draft?', false);

  const pr = await withSpinner('Creating pull request…', () =>
    github.post(`/repos/${owner}/${repo}/pulls`, {
      title: title.trim(),
      head: head.trim(),
      base: base.trim(),
      body,
      draft,
    })
  );

  github.invalidate(`/repos/${owner}/${repo}/pulls`);
  printSuccess(`PR created: ${c.bold(`#${pr.number}`)} — ${pr.title}`);
  printInfo(`URL: ${terminalLink(pr.html_url, pr.html_url)}`);
}
