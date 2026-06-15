// Generative signature: a space-colonization tree (the organic look Ashton
// liked). The trunk is rooted at the very bottom of the page and procedurally
// branches upward across the full scroll, into the hero. A spatial grid keeps
// the nearest-node search cheap so it can climb fast. Honors reduced-motion.
//
// Served as a static file from /public so it loads as an external, same-origin
// script (satisfies the site's strict `script-src 'self'` CSP).

const canvas = document.getElementById('hero-canvas');
const ctx = canvas && canvas.getContext('2d');
const host = canvas && canvas.parentElement; // <main>

if (canvas && ctx && host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX_DIST = 150;  // attractor influence radius
  const KILL = 16;       // remove an attractor once a branch reaches it
  const SEG = 8;         // branch growth step
  const CELL = 150;      // spatial-grid cell size (== MAX_DIST)

  let W = 0, H = 0, raf = 0, maxNodes = 4000, warmY = 0;
  let nodes = [];
  let attractors = [];
  let grid = new Map();

  const keyOf = (x, y) => Math.floor(x / CELL) + ',' + Math.floor(y / CELL);

  function addNode(n) {
    const i = nodes.push(n) - 1;
    const k = keyOf(n.x, n.y);
    const bucket = grid.get(k);
    if (bucket) bucket.push(i); else grid.set(k, [i]);
  }

  // Nearest node to an attractor, searching only the 3x3 neighbouring cells.
  function nearest(ax, ay) {
    const cx = Math.floor(ax / CELL), cy = Math.floor(ay / CELL);
    let best = -1, bd = MAX_DIST;
    for (let gx = cx - 1; gx <= cx + 1; gx++) {
      for (let gy = cy - 1; gy <= cy + 1; gy++) {
        const arr = grid.get(gx + ',' + gy);
        if (!arr) continue;
        for (const i of arr) {
          const n = nodes[i];
          const d = Math.hypot(ax - n.x, ay - n.y);
          if (d < bd) { bd = d; best = i; }
        }
      }
    }
    return { best, bd };
  }

  function size() {
    const r = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.max(1, Math.floor(W * dpr));
    canvas.height = Math.max(1, Math.floor(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    nodes = [];
    grid = new Map();
    attractors = [];
    const baseX = W * 0.66;
    const vh = Math.min(H, window.innerHeight || 800);
    const canopyH = Math.min(H, vh * 0.98); // the hero region, where it blooms
    warmY = canopyH * 0.45;

    // Dense canopy cloud in the hero region (top), biased to the right.
    const canopyCount = Math.min(560, Math.max(170, Math.floor((W * canopyH) / 4600)));
    for (let i = 0; i < canopyCount; i++) {
      attractors.push({ x: W * (0.44 + 0.60 * Math.random()), y: canopyH * Math.random(), dead: false });
    }
    // Thin attractor "column" from the canopy down to the page bottom, so a
    // single trunk climbs the whole page before branching. Spacing < MAX_DIST
    // keeps the climb continuous.
    for (let y = canopyH * 0.7; y < H + 40; y += 80) {
      attractors.push({ x: baseX + (Math.random() - 0.5) * 44, y, dead: false });
    }

    maxNodes = Math.min(12000, Math.floor(H / SEG) * 4 + canopyCount * 12);
    // Single root at the very bottom of the page; the trunk grows upward.
    addNode({ x: baseX, y: H + 10, px: baseX, py: H + 40 });
  }

  function grow() {
    const pull = new Map();
    for (const a of attractors) {
      const { best, bd } = nearest(a.x, a.y);
      if (best === -1) continue;
      if (bd < KILL) { a.dead = true; continue; }
      const n = nodes[best];
      const v = pull.get(best) || { x: 0, y: 0 };
      v.x += (a.x - n.x) / bd;
      v.y += (a.y - n.y) / bd;
      pull.set(best, v);
    }

    let added = 0;
    ctx.lineWidth = 1;
    for (const [i, v] of pull) {
      const len = Math.hypot(v.x, v.y) || 1;
      const n = nodes[i];
      const nx = n.x + (v.x / len) * SEG;
      const ny = n.y + (v.y / len) * SEG;
      const warm = ny < warmY; // canopy tips in the hero pick up a warm glow
      ctx.strokeStyle = warm ? 'rgba(224,164,88,0.16)' : 'rgba(244,240,232,0.11)';
      ctx.beginPath();
      ctx.moveTo(n.px, n.py);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      addNode({ x: nx, y: ny, px: n.x, py: n.y });
      added++;
    }
    attractors = attractors.filter((a) => !a.dead);
    return added > 0 && nodes.length < maxNodes;
  }

  function animate() {
    let alive = true;
    for (let s = 0; s < 5 && alive; s++) alive = grow(); // several steps/frame = fast climb
    if (alive) raf = requestAnimationFrame(animate);
  }

  function run() {
    cancelAnimationFrame(raf);
    size();
    ctx.clearRect(0, 0, W, H);
    seed();
    if (reduce) { let g = 0; while (grow() && g < 9000) g++; }
    else animate();
  }

  let t = 0;
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    // Mobile browsers fire resize when the URL bar shows/hides on scroll,
    // changing only the height. Ignore those — re-run only on width change.
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(t);
    t = window.setTimeout(run, 200);
  });
  run();

  // Subtle cursor parallax
  if (!reduce) {
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      canvas.style.transform = `translate(${mx * 10}px, ${my * 8}px)`;
    });
    host.addEventListener('pointerleave', () => { canvas.style.transform = ''; });
  }
}
