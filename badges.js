document.querySelectorAll("[data-face]").forEach(el => {
  el.style.setProperty("--face", `url('${BLOB}${el.dataset.face}')`);
});

let fanTimer;
window.ciliphusHold = false;

function closeAll() {
  document.querySelectorAll(".fan.open").forEach(f => f.classList.remove("open"));
  document.querySelectorAll(".badge.lit").forEach(b => b.classList.remove("lit"));
  document.querySelectorAll(".sub.scheduled").forEach(s => s.classList.remove("scheduled"));
}

const SCHEDULE = [
  { fan: "dailywire", name: "Knowles", start: [9, 0],  end: [9, 30] },
  { fan: "rumble",    name: "Crowder", start: [10, 30], end: [11, 0] },
  { fan: "dailywire", name: "Matt",    start: [14, 30], end: [15, 0] }
];

function inWindow(now, s) {
  const m = now.getHours() * 60 + now.getMinutes();
  const a = s.start[0] * 60 + s.start[1];
  const b = s.end[0] * 60 + s.end[1];
  return m >= a && m < b;
}

function applySchedule() {
  const hit = SCHEDULE.find(s => inWindow(new Date(), s));
  window.ciliphusHold = !!hit;
  if (!hit) {
    document.querySelectorAll(".sub.scheduled").forEach(s => s.classList.remove("scheduled"));
    return;
  }
  const fan = document.getElementById(hit.fan);
  const btn = document.querySelector(`.badge[data-fan="${hit.fan}"]`);
  if (!fan || !btn) return;
  document.querySelectorAll(".fan.open").forEach(f => { if (f !== fan) f.classList.remove("open"); });
  document.querySelectorAll(".badge.lit").forEach(b => { if (b !== btn) b.classList.remove("lit"); });
  fan.classList.add("open");
  btn.classList.add("lit");
  fan.querySelectorAll(".sub").forEach(s => {
    s.classList.toggle("scheduled", s.dataset.name === hit.name);
  });
}

document.querySelectorAll(".badge[data-fan]").forEach(btn => {
  btn.addEventListener("click", () => {
    if (window.ciliphusHold) return;
    const fan = document.getElementById(btn.dataset.fan);
    const wasOpen = fan.classList.contains("open");
    closeAll();
    clearTimeout(fanTimer);
    if (!wasOpen) {
      fan.classList.add("open");
      btn.classList.add("lit");
      fanTimer = setTimeout(closeAll, 5000);
    }
  });
});
document.addEventListener("click", (e) => {
  if (window.ciliphusHold) return;
  if (!e.target.closest(".launchers")) {
    clearTimeout(fanTimer);
    closeAll();
  }
});

applySchedule();
setInterval(applySchedule, 15000);
