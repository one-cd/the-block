import { useEffect, useRef } from "react";

type ConfettiProps = {
  onDone: () => void;
  duration?: number;
};

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vrot: number;
  tilt: number;
  vtilt: number;
  color: string;
  delay: number;
  life: number;
};

export function Confetti({ onDone, duration = 3500 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const colors = ["#1652F0", "#0a3bb8", "#0c2c7a", "#2d6df0", "#5b8cff", "#a3b8f5", "#dbe5ff", "#6f8be8"];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pieces: Piece[] = [];
    const spawn = (count: number, delay: number) => {
      for (let index = 0; index < count; index += 1) {
        pieces.push({
          x: Math.random() * width,
          y: -20 - Math.random() * height * 0.3,
          vx: (Math.random() - 0.5) * 4,
          vy: 2 + Math.random() * 3,
          w: 6 + Math.random() * 8,
          h: 10 + Math.random() * 10,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.25,
          tilt: Math.random() * Math.PI * 2,
          vtilt: 0.1 + Math.random() * 0.15,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay,
          life: 0,
        });
      }
    };

    spawn(220, 0);
    spawn(120, 500);
    spawn(80, 1100);

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);

      let alive = 0;
      for (const piece of pieces) {
        if (elapsed < piece.delay) {
          continue;
        }

        piece.life = elapsed - piece.delay;
        piece.vy += 0.08;
        piece.vx *= 0.995;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rot += piece.vrot;
        piece.tilt += piece.vtilt;

        if (piece.y < height + 50) {
          alive += 1;
        }

        if (piece.y > height + 50) {
          continue;
        }

        const h = piece.h * Math.abs(Math.cos(piece.tilt));
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rot);
        ctx.fillStyle = piece.color;
        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(piece.w, 0);
        ctx.lineTo(0, h);
        ctx.lineTo(-piece.w, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      if (elapsed < duration + 1500 && alive > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
        doneRef.current();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [duration]);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}
