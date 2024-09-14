import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
	title: "Github-CLI",
	tagline: "A CLI tool to interact with Github",
	favicon: "img/favicon.ico",

	url: "https://jpranays.github.io",
	baseUrl: "/cli-gh/", // Update this if your repo name is different
	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",
	organizationName: "jpranays", // Your GitHub username or organization name
	projectName: "cli-gh", // Your repo name

	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},
	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		algolia: {
			apiKey: "3012a81621acdbbb5fc663277d5d013e",
			appId: "1F8174QBLL",
			indexName: "jpranaysio",
			contextualSearch: true,
		},
		colorMode: {
			defaultMode: "dark",
			disableSwitch: false,
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: "Github-CLI",
			items: [
				{
					type: "docSidebar",
					sidebarId: "docsSidebar",
					position: "left",
					label: "docs",
				},
				{
					href: "https://github.com/jpranays/cli-gh",
					"aria-label": "GitHub",
					className: "navbar__icon navbar__github",
					position: "right",
					html: '<i class="fa fa-github"></i>',
				},
			],
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
		announcementBar: {
			id: "under-construction",
			content:
				'⚠️ This project is under construction. Please check back later for updates.',
			backgroundColor: "#FFD700",
			textColor: "#000",
			isCloseable: false,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
