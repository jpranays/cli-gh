import { z } from 'zod';
import { ValidationError } from '../core/errors.js';

export const RepoSchema = z.object({
  owner: z.string().min(1, 'Owner is required'),
  repo: z.string().min(1, 'Repo name is required'),
});

export const IssueSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  number: z.coerce.number().int().positive('Issue number must be positive'),
});

export const TokenSchema = z
  .string()
  .min(10, 'Token appears too short')
  .regex(/^(ghp_|github_pat_|gho_|ghs_|ghu_|[a-f0-9]{40})/, {
    message: 'Does not look like a valid GitHub token',
  });

/**
 * Validates data against a Zod schema and throws a ValidationError on failure.
 * Returns the parsed (type-coerced) data on success.
 */
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    throw new ValidationError(issues[0], issues);
  }
  return result.data;
}
