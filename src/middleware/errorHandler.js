import chalk from 'chalk';
import {
  AuthError,
  RateLimitError,
  NetworkError,
  NotFoundError,
  ValidationError,
  APIError,
  CLIError,
} from '../core/errors.js';

/**
 * Top-level error handler.
 * Formats the error with appropriate context and exits non-zero.
 * Does NOT re-throw — this is the terminal boundary.
 */
export function handleError(err) {
  if (err instanceof AuthError) {
    console.error(chalk.red(`✖ ${err.message}`));
    console.log(chalk.cyan('  Run: ghc auth login'));
  } else if (err instanceof RateLimitError) {
    console.error(chalk.red(`✖ ${err.message}`));
  } else if (err instanceof NetworkError) {
    console.error(chalk.red(`✖ ${err.message}`));
  } else if (err instanceof NotFoundError) {
    console.error(chalk.red(`✖ ${err.message}`));
  } else if (err instanceof ValidationError) {
    console.error(chalk.red(`✖ Validation: ${err.message}`));
  } else if (err instanceof APIError) {
    console.error(chalk.red(`✖ GitHub API (${err.statusCode}): ${err.message}`));
  } else if (err instanceof CLIError) {
    console.error(chalk.red(`✖ ${err.message}`));
  } else {
    console.error(chalk.red(`✖ Unexpected error: ${err?.message ?? String(err)}`));
    if (process.env.DEBUG) console.error(err);
  }

  process.exitCode = 1;
}
