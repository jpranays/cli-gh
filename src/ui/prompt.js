import inquirer from 'inquirer';

/** Prompt for a text value with optional validation. */
export async function ask(message, opts = {}) {
  const { answer } = await inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message,
      default: opts.default,
      validate: opts.validate,
    },
  ]);
  return answer;
}

/** Prompt for a secret/password (input is hidden). */
export async function secret(message, opts = {}) {
  const { answer } = await inquirer.prompt([
    {
      type: 'password',
      name: 'answer',
      message,
      mask: '*',
      validate: opts.validate,
    },
  ]);
  return answer;
}

/** Prompt with a yes/no confirmation. Returns boolean. */
export async function confirm(message, defaultVal = false) {
  const { answer } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'answer',
      message,
      default: defaultVal,
    },
  ]);
  return answer;
}

/** Select one item from a list. */
export async function select(message, choices, opts = {}) {
  const { answer } = await inquirer.prompt([
    {
      type: 'list',
      name: 'answer',
      message,
      choices,
      default: opts.default,
      pageSize: opts.pageSize ?? 10,
    },
  ]);
  return answer;
}

/** Select multiple items from a list. */
export async function multiselect(message, choices, opts = {}) {
  const { answer } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'answer',
      message,
      choices,
      pageSize: opts.pageSize ?? 10,
    },
  ]);
  return answer;
}

/** Prompt for a multi-line text editor input. */
export async function editor(message, opts = {}) {
  const { answer } = await inquirer.prompt([
    {
      type: 'editor',
      name: 'answer',
      message,
      default: opts.default ?? '',
    },
  ]);
  return answer;
}
