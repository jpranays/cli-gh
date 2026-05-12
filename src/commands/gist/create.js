import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm, editor } from '../../ui/prompt.js';
import { printSuccess, printInfo } from '../../ui/output.js';
import terminalLink from 'terminal-link';

export async function createGist() {
  requireAuth();

  const description = await ask('Gist description (optional):');
  const filename = await ask('Filename (e.g. snippet.js):', {
    validate: (v) => (v?.trim() ? true : 'Filename is required'),
  });
  const content = await editor('Gist content (opens editor):');
  const isPublic = await confirm('Make gist public?', true);

  const gist = await withSpinner('Creating gist…', () =>
    github.post('/gists', {
      description,
      public: isPublic,
      files: {
        [filename.trim()]: { content },
      },
    })
  );

  github.invalidate('/gists');
  printSuccess('Gist created successfully!');
  printInfo(`URL: ${terminalLink(gist.html_url, gist.html_url)}`);
  printInfo(`Raw: ${terminalLink(gist.files[filename.trim()]?.raw_url ?? '', gist.files[filename.trim()]?.raw_url ?? '')}`);
}
