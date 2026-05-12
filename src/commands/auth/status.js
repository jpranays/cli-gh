import { isAuthenticated } from '../../utils/config.js';
import { github } from '../../services/github.js';
import { withSpinner } from '../../ui/spinner.js';
import { printBox, printError } from '../../ui/output.js';
import { printKV } from '../../ui/table.js';
import { c } from '../../ui/colors.js';
import { fmtDate } from '../../utils/format.js';

export async function authStatus() {
  if (!isAuthenticated()) {
    printError('Not logged in. Run: ghc auth login');
    process.exitCode = 1;
    return;
  }

  let user;
  try {
    user = await withSpinner('Checking authentication…', () => github.get('/user'));
  } catch (err) {
    printError(`Token validation failed: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  console.log();
  printBox(
    `${c.success('✔ Authenticated')} as ${c.bold(user.login)}`,
    { title: 'Auth Status', borderColor: 'green' }
  );

  printKV({
    Username: c.bold(user.login),
    Name: user.name ?? c.muted('—'),
    Email: user.email ?? c.muted('—'),
    'Public Repos': String(user.public_repos),
    Followers: String(user.followers),
    Following: String(user.following),
    'Account Created': fmtDate(user.created_at),
  });
}
