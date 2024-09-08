#!/usr/bin/env node

import { program } from "commander";
import {
	listRepositories,
	createRepository,
	deleteRepository,
	starRepository,
	unstarRepository,
	forkRepository,
	cloneRepository,
	getRepositoryInfo,
	listRepositoryIssues,
	createIssue,
	closeIssue,
	listRepositoryPullRequests,
	createPullRequest,
	mergePullRequest,
} from "../src/commands/repo.js";
import { getUserInfo } from "../src/commands/user.js";
import { login, logout } from "../src/commands/auth.js";

program.version("1.0.0").description("GitHub CLI Tool");

program
	.command("repo-list")
	.description("List public repositories for a given username")
	.action(listRepositories);

program
	.command("repo-create")
	.description("Create a new GitHub repository")
	.action(createRepository);
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
	.command("repo-issues")
	.description("List issues for a GitHub repository")
	.action(listRepositoryIssues);
program
	.command("issue-create")
	.description("Create a new issue for a GitHub repository")
	.action(createIssue);
program
	.command("issue-close")
	.description("Close an issue for a GitHub repository")
	.action(closeIssue);
program
	.command("pr-list")
	.description("List pull requests for a GitHub repository")
	.action(listRepositoryPullRequests);
program
	.command("pr-create")
	.description("Create a new pull request for a GitHub repository")
	.action(createPullRequest);
program
	.command("pr-merge")
	.description("Merge a pull request for a GitHub repository")
	.action(mergePullRequest);

program
	.command("user-info")
	.description("Get information about a GitHub user")
	.action(getUserInfo);

program
	.command("login")
	.description("Login to GitHub and store your credentials")
	.action(login);

program
	.command("logout")
	.description("Logout from GitHub and remove your credentials")
	.action(logout);

program.parse(process.argv);
