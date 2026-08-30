(() => {
  const d = document,
    $ = (id) => d.getElementById(id),
    THIS_YEAR = new Date().getFullYear();
  const PRODUCTS = [
    {
      id: "free-basic",
      name: "무료 기본풀이",
      price: 0,
      badge: "무료",
      desc: "사주팔자 · 오행 분포 · 성격 핵심 요약",
      q: "",
    },
    {
      id: "yongsin",
      name: "개인 용신 분석",
      price: 5900,
      badge: "NEW",
      desc: "용신 · 희신 · 기신 · 오행 균형 · 대운과 세운 활용",
      q: "내 사주의 오행 균형과 신강·신약을 바탕으로 용신, 희신, 기신을 쉽게 설명해 주세요. 직업, 재물, 관계와 현재 대운 및 올해 세운에서 각 기운을 어떻게 활용하고 무엇을 조심해야 하는지도 자세히 알려 주세요.",
    },
    {
      id: "annual-fortune",
      name: `${THIS_YEAR}년 신년운세`,
      price: 9900,
      badge: "연도별",
      desc: "1년 총운 · 12개월 월별운 · 재물 · 직업 · 관계 · 건강",
      q: `${THIS_YEAR}년 한 해의 전체 흐름과 1월부터 12월까지의 월별 운세를 재물, 직업과 사업, 관계, 건강 중심으로 자세히 설명해 주세요.`,
    },
    {
      id: "money-business",
      name: "재물·사업 상담",
      price: 5900,
      badge: "유료",
      desc: "재물운 · 사업운 · 돈의 흐름 · 시기별 주의점",
      q: "재물운과 사업운을 중심으로 앞으로의 돈 흐름, 기회가 들어오는 시기, 지출과 투자에서 주의할 점까지 자세히 설명해 주세요.",
    },
    {
      id: "compatibility",
      name: "궁합 상담",
      price: 7900,
      badge: "유료",
      desc: "연애 · 결혼 · 두 사람의 관계 흐름과 궁합",
      q: "궁합을 중심으로 두 사람의 성향, 잘 맞는 점, 갈등하기 쉬운 부분, 관계가 좋아지는 방법과 시기를 자세히 설명해 주세요.",
    },
    {
      id: "comprehensive",
      name: "종합 사주 상담",
      price: 9900,
      badge: "유료",
      desc: "성격 · 재물 · 직업 · 관계 · 대운 · 올해운세 종합",
      q: "성격, 재물, 직업과 사업, 연애와 가족관계, 현재 대운과 올해 세운까지 종합적으로 자세히 설명해 주세요.",
    },
    {
      id: "lifetime-fortune",
      name: "평생운세 장문 리포트",
      price: 14900,
      badge: "PREMIUM",
      desc: "평생 총운 · 재물 · 직업 · 배우자 · 자녀 · 건강 흐름 · 대운 전환점 · 말년운",
      q: "평생운세 장문 리포트로 작성해 주세요. 사주 원국을 근거로 평생 총운, 타고난 성향과 강점, 재물운, 직업·사업운, 배우자·결혼운, 가족·자녀운, 건강에서 주의할 생활 흐름, 대운별 주요 전환점과 기회·주의 시기, 중년 이후의 변화, 말년운과 삶의 방향까지 항목별로 충분히 깊고 길게 설명해 주세요. 단정적인 예언은 피하고 실제 생활에서 활용할 수 있는 조언을 포함해 주세요.",
    },
  ];
  function money(n) {
    return n ? Number(n).toLocaleString("ko-KR") + "원" : "무료";
  }
  function goAnalysis() {
    try {
      const b = parent.document.querySelector(
        '.navItem[data-target="analysis"]',
      );
      if (b) {
        b.click();
        return;
      }
    } catch {}
    d.defaultView?.hwadamScreenMode?.show?.("analysis");
  }
  function choose(p) {
    try {
      localStorage.setItem(
        "hwadam_selected_product",
        JSON.stringify({
          id: p.id,
          name: p.name,
          price: p.price,
          at: new Date().toISOString(),
        }),
      );
    } catch {}
    d.querySelectorAll(".hwadamProduct").forEach((x) =>
      x.classList.toggle("selected", x.dataset.id === p.id),
    );
    d.dispatchEvent(
      new CustomEvent("hwadam:product-selected", {
        detail: { id: p.id, name: p.name, price: p.price },
      }),
    );
    const status = $("aiStatus");
    if (p.id === "free-basic") {
      if (status)
        status.textContent =
          "무료 기본풀이는 화담분석에서 바로 확인할 수 있습니다.";
      goAnalysis();
      return;
    }
    const ta = $("aiQuestion");
    if (ta) {
      ta.value = p.q;
      ta.focus();
    }
    if (status)
      status.textContent = `${p.name} · ${money(p.price)} 상품을 선택했습니다. 상담 완료 후 선택한 금액으로 테스트 결제를 진행할 수 있습니다.`;
    setTimeout(
      () => ta?.scrollIntoView({ behavior: "smooth", block: "center" }),
      60,
    );
  }
  function build() {
    const ai = $("hwadamAiConsult");
    if (!ai || $("hwadamProductCatalog")) return false;
    const sec = d.createElement("section");
    sec.id = "hwadamProductCatalog";
    sec.innerHTML = `<div class="hpcHead"><div><span>상담 상품</span><h3>원하는 상담을 선택하세요</h3></div><p>결제한 리포트는 화담일지에서 계속 다시 볼 수 있습니다.</p></div><div class="hpcGrid">${PRODUCTS.map((p, i) => `<button type="button" class="hwadamProduct ${i === 0 ? "selected" : ""}" data-id="${p.id}"><div class="hpTop"><b>${p.name}</b><em>${p.badge}</em></div><strong>${money(p.price)}</strong><small>${p.desc}</small><span>${p.price ? "상담 선택" : "무료로 보기"} ›</span></button>`).join("")}</div><div class="hpcNote">신년운세는 연도별 상품입니다. 평생운세는 한 번의 결제로 장문 리포트를 제공하며, 결제한 리포트는 화담일지에서 계속 다시 볼 수 있습니다.</div>`;
    const anchor = ai.querySelector(".aiChips") || ai.querySelector("textarea");
    anchor?.insertAdjacentElement("beforebegin", sec);
    sec.querySelectorAll(".hwadamProduct").forEach((b) =>
      b.addEventListener("click", () => {
        const p = PRODUCTS.find((x) => x.id === b.dataset.id);
        if (p) choose(p);
      }),
    );
    const saved = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("hwadam_selected_product") || "{}",
        );
      } catch {
        return {};
      }
    })();
    if (saved?.id) {
      sec
        .querySelectorAll(".hwadamProduct")
        .forEach((x) =>
          x.classList.toggle("selected", x.dataset.id === saved.id),
        );
      const savedProduct = PRODUCTS.find((x) => x.id === saved.id);
      const question = $("aiQuestion");
      if (savedProduct?.q && question && !question.value.trim()) {
        question.value = savedProduct.q;
      }
    }
    if (!$("hwadamProductStyle")) {
      const st = d.createElement("style");
      st.id = "hwadamProductStyle";
      st.textContent = `#hwadamProductCatalog{margin:18px 0 16px}.hpcHead{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:12px}.hpcHead span{font-size:12px;font-weight:900;color:#b88746}.hpcHead h3{margin:3px 0 0;font-size:22px;color:#20352d}.hpcHead p{margin:0;max-width:46%;font-size:12px;line-height:1.5;color:#777}.hpcGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.hwadamProduct{min-height:150px!important;margin:0!important;text-align:left!important;padding:15px!important;border:1px solid #dfd5c5!important;border-radius:17px!important;background:#fffdf9!important;color:#26352f!important;box-shadow:none!important}.hwadamProduct.selected{outline:3px solid #d49a49!important;outline-offset:-2px}.hwadamProduct:nth-child(1){background:#eef7f1!important}.hwadamProduct:nth-child(2){background:#fff4d8!important}.hwadamProduct:nth-child(3){background:#ffe9ef!important}.hwadamProduct:nth-child(4){background:#eaf0ff!important}.hwadamProduct:nth-child(7){background:#f3eaff!important}.hpTop{display:flex;justify-content:space-between;gap:8px;align-items:center}.hpTop b{font-size:16px}.hpTop em{font-style:normal;font-size:11px;padding:4px 7px;border-radius:999px;background:#20352d;color:#fff}.hwadamProduct strong{display:block;margin:9px 0 6px;font-size:22px;color:#8d5e24}.hwadamProduct small{display:block;min-height:42px;font-size:12px;line-height:1.55;color:#68635c}.hwadamProduct span{display:block;margin-top:9px;font-size:12px;font-weight:900;color:#20352d}.hpcNote{margin-top:9px;padding:10px 12px;border-radius:12px;background:#f4f0e8;font-size:11px;line-height:1.55;color:#726b61}@media(max-width:430px){.hpcHead{display:block}.hpcHead p{max-width:none;margin-top:5px}.hpcGrid{grid-template-columns:1fr}.hwadamProduct{min-height:132px!important}}`;
      d.head.appendChild(st);
    }
    return true;
  }
  function boot() {
    if (build()) return;
    let n = 0;
    const t = setInterval(() => {
      if (build() || n++ > 30) clearInterval(t);
    }, 200);
  }
  if (d.readyState === "loading")
    d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
