(() => {
  const d = document;
  function apply() {
    if (d.getElementById("hwadam-member-font-fix-style")) return;
    const s = d.createElement("style");
    s.id = "hwadam-member-font-fix-style";
    s.textContent = `#hwadamAuthBar{justify-content:flex-start!important;gap:8px!important;margin:10px 12px 12px!important}#hwadamAuthBar .hdAuthUser{font-size:16px!important;white-space:nowrap!important}#hwadamAuthBar .hdAuthBtn{min-height:44px!important;height:44px!important;padding:8px 15px!important;font-size:15px!important;box-shadow:0 3px 10px rgba(32,53,45,.06)!important}@media(max-width:430px){#hwadamAuthBar .hdAuthUser{font-size:15px!important}#hwadamAuthBar .hdAuthBtn{padding:8px 13px!important;font-size:14px!important}}`;
    d.head.appendChild(s);
  }
  if (d.readyState === "loading")
    d.addEventListener("DOMContentLoaded", apply, { once: true });
  else apply();
})();
