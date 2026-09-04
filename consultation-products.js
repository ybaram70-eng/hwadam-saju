(() => {
  const d = document;
  const $ = (id) => d.getElementById(id);
  const THIS_YEAR = new Date().getFullYear();

  const PRODUCTS = [
    {
      id: "annual-membership",
      name: "1년 회원권",
      price: 55000,
      badge: "MEMBER",
      desc: "로그인한 회원 본인 기준 · 구매일로부터 1년 동안 화담 유료 기능 전체 이용",
      q: ""
    },
    {
      id: "annual-fortune",
      name: `${THIS_YEAR}년 신년운세`,
      price: 9900,
      badge: "연도별",
      desc: "1년 총운 · 12개월 월별운 · 재물 · 직업 · 관계 · 건강",
      q: `${THIS_YEAR}년 한 해의 전체 흐름과 1월부터 12월까지의 월별 운세를 재물, 직업과 사업, 관계, 건강 중심으로 자세히 설명해 주세요.`
    },
    {
      id: "money-business",
      name: "재물·사업 상담",
      price: 5900,
      badge: "재물",
      desc: "재물운 · 사업운 · 돈의 흐름 · 시기별 기회와 주의점",
      q: "재물운과 사업운을 중심으로 앞으로의 돈 흐름, 기회가 들어오는 시기, 지출과 투자에서 주의할 점까지 자세히 설명해 주세요."
    },
    {
      id: "compatibility",
      name: "궁합 상담",
      price: 7900,
      badge: "궁합",
      desc: "연애 · 결혼 · 두 사람의 관계 흐름과 궁합",
      q: "궁합을 중심으로 두 사람의 성향, 잘 맞는 점, 갈등하기 쉬운 부분, 관계가 좋아지는 방법과 시기를 자세히 설명해 주세요."
    },
    {
      id: "lifetime-fortune",
      name: "평생운세 장문 리포트",
      price: 14900,
      badge: "PREMIUM",
      desc: "평생 총운 · 재물 · 직업 · 배우자 · 자녀 · 건강 · 대운 전환점 · 말년운",
      q: "평생운세 장문 리포트로 작성해 주세요. 사주 원국을 근거로 평생 총운, 타고난 성향과 강점, 재물운, 직업·사업운, 배우자·결혼운, 가족·자녀운, 건강에서 주의할 생활 흐름, 대운별 주요 전환점과 기회·주의 시기, 중년 이후의 변화, 말년운과 삶의 방향까지 항목별로 충분히 깊고 길게 설명해 주세요. 단정적인 예언은 피하고 실제 생활에서 활용할 수 있는 조언을 포함해 주세요."
    }
  ];

  const money = (n) => Number(n).toLocaleString("ko-KR") + "원";

  function selectProduct(p) {
    const selected = { id: p.id, name: p.name, price: p.price, at: new Date().toISOString() };
    try {
      localStorage.setItem("hwadam_selected_product", JSON.stringify(selected));
      localStorage.removeItem("hwadam_formal_report_payment");
    } catch {}

    d.querySelectorAll("#hwadamProductCatalog .hwadamProduct").forEach((el) => {
      el.classList.toggle("selected", el.dataset.id === p.id);
    });

    d.dispatchEvent(new CustomEvent("hwadam:product-selected", { detail: selected }));

    const status = $("aiStatus");
    const ta = $("aiQuestion");

    if (p.id === "annual-membership") {
      if (ta) ta.value = "";
      if (status) status.textContent = "1년 회원권 · 55,000원을 선택했습니다. 아래 결제 영역에서 회원권 결제를 진행할 수 있습니다.";
      setTimeout(() => $("hwadamPaidReport")?.scrollIntoView({ behavior: "smooth", block: "start" }), 180);
      return;
    }

    if (ta) ta.value = p.q;
    if (status) {
      status.textContent = `${p.name} · ${money(p.price)}을 선택했습니다. 위 내용을 확인한 뒤 AI 상담하기를 누르면 상담 결과와 결제 단계로 이어집니다.`;
    }

    const detail = $("hwadamSelectedProductDetail");
    if (detail) {
      detail.innerHTML = `<b>${p.name}</b><span>${p.desc}</span><strong>${money(p.price)}</strong>`;
      detail.hidden = false;
    }

    setTimeout(() => {
      ta?.scrollIntoView({ behavior: "smooth", block: "center" });
      ta?.focus();
    }, 120);
  }

  function card(p) {
    return `<button type="button" class="hwadamProduct" data-id="${p.id}">
      <div class="hpTop"><b>${p.name}</b><em>${p.badge}</em></div>
      <strong>${money(p.price)}</strong>
      <small>${p.desc}</small>
      <span class="selectLink">${p.id === "annual-membership" ? "회원권 선택" : "상담 선택"} ›</span>
    </button>`;
  }

  function build() {
    const ai = $("hwadamAiConsult");
    if (!ai) return false;

    $("hwadamProductCatalog")?.remove();

    const sec = d.createElement("section");
    sec.id = "hwadamProductCatalog";
    sec.innerHTML = `
      <div class="hpcHead">
        <div><span>HWADAM SERVICE</span><h3>화담 상담 상품</h3></div>
        <b>5개 상품</b>
      </div>
      <div class="hpcGrid">${PRODUCTS.map(card).join("")}</div>
      <div id="hwadamSelectedProductDetail" class="hpcSelected" hidden></div>
      <div class="hpcNote">상품 선택 → AI 상담 → 결제 → 정식 리포트 열람 순서로 진행됩니다. 1년 회원권은 선택 후 바로 결제할 수 있습니다.</div>`;

    const anchor = ai.querySelector(".aiChips") || ai.querySelector("textarea");
    anchor?.insertAdjacentElement("beforebegin", sec);

    sec.querySelectorAll(".hwadamProduct").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = PRODUCTS.find((x) => x.id === btn.dataset.id);
        if (p) selectProduct(p);
      });
    });

    let st = $("hwadamProductStyle");
    if (!st) {
      st = d.createElement("style");
      st.id = "hwadamProductStyle";
      d.head.appendChild(st);
    }
    st.textContent = `
      #hwadamProductCatalog{margin:18px 0 16px}
      .hpcHead{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:12px}
      .hpcHead span{font-size:12px;font-weight:900;color:#b88746}.hpcHead h3{margin:3px 0 0;font-size:24px;color:#20352d}.hpcHead>b{color:#d9602b;font-size:14px}
      .hpcGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .hwadamProduct{min-height:150px!important;margin:0!important;text-align:left!important;padding:15px!important;border:1px solid #dfd5c5!important;border-radius:17px!important;background:#fffdf9!important;color:#26352f!important;box-shadow:none!important}
      .hwadamProduct:first-child{background:linear-gradient(145deg,#eef6ff,#dfeeff)!important;border:2px solid #8fb8e8!important}
      .hwadamProduct:last-child{background:#f0f1ff!important}
      .hwadamProduct.selected{outline:3px solid #d49a49!important;outline-offset:-2px}
      .hpTop{display:flex;justify-content:space-between;gap:8px;align-items:center}.hpTop b{font-size:16px}.hpTop em{font-style:normal;font-size:11px;padding:4px 8px;border-radius:999px;background:#20352d;color:#fff}
      .hwadamProduct strong{display:block;margin:9px 0 6px;font-size:23px;color:#8d5e24}.hwadamProduct small{display:block;min-height:42px;font-size:12px;line-height:1.6;color:#68635c}.selectLink{display:block;margin-top:9px;font-size:12px;font-weight:900;color:#20352d}
      .hpcSelected{margin-top:12px;padding:13px 14px;border-radius:14px;background:#eef5ef;border:1px solid #cfded3}.hpcSelected b,.hpcSelected span,.hpcSelected strong{display:block}.hpcSelected b{font-size:16px;color:#20352d}.hpcSelected span{margin-top:5px;font-size:13px;line-height:1.6;color:#5f675f}.hpcSelected strong{margin-top:5px;color:#8d5e24;font-size:19px}
      .hpcNote{margin-top:9px;padding:10px 12px;border-radius:12px;background:#f4f0e8;font-size:11px;line-height:1.6;color:#726b61}
      @media(max-width:430px){.hpcGrid{grid-template-columns:1fr}.hwadamProduct{min-height:132px!important}}
    `;

    try {
      const saved = JSON.parse(localStorage.getItem("hwadam_selected_product") || "{}");
      if (saved?.id) sec.querySelector(`[data-id="${saved.id}"]`)?.classList.add("selected");
    } catch {}

    return true;
  }

  function boot() {
    if (build()) return;
    let n = 0;
    const t = setInterval(() => {
      if (build() || n++ > 30) clearInterval(t);
    }, 200);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
