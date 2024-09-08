import api from "../services/api.js";
import chalk from "chalk";
import inquirer from "inquirer";
import { exec } from "child_process";

export const listRepositories = async () => {
	try {
		const { data } = await api.get("/user/repos");
		data.forEach((repo) => {
			console.log(chalk.blue(repo.name));
		});
	} catch (error) {
		console.error(chalk.red("Error fetching repositories:"), error.message);
	}
};

export const createRepository = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "name",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
			{
				name: "description",
				message: "Enter the repository description (optional):",
			},
			{
				type: "confirm",
				name: "private",
				message: "Should the repository be private?",
				default: false,
			},
		]);

		const response = await api.post("/user/repos", {
			name: answers.name,
			description: answers.description,
			private: answers.private,
		});

		if (response.status === 201) {
			console.log(
				chalk.green(`Repository '${response.data.name}' created successfully!`)
			);
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const deleteRepository = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
		]);

		const confirmDelete = await inquirer.prompt([
			{
				type: "confirm",
				name: "confirm",
				message: `Are you sure you want to delete the repository ${answers.repo}? This action cannot be undone.`,
				default: false,
			},
		]);

		if (confirmDelete.confirm) {
			await api.delete(`/repos/${answers.owner}/${answers.repo}`);
			console.log(
				chalk.green(`Repository '${answers.repo}' deleted successfully!`)
			);
		} else {
			console.log(chalk.yellow("Repository deletion canceled."));
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const starRepository = async () => {
	try {
		const { owner, repo } = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
		]);

		await api.put(`/user/starred/${owner}/${repo}`);

		console.log(chalk.green(`Successfully starred the repository '${repo}'!`));
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const unstarRepository = async () => {
	try {
		const { owner, repo } = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
		]);

		await api.delete(`/user/starred/${owner}/${repo}`);

		console.log(
			chalk.green(`Successfully unstarred the repository '${repo}'!`)
		);
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const forkRepository = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
		]);

		const { owner, repo } = answers;

		const response = await api.post(`/repos/${owner}/${repo}/forks`);

		if (response.status === 202) {
			console.log(
				chalk.green(
					`Repository '${repo}' from '${owner}' is being forked successfully! Check your repositories list to see it soon.`
				)
			);
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const cloneRepository = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
		]);

		const { owner, repo } = answers;

		const { data } = await api.get(`/repos/${owner}/${repo}`);

		if (data.clone_url) {
			console.log(chalk.blue(`Cloning repository '${repo}'...`));
			exec(`git clone ${data.clone_url}`, (error, stdout, stderr) => {
				if (error) {
					console.error(
						chalk.red(`Error cloning repository: ${error.message}`)
					);
					return;
				}
				if (stderr) {
					console.error(chalk.yellow(`Warnings: ${stderr}`));
				}
				console.log(chalk.green(`Repository '${repo}' cloned successfully!`));
				console.log(stdout);
			});
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const getRepositoryInfo = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
		]);

		const { owner, repo } = answers;

		const { data } = await api.get(`/repos/${owner}/${repo}`);

		console.log(chalk.blue(`Repository Name: ${data.name}`));
		console.log(
			chalk.blue(
				`Description: ${data.description || "No description provided"}`
			)
		);
		console.log(chalk.blue(`Stars: ${data.stargazers_count}`));
		console.log(chalk.blue(`Forks: ${data.forks_count}`));
		console.log(chalk.blue(`Open Issues: ${data.open_issues_count}`));
		console.log(chalk.blue(`Primary Language: ${data.language}`));
		console.log(chalk.blue(`Repository URL: ${data.html_url}`));
		console.log(
			chalk.blue(`Created At: ${new Date(data.created_at).toLocaleString()}`)
		);
		console.log(
			chalk.blue(`Updated At: ${new Date(data.updated_at).toLocaleString()}`)
		);
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const listRepositoryIssues = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
		]);

		const { owner, repo } = answers;

		const { data } = await api.get(`/repos/${owner}/${repo}/issues`);

		if (data.length === 0) {
			console.log(
				chalk.yellow(`No open issues found in repository '${repo}'.`)
			);
		} else {
			console.log(chalk.green(`Open issues in repository '${repo}':`));
			data.forEach((issue, index) => {
				console.log(
					chalk.blue(`${index + 1}. ${issue.title} (#${issue.number})`)
				);
				console.log(
					chalk.gray(
						`   Created by: ${issue.user.login} on ${new Date(
							issue.created_at
						).toLocaleString()}`
					)
				);
				console.log(chalk.gray(`   State: ${issue.state}`));
				console.log(chalk.gray(`   URL: ${issue.html_url}`));
				console.log();
			});
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};
export const createIssue = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
			{
				name: "title",
				message: "Enter the issue title:",
				validate: (input) => (input ? true : "Issue title is required."),
			},
			{
				name: "body",
				message: "Enter the issue description (optional):",
			},
		]);

		const { owner, repo, title, body } = answers;

		const response = await api.post(`/repos/${owner}/${repo}/issues`, {
			title,
			body,
		});

		if (response.status === 201) {
			console.log(
				chalk.green(`Issue '${response.data.title}' created successfully!`)
			);
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const closeIssue = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
			{
				name: "issue_number",
				message: "Enter the issue number to close:",
				validate: (input) => (input ? true : "Issue number is required."),
			},
		]);

		const { owner, repo, issue_number } = answers;

		const response = await api.patch(
			`/repos/${owner}/${repo}/issues/${issue_number}`,
			{
				state: "closed",
			}
		);

		if (response.status === 200) {
			console.log(chalk.green(`Issue #${issue_number} closed successfully!`));
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};
export const listRepositoryPullRequests = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
		]);

		const { owner, repo } = answers;

		const { data } = await api.get(`/repos/${owner}/${repo}/pulls`);

		if (data.length === 0) {
			console.log(
				chalk.yellow(`No open pull requests found in repository '${repo}'.`)
			);
		} else {
			console.log(chalk.green(`Open pull requests in repository '${repo}':`));
			data.forEach((pr, index) => {
				console.log(chalk.blue(`${index + 1}. ${pr.title} (#${pr.number})`));
				console.log(chalk.gray(`   Created by: ${pr.user.login}`));
			});
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};
export const createPullRequest = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
			{
				name: "head",
				message: "Enter the branch name to merge from (head):",
				validate: (input) => (input ? true : "Branch name is required."),
			},
			{
				name: "base",
				message: "Enter the branch name to merge into (base):",
				validate: (input) => (input ? true : "Base branch is required."),
			},
			{
				name: "title",
				message: "Enter the pull request title:",
				validate: (input) => (input ? true : "Title is required."),
			},
			{
				name: "body",
				message: "Enter the pull request description (optional):",
			},
		]);

		const { owner, repo, head, base, title, body } = answers;

		const response = await api.post(`/repos/${owner}/${repo}/pulls`, {
			head,
			base,
			title,
			body,
		});

		if (response.status === 201) {
			console.log(
				chalk.green(
					`Pull request '${response.data.title}' created successfully!`
				)
			);
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const mergePullRequest = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "owner",
				message: "Enter the GitHub username (owner of the repository):",
				validate: (input) => (input ? true : "Owner username is required."),
			},
			{
				name: "repo",
				message: "Enter the repository name:",
				validate: (input) => (input ? true : "Repository name is required."),
			},
			{
				name: "pull_number",
				message: "Enter the pull request number to merge:",
				validate: (input) =>
					input ? true : "Pull request number is required.",
			},
			{
				name: "commit_message",
				message: "Enter the commit message for the merge:",
				validate: (input) => (input ? true : "Commit message is required."),
			},
		]);

		const { owner, repo, pull_number, commit_message } = answers;

		const response = await api.put(
			`/repos/${owner}/${repo}/pulls/${pull_number}/merge`,
			{
				commit_message,
			}
		);

		if (response.status === 200) {
			console.log(
				chalk.green(`Pull request #${pull_number} merged successfully!`)
			);
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};
