import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm } from '../../ui/prompt.js';
import { printSuccess, printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import terminalLink from 'terminal-link';

export async function createRepository() {
  requireAuth();

  const name = await ask('Repository name:', {
    validate: (v) => (v?.trim() ? true : 'Name is required'),
  });
  const description = await ask('Description (optional):');
  const isPrivate = await confirm('Make repository private?', false);
  const initReadme = await confirm('Initialize with README?', true);
  const autoInit = initReadme;

  const repo = await withSpinner('Creating repository…', () =>
    github.post('/user/repos', {
      name: name.trim(),
      description,
      private: isPrivate,
      auto_init: autoInit,
    })
  );

  printSuccess(`Repository created: ${c.bold(repo.full_name)}`);
  const link = terminalLink(repo.html_url, repo.html_url);
  printInfo(`URL: ${link}`);
}
