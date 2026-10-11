document.querySelectorAll(".badge[data-fan]").forEach(btn => {
  btn.addEventListener("click", () => {
    const fan = document.getElementById(btn.dataset.fan);
    document.querySelectorAll(".fan.open").forEach(f => { if (f !== fan) f.classList.remove("open"); });
    fan.classList.toggle("open");
  });
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".launchers")) {
    document.querySelectorAll(".fan.open").forEach(f => f.classList.remove("open"));
  }
});
