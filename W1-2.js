document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container") || document.body;

  const elements = Array.from(
    document.querySelectorAll(".icon-sculptures, .icon-paintings, .icon-about")
  );

  if (elements.length === 0) {
    console.warn("no element to move. recheck name");
    return;
  }

  //물리 상태 저장
  const bodies = elements.map((el) => ({
    el,
    x: 0,
    y: 0,
    vx: rand(-90, 90), //px/sec
    vy: rand(-90, 90),
    w: 0,
    h: 0,
  }));

  //초기 위치 상태 겹치지 않게 배치
  refreshSizes();
  placeWithoutOverlap();

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.033);
    last = now;

    //컨테이너 크기 최신화
    const cw = container.clientWidth;
    const ch = container.clientHeight;

    //1 move
    for (const b of bodies) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      //wall boink
      if (b.x <= 0) {
        b.x = 0;
        b.vx *= -1;
      } else if (b.x + b.w >= cw) {
        b.x = cw - b.w;
        b.vx *= -1;
      }

      if (b.y <= 0) {
        b.y = 0;
        b.vy *= -1;
      } else if (b.y + b.h >= ch) {
        b.y = ch - b.h;
        b.vy *= -1;
      }
    }

    //they boink
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        resolveCollision(bodies[i], bodies[j]);
      }
    }

    //apply on screen
    for (const b of bodies) {
      b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    }

    requestAnimationFrame(tick);
  }

  //resize calculation
  window.addEventListener("resize", () => {
    refreshSizes();
    const cw = container.clienthWidth;
    const ch = container.clientHeight;
    for (const b of bodies) {
      b.x = clamp(b.x, 0, Math.max(cw - b.w, 0));
      b.y = clamp(b.y, 0, Math.max(ch - b.h, 0));
    }
    });

    requestAnimationFrame(tick);

    function refreshSizes() {
      for (const b of bodies) {
        b.w = b.el.offsetWidth;
        b.h = b.el.offsetHeight;
      }
    }

    function placeWithoutOverlap() {
      const cw = container.clientWidth;
      const ch = container.clientHeight;

      for (let k = 0; k < bodies.length; k++) {
        const b = bodies[k];
        let placed = false;

        for (let tries = 0; tries < 200; tries++) {
          b.x = rand(0, Math.max(cw - b.w, 0));
          b.y = rand(0, Math.max(ch - b.h, 0));

          let ok = true;
          for (let t = 0; t < k; t++) {
            if (aabbOverlab(b, bodies[t])) {
              ok = false;
              break;
            }
          }
          if (ok) {
            placed = true;
            break;
          }
        }
        if (!placed) {
          //공간 좁으면 그냥 배치
          b.x = rand(0, Math.max(cw - b.w, 0));
          b.y = rand(0, Math.max(ch - b.h, 0));
        }
      }
    }

    function resolveCollision(a, b) {
      if (!aabbOverlab(a, b))  return;

      //겹침 정도 계산
      const ax2 = a.x + a.w;
      const ay2 = a.y + a.h;
      const bx2 = b.x + b.w;
      const by2 = b.y + b.h;

      const overlapX = Math.min(ax2, bx2) - Math.max(a.x, b.x);
      const overlapY = Math.min(ay2, by2) - Math.max(a.y, b.y);

      if (overlapX <= 0 || overlapY <=0) return;

      //push to less overlapped part
      if (overlapX < overlapY) {
        const push = overlapX / 2;
        if (a.x < b.x) {
          a.x -= push;
          b.x += push;
        } else {
          a.x += push;
          b.x -= push;
        }
        //x축 속도 교환 (탄성)
        const tmp = a.vx;
        a.vx = b.vx;
        b.vx = tmp;
      } else {
        const push = overlapY / 2;
        if (a.y < b.y) {
          a.y -= push;
          b.y += push;
        } else {
          a.y += push;
          b.y -= push;
        }
        const tmp = a.vy;
        a.vy = b.vy;
        b.vy = tmp;
        }
      }

    function aabbOverlab(a, b) {
      return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      );
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function clamp(v, lo, hi) {
      return Math.max(lo, Math.min(hi, v))
    }
});


const audio = document.getElementById("bgm");
const btn = document.getElementById("music-btn");

btn.addEventListener("click", async () => {
  try {
    if (audio.paused) {
      await audio.play();
      btn.textContent = "Pause";
      localStorage.setItem("bgm_on", "1");
    } else {
      audio.pause();
      btn.textContent = "Play";
      localStorage.setItem("bgm_on", "0");
    }
    } catch (e) {
      console.log("재생 막힘:", e);
    }
  });

  if (localStorage.getItem("bgm_on") === "1") {
    btn.textContent = "Pause music";
  }