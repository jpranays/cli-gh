import inquirer from "inquirer";
import api from "../services/api.js";
import chalk from "chalk";

export const getUserInfo = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "username",
				message: "Enter the GitHub username:",
				validate: (input) => (input ? true : "GitHub username is required."),
			},
		]);

		const { username } = answers;

		const response = await api.get(`/users/${username}`);

		if (response.status === 200) {
			const user = response.data;
			console.log(`Username: ${user.login}`);
			console.log(`Name: ${user.name}`);
			console.log(`Bio: ${user.bio}`);
			console.log(`Public Repos: ${user.public_repos}`);
			console.log(`Followers: ${user.followers}`);
			console.log(`Following: ${user.following}`);
			console.log(`Location: ${user.location}`);
			console.log(`Blog: ${user.blog}`);
			console.log(`Email: ${user.email}`);
			console.log(`Avatar URL: ${user.avatar_url}`);
			console.log(`Profile URL: ${user.html_url}`);
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};

export const updateUserInfo = async () => {
	try {
		const answers = await inquirer.prompt([
			{
				name: "name",
				message: "Enter the new name:",
				default: "",
			},
			{
				name: "bio",
				message: "Enter the new bio:",
				default: "",
			},
			{
				name: "location",
				message: "Enter the new location:",
				default: "",
			},
			{
				name: "blog",
				message: "Enter the new blog URL:",
				default: "",
			},
			{
				name: "email",
				message: "Enter the new email:",
				default: "",
			},
		]);

		const { name, bio, location, blog, email } = answers;

		const response = await api.patch("/user", {
			name,
			bio,
			location,
			blog,
			email,
		});

		if (response.status === 200) {
			console.log(chalk.green("User information updated successfully!"));
		}
	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
	}
};
