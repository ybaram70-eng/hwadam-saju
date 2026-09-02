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
    s.src = "/payment.js?v=20260903-payfix4";
    d.body.appendChild(s);
  }

  function ensureImmediatePanel() {
    let sec = $("hwadamPaidReport");
    if (sec) return sec;
    const ai = $("hwadamAiConsult");
    if (!ai) return null;
    sec = d.createElement("section");
    sec.id = "hwadamPaidReport";
    sec.className = "card";
    sec.innerHTML = `<h2>유료 상담 결제</h2><div id="payState" class="payState">토스 결제 화면을 준비하고 있습니다…</div><div id="payMethods" hidden></div><div id="payAgreement" hidden></div><button id="payStart" type="button" hidden>5,900원 결제하기</button>`;
    ai.appendChild(sec);
    return sec;
  }

  function rememberYongsin() {
    try {
      const p = { id: "yongsin", name: "개인 용신 분석", price: 5900, at: new Date().toISOString() };
      localStorage.setItem("hwadam_selected_product", JSON.stringify(p));
      d.dispatchEvent(new CustomEvent("hwadam:product-selected", { detail: p }));
      return p;
    } catch { return { id:"yongsin", name:"개인 용신 분석", price:5900 }; }
  }

  function openPayment() {
    const p = rememberYongsin();
    const sec = ensureImmediatePanel();
    ensurePaymentScript();
    if (sec) {
      sec.hidden = false;
      sec.style.display = "block";
      sec.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => d.dispatchEvent(new CustomEvent("hwadam:product-selected", { detail: p })), 120);
    setTimeout(() => {
      const pay = $("hwadamPaidReport");
      if (pay) pay.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 420);
  }

  function lockBox() {
    let box = $("hwadamYongsinLock");
    const answer = $("aiAnswer");
    if (!box) {
      if (!answer) return null;
      box = d.createElement("section");
      box.id = "hwadamYongsinLock";
      answer.insertAdjacentElement("beforebegin", box);
    }
    box.innerHTML = `<span>🔒</span><h3>개인 용신 결과가 준비되었습니다</h3><p>전체 용신·희신·기신과 대운·세운 활용 결과는 결제 완료 후 확인할 수 있습니다.</p><a id="hwadamYongsinPayButton" href="/?product=yongsin" target="_top" role="button">5,900원 결제하고 전체 결과 보기</a>`;
    return box;
  }

  function clearLock() {
    const ai = $("hwadamAiConsult");
    if (ai) {
      ai.classList.remove("hdYongsinLocked");
      ai.classList.remove("hdYongsinUnlocked");
    }
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
    sheet.textContent = `#hwadamAiConsult.hdYongsinLocked #aiAnswer{display:none!important}#hwadamYongsinLock{margin:14px 0;padding:22px 17px;border:2px solid #dec17f;border-radius:18px;background:#fff8e8;text-align:center}#hwadamYongsinLock>span{font-size:32px}#hwadamYongsinLock h3{margin:8px 0;color:#20352d;font-size:20px}#hwadamYongsinLock p{margin:0;color:#666057;font-size:14px;line-height:1.7}#hwadamYongsinPayButton{display:block;width:100%;box-sizing:border-box;margin-top:14px;padding:16px;border:0;border-radius:13px;background:#20352d;color:#fff!important;text-decoration:none!important;font-size:16px;font-weight:900;pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:999!important;cursor:pointer!important}#hwadamPaidReport{margin-top:18px;padding:18px;border-radius:18px;background:#fffdf8;border:1px solid #ddd3c2}.payState{padding:12px;border-radius:12px;background:#f4f0e8;color:#625d55}#hwadamAiConsult.hdYongsinUnlocked #hwadamYongsinLock{display:none!important}#hwadamAiConsult.hdYongsinUnlocked #aiAnswer{display:block!important}`;
  }

  async function apply() {
    if (selected().id !== "yongsin") { clearLock(); return; }
    const ai = $("hwadamAiConsult"), report = last();
    if (!ai) return;
    style();
    if (!report.answer) return;
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

  function delegatedTap(e) {
    const b = e.target?.closest?.("#hwadamYongsinPayButton");
    if (!b) return;
    rememberYongsin();
    openPayment();
  }

  function boot() {
    style();
    ensurePaymentScript();
    apply();
    d.addEventListener("click", delegatedTap, true);
    d.addEventListener("pointerup", delegatedTap, true);
    let timer;
    new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(apply, 80);
    }).observe(d.body, { childList: true, subtree: true, attributes: true });
    d.addEventListener("hwadam:report-entitled", apply);
    d.addEventListener("hwadam:product-selected", () => setTimeout(apply, 20));
    setInterval(apply, 900);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
