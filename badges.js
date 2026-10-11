let fanTimer;
function closeAll() {
  document.querySelectorAll(".fan.open").forEach(f => f.classList.remove("open"));
  document.querySelectorAll(".badge.lit").forEach(b => b.classList.remove("lit"));
}
document.querySelectorAll(".badge[data-fan]").forEach(btn => {
  btn.addEventListener("click", () => {
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
  if (!e.target.closest(".launchers")) {
    clearTimeout(fanTimer);
    closeAll();
  }
});
