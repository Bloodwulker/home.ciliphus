(() => {
  const root = document.querySelector(".launchers");
  if (!root) return;
  const badges = [...root.querySelectorAll(":scope > .badge")];
  let idle, roam;

  function wander() {
    badges.forEach(b => {
      b.style.left = (12 + Math.random() * 76) + "%";
      b.style.top = (18 + Math.random() * 64) + "%";
    });
  }
  function start() {
    root.classList.add("roaming");
    wander();
    roam = setInterval(wander, 4000);
  }
  function stop() {
    clearTimeout(idle);
    clearInterval(roam);
    root.classList.remove("roaming");
    badges.forEach(b => { b.style.left = ""; b.style.top = ""; });
    idle = setTimeout(start, 60000);
  }
  addEventListener("pointermove", stop);
  addEventListener("keydown", stop);
  idle = setTimeout(start, 60000);
})();
