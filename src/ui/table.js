import Table from 'cli-table3';
import chalk from 'chalk';

const DEFAULT_STYLE = {
  head: ['cyan', 'bold'],
  border: ['dim'],
};

/**
 * Build a styled CLI table.
 * @param {string[]} headers
 * @param {Array<Array<string|number>>} rows
 * @param {object} opts  — merged into cli-table3 constructor options
 */
export function createTable(headers, rows, opts = {}) {
  const table = new Table({
    head: headers.map((h) => chalk.cyan.bold(h)),
    style: DEFAULT_STYLE,
    wordWrap: true,
    ...opts,
  });

  for (const row of rows) {
    table.push(row.map((cell) => String(cell ?? '')));
  }

  return table;
}

/**
 * Print a key-value list as a compact table with no outer border.
 * @param {Record<string, string>} pairs
 */
export function printKV(pairs) {
  const table = new Table({
    style: { border: [], head: [] },
    chars: {
      top: '', 'top-mid': '', 'top-left': '', 'top-right': '',
      bottom: '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
      left: '', 'left-mid': '', mid: '', 'mid-mid': '',
      right: '', 'right-mid': '', middle: '  ',
    },
  });

  for (const [k, v] of Object.entries(pairs)) {
    table.push([chalk.dim(k), v ?? chalk.dim('—')]);
  }

  console.log(table.toString());
}
