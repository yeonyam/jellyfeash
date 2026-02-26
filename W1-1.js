document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(
    ".icon-sculptures, .icon-paintings, .icon-about"
  );
  targets.forEach((el => {
    moveRandom(el);
    setInterval(() => moveRandom(el), 1400);
  }));
});

function moveRandom(el) {
  const container = document.querySelector(".container") || document.body;
  
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  const ew = el.offsetWidth;
  const eh = el.offsetHeight;

  const maxX = Math.max(cw - ew, 0);
  const maxY = Math.max(ch - eh, 0);

  const x = Math.floor(Math.random() *maxX);
  const y = Math.floor(Math.random() * maxY);

  el.style.transform = `translate(${x}px, ${y}px)`;
}