(() => {
  const d = document;
  const $ = (id) => d.getElementById(id);

  function hideSamplePlaceholders() {
    ["year", "month", "day", "hour", "minute"].forEach((id) => {
      const el = $(id);
      if (el) el.placeholder = "";
    });
  }

  function revealInput() {
    hideSamplePlaceholders();
    const name = $("name");
    if (!name) return false;
    let node = name.closest(".card") || name.parentElement;
    while (node && node !== d.body) {
      node.classList.remove("hd-screen-hidden");
      if (node.matches("section, .card, main, .w") || node.contains(name)) {
        node.classList.add("hd-screen-visible");
      }
      node = node.parentElement;
    }
    try { d.scrollingElement.scrollTop = 0; d.defaultView.scrollTo(0, 0); } catch {}
    return true;
  }

  async function directCalculate(ev) {
    ev?.preventDefault?.();
    ev?.stopPropagation?.();
    ev?.stopImmediatePropagation?.();
    const btn = $("go");
    const st = $("st");
    if (!btn || btn.dataset.busy === "1") return;
    try {
      btn.dataset.busy = "1";
      btn.disabled = true;
      btn.textContent = "계산 중…";
      if (st) { st.className = "status"; st.textContent = "사주를 계산하고 있습니다…"; }

      const year = Number($("year")?.value);
      const month = Number($("month")?.value);
      const day = Number($("day")?.value);
      const hour = Number($("hour")?.value);
      const minute = Number($("minute")?.value);
      if (!year || !month || !day || Number.isNaN(hour) || hour < 0 || hour > 23 || Number.isNaN(minute) || minute < 0 || minute > 59) {
        throw new Error("생년월일과 시간을 확인해 주세요.");
      }
      const lunar = d.querySelector('input[name="cal"]:checked')?.value === "lunar";
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      let res;
      try {
        res = await fetch("/api/saju-calc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year, month, day, hour, minute,
            isLunar: lunar,
            isLeapMonth: lunar && $("leap")?.value === "leap",
            dayBoundary: $("boundary")?.value || "midnight",
            gender: $("gender")?.value || "female"
          }),
          signal: ctrl.signal
        });
      } finally { clearTimeout(timer); }
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.error || "사주 계산에 실패했습니다.");

      const k = j.pillars || {};
      const who = $("who");
      if (who) who.textContent = (($("name")?.value || "").trim() || "고객") + "님의 사주팔자";
      if ($("summary")) $("summary").textContent = `${lunar ? "음력" : "양력"} ${year}.${month}.${day} ${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
      [["y",k.year],["m",k.month],["d",k.day],["h",k.hour]].forEach(([id,p]) => {
        if ($(id+"P")) $(id+"P").textContent = p || "";
      });
      if ($("dm")) $("dm").textContent = `${k.day?.[0] || "-"} 일간 · ${j.dayElement || "-"} · ${j.dayYinYang || "-"}`;
      if ($("vb")) $("vb").textContent = Array.isArray(j.voidBranches) ? j.voidBranches.join(" · ") : (j.voidBranches || "-");
      if ($("result")) $("result").style.display = "block";
      if (st) { st.className = "status"; st.textContent = "계산 완료"; }
      try {
        const analysis = parent.document.querySelector('.navItem[data-target="analysis"]');
        if (analysis) analysis.click();
      } catch {}
      setTimeout(() => $("result")?.scrollIntoView?.({ behavior: "smooth", block: "start" }), 120);
    } catch (e) {
      if (st) {
        st.className = "status err";
        st.textContent = "계산 오류: " + (e?.name === "AbortError" ? "서버 응답이 늦습니다. 다시 눌러 주세요." : (e?.message || String(e)));
      } else {
        alert(e?.message || "계산 오류가 발생했습니다.");
      }
    } finally {
      const b = $("go");
      if (b) { b.dataset.busy = "0"; b.disabled = false; b.textContent = "사주팔자 계산"; }
    }
  }

  function hardBindCalc() {
    let btn = $("go");
    if (!btn || btn.dataset.hwadamHardBound === "1") return;
    const clone = btn.cloneNode(true);
    clone.id = "go";
    clone.type = "button";
    clone.disabled = false;
    clone.style.pointerEvents = "auto";
    clone.style.touchAction = "manipulation";
    clone.style.position = "relative";
    clone.style.zIndex = "5";
    clone.dataset.hwadamHardBound = "1";
    btn.replaceWith(clone);
    clone.addEventListener("click", directCalculate, true);
    clone.addEventListener("touchend", (e) => { e.preventDefault(); directCalculate(e); }, { passive: false, capture: true });
  }

  function bindNav() {
    try {
      const button = parent.document.querySelector('.navItem[data-target="input"]');
      if (!button || button.dataset.inputRevealBound) return;
      button.dataset.inputRevealBound = "1";
      button.addEventListener("click", () => {
        hideSamplePlaceholders();
        setTimeout(() => { revealInput(); hardBindCalc(); }, 40);
        setTimeout(() => { revealInput(); hardBindCalc(); }, 180);
        setTimeout(() => { revealInput(); hardBindCalc(); }, 500);
      }, false);
    } catch {}
  }

  function boot() {
    hideSamplePlaceholders();
    bindNav();
    hardBindCalc();
    setTimeout(() => { bindNav(); hardBindCalc(); }, 250);
    setTimeout(() => { bindNav(); hardBindCalc(); }, 800);
    try {
      const active = parent.document.querySelector('.navItem.active[data-target="input"]');
      if (active) setTimeout(() => { revealInput(); hardBindCalc(); }, 80);
    } catch {}
  }

  window.hwadamInputScreenFix = { reveal: revealInput, hideSamplePlaceholders, calculate: directCalculate };
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();
