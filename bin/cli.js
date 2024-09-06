#!/usr/bin/env node

import { program } from "commander";
import { listRepositories, createRepository } from "../src/commands/repo.js";
import { getUserInfo } from "../src/commands/user.js";
import { login, logout } from "../src/commands/auth.js";

program.version("1.0.0").description("GitHub CLI Tool");

program
	.command("repo-list")
	.description("List public repositories for a given username")
	.action(listRepositories);

program
	.command("repo-create")
	.description("Create a new GitHub repository (authentication required)")
	.action(createRepository);

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
