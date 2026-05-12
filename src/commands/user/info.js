import { github } from '../../services/github.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printBox } from '../../ui/output.js';
import { printKV } from '../../ui/table.js';
import { c } from '../../ui/colors.js';
import { fmtDate, fmtNum } from '../../utils/format.js';
import terminalLink from 'terminal-link';

export async function getUserInfo() {
  const username = await ask('GitHub username:', {
    validate: (v) => (v?.trim() ? true : 'Username is required'),
  });

  const user = await withSpinner(`Fetching profile for ${username}…`, () =>
    github.get(`/users/${username}`)
  );

  printBox(
    `${c.bold(user.login)}${user.name ? `  (${user.name})` : ''}\n${c.muted(user.bio || 'No bio')}`,
    { title: 'GitHub Profile', borderColor: 'cyan' }
  );

  printKV({
    Username: c.user(user.login),
    Name: user.name ?? c.muted('—'),
    Email: user.email ?? c.muted('—'),
    Location: user.location ?? c.muted('—'),
    Blog: user.blog ? terminalLink(user.blog, user.blog) : c.muted('—'),
    Company: user.company ?? c.muted('—'),
    'Public Repos': fmtNum(user.public_repos),
    'Public Gists': fmtNum(user.public_gists),
    Followers: fmtNum(user.followers),
    Following: fmtNum(user.following),
    'Twitter/X': user.twitter_username ? `@${user.twitter_username}` : c.muted('—'),
    'Account Type': user.type,
    Created: fmtDate(user.created_at),
    Profile: terminalLink(user.html_url, user.html_url),
    Avatar: terminalLink('View avatar', user.avatar_url),
  });
}
