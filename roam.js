(() => {
  const root = document.querySelector(".launchers");
  if (!root) return;
  const logo = document.querySelector(".logo");
  const badges = [...root.querySelectorAll(":scope > .badge")].map(el => ({
    el,
    x: 50, y: 50,
    vx: (Math.random() * 0.06 + 0.08) * (Math.random() < 0.5 ? -1 : 1),
    vy: (Math.random() * 0.05 + 0.06) * (Math.random() < 0.5 ? -1 : 1)
  }));
  const hosts = [...document.querySelectorAll(".fan .sub")].map(el => ({
    el,
    x: 50, y: 50,
    vx: (Math.random() * 0.06 + 0.08) * (Math.random() < 0.5 ? -1 : 1),
    vy: (Math.random() * 0.05 + 0.06) * (Math.random() < 0.5 ? -1 : 1)
  }));
  const ns = "http://www.w3.org/2000/svg";
  const COLORS = ["#c41230", "#ffffff", "#0a3161", "#fff4c2"];
  const bits = [];
  let idle, raf, pre, roaming = false;

  function spark(px, py, kick = 1) {
    const group = document.querySelector(".sparklers");
    if (!group) return;
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#sparkler-star");
    use.setAttribute("class", "star");
    use.setAttribute("fill", COLORS[(Math.random() * COLORS.length) | 0]);
    const ang = Math.random() * Math.PI * 2;
    const spd = (0.6 + Math.random() * 1.8) * kick;
    bits.push({
      el: use, x: px, y: py,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 0.4,
      life: 1,
      rot: Math.random() * 360,
      spin: (Math.random() - 0.5) * 18,
      scale: (1.6 + Math.random() * 2.4) * Math.min(kick, 2)
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
    hosts.forEach(h => {
      h.x += h.vx; h.y += h.vy;
      if (h.x < 6 || h.x > 94) h.vx *= -1;
      if (h.y < 10 || h.y > 90) h.vy *= -1;
      h.el.style.left = h.x + "%";
      h.el.style.top = h.y + "%";
      h.el.style.transform = "translate(-50%, -50%)";
      if (Math.random() < 0.25) {
        const r = h.el.getBoundingClientRect();
        const len = Math.hypot(h.vx, h.vy) || 1;
        spark(r.left + r.width / 2 - (h.vx / len) * 30, r.top + r.height / 2 - (h.vy / len) * 30, 0.6);
      }
    });
    sparks();
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (window.ciliphusHold) { idle = setTimeout(start, 60000); return; }
    document.querySelectorAll(".fan.open").forEach(f => f.classList.remove("open"));
    document.querySelectorAll(".badge.lit").forEach(b => b.classList.remove("lit"));
    badges.forEach(b => b.el.classList.add("preroam"));
    if (logo) logo.classList.add("preroam");
    pre = setTimeout(() => {
      badges.forEach(b => {
        b.el.classList.remove("preroam");
        b.el.style.transition = "none";
        b.x = parseFloat(getComputedStyle(b.el).left) / innerWidth * 100;
        b.y = parseFloat(getComputedStyle(b.el).top) / innerHeight * 100;
      });
      document.querySelectorAll(".fan").forEach(f => f.classList.add("open"));
      hosts.forEach(h => {
        const r = h.el.getBoundingClientRect();
        h.x = (r.left + r.width / 2) / innerWidth * 100;
        h.y = (r.top + r.height / 2) / innerHeight * 100;
        h.el.style.transition = "none";
        h.el.style.position = "fixed";
        h.el.style.opacity = "1";
        h.el.style.pointerEvents = "none";
      });
      if (logo) {
        logo.classList.remove("preroam");
        const r = logo.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        for (let i = 0; i < 70; i++) spark(cx, cy, 6);
        logo.classList.add("boom");
        setTimeout(() => { logo.style.visibility = "hidden"; }, 500);
      }
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
      hosts.forEach(h => {
        h.el.style.transition = "";
        h.el.style.position = "";
        h.el.style.left = "";
        h.el.style.top = "";
        h.el.style.transform = "";
        h.el.style.opacity = "";
        h.el.style.pointerEvents = "";
      });
      document.querySelectorAll(".fan.open").forEach(f => f.classList.remove("open"));
      bits.forEach(b => b.el.remove());
      bits.length = 0;
    }
    badges.forEach(b => b.el.classList.remove("preroam"));
    if (logo) {
      logo.classList.remove("preroam", "boom");
      logo.style.visibility = "";
    }
    idle = setTimeout(start, 60000);
  }
  addEventListener("pointermove", stop);
  addEventListener("keydown", stop);
  idle = setTimeout(start, 60000);
  window.ciliphusStop = stop;
})();
