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

  function ensurePaymentScript() {
    if (d.getElementById("hwadam-payment-runtime")) return;
    const s = d.createElement("script");
    s.id = "hwadam-payment-runtime";
    s.src = "/payment.js?v=20260902-payfix1";
    d.body.appendChild(s);
  }

  function openPayment() {
    try {
      const p = { id: "yongsin", name: "개인 용신 분석", price: 5900, at: new Date().toISOString() };
      localStorage.setItem("hwadam_selected_product", JSON.stringify(p));
      d.dispatchEvent(new CustomEvent("hwadam:product-selected", { detail: p }));
    } catch {}
    ensurePaymentScript();
    const go = () => {
      const pay = $("hwadamPaidReport");
      if (pay) {
        pay.scrollIntoView({ behavior: "smooth", block: "start" });
        const btn = $("payStart");
        if (btn && !btn.hidden) btn.focus({ preventScroll: true });
        return true;
      }
      return false;
    };
    if (go()) return;
    let n = 0;
    const t = setInterval(() => {
      if (go() || n++ > 30) clearInterval(t);
    }, 120);
  }

  function lockBox() {
    let box = $("hwadamYongsinLock");
    if (box) return box;
    const answer = $("aiAnswer");
    if (!answer) return null;
    box = d.createElement("section");
    box.id = "hwadamYongsinLock";
    box.innerHTML = `<span>🔒</span><h3>개인 용신 결과가 준비되었습니다</h3><p>전체 용신·희신·기신과 대운·세운 활용 결과는 결제 완료 후 확인할 수 있습니다.</p><button type="button">5,900원 결제하고 전체 결과 보기</button>`;
    answer.insertAdjacentElement("beforebegin", box);
    const b = box.querySelector("button");
    b.style.pointerEvents = "auto";
    b.style.touchAction = "manipulation";
    b.addEventListener("click", (e) => { e.preventDefault(); openPayment(); }, true);
    b.addEventListener("touchend", (e) => { e.preventDefault(); openPayment(); }, { passive: false, capture: true });
    return box;
  }

  function style() {
    if ($("hwadamYongsinPaywallStyle")) return;
    const sheet = d.createElement("style");
    sheet.id = "hwadamYongsinPaywallStyle";
    sheet.textContent = `#hwadamAiConsult.hdYongsinLocked #aiAnswer{display:none!important}#hwadamYongsinLock{margin:14px 0;padding:22px 17px;border:2px solid #dec17f;border-radius:18px;background:#fff8e8;text-align:center}#hwadamYongsinLock>span{font-size:32px}#hwadamYongsinLock h3{margin:8px 0;color:#20352d;font-size:20px}#hwadamYongsinLock p{margin:0;color:#666057;font-size:14px;line-height:1.7}#hwadamYongsinLock button{width:100%;margin-top:14px;padding:14px;border:0;border-radius:13px;background:#20352d;color:#fff;font-size:16px;font-weight:900;pointer-events:auto!important;touch-action:manipulation!important;position:relative;z-index:8}#hwadamAiConsult.hdYongsinUnlocked #hwadamYongsinLock{display:none!important}#hwadamAiConsult.hdYongsinUnlocked #aiAnswer{display:block!important}`;
    d.head.appendChild(sheet);
  }
  async function apply() {
    if (selected().id !== "yongsin") return;
    const ai = $("hwadamAiConsult"), report = last();
    if (!ai) return;
    style();
    if (!report.answer) return;
    if (report.reportId && await paid(report.reportId)) {
      ai.classList.remove("hdYongsinLocked");
      ai.classList.add("hdYongsinUnlocked");
      $("aiAnswer")?.removeAttribute("hidden");
      return;
    }
    ai.classList.remove("hdYongsinUnlocked");
    ai.classList.add("hdYongsinLocked");
    lockBox();
  }
  function boot() {
    style();
    ensurePaymentScript();
    apply();
    let timer;
    new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(apply, 80);
    }).observe(d.body, { childList: true, subtree: true, attributes: true });
    d.addEventListener("hwadam:report-entitled", apply);
    setInterval(apply, 900);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
