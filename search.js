(() => {
  /* colors and svg namespace used by the star bursts */
  const ns = "http://www.w3.org/2000/svg";
  const COLORS = ["#c41230", "#ffffff", "#0a3161", "#fff4c2"];
  let idleBox;

  /* spawn a small burst of stars at a point (used when a search opens) */
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

  /* open a search box: clear others, fly the icon in, focus the input, start the 10s timer */
  function openBox(which) {
    document.querySelectorAll(".gsearch").forEach(b => {
      b.classList.remove("show", "gone");
      b.hidden = true;
      b.querySelector("input").value = "";
    });
    const box = document.querySelector(which);
    const input = box.querySelector("input");
    burst();
    document.body.classList.add("searching");
    box.hidden = false;
    box.classList.remove("show", "gone");
    void box.offsetWidth;
    box.classList.add("show");
    setTimeout(() => input.focus(), 50);
    clearTimeout(idleBox);
    idleBox = setTimeout(close, 10000);
  }

  /* explode the open search icon into stars, then hide the box and restore the page */
  function explode(open) {
    const r = open.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + 120;
    const group = document.querySelector(".sparklers");
    if (group) {
      for (let i = 0; i < 70; i++) {
        const use = document.createElementNS(ns, "use");
        use.setAttribute("href", "#sparkler-star");
        use.setAttribute("fill", COLORS[(Math.random() * COLORS.length) | 0]);
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 7;
        let x = cx, y = cy, life = 1;
        group.appendChild(use);
        const tick = () => {
          x += Math.cos(ang) * spd;
          y += Math.sin(ang) * spd;
          life -= 0.012;
          if (life <= 0) { use.remove(); return; }
          use.setAttribute("transform", `translate(${x} ${y}) scale(${life * 4})`);
          use.setAttribute("opacity", life);
          requestAnimationFrame(tick);
        };
        tick();
      }
    }
    open.querySelector("input").style.opacity = "0";
    setTimeout(() => open.classList.add("gone"), 80);
    setTimeout(() => {
      open.hidden = true;
      open.classList.remove("show", "gone");
      open.querySelector("input").style.opacity = "";
      document.body.classList.remove("searching");
    }, 900);
  }

  /* close whatever search is open: clear text, explode, hide */
  function close() {
    clearTimeout(idleBox);
    const open = document.querySelector(".gsearch.show");
    if (!open) return;
    document.querySelectorAll(".gsearch input").forEach(inp => { inp.blur(); inp.value = ""; });
    explode(open);
  }

  /* keyboard: G/Y/K open a search, Escape closes */
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

  /* Enter submits the form (opens results) then closes the box */
  document.querySelectorAll(".gsearch form").forEach(f => {
    f.addEventListener("submit", () => setTimeout(close, 100));
  });

  /* typing resets the 10-second idle timer */
  document.querySelectorAll(".gsearch input").forEach(inp => {
    inp.addEventListener("input", () => {
      clearTimeout(idleBox);
      idleBox = setTimeout(close, 10000);
    });
  });
})();
