#!/usr/bin/env node

import { program, Command } from 'commander';
import chalk from 'chalk';

// ─── Auth ─────────────────────────────────────────────────────────────────────
import { login } from '../src/commands/auth/login.js';
import { logout } from '../src/commands/auth/logout.js';
import { authStatus } from '../src/commands/auth/status.js';

// ─── Repo ─────────────────────────────────────────────────────────────────────
import { listRepositories } from '../src/commands/repo/list.js';
import { createRepository } from '../src/commands/repo/create.js';
import { updateRepository } from '../src/commands/repo/update.js';
import { deleteRepository } from '../src/commands/repo/delete.js';
import { getRepositoryInfo } from '../src/commands/repo/info.js';
import { starRepository, unstarRepository } from '../src/commands/repo/star.js';
import { forkRepository } from '../src/commands/repo/fork.js';
import { cloneRepository } from '../src/commands/repo/clone.js';
import { listActions, listWorkflowRuns } from '../src/commands/repo/actions.js';
import { getRepositoryTraffic } from '../src/commands/repo/traffic.js';

// ─── Issue ────────────────────────────────────────────────────────────────────
import { listIssues } from '../src/commands/issue/list.js';
import { getIssueInfo } from '../src/commands/issue/info.js';
import { createIssue } from '../src/commands/issue/create.js';
import { updateIssue } from '../src/commands/issue/update.js';
import { closeIssue } from '../src/commands/issue/close.js';

// ─── PR ───────────────────────────────────────────────────────────────────────
import { listPullRequests } from '../src/commands/pr/list.js';
import { getPullRequestInfo } from '../src/commands/pr/info.js';
import { createPullRequest } from '../src/commands/pr/create.js';
import { mergePullRequest } from '../src/commands/pr/merge.js';

// ─── Branch ───────────────────────────────────────────────────────────────────
import { listBranches } from '../src/commands/branch/list.js';
import { createBranch } from '../src/commands/branch/create.js';
import { deleteBranch } from '../src/commands/branch/delete.js';

// ─── Collaborator ─────────────────────────────────────────────────────────────
import {
  listCollaborators,
  addCollaborator,
  removeCollaborator,
} from '../src/commands/branch/collaborator.js';

// ─── User ─────────────────────────────────────────────────────────────────────
import { getUserInfo } from '../src/commands/user/info.js';
import { updateUserInfo } from '../src/commands/user/update.js';

// ─── Gist ─────────────────────────────────────────────────────────────────────
import { listGists } from '../src/commands/gist/list.js';
import { createGist } from '../src/commands/gist/create.js';
import { viewGist } from '../src/commands/gist/view.js';
import { deleteGist } from '../src/commands/gist/delete.js';

// ─── Release ──────────────────────────────────────────────────────────────────
import { listReleases } from '../src/commands/release/list.js';
import { viewRelease } from '../src/commands/release/view.js';
import { createRelease } from '../src/commands/release/create.js';

// ─── Notification ─────────────────────────────────────────────────────────────
import { listNotifications } from '../src/commands/notification/list.js';

// ─── Core ─────────────────────────────────────────────────────────────────────
import { registry } from '../src/core/registry.js';
import { handleError } from '../src/middleware/errorHandler.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: wrap an action with top-level error handling
// ─────────────────────────────────────────────────────────────────────────────
function action(fn) {
  return async (...args) => {
    try {
      await fn(...args);
    } catch (err) {
      handleError(err);
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Populate the command registry (powers fuzzy suggestions on unknown commands)
// ─────────────────────────────────────────────────────────────────────────────
const COMMANDS = [
  // Auth
  { name: 'auth login',          description: 'Login with a GitHub PAT',                    category: 'auth',          fn: login },
  { name: 'auth logout',         description: 'Logout and clear credentials',               category: 'auth',          fn: logout },
  { name: 'auth status',         description: 'Check authentication status',                category: 'auth',          fn: authStatus },
  // Repo
  { name: 'repo list',           description: 'List your repositories',                     category: 'repo',          fn: listRepositories },
  { name: 'repo create',         description: 'Create a new repository',                    category: 'repo',          fn: createRepository },
  { name: 'repo update',         description: 'Update a repository',                        category: 'repo',          fn: updateRepository },
  { name: 'repo delete',         description: 'Delete a repository',                        category: 'repo',          fn: deleteRepository },
  { name: 'repo info',           description: 'View repository details',                    category: 'repo',          fn: getRepositoryInfo },
  { name: 'repo star',           description: 'Star a repository',                          category: 'repo',          fn: starRepository },
  { name: 'repo unstar',         description: 'Unstar a repository',                        category: 'repo',          fn: unstarRepository },
  { name: 'repo fork',           description: 'Fork a repository',                          category: 'repo',          fn: forkRepository },
  { name: 'repo clone',          description: 'Clone a repository',                         category: 'repo',          fn: cloneRepository },
  { name: 'repo actions',        description: 'List GitHub Actions workflows',              category: 'repo',          fn: listActions },
  { name: 'repo runs',           description: 'List recent workflow runs',                  category: 'repo',          fn: listWorkflowRuns },
  { name: 'repo traffic',        description: 'View repository traffic data',               category: 'repo',          fn: getRepositoryTraffic },
  // Issue
  { name: 'issue list',          description: 'List issues',                                category: 'issue',         fn: listIssues },
  { name: 'issue info',          description: 'View an issue',                              category: 'issue',         fn: getIssueInfo },
  { name: 'issue create',        description: 'Create an issue',                            category: 'issue',         fn: createIssue },
  { name: 'issue update',        description: 'Update an issue',                            category: 'issue',         fn: updateIssue },
  { name: 'issue close',         description: 'Close an issue',                             category: 'issue',         fn: closeIssue },
  // PR
  { name: 'pr list',             description: 'List pull requests',                         category: 'pr',            fn: listPullRequests },
  { name: 'pr info',             description: 'View a pull request',                        category: 'pr',            fn: getPullRequestInfo },
  { name: 'pr create',           description: 'Create a pull request',                      category: 'pr',            fn: createPullRequest },
  { name: 'pr merge',            description: 'Merge a pull request',                       category: 'pr',            fn: mergePullRequest },
  // Branch
  { name: 'branch list',         description: 'List branches',                              category: 'branch',        fn: listBranches },
  { name: 'branch create',       description: 'Create a branch',                            category: 'branch',        fn: createBranch },
  { name: 'branch delete',       description: 'Delete a branch',                            category: 'branch',        fn: deleteBranch },
  // Collaborator
  { name: 'collaborator list',   description: 'List collaborators',                         category: 'collaborator',  fn: listCollaborators },
  { name: 'collaborator add',    description: 'Add a collaborator',                         category: 'collaborator',  fn: addCollaborator },
  { name: 'collaborator remove', description: 'Remove a collaborator',                      category: 'collaborator',  fn: removeCollaborator },
  // User
  { name: 'user info',           description: 'View a GitHub user profile',                 category: 'user',          fn: getUserInfo },
  { name: 'user update',         description: 'Update your GitHub profile',                 category: 'user',          fn: updateUserInfo },
  // Gist
  { name: 'gist list',           description: 'List gists',                                 category: 'gist',          fn: listGists },
  { name: 'gist create',         description: 'Create a gist',                              category: 'gist',          fn: createGist },
  { name: 'gist view',           description: 'View a gist',                                category: 'gist',          fn: viewGist },
  { name: 'gist delete',         description: 'Delete a gist',                              category: 'gist',          fn: deleteGist },
  // Release
  { name: 'release list',        description: 'List releases',                              category: 'release',       fn: listReleases },
  { name: 'release view',        description: 'View a release',                             category: 'release',       fn: viewRelease },
  { name: 'release create',      description: 'Create a release',                           category: 'release',       fn: createRelease },
  // Notification
  { name: 'notification list',   description: 'List unread notifications',                  category: 'notification',  fn: listNotifications },
];

for (const cmd of COMMANDS) {
  registry.register(cmd.name, {
    handler: cmd.fn,
    description: cmd.description,
    category: cmd.category,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Program setup
// ─────────────────────────────────────────────────────────────────────────────
program
  .name('ghc')
  .version('1.0.0')
  .description('The extensible GitHub CLI platform');

// ─────────────────────────────────────────────────────────────────────────────
// Subcommand tree (new-style: ghc auth login, ghc repo list, etc.)
// ─────────────────────────────────────────────────────────────────────────────

// AUTH
const auth = program.command('auth').description('Manage GitHub authentication');
auth.command('login').description('Login with a GitHub Personal Access Token').action(action(login));
auth.command('logout').description('Logout and clear stored credentials').action(action(logout));
auth.command('status').description('Show current authentication status').action(action(authStatus));

// REPO
const repo = program.command('repo').description('Manage GitHub repositories');
repo.command('list').description('List your repositories').action(action(listRepositories));
repo.command('create').description('Create a new repository').action(action(createRepository));
repo.command('update').description('Update a repository').action(action(updateRepository));
repo.command('delete').description('Delete a repository').action(action(deleteRepository));
repo.command('info').description('View repository details').action(action(getRepositoryInfo));
repo.command('star').description('Star a repository').action(action(starRepository));
repo.command('unstar').description('Unstar a repository').action(action(unstarRepository));
repo.command('fork').description('Fork a repository').action(action(forkRepository));
repo.command('clone').description('Clone a repository').action(action(cloneRepository));
repo.command('actions').description('List GitHub Actions workflows').action(action(listActions));
repo.command('runs').description('List recent workflow runs').action(action(listWorkflowRuns));
repo.command('traffic').description('View repository traffic analytics').action(action(getRepositoryTraffic));

// ISSUE
const issue = program.command('issue').description('Manage repository issues');
issue.command('list').description('List issues').action(action(listIssues));
issue.command('info').description('View an issue').action(action(getIssueInfo));
issue.command('create').description('Create a new issue').action(action(createIssue));
issue.command('update').description('Update an issue').action(action(updateIssue));
issue.command('close').description('Close an issue').action(action(closeIssue));

// PR
const pr = program.command('pr').description('Manage pull requests');
pr.command('list').description('List pull requests').action(action(listPullRequests));
pr.command('info').description('View a pull request').action(action(getPullRequestInfo));
pr.command('create').description('Create a pull request').action(action(createPullRequest));
pr.command('merge').description('Merge a pull request').action(action(mergePullRequest));

// BRANCH
const branch = program.command('branch').description('Manage repository branches');
branch.command('list').description('List branches').action(action(listBranches));
branch.command('create').description('Create a branch').action(action(createBranch));
branch.command('delete').description('Delete a branch').action(action(deleteBranch));

// COLLABORATOR
const collaborator = program.command('collaborator').description('Manage repository collaborators').alias('collab');
collaborator.command('list').description('List collaborators').action(action(listCollaborators));
collaborator.command('add').description('Add a collaborator').action(action(addCollaborator));
collaborator.command('remove').description('Remove a collaborator').action(action(removeCollaborator));

// USER
const user = program.command('user').description('View and update GitHub user profiles');
user.command('info').description('View a GitHub user profile').action(action(getUserInfo));
user.command('update').description('Update your GitHub profile').action(action(updateUserInfo));

// GIST
const gist = program.command('gist').description('Manage GitHub Gists');
gist.command('list').description('List gists').action(action(listGists));
gist.command('create').description('Create a new gist').action(action(createGist));
gist.command('view').description('View a gist and its contents').action(action(viewGist));
gist.command('delete').description('Delete a gist').action(action(deleteGist));

// RELEASE
const release = program.command('release').description('Manage GitHub Releases');
release.command('list').description('List releases').action(action(listReleases));
release.command('view').description('View a release').action(action(viewRelease));
release.command('create').description('Create a new release').action(action(createRelease));

// NOTIFICATION
const notification = program.command('notification').description('Manage GitHub Notifications').alias('notif');
notification.command('list').description('List unread notifications').action(action(listNotifications));

// ─────────────────────────────────────────────────────────────────────────────
// Backward-compatible flat aliases (ghc repo-list, ghc issue-create, etc.)
// These are hidden so they don't pollute --help output.
// ─────────────────────────────────────────────────────────────────────────────
const legacy = [
  ['login',                login],
  ['logout',               logout],
  ['repo-list',            listRepositories],
  ['repo-create',          createRepository],
  ['repo-update',          updateRepository],
  ['repo-delete',          deleteRepository],
  ['repo-info',            getRepositoryInfo],
  ['repo-star',            starRepository],
  ['repo-unstar',          unstarRepository],
  ['repo-fork',            forkRepository],
  ['repo-clone',           cloneRepository],
  ['repo-actions',         listActions],
  ['repo-traffic',         getRepositoryTraffic],
  ['issue-list',           listIssues],
  ['issue-info',           getIssueInfo],
  ['issue-create',         createIssue],
  ['issue-update',         updateIssue],
  ['issue-close',          closeIssue],
  ['pr-list',              listPullRequests],
  ['pr-info',              getPullRequestInfo],
  ['pr-create',            createPullRequest],
  ['pr-merge',             mergePullRequest],
  ['branch-list',          listBranches],
  ['branch-create',        createBranch],
  ['branch-delete',        deleteBranch],
  ['collaborator-list',    listCollaborators],
  ['collaborator-add',     addCollaborator],
  ['collaborator-remove',  removeCollaborator],
  ['user-info',            getUserInfo],
  ['user-update',          updateUserInfo],
];

for (const [name, fn] of legacy) {
  program
    .command(name, { hidden: true })
    .action(action(fn));
}

// ─────────────────────────────────────────────────────────────────────────────
// Unknown command handler with fuzzy suggestions
// ─────────────────────────────────────────────────────────────────────────────
program.on('command:*', (operands) => {
  const input = operands.join(' ');
  console.error(chalk.red(`\n✖ Unknown command: ${chalk.bold(input)}\n`));

  const suggestions = registry.getSuggestions(input, 3);
  if (suggestions.length) {
    console.log(chalk.yellow('Did you mean one of these?'));
    for (const s of suggestions) {
      console.log(`  ${chalk.cyan(s.name)}  ${chalk.dim(s.description)}`);
    }
    console.log();
  }

  console.log(`Run ${chalk.cyan('ghc --help')} to see all available commands.`);
  process.exitCode = 1;
});

// ─────────────────────────────────────────────────────────────────────────────
// Parse
// ─────────────────────────────────────────────────────────────────────────────
program.parse(process.argv);
