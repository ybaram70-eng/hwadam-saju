(() => {
  const d = document;
  function run() {
    let direct = "";
    try { direct = sessionStorage.getItem("hwadam_direct_product") || ""; } catch {}
    if (direct !== "yongsin") return true;
    const card = d.querySelector('.hwadamProduct[data-id="yongsin"]');
    const question = d.getElementById("aiQuestion");
    if (!card || !question) return false;
    try { sessionStorage.removeItem("hwadam_direct_product"); } catch {}
    card.click();
    setTimeout(() => question.scrollIntoView({ behavior: "smooth", block: "center" }), 180);
    return true;
  }
  let count = 0;
  const timer = setInterval(() => {
    if (run() || count++ > 40) clearInterval(timer);
  }, 150);
})();
