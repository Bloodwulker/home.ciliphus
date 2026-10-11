document.querySelectorAll(".badge[data-fan]").forEach(btn => {
  btn.addEventListener("click", () => {
    const fan = document.getElementById(btn.dataset.fan);
    document.querySelectorAll(".fan.open").forEach(f => { if (f !== fan) f.classList.remove("open"); });
    document.querySelectorAll(".badge.lit").forEach(b => { if (b !== btn) b.classList.remove("lit"); });
    fan.classList.toggle("open");
    btn.classList.toggle("lit", fan.classList.contains("open"));
  });
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".launchers")) {
    document.querySelectorAll(".fan.open").forEach(f => f.classList.remove("open"));
    document.querySelectorAll(".badge.lit").forEach(b => b.classList.remove("lit"));
  }
});
