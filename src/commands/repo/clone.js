import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask, select } from '../../ui/prompt.js';
import { printSuccess, printInfo, printError } from '../../ui/output.js';

const execAsync = promisify(exec);

export async function cloneRepository() {
  requireAuth();

  const owner = await ask('Repository owner:');
  const repo = await ask('Repository name:');
  const protocol = await select('Clone via:', [
    { name: 'HTTPS', value: 'https' },
    { name: 'SSH', value: 'ssh' },
  ]);
  const dest = await ask('Destination directory (blank for default):');

  const repoData = await withSpinner(`Resolving ${owner}/${repo}…`, () =>
    github.get(`/repos/${owner}/${repo}`)
  );

  const cloneUrl =
    protocol === 'ssh' ? repoData.ssh_url : repoData.clone_url;

  const cmd = ['git', 'clone', cloneUrl, dest.trim()].filter(Boolean).join(' ');

  printInfo(`Running: ${cmd}`);

  try {
    const { stdout, stderr } = await withSpinner(`Cloning ${owner}/${repo}…`, () =>
      execAsync(cmd)
    );
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    printSuccess(`Repository cloned to ${dest.trim() || repo}`);
  } catch (err) {
    printError(`Clone failed: ${err.message}`);
  }
}
