import chalk from 'chalk';

export const c = {
  // Semantic intent
  success: chalk.green,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.cyan,
  muted: chalk.dim,
  bold: chalk.bold,
  header: chalk.bold.white,

  // Entity colors
  repo: chalk.cyan,
  issue: chalk.yellow,
  pr: chalk.magenta,
  branch: chalk.blue,
  user: chalk.green,
  gist: chalk.cyan,
  release: chalk.magenta,

  // State colors
  open: chalk.green,
  closed: chalk.red,
  merged: chalk.magenta,
  draft: chalk.yellow,
  public: chalk.cyan,
  private: chalk.yellow,

  // Raw chalk passthrough
  chalk,
};
