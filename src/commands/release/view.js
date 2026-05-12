import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printBox, printDivider } from '../../ui/output.js';
import { printKV, createTable } from '../../ui/table.js';
import { c } from '../../ui/colors.js';
import { fmtDate, fmtNum } from '../../utils/format.js';
import terminalLink from 'terminal-link';

export async function viewRelease() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const tag = await ask('Tag name (blank for latest):');

  const endpoint = tag.trim()
    ? `/repos/${owner}/${repo}/releases/tags/${tag.trim()}`
    : `/repos/${owner}/${repo}/releases/latest`;

  const release = await withSpinner('Fetching release…', () =>
    github.get(endpoint)
  );

  const badges = [
    release.prerelease ? c.warn('pre-release') : c.success('stable'),
    release.draft ? c.muted('draft') : '',
  ]
    .filter(Boolean)
    .join('  ');

  printBox(
    `${c.bold(release.name || release.tag_name)}  ${badges}\n\n` +
    (release.body?.slice(0, 500) ?? c.muted('No release notes.')),
    { title: 'Release', borderColor: 'magenta' }
  );

  printKV({
    Tag: release.tag_name,
    Author: c.user(release.author?.login ?? '—'),
    Published: fmtDate(release.published_at),
    URL: terminalLink(release.html_url, release.html_url),
    'Zip download': terminalLink('Source (zip)', release.zipball_url),
    Assets: String(release.assets?.length ?? 0),
  });

  if (release.assets?.length) {
    printDivider('Assets');
    const table = createTable(
      ['Name', 'Size', 'Downloads', 'Content-Type'],
      release.assets.map((a) => [
        terminalLink(a.name, a.browser_download_url),
        `${(a.size / 1024 / 1024).toFixed(2)} MB`,
        fmtNum(a.download_count),
        c.muted(a.content_type),
      ])
    );
    console.log(table.toString());
  }
}
