import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
	// By default, Docusaurus generates a sidebar from the docs folder structure
	docsSidebar: [
		"intro",
		{
			Commands: [
				"commands/Authentication/Authentication",
				"commands/Repository/Repository",
				"commands/Pull Request/Pull Request",
				"commands/Branch/Branch",
				"commands/Issue/Issue",
				"commands/Collaborator/Collaborator",
				"commands/User/User",
			],
		},
		"Troubleshooting & FAQs",
	],
};

export default sidebars;
