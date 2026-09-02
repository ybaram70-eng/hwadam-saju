(() => {
  const d = document;
  const $ = (id) => d.getElementById(id);

  function selected() {
    try { return JSON.parse(localStorage.getItem("hwadam_selected_product") || "{}"); }
    catch { return {}; }
  }
  function last() {
    try { return JSON.parse(localStorage.getItem("hwadam_last_ai_consult") || "{}"); }
    catch { return {}; }
  }
  function entitlement(reportId) {
    try { return (JSON.parse(localStorage.getItem("hwadam_report_entitlements") || "{}") || {})[reportId]; }
    catch { return null; }
  }
  async function paid(reportId) {
    const item = entitlement(reportId);
    try {
      const response = await fetch("/api/report-entitlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token: item?.token || "", reportId }),
      });
      const data = await response.json();
      return Boolean(response.ok && data.ok);
    } catch { return false; }
  }
  function rememberYongsin() {
    const p = { id: "yongsin", name: "개인 용신 분석", price: 5900, at: new Date().toISOString() };
    try { localStorage.setItem("hwadam_selected_product", JSON.stringify(p)); } catch {}
    return p;
  }
  function bindPayButton() {
    const b = $("hwadamYongsinPayButton");
    if (!b || b.dataset.bound === "1") return;
    b.dataset.bound = "1";
    b.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const p = rememberYongsin();
      d.dispatchEvent(new CustomEvent("hwadam:product-selected", { detail: p }));
      let tries = 0;
      const go = () => {
        const pay = $("hwadamPaidReport");
        if (pay) {
          pay.hidden = false;
          pay.style.display = "block";
          pay.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (tries++ < 20) setTimeout(go, 120);
      };
      go();
    });
  }
  function lockBox() {
    let box = $("hwadamYongsinLock");
    if (!box) {
      const answer = $("aiAnswer");
      if (!answer) return null;
      box = d.createElement("section");
      box.id = "hwadamYongsinLock";
      box.innerHTML = `<span>🔒</span><h3>개인 용신 결과가 준비되었습니다</h3><p>전체 용신·희신·기신과 대운·세운 활용 결과는 결제 완료 후 확인할 수 있습니다.</p><button id="hwadamYongsinPayButton" type="button">5,900원 결제하고 전체 결과 보기</button>`;
      answer.insertAdjacentElement("beforebegin", box);
    }
    bindPayButton();
    return box;
  }
  function clearLock() {
    const ai = $("hwadamAiConsult");
    ai?.classList.remove("hdYongsinLocked", "hdYongsinUnlocked");
    $("hwadamYongsinLock")?.remove();
    $("aiAnswer")?.removeAttribute("hidden");
  }
  function style() {
    let sheet = $("hwadamYongsinPaywallStyle");
    if (!sheet) {
      sheet = d.createElement("style");
      sheet.id = "hwadamYongsinPaywallStyle";
      d.head.appendChild(sheet);
    }
    sheet.textContent = `#hwadamAiConsult.hdYongsinLocked #aiAnswer{display:none!important}#hwadamYongsinLock{margin:14px 0;padding:22px 17px;border:2px solid #dec17f;border-radius:18px;background:#fff8e8;text-align:center}#hwadamYongsinLock>span{font-size:32px}#hwadamYongsinLock h3{margin:8px 0;color:#20352d;font-size:20px}#hwadamYongsinLock p{margin:0;color:#666057;font-size:14px;line-height:1.7}#hwadamYongsinPayButton{display:block;width:100%;box-sizing:border-box;margin-top:14px;padding:16px;border:0;border-radius:13px;background:#20352d;color:#fff!important;font-size:16px;font-weight:900;pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important}#hwadamPaidReport{display:block!important;visibility:visible!important;opacity:1!important;animation:none!important;transition:none!important;transform:none!important}#hwadamAiConsult.hdYongsinUnlocked #hwadamYongsinLock{display:none!important}#hwadamAiConsult.hdYongsinUnlocked #aiAnswer{display:block!important}`;
  }
  async function apply() {
    if (selected().id !== "yongsin") { clearLock(); return; }
    const ai = $("hwadamAiConsult"), report = last();
    if (!ai || !report.answer) return;
    style();
    if (report.reportId && await paid(report.reportId)) {
      ai.classList.remove("hdYongsinLocked");
      ai.classList.add("hdYongsinUnlocked");
      $("hwadamYongsinLock")?.remove();
      $("aiAnswer")?.removeAttribute("hidden");
      return;
    }
    ai.classList.remove("hdYongsinUnlocked");
    ai.classList.add("hdYongsinLocked");
    lockBox();
  }
  function boot() {
    style();
    apply();
    d.addEventListener("hwadam:report-entitled", apply);
    d.addEventListener("hwadam:product-selected", () => setTimeout(() => {
      bindPayButton();
      const pay = $("hwadamPaidReport");
      if (pay) { pay.hidden = false; pay.style.display = "block"; }
    }, 80));
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
