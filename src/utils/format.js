import chalk from 'chalk';

/** Human-readable relative time (e.g. "3 days ago"). */
export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

/** Format a date as locale string or 'N/A'. */
export function fmtDate(dateStr) {
  if (!dateStr) return chalk.dim('N/A');
  return new Date(dateStr).toLocaleDateString();
}

/** Truncate a string to maxLen with an ellipsis. */
export function truncate(str, maxLen = 50) {
  if (!str) return chalk.dim('—');
  return str.length <= maxLen ? str : `${str.slice(0, maxLen - 1)}…`;
}

/** Color-code a boolean open/closed state. */
export function fmtState(state) {
  if (!state) return chalk.dim('—');
  return state === 'open' ? chalk.green('open') : chalk.red(state);
}

/** Color-code visibility. */
export function fmtVisibility(isPrivate) {
  return isPrivate ? chalk.yellow('private') : chalk.cyan('public');
}

/** Format a number with commas. */
export function fmtNum(n) {
  if (n == null) return chalk.dim('0');
  return Number(n).toLocaleString();
}

/** Format a language with a neutral color. */
export function fmtLang(lang) {
  return lang ? chalk.magenta(lang) : chalk.dim('—');
}

/** Produce a short GitHub URL for display. */
export function shortUrl(url) {
  if (!url) return chalk.dim('—');
  return url.replace('https://github.com/', 'github.com/');
}
