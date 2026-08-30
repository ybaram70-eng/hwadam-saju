(() => {
  const d = document;
  function run() {
    let direct = "";
    try { direct = sessionStorage.getItem("hwadam_direct_product") || ""; } catch {}
    if (direct !== "yongsin") return false;
    const card = d.querySelector('.hwadamProduct[data-id="yongsin"]');
    const question = d.getElementById("aiQuestion");
    if (!card || !question) return false;
    try { sessionStorage.removeItem("hwadam_direct_product"); } catch {}
    const ai = d.getElementById("hwadamAiConsult");
    ai?.classList.add("hdYongsinDirect");
    if (ai?.querySelector("h2")) ai.querySelector("h2").textContent = "개인 용신 분석";
    if (!d.getElementById("hwadamYongsinDirectStyle")) {
      const style = d.createElement("style");
      style.id = "hwadamYongsinDirectStyle";
      style.textContent = `#hwadamAiConsult.hdYongsinDirect #hwadamAiCharacter,#hwadamAiConsult.hdYongsinDirect #hwadamCharacterRecommend,#hwadamAiConsult.hdYongsinDirect #hwadamProductCatalog,#hwadamAiConsult.hdYongsinDirect .aiIntro,#hwadamAiConsult.hdYongsinDirect .aiChips{display:none!important}#hwadamAiConsult.hdYongsinDirect{scroll-margin-top:12px}#hwadamAiConsult.hdYongsinDirect h2{margin-bottom:12px!important}`;
      d.head.appendChild(style);
    }
    card.click();
    setTimeout(() => ai?.scrollIntoView({ behavior: "auto", block: "start" }), 320);
    return true;
  }
  let count = 0;
  const timer = setInterval(() => {
    if (run() || count++ > 40) clearInterval(timer);
  }, 150);
  d.addEventListener("hwadam:product-selected", (event) => {
    if (event.detail?.id !== "yongsin") d.getElementById("hwadamAiConsult")?.classList.remove("hdYongsinDirect");
  });
})();
