/* Blue confetti — canvas, rhombus pieces, gravity + rotation */

const { useEffect: useCEffect, useRef: useCRef } = React;

function Confetti({ onDone, duration = 3500 }) {
  const canvasRef = useCRef(null);
  const rafRef = useCRef(null);
  const startRef = useCRef(0);
  const piecesRef = useCRef([]);

  useCEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Blue confetti palette to match OpenLane brand
    const colors = [
      "#1652F0", // brand blue
      "#0a3bb8", // deep blue
      "#0c2c7a", // navy
      "#2d6df0", // mid blue
      "#5b8cff", // soft blue
      "#a3b8f5", // pale lavender-blue
      "#dbe5ff", // very pale
      "#6f8be8",
    ];

    const W = window.innerWidth;
    const H = window.innerHeight;

    // Two waves: a burst at t=0 from above, then a steady drizzle for ~1s.
    const pieces = [];
    const spawn = (count, delay) => {
      for (let i = 0; i < count; i++) {
        pieces.push({
          x: Math.random() * W,
          y: -20 - Math.random() * H * 0.3,
          vx: (Math.random() - 0.5) * 4,
          vy: 2 + Math.random() * 3,
          w: 6 + Math.random() * 8,
          h: 10 + Math.random() * 10,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.25,
          tilt: Math.random() * Math.PI * 2,
          vtilt: 0.1 + Math.random() * 0.15,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: delay,
          life: 0,
        });
      }
    };
    spawn(220, 0);
    spawn(120, 500);
    spawn(80, 1100);

    piecesRef.current = pieces;
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      ctx.clearRect(0, 0, W, H);

      let alive = 0;
      for (const p of pieces) {
        if (elapsed < p.delay) continue;
        p.life = elapsed - p.delay;
        // physics
        p.vy += 0.08; // gravity
        p.vx *= 0.995; // air resistance
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.tilt += p.vtilt;

        if (p.y < H + 50) alive++;
        if (p.y > H + 50) continue;

        // draw rhombus (rotated rectangle with squashed Y via tilt cos)
        const cosT = Math.cos(p.tilt);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        // squash with tilt for shimmer feel
        const w = p.w;
        const h = p.h * Math.abs(cosT);
        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(w, 0);
        ctx.lineTo(0, h);
        ctx.lineTo(-w, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      if (elapsed < duration + 1500 && alive > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W, H);
        if (onDone) onDone();
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}

window.Confetti = Confetti;
