import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printSuccess, printInfo } from '../../ui/output.js';
import terminalLink from 'terminal-link';

export async function forkRepository() {
  requireAuth();

  const owner = await ask('Repository owner to fork from:');
  const repo = await ask('Repository name:');
  const targetOrg = await ask('Fork into organization (blank for your account):');

  const payload = {};
  if (targetOrg.trim()) payload.organization = targetOrg.trim();

  const fork = await withSpinner(`Forking ${owner}/${repo}…`, () =>
    github.post(`/repos/${owner}/${repo}/forks`, payload)
  );

  printSuccess(`Forked to ${fork.full_name}`);
  printInfo(`URL: ${terminalLink(fork.html_url, fork.html_url)}`);
}
