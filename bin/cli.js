#!/usr/bin/env node

import { program } from "commander";
import {
    listRepositories,
    createRepository,
    updateRepository,
    deleteRepository,
    starRepository,
    unstarRepository,
    forkRepository,
    cloneRepository,
    getRepositoryInfo,
    getRepositoryTraffic,
    listRepositoryIssues,
    createIssue,
    updateIssue,
    closeIssue,
    listRepositoryPullRequests,
    createPullRequest,
    mergePullRequest,
    listCollaborators,
    addCollaborator,
    removeCollaborator,
    listBranches,
    createBranch,
    deleteBranch,
	getPrInfo,
	getIssueInfo,
	listActions
} from "../src/commands/repo.js";
import { getUserInfo, updateUserInfo } from "../src/commands/user.js";
import { login, logout } from "../src/commands/auth.js";

program.version("1.0.0").description("GitHub CLI Tool");

// Authentication Commands
program
    .command("login")
    .description("Login to GitHub and store your credentials")
    .action(login);

program
    .command("logout")
    .description("Logout from GitHub and remove your credentials")
    .action(logout);

// Repository Commands
program
    .command("repo-list")
    .description("List public repositories for a given username")
    .action(listRepositories);

program
    .command("repo-create")
    .description("Create a new GitHub repository")
    .action(createRepository);

program
    .command("repo-update")
    .description("Update a GitHub repository")
    .action(updateRepository);

program
    .command("repo-delete")
    .description("Delete a GitHub repository")
    .action(deleteRepository);

program
    .command("repo-star")
    .description("Star a GitHub repository")
    .action(starRepository);

program
    .command("repo-unstar")
    .description("Unstar a GitHub repository")
    .action(unstarRepository);

program
    .command("repo-fork")
    .description("Fork a GitHub repository")
    .action(forkRepository);

program
    .command("repo-clone")
    .description("Clone a GitHub repository")
    .action(cloneRepository);

program
    .command("repo-info")
    .description("Get information about a GitHub repository")
    .action(getRepositoryInfo);

program
    .command("repo-actions")
    .description("List GitHub Actions for a GitHub repository")
    .action(listActions);

program
    .command("repo-traffic")
    .description("Get traffic information for a GitHub repository")
    .action(getRepositoryTraffic);

// Issue Commands
program
    .command("issue-list")
    .description("List issues for a GitHub repository")
    .action(listRepositoryIssues);

program
    .command("issue-info")
    .description("Get information about an issue for a GitHub repository")
    .action(getIssueInfo);

program
    .command("issue-create")
    .description("Create a new issue for a GitHub repository")
    .action(createIssue);

program
    .command("issue-update")
    .description("Update an issue for a GitHub repository")
    .action(updateIssue);

program
    .command("issue-close")
    .description("Close an issue for a GitHub repository")
    .action(closeIssue);

// Pull Request Commands
program
    .command("pr-list")
    .description("List pull requests for a GitHub repository")
    .action(listRepositoryPullRequests);

program
    .command("pr-info")
    .description("Get information about a pull request for a GitHub repository")
    .action(getPrInfo);

program
    .command("pr-create")
    .description("Create a new pull request for a GitHub repository")
    .action(createPullRequest);

program
    .command("pr-merge")
    .description("Merge a pull request for a GitHub repository")
    .action(mergePullRequest);

// Branch Commands
program
    .command("branch-list")
    .description("List branches for a GitHub repository")
    .action(listBranches);

program
    .command("branch-create")
    .description("Create a new branch for a GitHub repository")
    .action(createBranch);

program
    .command("branch-delete")
    .description("Delete a branch from a GitHub repository")
    .action(deleteBranch);

// Collaborator Commands
program
    .command("collaborator-list")
    .description("List collaborators for a GitHub repository")
    .action(listCollaborators);

program
    .command("collaborator-add")
    .description("Add a collaborator to a GitHub repository")
    .action(addCollaborator);

program
    .command("collaborator-remove")
    .description("Remove a collaborator from a GitHub repository")
    .action(removeCollaborator);

// User Commands
program
    .command("user-info")
    .description("Get information about a GitHub user")
    .action(getUserInfo);

program
    .command("user-update")
    .description("Update information about a GitHub user (self)")
    .action(updateUserInfo);

program.parse(process.argv);
