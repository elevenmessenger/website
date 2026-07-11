// ambient.js — the site's living backdrop: the product's soft smoke + rising
// dust motes (home/web/static/bootscene.js), trimmed hard so a marketing page
// never warms anyone's lap:
//   - roughly half the particle counts, no film-grain pass
//   - frames capped at 30fps (the drift is slow; 60 buys nothing)
//   - devicePixelRatio capped at 1.5
//   - prefers-reduced-motion gets a single considered still, no animation
//   - the tab being hidden pauses it for free (requestAnimationFrame)
// The canvas sits at z-index -1 behind everything, at low opacity.

const FRAME_MS = 1000 / 30;

function makePuffShape(size) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const p = c.getContext("2d");
  for (let i = 0; i < 24; i++) {
    const bx = size / 2 + (Math.random() - 0.5) * size * 0.52;
    const by = size / 2 + (Math.random() - 0.5) * size * 0.38;
    const br = size * (0.09 + Math.random() * 0.17);
    const grad = p.createRadialGradient(bx, by, 0, bx, by, br);
    grad.addColorStop(0, "rgba(255,255,255,0.055)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    p.fillStyle = grad;
    p.fillRect(0, 0, size, size);
  }
  const mask = p.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.5);
  mask.addColorStop(0, "rgba(0,0,0,1)");
  mask.addColorStop(1, "rgba(0,0,0,0)");
  p.globalCompositeOperation = "destination-in";
  p.fillStyle = mask;
  p.fillRect(0, 0, size, size);
  return c;
}

function tinted(shape, rgb) {
  const c = document.createElement("canvas");
  c.width = c.height = shape.width;
  const p = c.getContext("2d");
  p.drawImage(shape, 0, 0);
  p.globalCompositeOperation = "source-in";
  p.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  p.fillRect(0, 0, c.width, c.height);
  return c;
}

function start() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;
  const g = canvas.getContext("2d");
  if (!g) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Dark room: pale smoke, additive glints. Lit room: dark smoke that occludes.
  const bgRGB = ((getComputedStyle(document.body).backgroundColor || "").match(/\d+/g) || []).map(Number);
  const dark = bgRGB.length >= 3 && 0.299 * bgRGB[0] + 0.587 * bgRGB[1] + 0.114 * bgRGB[2] < 128;
  const room = dark
    ? { comp: "lighter", neutral: [216, 216, 224], neutralA: 0.26, mote: [255, 255, 255], moteA: 0.42, puffMul: 1 }
    : { comp: "source-over", neutral: [26, 28, 38], neutralA: 0.65, mote: [24, 26, 36], moteA: 0.65, puffMul: 1.7 };

  const shapes = Array.from({ length: 5 }, () => makePuffShape(256));
  const sprites = shapes.map((s) => tinted(s, room.neutral));

  const S = { canvas, g, room, sprites, reduced, W: 0, H: 0, puffs: [], motes: [] };
  const size = () => {
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    S.W = window.innerWidth;
    S.H = window.innerHeight;
    canvas.width = S.W * dpr;
    canvas.height = S.H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const seed = () => {
    const { W, H } = S;
    const k = Math.max(0.5, Math.min(1, W / 1100));
    const mul = room.puffMul;
    S.puffs = [];
    for (const layer of [
      { n: Math.round(18 * k * mul), s: [480, 860], v: [13, 26], a: 0.6, dir: 1, band: [0.3, 0.98] },
      { n: Math.round(14 * k * mul), s: [240, 480], v: [22, 42], a: 0.8, dir: -1, band: [0.42, 1.0] },
    ]) {
      for (let i = 0; i < layer.n; i++) {
        S.puffs.push({
          x: Math.random() * (W + 400) - 200,
          y: H * (layer.band[0] + Math.random() * (layer.band[1] - layer.band[0])),
          s: layer.s[0] + Math.random() * (layer.s[1] - layer.s[0]),
          vx: layer.dir * (layer.v[0] + Math.random() * (layer.v[1] - layer.v[0])),
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.13,
          a: layer.a * (0.6 + Math.random() * 0.4),
          spi: (Math.random() * sprites.length) | 0,
          wob: Math.random() * Math.PI * 2,
        });
      }
    }
    S.motes = Array.from({ length: Math.min(110, Math.round(W / 13)) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.5 + Math.random() * 1.2,
      vy: -(8 + Math.random() * 18),
      sway: 6 + Math.random() * 14,
      ph: Math.random() * Math.PI * 2,
      tw: 0.5 + Math.random() * 1.6,
    }));
  };

  const draw = (dt, now) => {
    const { W, H } = S;
    g.clearRect(0, 0, W, H);
    g.save();
    g.globalCompositeOperation = room.comp;
    for (const p of S.puffs) {
      if (!reduced) {
        p.x += p.vx * dt;
        p.rot += p.vr * dt;
        p.wob += dt * 0.55;
        if (p.x < -p.s) p.x = W + p.s * 0.6;
        else if (p.x > W + p.s) p.x = -p.s * 0.6;
      }
      const y = p.y + Math.sin(p.wob) * 20;
      g.save();
      g.translate(p.x, y);
      g.rotate(p.rot);
      g.globalAlpha = p.a * room.neutralA;
      g.drawImage(sprites[p.spi], -p.s / 2, -p.s / 2, p.s, p.s);
      g.restore();
    }
    for (const m of S.motes) {
      if (!reduced) {
        m.y += m.vy * dt;
        m.ph += dt * 0.9;
        if (m.y < -4) {
          m.y = H + 4;
          m.x = Math.random() * W;
        }
      }
      const x = m.x + Math.sin(m.ph) * m.sway;
      const tw = 0.65 + 0.35 * Math.sin(now * 0.001 * m.tw + m.ph * 3);
      const a = room.moteA * tw;
      if (a < 0.015) continue;
      g.globalAlpha = a;
      g.fillStyle = `rgb(${room.mote[0]},${room.mote[1]},${room.mote[2]})`;
      g.beginPath();
      g.arc(x, m.y, m.r, 0, 7);
      g.fill();
    }
    g.restore();
  };

  size();
  seed();
  addEventListener("resize", () => {
    size();
    seed();
    if (reduced) draw(0, performance.now());
  });

  if (reduced) {
    draw(0, performance.now());
    return;
  }
  let last = performance.now();
  let pending = 0; // seconds of motion owed since the last paint
  const tick = (now) => {
    // 30fps budget: accumulate elapsed time, paint only when a frame is due,
    // and advance the motion by the real elapsed time at that moment.
    pending += (now - last) / 1000;
    last = now;
    if (pending * 1000 >= FRAME_MS) {
      draw(Math.min(0.1, pending), now);
      pending = 0;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

start();
