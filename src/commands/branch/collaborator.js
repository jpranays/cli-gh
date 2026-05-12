import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, select, confirm } from '../../ui/prompt.js';
import { createTable } from '../../ui/table.js';
import { printSuccess, printWarn, printInfo } from '../../ui/output.js';
import { c } from '../../ui/colors.js';

export async function listCollaborators() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');

  const collaborators = await withSpinner(`Fetching collaborators for ${owner}/${repo}…`, () =>
    github.get(`/repos/${owner}/${repo}/collaborators`)
  );

  if (!collaborators.length) {
    printInfo('No collaborators found.');
    return;
  }

  const table = createTable(
    ['Username', 'Profile', 'Role'],
    collaborators.map((u) => [
      c.user(u.login),
      u.html_url,
      u.role_name ?? u.permissions?.admin ? 'admin' : 'collaborator',
    ])
  );

  console.log(table.toString());
  printInfo(`${collaborators.length} collaborator(s)`);
}

export async function addCollaborator() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const username = await ask('GitHub username to add:');
  const permission = await select('Permission level:', [
    { name: 'Write (push)', value: 'push' },
    { name: 'Admin', value: 'admin' },
    { name: 'Read (pull)', value: 'pull' },
    { name: 'Maintain', value: 'maintain' },
    { name: 'Triage', value: 'triage' },
  ]);

  await withSpinner(`Inviting ${username}…`, () =>
    github.put(`/repos/${owner}/${repo}/collaborators/${username}`, { permission })
  );

  github.invalidate(`/repos/${owner}/${repo}/collaborators`);
  printSuccess(`Invitation sent to ${c.user(username)} with ${permission} permission.`);
}

export async function removeCollaborator() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const username = await ask('GitHub username to remove:');

  const ok = await confirm(`Remove ${username} from ${owner}/${repo}?`, false);
  if (!ok) {
    printWarn('Cancelled.');
    return;
  }

  await withSpinner(`Removing ${username}…`, () =>
    github.delete(`/repos/${owner}/${repo}/collaborators/${username}`)
  );

  github.invalidate(`/repos/${owner}/${repo}/collaborators`);
  printSuccess(`${c.user(username)} removed from ${owner}/${repo}.`);
}
