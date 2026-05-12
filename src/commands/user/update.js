import { github } from '../../services/github.js';
import { requireAuth } from '../../middleware/auth.js';
import { withSpinner } from '../../ui/spinner.js';
import { ask } from '../../ui/prompt.js';
import { printSuccess } from '../../ui/output.js';
import { printInfo } from '../../ui/output.js';

export async function updateUserInfo() {
  requireAuth();

  printInfo('Leave any field blank to keep the current value.\n');

  const name = await ask('New display name:');
  const bio = await ask('New bio:');
  const location = await ask('New location:');
  const blog = await ask('New blog/website URL:');
  const email = await ask('New public email:');
  const twitterUsername = await ask('New Twitter/X username (without @):');
  const company = await ask('New company:');

  const payload = {};
  if (name.trim()) payload.name = name.trim();
  if (bio.trim()) payload.bio = bio.trim();
  if (location.trim()) payload.location = location.trim();
  if (blog.trim()) payload.blog = blog.trim();
  if (email.trim()) payload.email = email.trim();
  if (twitterUsername.trim()) payload.twitter_username = twitterUsername.trim();
  if (company.trim()) payload.company = company.trim();

  if (!Object.keys(payload).length) {
    printSuccess('No changes made.');
    return;
  }

  await withSpinner('Updating profile…', () => github.patch('/user', payload));

  github.invalidate('/user');
  printSuccess('Profile updated successfully.');
}
