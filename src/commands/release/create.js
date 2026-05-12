import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, confirm, editor } from '../../ui/prompt.js';
import { printSuccess, printInfo } from '../../ui/output.js';
import terminalLink from 'terminal-link';

export async function createRelease() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const tagName = await ask('Tag name (e.g. v1.2.0):', {
    validate: (v) => (v?.trim() ? true : 'Tag is required'),
  });
  const name = await ask('Release name:', { default: tagName });
  const targetCommitish = await ask('Target branch or SHA:', { default: 'main' });
  const body = await editor('Release notes (opens editor):');
  const isDraft = await confirm('Save as draft?', false);
  const isPrerelease = await confirm('Mark as pre-release?', false);
  const autoGenNotes = await confirm('Auto-generate release notes?', false);

  const release = await withSpinner('Creating release…', () =>
    github.post(`/repos/${owner}/${repo}/releases`, {
      tag_name: tagName.trim(),
      target_commitish: targetCommitish.trim(),
      name: name.trim() || tagName.trim(),
      body,
      draft: isDraft,
      prerelease: isPrerelease,
      generate_release_notes: autoGenNotes,
    })
  );

  github.invalidate(`/repos/${owner}/${repo}/releases`);
  printSuccess(`Release ${release.tag_name} created.`);
  printInfo(`URL: ${terminalLink(release.html_url, release.html_url)}`);
}
