import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import { useCanvasAnimation } from "../hooks/useCanvasAnimation";
import Termynal from "./terminal";
import { useEffect } from "react";
import "./terminal.css";
function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={clsx("hero hero--primary", styles.heroBanner)}>
			<div className="container">
				<Heading as="h1" className="hero__title">
					{siteConfig.title}
				</Heading>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<GHCli />
				<div className={styles.buttons}>
					<Link className="button button--primary button--lg" to="/docs/intro">
						See all commands
					</Link>
				</div>
			</div>
		</header>
	);
}

function GHCli() {
	useEffect(() => {
		new Termynal("#termynal");
	}, []);
	return (
		<div
			id="termynal"
			data-termynal
			data-ty-typeDelay="40"
			data-ty-lineDelay="700"
		>
			<span data-ty="input" data-color="green">
				ghc repo-create
			</span>
			<span data-ty="input" data-ty-prompt="?" data-color="white">
				Enter the repository name: Test-Repo
			</span>
			<span data-ty="input" data-ty-prompt="?" data-color="white">
				Enter the repository description: This is a test repository
			</span>
			<span data-ty="input" data-ty-prompt="?" data-color="white">
				Should the repository be private? (y/n): n
			</span>
			<span data-ty data-color="green">
				Repository 'Test-Repo' created successfully!
			</span>
		</div>
	);
}

export default function Home(): JSX.Element {
	const { siteConfig } = useDocusaurusContext();

	useCanvasAnimation("canvas-bubbles");

	return (
		<Layout
			title={`${siteConfig.title}`}
			description="A CLI tool to interact with Github"
			wrapperClassName="homepage-wrapper"
		>
			<canvas id="canvas-bubbles"></canvas>

			<HomepageHeader />
			<main
				style={{
					backgroundColor: "var(--background-color)",
				}}
			>
				<HomepageFeatures />
			</main>
		</Layout>
	);
}
