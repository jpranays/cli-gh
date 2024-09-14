import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import { useCanvasAnimation } from "../hooks/useCanvasAnimation";
import { useEffect } from "react";
import "./terminal.css";

class Termynal {
    container: HTMLElement;
    pfx: string;
    startDelay: number;
    typeDelay: number;
    lineDelay: number;
    progressLength: number;
    progressChar: string;
    cursor: string;
    lines: HTMLElement[] = [];

    constructor(selector: string = '#termynal', options: any = {}) {
        this.container = typeof selector === 'string' ? document.querySelector(selector)! : selector;
        this.pfx = 'data-' + (options.prefix || 'ty');
        this.startDelay = options.startDelay || parseFloat(this.container.getAttribute(this.pfx + '-startDelay')!) || 600;
        this.typeDelay = options.typeDelay || parseFloat(this.container.getAttribute(this.pfx + '-typeDelay')!) || 90;
        this.lineDelay = options.lineDelay || parseFloat(this.container.getAttribute(this.pfx + '-lineDelay')!) || 1500;
        this.progressLength = options.progressLength || parseFloat(this.container.getAttribute(this.pfx + '-progressLength')!) || 40;
        this.progressChar = options.progressChar || this.container.getAttribute(this.pfx + '-progressChar') || '\u2588';
        this.cursor = options.cursor || this.container.getAttribute(this.pfx + '-cursor') || '\u258B';
        if (!options.noInit) {
            this.init();
        }
    }

    private init() {
        this.lines = Array.from(this.container.querySelectorAll('[' + this.pfx + ']')) as HTMLElement[];
        const computedStyle = getComputedStyle(this.container);
        this.container.style.width = computedStyle.width;
        this.container.style.height = computedStyle.height;
        this.container.setAttribute('data-termynal', '');
        this.container.innerHTML = '';
        this.start();
    }

    private async start() {
        await this._wait(this.startDelay);

        for (const line of this.lines) {
            const type = line.getAttribute(this.pfx)!;
            const delay = line.getAttribute(this.pfx + '-delay') || this.lineDelay;

            if (type === 'input') {
                line.setAttribute(this.pfx + '-cursor', this.cursor);
                await this.type(line);
                await this._wait(Number(delay));
            } else if (type === 'progress') {
                await this.progress(line);
                await this._wait(Number(delay));
            } else {
                this.container.appendChild(line);
                await this._wait(Number(delay));
            }

            line.removeAttribute(this.pfx + '-cursor');
        }
    }

    private async type(line: HTMLElement) {
        const content = Array.from(line.textContent!);
        const delay = Number(line.getAttribute(this.pfx + '-typeDelay') || this.typeDelay);
        line.textContent = '';
        this.container.appendChild(line);

        for (const char of content) {
            await this._wait(delay);
            line.textContent += char;
        }
    }

    private async progress(line: HTMLElement) {
        const progressLength = Number(line.getAttribute(this.pfx + '-progressLength') || this.progressLength);
        const progressChar = line.getAttribute(this.pfx + '-progressChar') || this.progressChar;
        const progressString = progressChar.repeat(progressLength);
        line.textContent = '';
        this.container.appendChild(line);

        for (let i = 1; i <= progressString.length; i++) {
            await this._wait(this.typeDelay);
            const percentage = Math.round((i / progressString.length) * 100);
            line.textContent = `${progressString.slice(0, i)} ${percentage}%`;
        }
    }

    private _wait(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
}

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
