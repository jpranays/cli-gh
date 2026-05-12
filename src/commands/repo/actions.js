import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printInfo, printBox } from '../../ui/output.js';
import { c } from '../../ui/colors.js';
import { fmtState, timeAgo, truncate } from '../../utils/format.js';
import terminalLink from 'terminal-link';

export async function listActions() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  const data = await withSpinner(`Fetching workflows for ${owner}/${repo}…`, () =>
    github.get(`/repos/${owner}/${repo}/actions/workflows`)
  );

  const workflows = data.workflows ?? [];

  if (!workflows.length) {
    printInfo('No workflows found.');
    return;
  }

  // Also fetch recent run counts per workflow
  const table = createTable(
    ['Workflow', 'State', 'File', 'Last Updated'],
    workflows.map((w) => [
      c.bold(truncate(w.name, 35)),
      fmtState(w.state),
      c.muted(w.path),
      timeAgo(w.updated_at),
    ])
  );

  printBox(`${c.bold(owner + '/' + repo)} — GitHub Actions`, { borderColor: 'cyan' });
  console.log(table.toString());
  printInfo(`${workflows.length} workflow(s)`);
}

export async function listWorkflowRuns() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  const data = await withSpinner(`Fetching recent workflow runs for ${owner}/${repo}…`, () =>
    github.get(`/repos/${owner}/${repo}/actions/runs`, {
      params: { per_page: 20 },
    })
  );

  const runs = data.workflow_runs ?? [];

  if (!runs.length) {
    printInfo('No workflow runs found.');
    return;
  }

  const conclusionColor = (c_) => {
    if (c_ === 'success') return c.success(c_);
    if (c_ === 'failure') return c.error(c_);
    if (c_ === 'cancelled') return c.muted(c_);
    return c.warn(c_ ?? 'running');
  };

  const table = createTable(
    ['#', 'Workflow', 'Branch', 'Status', 'Conclusion', 'Triggered'],
    runs.map((r) => [
      String(r.run_number),
      truncate(r.name, 30),
      c.branch(r.head_branch),
      r.status,
      conclusionColor(r.conclusion),
      timeAgo(r.created_at),
    ])
  );

  console.log(table.toString());
  printInfo(`${runs.length} recent run(s)  —  ${terminalLink('View all', `https://github.com/${owner}/${repo}/actions`)}`);
}
