// =============================================
// INTERACTIVE PIXEL BACKGROUND
// Spaceship shooting monsters + Mario + Stars
// =============================================

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// --- STARS ---
const stars = [];
for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.3 + 0.1,
    alpha: Math.random() * 0.7 + 0.3
  });
}

// --- PIXEL DRAWING HELPERS ---
function pixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

// --- SPACESHIP ---
const ship = {
  x: 80, y: 0,
  vy: 0.8,
  w: 32, h: 20,
  bullets: [],
  shootTimer: 0,
  shootInterval: 55
};

function drawShip(x, y) {
  // Body
  pixelRect(x+8,  y+4,  16, 8,  '#7ee8fa');
  pixelRect(x+12, y,    8,  4,  '#a8d8f0');
  // Wings
  pixelRect(x,    y+8,  8,  6,  '#5bb8e8');
  pixelRect(x+24, y+8,  8,  6,  '#5bb8e8');
  // Cockpit
  pixelRect(x+14, y+2,  4,  4,  '#ffe066');
  // Engine glow
  pixelRect(x+12, y+12, 4,  4,  '#ff6b6b');
  pixelRect(x+16, y+12, 4,  4,  '#ff6b6b');
  // Thruster flicker
  if (Math.floor(Date.now()/120) % 2 === 0) {
    pixelRect(x+13, y+16, 6, 4, '#ffaa00');
  }
}

// --- MONSTERS (pixel aliens) ---
const monsters = [];
const MONSTER_COLORS = ['#ff6b6b','#ff9f43','#a29bfe','#fd79a8','#55efc4'];

function spawnMonster() {
  const color = MONSTER_COLORS[Math.floor(Math.random() * MONSTER_COLORS.length)];
  monsters.push({
    x: canvas.width + 20,
    y: Math.random() * (canvas.height - 60) + 20,
    vx: -(Math.random() * 1.2 + 0.5),
    w: 24, h: 20,
    color: color,
    frame: 0,
    frameTimer: 0,
    hp: 1
  });
}

function drawMonster(m) {
  const f = m.frame;
  const c = m.color;
  const x = m.x, y = m.y;
  // Body
  pixelRect(x+4,  y+4,  16, 12, c);
  // Eyes
  pixelRect(x+6,  y+6,  4,  4,  '#fff');
  pixelRect(x+14, y+6,  4,  4,  '#fff');
  pixelRect(x+7,  y+7,  2,  2,  '#222');
  pixelRect(x+15, y+7,  2,  2,  '#222');
  // Mouth
  pixelRect(x+8,  y+12, 8,  2,  '#222');
  // Antennae
  pixelRect(x+8,  y,    2,  4,  c);
  pixelRect(x+14, y,    2,  4,  c);
  pixelRect(x+6,  y-2,  4,  2,  c);
  pixelRect(x+14, y-2,  4,  2,  c);
  // Legs (animated)
  if (f === 0) {
    pixelRect(x+6,  y+16, 4, 4, c);
    pixelRect(x+14, y+16, 4, 4, c);
  } else {
    pixelRect(x+4,  y+16, 4, 4, c);
    pixelRect(x+16, y+16, 4, 4, c);
  }
}

// --- MARIO (pixel) ---
const mario = {
  x: -40,
  y: 0,
  vx: 1.8,
  vy: 0,
  onGround: false,
  jumpTimer: 0,
  frame: 0,
  frameTimer: 0,
  w: 16, h: 24,
  groundY: 0
};

function initMario() {
  mario.x = -40;
  mario.groundY = canvas.height * 0.75 + Math.random() * (canvas.height * 0.15);
  mario.y = mario.groundY - mario.h;
  mario.vx = 1.5 + Math.random() * 0.8;
}
initMario();

function drawMario(x, y, frame) {
  // Hat
  pixelRect(x+2,  y,    12, 4,  '#e74c3c');
  pixelRect(x,    y+4,  16, 4,  '#f39c12');
  // Face
  pixelRect(x+2,  y+8,  12, 8,  '#f39c12');
  // Eyes
  pixelRect(x+4,  y+10, 2,  2,  '#222');
  pixelRect(x+10, y+10, 2,  2,  '#222');
  // Mustache
  pixelRect(x+2,  y+14, 12, 2,  '#5d4037');
  // Body (overalls)
  pixelRect(x+2,  y+16, 12, 6,  '#3498db');
  pixelRect(x,    y+18, 4,  4,  '#3498db');
  pixelRect(x+12, y+18, 4,  4,  '#3498db');
  // Legs
  if (frame === 0) {
    pixelRect(x+2,  y+22, 5,  4,  '#e74c3c');
    pixelRect(x+9,  y+22, 5,  4,  '#e74c3c');
  } else {
    pixelRect(x,    y+22, 5,  4,  '#e74c3c');
    pixelRect(x+11, y+22, 5,  4,  '#e74c3c');
  }
}

// --- COINS ---
const coins = [];
function spawnCoin() {
  coins.push({
    x: Math.random() * canvas.width,
    y: Math.random() * (canvas.height * 0.6) + 60,
    r: 6,
    vy: -0.5,
    alpha: 1,
    life: 180
  });
}

function drawCoin(c) {
  ctx.save();
  ctx.globalAlpha = c.alpha;
  ctx.fillStyle = '#ffe066';
  ctx.fillRect(c.x - 4, c.y - 6, 8, 12);
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(c.x - 2, c.y - 8, 4, 2);
  ctx.fillRect(c.x - 2, c.y + 6, 4, 2);
  ctx.restore();
}

// --- EXPLOSIONS ---
const explosions = [];
function spawnExplosion(x, y, color) {
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    explosions.push({
      x, y,
      vx: Math.cos(angle) * (Math.random() * 3 + 1),
      vy: Math.sin(angle) * (Math.random() * 3 + 1),
      life: 30,
      maxLife: 30,
      color: color,
      size: Math.random() * 4 + 2
    });
  }
}

// --- CLOUDS (pixel) ---
const clouds = [];
for (let i = 0; i < 5; i++) {
  clouds.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * (window.innerHeight * 0.4) + 60,
    vx: -(Math.random() * 0.3 + 0.1),
    w: Math.random() * 60 + 40
  });
}

function drawCloud(c) {
  ctx.fillStyle = 'rgba(168,216,240,0.12)';
  ctx.fillRect(c.x, c.y, c.w, 16);
  ctx.fillRect(c.x + 8, c.y - 8, c.w - 16, 12);
  ctx.fillRect(c.x + 16, c.y - 16, c.w - 32, 10);
}

// --- TIMERS ---
let monsterTimer = 0;
let coinTimer = 0;

// --- MAIN LOOP ---
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#050d1a');
  grad.addColorStop(0.5, '#0a1628');
  grad.addColorStop(1, '#0d2040');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
    ctx.save();
    ctx.globalAlpha = s.alpha * (0.5 + 0.5 * Math.sin(Date.now() * 0.002 + s.x));
    ctx.fillStyle = '#a8d8f0';
    ctx.fillRect(s.x, s.y, s.r * 2, s.r * 2);
    ctx.restore();
  });

  // Clouds
  clouds.forEach(c => {
    c.x += c.vx;
    if (c.x + c.w < 0) c.x = canvas.width + 10;
    drawCloud(c);
  });

  // --- SHIP ---
  ship.y += ship.vy;
  if (ship.y > canvas.height - ship.h - 10) ship.vy = -Math.abs(ship.vy);
  if (ship.y < 60) ship.vy = Math.abs(ship.vy);

  ship.shootTimer++;
  if (ship.shootTimer >= ship.shootInterval) {
    ship.shootTimer = 0;
    ship.bullets.push({ x: ship.x + ship.w, y: ship.y + ship.h / 2 - 2, vx: 6, w: 10, h: 4 });
  }

  // Bullets
  ship.bullets = ship.bullets.filter(b => b.x < canvas.width + 20);
  ship.bullets.forEach(b => {
    b.x += b.vx;
    // Draw bullet
    ctx.fillStyle = '#ffe066';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(b.x + b.w - 3, b.y + 1, 3, 2);
    // Bullet trail
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#7ee8fa';
    ctx.fillRect(b.x - 8, b.y + 1, 8, 2);
    ctx.restore();
  });

  drawShip(ship.x, ship.y);

  // --- MONSTERS ---
  monsterTimer++;
  if (monsterTimer > 120) { monsterTimer = 0; spawnMonster(); }

  monsters.forEach((m, mi) => {
    m.x += m.vx;
    m.frameTimer++;
    if (m.frameTimer > 20) { m.frameTimer = 0; m.frame = 1 - m.frame; }

    // Bullet collision
    ship.bullets.forEach((b, bi) => {
      if (b.x + b.w > m.x && b.x < m.x + m.w && b.y + b.h > m.y && b.y < m.y + m.h) {
        spawnExplosion(m.x + m.w/2, m.y + m.h/2, m.color);
        m.hp = 0;
        ship.bullets.splice(bi, 1);
      }
    });

    if (m.hp > 0) drawMonster(m);
  });
  // Remove dead/off-screen monsters
  for (let i = monsters.length - 1; i >= 0; i--) {
    if (monsters[i].hp <= 0 || monsters[i].x < -40) monsters.splice(i, 1);
  }

  // --- MARIO ---
  mario.x += mario.vx;
  mario.vy += 0.25; // gravity
  mario.y += mario.vy;

  if (mario.y >= mario.groundY - mario.h) {
    mario.y = mario.groundY - mario.h;
    mario.vy = 0;
    mario.onGround = true;
  }

  mario.jumpTimer++;
  if (mario.onGround && mario.jumpTimer > 80 + Math.random() * 60) {
    mario.vy = -(6 + Math.random() * 3);
    mario.onGround = false;
    mario.jumpTimer = 0;
  }

  mario.frameTimer++;
  if (mario.frameTimer > 12) { mario.frameTimer = 0; mario.frame = 1 - mario.frame; }

  if (mario.x > canvas.width + 40) initMario();

  drawMario(mario.x, mario.y, mario.frame);

  // --- COINS ---
  coinTimer++;
  if (coinTimer > 200) { coinTimer = 0; spawnCoin(); }
  for (let i = coins.length - 1; i >= 0; i--) {
    const c = coins[i];
    c.y += c.vy;
    c.life--;
    c.alpha = c.life / c.maxLife;
    if (c.life <= 0) { coins.splice(i, 1); continue; }
    drawCoin(c);
  }

  // --- EXPLOSIONS ---
  for (let i = explosions.length - 1; i >= 0; i--) {
    const e = explosions[i];
    e.x += e.vx;
    e.y += e.vy;
    e.life--;
    if (e.life <= 0) { explosions.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = e.life / e.maxLife;
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.size, e.size);
    ctx.restore();
  }

  requestAnimationFrame(loop);
}

loop();
