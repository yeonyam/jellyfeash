// ── 설정 ──────────────────────────────────────────
const TARGET_COUNT  = 12;         // 새 마리 수
const BIRD_SIZE   = 200;         // px
const SPEED_MIN   = 0.5;
const SPEED_MAX   = 1.4;
const PUSH_RADIUS = 70;        // 마우스 회피 반경 (px)
const PUSH_FORCE  = 4;          // 마우스 회피 세기
const FRICTION  = 0.92;         // high friction = birds slow down and drift away naturally
const IMG_SRC     = 'image/birdpink.png'; // ← 이미지 파일명

// ── 초기화 ────────────────────────────────────────
const layer = document.getElementById('bird-layer');
let mouseX = -9999, mouseY = -9999;
const birds = [];

function rand(min, max) { return Math.random() * (max - min) + min; }

// ── 새 생성 ───────────────────────────────────────
function spawnBirdRandom() {
  const W = window.innerWidth;
  const H = window.innerHeight;
 const x = rand(BIRD_SIZE, W - BIRD_SIZE);
  const y = rand(BIRD_SIZE, H - BIRD_SIZE);
  const angle = rand(0, Math.PI * 2);

  const el = document.createElement('div');
  el.className = 'bird';
  el.style.width  = BIRD_SIZE + 'px';
  el.style.height = BIRD_SIZE + 'px';
  const img = document.createElement('img');
  img.src = IMG_SRC;
  img.alt = '';
  el.appendChild(img);
  layer.appendChild(el);


  birds.push({
    el,x, y,
    vx: Math.cos(angle) * rand(SPEED_MIN, SPEED_MAX),
    vy: Math.sin(angle) * rand(SPEED_MIN, SPEED_MAX),
    wobbleOffset: rand(0, Math.PI * 2),
    wobbleSpeed:  rand(0.015, 0.03),
    wobbleAmp:    rand(0.3, 0.8),
  });
}

// ── initial spawn ─────────────────────────────────
for (let i = 0; i < TARGET_COUNT; i++) spawnBirdRandom();

// ── 마우스 추적 ───────────────────────────────────
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouseX = -9999; mouseY = -9999;
});

// ── 애니메이션 루프 ───────────────────────────────
let t = 0;
function tick() {
  t++;
  const W = window.innerWidth;
  const H = window.innerHeight;

  for (let i = birds.length - 1; i >= 0; i--) {
    const b = birds[i];

// mouse push — instantaneous shove, no gradual falloff
    const dx = b.x - mouseX;
    const dy = b.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < PUSH_RADIUS && dist > 0) {
      // force is strongest at center, zero at edge
      const strength = (1 - dist / PUSH_RADIUS) * PUSH_FORCE;
      b.vx += (dx / dist) * strength;
      b.vy += (dy / dist) * strength;
    }

   // friction — slows birds back to natural speed after being shoved
  b.vx *= FRICTION;
  b.vy *= FRICTION;

     // minimum speed with slight drift so they never freeze
    const curSpeed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    if (curSpeed < SPEED_MIN) {
      const angle = Math.atan2(b.vy, b.vx) + (Math.random() - 0.5) * 0.4;
      b.vx = Math.cos(angle) * SPEED_MIN;
      b.vy = Math.sin(angle) * SPEED_MIN;
    }

    // wobble
    const wobble = Math.sin(t * b.wobbleSpeed + b.wobbleOffset) * b.wobbleAmp;
    b.x += b.vx;
    b.y += b.vy + wobble;

    // off screen → remove + respawn
    if (b.x < -BIRD_SIZE * 2 || b.x > W + BIRD_SIZE * 2 ||
        b.y < -BIRD_SIZE * 2 || b.y > H + BIRD_SIZE * 2) {
      b.el.remove();
      birds.splice(i, 1);
      spawnBird();
      continue;
    }

    // flip based on horizontal direction
    const scaleX = b.vx < 0 ? -1 : 1;
    b.el.style.transform = `translate(${b.x}px, ${b.y}px) scaleX(${scaleX})`;
  }

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

// show scroll block when user scrolls down
document.addEventListener('scroll', () => {
 const block1 = document.getElementById('scroll-block-1');
 const block2 = document.getElementById('scroll-block-2');
  const others = document.querySelectorAll('.text-block.t1, .text-block.t2, .text-block.t3');
  const scrollY = document.documentElement.scrollTop || window.scrollY;

  if (scrollY > 50) {
  block1.style.opacity = '1';
  block1.style.transform = 'translate(calc(-50% + 150px), -50%)';
  block2.style.opacity = '1';
  block2.style.transform = 'translate(calc(-50% - 150px), -50%)';
    others.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
    });
  } else {
    block1.style.opacity = '0';
    block1.style.transform = 'translate(calc(-50% + 150px), calc(-50% + 20px))';
    block2.style.opacity = '0';
    block2.style.transform = 'translate(calc(-50% - 150px), calc(-50% + 20px))';
    others.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
}, true);

