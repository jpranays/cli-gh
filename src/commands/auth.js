import inquirer from "inquirer";
import axios from "axios";
import { writeConfig, readConfig } from "../utils/config.js";
import chalk from "chalk";
import api from "../services/api.js";

// Login command to store GitHub credentials
export const login = async () => {
	const { token } = await inquirer.prompt([
		{
			name: "token",
			message: "Enter your GitHub Personal Access Token:",
			type: "password",
		},
	]);

	try {
		const response = await api.get("/user", {
			headers: { Authorization: `token ${token}` },
		});

		if (response.status === 200) {
			writeConfig({ githubToken: token });
			console.log(chalk.green("Successfully logged in!"));
		} else {
			console.log(chalk.red("Invalid token. Please try again."));
		}
	} catch (error) {
		console.error(chalk.red("Error validating token:"), error.message);
	}
};

// Logout command to remove GitHub credentials
export const logout = async () => {
	try {
		const config = readConfig();
		if (config.githubToken) {
			writeConfig({});
			console.log(chalk.green("Successfully logged out!"));
		} else {
			console.log(chalk.red("No login information found."));
		}
	} catch (error) {
		console.error(chalk.red("Error logging out:"), error.message);
	}
};
