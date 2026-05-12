import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { c } from './colors.js';

/** Print the cli-gh ASCII art banner with gradient. */
export function printBanner() {
  try {
    const art = figlet.textSync('cli-gh', { font: 'Slant', horizontalLayout: 'default' });
    console.log(gradient.pastel.multiline(art));
  } catch {
    console.log(gradient.pastel('  cli-gh  '));
  }
  console.log(c.muted('  The extensible GitHub CLI platform\n'));
}

export function printSuccess(message) {
  console.log(c.success(`✔ ${message}`));
}

export function printError(message) {
  console.error(c.error(`✖ ${message}`));
}

export function printWarn(message) {
  console.warn(c.warn(`⚠ ${message}`));
}

export function printInfo(message) {
  console.log(c.info(`ℹ ${message}`));
}

/** Print a titled box around a message (uses boxen). */
export function printBox(content, { title = '', borderColor = 'cyan' } = {}) {
  console.log(
    boxen(content, {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor,
      title: title ? chalk.bold(title) : undefined,
      titleAlignment: 'center',
    })
  );
}

/** Print a section divider with optional label. */
export function printDivider(label = '') {
  const line = '─'.repeat(50);
  if (label) {
    const side = '─'.repeat(Math.max(0, Math.floor((50 - label.length - 2) / 2)));
    console.log(chalk.dim(`${side} ${chalk.bold(label)} ${side}`));
  } else {
    console.log(chalk.dim(line));
  }
}

