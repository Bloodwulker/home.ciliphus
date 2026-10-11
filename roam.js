(() => {
  const root = document.querySelector(".launchers");
  if (!root) return;
  const badges = [...root.querySelectorAll(":scope > .badge")].map(el => ({
    el,
    x: 50, y: 50,
    vx: (Math.random() * 0.06 + 0.08) * (Math.random() < 0.5 ? -1 : 1),
    vy: (Math.random() * 0.05 + 0.06) * (Math.random() < 0.5 ? -1 : 1)
  }));
  const ns = "http://www.w3.org/2000/svg";
  const COLORS = ["#c41230", "#ffffff", "#0a3161", "#fff4c2"];
  const bits = [];
  let idle, raf, pre, roaming = false;

  function spark(px, py) {
    const group = document.querySelector(".sparklers");
    if (!group) return;
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#sparkler-star");
    use.setAttribute("class", "star");
    use.setAttribute("fill", COLORS[(Math.random() * COLORS.length) | 0]);
    const ang = Math.random() * Math.PI * 2;
    const spd = 0.6 + Math.random() * 1.8;
    bits.push({
      el: use, x: px, y: py,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 0.4,
      life: 1,
      rot: Math.random() * 360,
      spin: (Math.random() - 0.5) * 18,
      scale: 1.6 + Math.random() * 2.4
    });
    group.appendChild(use);
  }
  function sparks() {
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.x += b.vx; b.y += b.vy;
      b.vy += 0.04; b.vx *= 0.995;
      b.life -= 0.012; b.rot += b.spin;
      if (b.life <= 0) { b.el.remove(); bits.splice(i, 1); continue; }
      b.el.setAttribute("transform", `translate(${b.x} ${b.y}) rotate(${b.rot}) scale(${b.scale * b.life})`);
      b.el.setAttribute("opacity", b.life);
    }
  }
  function frame() {
    badges.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      if (b.x < 8 || b.x > 92) b.vx *= -1;
      if (b.y < 12 || b.y > 88) b.vy *= -1;
      b.el.style.left = b.x + "%";
      b.el.style.top = b.y + "%";
      if (Math.random() < 0.35) {
  const r = b.el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const len = Math.hypot(b.vx, b.vy) || 1;
  spark(cx - (b.vx / len) * 46, cy - (b.vy / len) * 46);
}
    });
    sparks();
    raf = requestAnimationFrame(frame);
  }
function start() {
  if (window.ciliphusHold) { idle = setTimeout(start, 10000); return; }
  document.querySelectorAll(".fan.open").forEach(f => f.classList.remove("open"));
  document.querySelectorAll(".badge.lit").forEach(b => b.classList.remove("lit"));
  badges.forEach(b => b.el.classList.add("preroam"));
  pre = setTimeout(() => {
    badges.forEach(b => {
      b.el.classList.remove("preroam");
      b.el.style.transition = "none";
      b.x = parseFloat(getComputedStyle(b.el).left) / innerWidth * 100;
      b.y = parseFloat(getComputedStyle(b.el).top) / innerHeight * 100;
    });
    roaming = true;
    root.classList.add("roaming");
    raf = requestAnimationFrame(frame);
  }, 3000);
}
  function stop() {
  clearTimeout(idle);
  clearTimeout(pre);
  if (roaming) {
    cancelAnimationFrame(raf);
    roaming = false;
    root.classList.remove("roaming");
    badges.forEach(b => {
      b.el.style.transition = "";
      b.el.style.left = "";
      b.el.style.top = "";
    });
    bits.forEach(b => b.el.remove());
    bits.length = 0;
  }
  badges.forEach(b => b.el.classList.remove("preroam"));
  idle = setTimeout(start, 60000);
}
  addEventListener("pointermove", stop);
  addEventListener("keydown", stop);
  idle = setTimeout(start, 60000);
})();
