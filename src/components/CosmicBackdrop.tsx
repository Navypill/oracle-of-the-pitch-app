'use client';

import { useEffect, useRef } from "react";

type Props = {
  consulting: boolean;
};

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  twinkle: number;
};

export default function CosmicBackdrop({ consulting }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const context = ctx;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let tick = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars.length = 0;
      const count = Math.min(160, Math.max(80, Math.floor((width * height) / 11000)));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          radius: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.55 + 0.25,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawNebula(intensity: number) {
      const left = context.createRadialGradient(width * 0.16, height * 0.34, 0, width * 0.16, height * 0.34, width * 0.72);
      left.addColorStop(0, `rgba(34, 176, 213, ${0.16 + intensity * 0.05})`);
      left.addColorStop(0.28, `rgba(89, 58, 179, ${0.13 + intensity * 0.05})`);
      left.addColorStop(0.72, "rgba(5, 8, 18, 0)");
      context.fillStyle = left;
      context.fillRect(0, 0, width, height);

      const right = context.createRadialGradient(width * 0.84, height * 0.22, 0, width * 0.84, height * 0.22, width * 0.55);
      right.addColorStop(0, `rgba(213, 82, 176, ${0.12 + intensity * 0.08})`);
      right.addColorStop(0.36, `rgba(118, 69, 209, ${0.11 + intensity * 0.05})`);
      right.addColorStop(0.86, "rgba(5, 8, 18, 0)");
      context.fillStyle = right;
      context.fillRect(0, 0, width, height);
    }

    function drawConstellations(intensity: number) {
      const maxDistance = consulting ? 130 : 104;
      context.lineWidth = 1;
      for (let i = 0; i < stars.length; i += 4) {
        const a = stars[i];
        for (let j = i + 4; j < stars.length; j += 9) {
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (0.11 + intensity * 0.08);
            context.strokeStyle = `rgba(155, 213, 255, ${alpha})`;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }
    }

    function draw() {
      const intensity = consulting ? 1 : 0;
      tick += reducedMotion ? 0 : 1;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#050812";
      context.fillRect(0, 0, width, height);
      drawNebula(intensity);

      for (const star of stars) {
        if (!reducedMotion) {
          star.x += star.vx * (consulting ? 2.5 : 1);
          star.y += star.vy * (consulting ? 2.5 : 1);
          if (star.x < -4) star.x = width + 4;
          if (star.x > width + 4) star.x = -4;
          if (star.y < -4) star.y = height + 4;
          if (star.y > height + 4) star.y = -4;
        }

        const shimmer = reducedMotion ? 0 : Math.sin(tick * 0.03 + star.twinkle) * 0.18;
        context.fillStyle = `rgba(255, 248, 218, ${Math.min(1, star.alpha + shimmer + intensity * 0.13)})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius + intensity * 0.15, 0, Math.PI * 2);
        context.fill();
      }

      drawConstellations(intensity);

      if (!reducedMotion) {
        frameId = requestAnimationFrame(draw);
      }
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [consulting]);

  return (
    <div className={`cosmic-backdrop${consulting ? " is-consulting" : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} className="cosmic-canvas" />
      <div className="cosmic-vignette" />
      <div className="cosmic-orbit cosmic-orbit-one" />
      <div className="cosmic-orbit cosmic-orbit-two" />
    </div>
  );
}
