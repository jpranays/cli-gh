import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
	emoji?: string;
	title: string;
	description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
	{
		emoji: "🛠️",
		title: "Simple and Intuitive",
		description: <>Easy to use with minimal setup required.</>,
	},
	{
		emoji: "🔒",
		title: "Secure Authentication",
		description: <>Secure authentication via GitHub PAT.</>,
	},
	{
		emoji: "📦",
		title: "Powerful commands",
		description: (
			<>Includes commands for repo, PR, issue, and user management and more.</>
		),
	},
	{
		emoji: "🌍",
		title: "Cross-Platform Compatibility",
		description: <>Works seamlessly on Windows, macOS, and Linux.</>,
	},
	{
		emoji: "🔄",
		title: "Real-Time Updates",
		description: (
			<>Fetch and display the latest data from GitHub with instant updates.</>
		),
	},
	{
		emoji: "📚",
		title: "Comprehensive Documentation",
		description: <>Detailed documentation with examples for each command.</>,
	},
];

function Feature({ emoji, title, description }: FeatureItem) {
	return (
		<div className={clsx("col col--4")} style={{ padding: 15 }}>
			<div className="text--center padding-horiz--md">
				<span
					style={{
						fontSize: "2rem",
						display: "block",
						marginBottom: "1rem",
						color: "var(--ifm-color-primary)",
					}}
				>
					{emoji}
				</span>
				<Heading
					as="h3"
					style={{
						color: "var(--ifm-color-primary)",
						fontWeight: "normal",
						fontSize: "1.2rem",
					}}
				>
					{title}
				</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures(): JSX.Element {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
