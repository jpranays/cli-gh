import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import { fmtDate, truncate } from '../../utils/format.js';

export async function listReleases() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  const releases = await withSpinner(`Fetching releases for ${owner}/${repo}…`, () =>
    github.get(`/repos/${owner}/${repo}/releases`, { params: { per_page: 30 } })
  );

  if (!releases.length) {
    printInfo('No releases found.');
    return;
  }

  const table = createTable(
    ['Tag', 'Name', 'Published', 'Pre-release', 'Draft', 'Assets'],
    releases.map((r) => [
      c.bold(r.tag_name),
      truncate(r.name ?? '', 30),
      fmtDate(r.published_at ?? r.created_at),
      r.prerelease ? c.warn('yes') : c.muted('no'),
      r.draft ? c.warn('yes') : c.muted('no'),
      String(r.assets?.length ?? 0),
    ])
  );

  console.log(table.toString());
  printInfo(`${releases.length} release(s)`);
}
