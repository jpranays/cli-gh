import api from "../services/api.js";
import chalk from "chalk";
import inquirer from "inquirer";


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
