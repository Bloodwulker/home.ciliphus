(() => {
  const ns = "http://www.w3.org/2000/svg";
  const COLORS = ["#c41230", "#ffffff", "#0a3161", "#fff4c2"];
  let idleBox;

  function burst() {
    const group = document.querySelector(".sparklers");
    if (!group) return;
    document.querySelectorAll(".launchers > .badge, .logo").forEach(el => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      for (let i = 0; i < 10; i++) {
        const use = document.createElementNS(ns, "use");
        use.setAttribute("href", "#sparkler-star");
        use.setAttribute("fill", COLORS[(Math.random() * COLORS.length) | 0]);
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        let x = cx, y = cy, life = 1;
        group.appendChild(use);
        const tick = () => {
          x += Math.cos(ang) * spd;
          y += Math.sin(ang) * spd;
          life -= 0.02;
          if (life <= 0) { use.remove(); return; }
          use.setAttribute("transform", `translate(${x} ${y}) scale(${life * 2})`);
          use.setAttribute("opacity", life);
          requestAnimationFrame(tick);
        };
        tick();
      }
    });
  }
  function openBox(which) {
    document.querySelectorAll(".gsearch").forEach(b => {
      b.classList.remove("show");
      b.hidden = true;
    });
    const box = document.querySelector(which);
    const input = box.querySelector("input");
    burst();
    document.body.classList.add("searching");
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("show"));
    setTimeout(() => input.focus(), 50);
    clearTimeout(idleBox);
    idleBox = setTimeout(close, 10000);
  }
  function close() {
  clearTimeout(idleBox);
    const open = document.querySelector(".gsearch.show");
if (open) {
  const r = open.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + 120;
  const group = document.querySelector(".sparklers");
  if (group) {
    for (let i = 0; i < 60; i++) {
      const use = document.createElementNS(ns, "use");
      use.setAttribute("href", "#sparkler-star");
      use.setAttribute("fill", COLORS[(Math.random() * COLORS.length) | 0]);
      const ang = Math.random() * Math.PI * 2;
      const spd = 3 + Math.random() * 8;
      let x = cx, y = cy, life = 1;
      group.appendChild(use);
      const tick = () => {
        x += Math.cos(ang) * spd;
        y += Math.sin(ang) * spd;
        life -= 0.018;
        if (life <= 0) { use.remove(); return; }
        use.setAttribute("transform", `translate(${x} ${y}) scale(${life * 2.5})`);
        use.setAttribute("opacity", life);
        requestAnimationFrame(tick);
      };
      tick();
    }
  }
  open.classList.add("boom");
}
  document.querySelectorAll(".gsearch input").forEach(inp => inp.value = "");
  document.querySelectorAll(".gsearch").forEach(b => b.classList.remove("show"));
  document.body.classList.remove("searching");
  setTimeout(() => {
    document.querySelectorAll(".gsearch").forEach(b => b.hidden = true);
  }, 350);
}
  addEventListener("keydown", (e) => {
    const typing = document.activeElement.tagName === "INPUT";
    if (typing) {
      if (e.key === "Escape") close();
      return;
    }
    if (e.key === "g" && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openBox(".google"); }
    if (e.key === "y" && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openBox(".youtube"); }
    if (e.key === "k" && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openBox(".grok"); }
    if (e.key === "Escape") close();
  });
  document.querySelectorAll(".gsearch form").forEach(f => {
    f.addEventListener("submit", () => setTimeout(close, 100));
  });
  document.querySelectorAll(".gsearch input").forEach(inp => {
    inp.addEventListener("input", () => {
      clearTimeout(idleBox);
      idleBox = setTimeout(close, 10000);
    });
  });
})();
