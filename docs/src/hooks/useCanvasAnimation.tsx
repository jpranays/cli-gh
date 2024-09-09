import { useEffect } from "react";

export const useCanvasAnimation = (canvasId: string) => {
	useEffect(() => {
		const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let w = window.innerWidth;
		let h = window.innerHeight;
		canvas.width = w;
		canvas.height = h;

		const rate = 60;
		const arc = 100;
		const size = 7;
		const speed = 20;
		let time = 0;
		let parts: Array<any> = [];
		const colors = ["red", "#f57900", "yellow", "#ce5c00", "#5c3566"];
		const mouse = { x: 0, y: 0 };

		const create = () => {
			time = 0;
			for (let i = 0; i < arc; i++) {
				parts[i] = {
					x: Math.ceil(Math.random() * w),
					y: Math.ceil(Math.random() * h),
					toX: Math.random() * 5 - 1,
					toY: Math.random() * 2 - 1,
					c: colors[Math.floor(Math.random() * colors.length)],
					size: Math.random() * size,
				};
			}
		};

		const particles = () => {
			ctx.clearRect(0, 0, w, h);
			for (let i = 0; i < arc; i++) {
				const li = parts[i];
				const distanceFactor = Math.max(
					Math.min(15 - DistanceBetween(mouse, li) / 10, 10),
					1
				);
				ctx.beginPath();
				ctx.arc(li.x, li.y, li.size * distanceFactor, 0, Math.PI * 2, false);
				ctx.fillStyle = li.c;
				ctx.strokeStyle = li.c;
				if (i % 2 === 0) {
					ctx.stroke();
				} else {
					ctx.fill();
				}

				li.x = li.x + li.toX * (time * 0.05);
				li.y = li.y + li.toY * (time * 0.05);

				if (li.x > w) li.x = 0;
				if (li.y > h) li.y = 0;
				if (li.x < 0) li.x = w;
				if (li.y < 0) li.y = h;
			}

			if (time < speed) {
				time++;
			}
			setTimeout(particles, 1000 / rate);
		};

		const DistanceBetween = (
			p1: { x: number; y: number },
			p2: { x: number; y: number }
		) => {
			const dx = p2.x - p1.x;
			const dy = p2.y - p1.y;
			return Math.sqrt(dx * dx + dy * dy);
		};

		create();
		particles();

		const removeParticles = () => {
			parts = [];
		};

		const adjustCanvasSize = () => {
			w = window.innerWidth;
			h = window.innerHeight;
			canvas.width = w;
			canvas.height = h;
			removeParticles();
			create();
		};
		window.addEventListener("resize", adjustCanvasSize);

		return () => {
			window.removeEventListener("resize", adjustCanvasSize);
		};
	}, [canvasId]);
};
