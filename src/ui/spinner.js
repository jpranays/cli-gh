import ora from 'ora';
import { c } from './colors.js';

export function createSpinner(text) {
  return ora({ text, color: 'cyan', spinner: 'dots' });
}

/**
 * Runs an async function with an ora spinner.
 * The spinner stops (success or fail) once the function settles.
 * Returns the resolved value or re-throws on error.
 */
export async function withSpinner(text, fn) {
  const spinner = createSpinner(text);
  spinner.start();
  try {
    const result = await fn();
    spinner.stop();
    return result;
  } catch (err) {
    spinner.fail(c.error(err.message ?? 'Failed'));
    throw err;
  }
}
