(() => {
  const root = document.querySelector(".launchers");
  if (!root) return;
  const badges = [...root.querySelectorAll(":scope > .badge")].map(el => ({
    el,
    x: 50, y: 50,
    vx: (Math.random() * 0.04 + 0.015) * (Math.random() < 0.5 ? -1 : 1),
    vy: (Math.random() * 0.03 + 0.01) * (Math.random() < 0.5 ? -1 : 1)
  }));
  let idle, raf, roaming = false;

  function frame() {
    badges.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < 8 || b.x > 92) b.vx *= -1;
      if (b.y < 12 || b.y > 88) b.vy *= -1;
      b.el.style.left = b.x + "%";
      b.el.style.top = b.y + "%";
    });
    raf = requestAnimationFrame(frame);
  }
  function start() {
    roaming = true;
    root.classList.add("roaming");
    badges.forEach(b => {
      b.x = parseFloat(getComputedStyle(b.el).left) / innerWidth * 100;
      b.y = parseFloat(getComputedStyle(b.el).top) / innerHeight * 100;
    });
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    clearTimeout(idle);
    if (roaming) {
      cancelAnimationFrame(raf);
      roaming = false;
      root.classList.remove("roaming");
      badges.forEach(b => { b.el.style.left = ""; b.el.style.top = ""; });
    }
    idle = setTimeout(start, 5000);
  }
  addEventListener("pointermove", stop);
  addEventListener("keydown", stop);
  idle = setTimeout(start, 5000);
})();
