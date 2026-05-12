import { github } from '../../services/github.js';
import { setToken, invalidateCache } from '../../utils/config.js';
import { maskSecret } from '../../utils/crypto.js';
import { secret } from '../../ui/prompt.js';
import { printSuccess, printError, printBox } from '../../ui/output.js';
import { withSpinner } from '../../ui/spinner.js';
import { c } from '../../ui/colors.js';

export async function login() {
  console.log(c.info('\nAuthenticate with a GitHub Personal Access Token (PAT)'));
  console.log(
    c.muted(
      'Generate one at: https://github.com/settings/tokens\n' +
      'Recommended scopes: repo, read:org, read:user, gist, notifications\n'
    )
  );

  const token = await secret('GitHub Personal Access Token:', {
    validate: (v) => (v?.length > 10 ? true : 'Token appears too short'),
  });

  let user;
  try {
    user = await withSpinner('Validating token…', async () => {
      const res = await github.raw.get('/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    });
  } catch (err) {
    printError(`Invalid token: ${err.message}`);
    return;
  }

  setToken(token);
  invalidateCache();

  printBox(
    `${c.success('Logged in as')} ${c.bold(user.login)}\n` +
    `${c.muted('Token ending:')} ${c.muted(maskSecret(token, 6))}\n` +
    `${c.muted('Plan:')} ${c.muted(user.plan?.name ?? 'N/A')}`,
    { title: '✔ Authenticated', borderColor: 'green' }
  );
}
