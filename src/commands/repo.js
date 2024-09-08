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
export const updateRepository = async () => {
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
				name: "name",
				message:
					"Enter the new name for the repository (leave blank to keep current name):",
			},
			{
				name: "description",
				message:
					"Enter the new description for the repository (leave blank to keep current description):",
			},
			{
				name: "homepage",
				message:
					"Enter the new homepage URL for the repository (leave blank to keep current URL):",
			},
			{
				type: "confirm",
				name: "isPrivate",
				message: "Should the repository be private?",
				default: false,
			},
			{
				type: "confirm",
				name: "hasIssues",
				message: "Should issues be enabled?",
				default: true,
			},
			{
				type: "confirm",
				name: "hasWiki",
				message: "Should the wiki be enabled?",
				default: true,
			},
			{
				type: "confirm",
				name: "hasProjects",
				message: "Should projects be enabled?",
				default: true,
			},
			{
				name: "defaultBranch",
				message:
					"Enter the name of the default branch (leave blank to keep current branch):",
			},
		]);

		const {
			owner,
			repo,
			name,
			description,
			homepage,
			isPrivate,
			hasIssues,
			hasWiki,
			hasProjects,
			defaultBranch,
		} = answers;

		const data = {};
		if (name) data.name = name;
		if (description) data.description = description;
		if (homepage) data.homepage = homepage;
		data.private = isPrivate;
		data.has_issues = hasIssues;
		data.has_wiki = hasWiki;
		data.has_projects = hasProjects;
		if (defaultBranch) data.default_branch = defaultBranch;

		const response = await api.patch(`/repos/${owner}/${repo}`, data);

		if (response.status === 200) {
			console.log(chalk.green(`Repository '${repo}' updated successfully!`));
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

export const listActions = async () => {
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

		const { data } = await api.get(
			`/repos/${answers.owner}/${answers.repo}/actions/workflows`
		);
		console.log(chalk.blue("GitHub Actions Workflows:"));
		data.workflows.forEach((workflow) => {
			console.log(chalk.green(workflow.name), "-", workflow.state);
		});
	} catch (error) {
		console.error(chalk.red("Error fetching workflows:"), error.message);
	}
};

export const getRepositoryTraffic = async () => {
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

		const response = await api.get(`/repos/${owner}/${repo}/traffic/views`);
		const { data } = response;

		console.log(`Traffic Data for ${repo}:`);
		console.log(`Total Views: ${data.count}`);
		console.log(`Unique Views: ${data.uniques}`);
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
export const getIssueInfo = async () => {
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
				name: "issueNumber",
				message: "Enter the issue number:",
				validate: (input) => (input ? true : "Issue number is required."),
			},
		]);

		const { owner, repo, issueNumber } = answers;
		const response = await api.get(
			`/repos/${owner}/${repo}/issues/${issueNumber}`
		);

		if (response.status === 200) {
			console.log(`Issue #${response.data.number}: ${response.data.title}`);
			console.log(`State: ${response.data.state}`);
			console.log(`Created At: ${response.data.created_at}`);
			console.log(`Updated At: ${response.data.updated_at}`);
			console.log(`User: ${response.data.user.login}`);
			console.log(`Description: ${response.data.body}`);
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
export const updateIssue = async () => {
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
				name: "issueNumber",
				message: "Enter the issue number:",
				validate: (input) => (input ? true : "Issue number is required."),
			},
			{
				name: "title",
				message:
					"Enter the new title for the issue (leave blank to keep current title):",
			},
			{
				name: "body",
				message:
					"Enter the new body text for the issue (leave blank to keep current body):",
			},
			{
				name: "state",
				message:
					"Enter the new state of the issue (open/closed, leave blank to keep current state):",
				validate: (input) =>
					["open", "closed", ""].includes(input) ? true : "Invalid state.",
			},
		]);

		const { owner, repo, issueNumber, title, body, state } = answers;

		const data = {};
		if (title) data.title = title;
		if (body) data.body = body;
		if (state) data.state = state;

		const response = await api.patch(
			`/repos/${owner}/${repo}/issues/${issueNumber}`,
			data
		);

		if (response.status === 200) {
			console.log(chalk.green(`Issue #${issueNumber} updated successfully!`));
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

export const getPrInfo = async () => {
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
				name: "prNumber",
				message: "Enter the pull request number:",
				validate: (input) =>
					input ? true : "Pull request number is required.",
			},
		]);

		const { owner, repo, prNumber } = answers;
		const response = await api.get(`/repos/${owner}/${repo}/pulls/${prNumber}`);

		if (response.status === 200) {
			console.log(
				`Pull Request #${response.data.number}: ${response.data.title}`
			);
			console.log(`State: ${response.data.state}`);
			console.log(`Created At: ${response.data.created_at}`);
			console.log(`Updated At: ${response.data.updated_at}`);
			console.log(`User: ${response.data.user.login}`);
			console.log(`Description: ${response.data.body}`);
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
export const addCollaborator = async () => {
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
				name: "collaborator",
				message: "Enter the username of the collaborator to add:",
				validate: (input) =>
					input ? true : "Collaborator username is required.",
			},
			{
				name: "permission",
				message:
					"Enter the permission level (admin, write, read) for the collaborator:",
				type: "list",
				choices: ["admin", "write", "read"],
				default: "write",
			},
		]);

		const { owner, repo, collaborator, permission } = answers;

		const response = await api.put(
			`/repos/${owner}/${repo}/collaborators/${collaborator}`,
			{ permission }
		);

		if (response.status === 201) {
			console.log(
				chalk.green(
					`Successfully added ${collaborator} as a collaborator to the repository '${repo}' with ${permission} permission!`
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

export const removeCollaborator = async () => {
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
				name: "collaborator",
				message: "Enter the username of the collaborator to remove:",
				validate: (input) =>
					input ? true : "Collaborator username is required.",
			},
		]);

		const { owner, repo, collaborator } = answers;

		const response = await api.delete(
			`/repos/${owner}/${repo}/collaborators/${collaborator}`
		);

		if (response.status === 204) {
			console.log(
				chalk.green(
					`Successfully removed ${collaborator} from the repository '${repo}'.`
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
export const listCollaborators = async () => {
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

		const response = await api.get(`/repos/${owner}/${repo}/collaborators`);

		if (response.status === 200) {
			const collaborators = response.data;
			if (collaborators.length > 0) {
				console.log(chalk.green(`Collaborators for repository '${repo}':`));
				collaborators.forEach((collaborator) => {
					console.log(chalk.blue(collaborator.login));
				});
			} else {
				console.log(
					chalk.yellow(`No collaborators found for repository '${repo}'.`)
				);
			}
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const listBranches = async () => {
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

		const response = await api.get(`/repos/${owner}/${repo}/branches`);

		if (response.status === 200) {
			const branches = response.data;
			if (branches.length > 0) {
				console.log(chalk.green(`Branches for repository '${repo}':`));
				branches.forEach((branch) => {
					console.log(chalk.blue(branch.name));
				});
			} else {
				console.log(
					chalk.yellow(`No branches found for repository '${repo}'.`)
				);
			}
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};
export const createBranch = async () => {
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
				name: "branch",
				message: "Enter the name of the new branch:",
				validate: (input) => (input ? true : "Branch name is required."),
			},
			{
				name: "baseBranch",
				message:
					"Enter the name of the base branch to create the new branch from (e.g., 'main' or 'master'):",
				validate: (input) => (input ? true : "Base branch name is required."),
			},
		]);

		const { owner, repo, branch, baseBranch } = answers;

		const baseBranchResponse = await api.get(
			`/repos/${owner}/${repo}/branches/${baseBranch}`
		);
		const baseBranchSha = baseBranchResponse.data.commit.sha;

		const response = await api.post(`/repos/${owner}/${repo}/git/refs`, {
			ref: `refs/heads/${branch}`,
			sha: baseBranchSha,
		});

		if (response.status === 201) {
			console.log(
				chalk.green(
					`Successfully created branch '${branch}' from '${baseBranch}' in repository '${repo}'.`
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

export const deleteBranch = async () => {
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
				name: "branch",
				message: "Enter the branch name to delete:",
				validate: (input) => (input ? true : "Branch name is required."),
			},
		]);

		const { owner, repo, branch } = answers;

		const refPath = `heads/${branch}`;

		const response = await api.delete(
			`/repos/${owner}/${repo}/git/refs/${refPath}`
		);

		if (response.status === 204) {
			console.log(
				chalk.green(
					`Successfully deleted branch '${branch}' from repository '${repo}'.`
				)
			);
		} else {
			console.log(
				chalk.yellow(
					`Branch '${branch}' might not exist or could not be deleted.`
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
