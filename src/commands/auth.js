import inquirer from "inquirer";
import axios from "axios";
import { writeConfig } from "../utils/config.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";

const configPath = path.resolve("config/config.json");

export const login = async () => {
	const { token } = await inquirer.prompt([
		{
			name: "token",
			message: "Enter your GitHub Personal Access Token:",
			type: "password",
		},
	]);

	try {
		const response = await axios.get("https://api.github.com/user", {
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

export const logout = async () => {
	try {
		if (fs.existsSync(configPath)) {
			fs.writeFileSync(configPath, JSON.stringify({}, null, 2), "utf8");
			console.log(chalk.green("Successfully logged out!"));
		} else {
			console.log(chalk.red("No login information found."));
		}
	} catch (error) {
		console.error(chalk.red("Error logging out:"), error.message);
	}
};
