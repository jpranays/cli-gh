import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printBox, printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import { fmtNum, fmtDate } from '../../utils/format.js';

export async function getRepositoryTraffic() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  const [views, clones, referrers] = await withSpinner(
    `Fetching traffic data for ${owner}/${repo}…`,
    () =>
      Promise.all([
        github.get(`/repos/${owner}/${repo}/traffic/views`),
        github.get(`/repos/${owner}/${repo}/traffic/clones`),
        github.get(`/repos/${owner}/${repo}/traffic/popular/referrers`),
      ])
  );

  printBox(
    `Total views: ${c.bold(fmtNum(views.count))}  (${fmtNum(views.uniques)} unique)\n` +
    `Total clones: ${c.bold(fmtNum(clones.count))}  (${fmtNum(clones.uniques)} unique)`,
    { title: `Traffic — ${owner}/${repo}`, borderColor: 'cyan' }
  );

  if (views.views?.length) {
    const viewTable = createTable(
      ['Date', 'Views', 'Unique'],
      views.views.map((v) => [fmtDate(v.timestamp), fmtNum(v.count), fmtNum(v.uniques)])
    );
    console.log(c.muted('\n  Daily Views'));
    console.log(viewTable.toString());
  }

  if (referrers?.length) {
    const refTable = createTable(
      ['Referrer', 'Views', 'Unique'],
      referrers.map((r) => [r.referrer, fmtNum(r.count), fmtNum(r.uniques)])
    );
    console.log(c.muted('\n  Top Referrers'));
    console.log(refTable.toString());
  }
}
