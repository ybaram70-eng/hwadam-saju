(() => {
  const d = document,
    $ = (id) => d.getElementById(id);
  if (!$("hwadam-auth-ui")) {
    const a = d.createElement("script");
    a.id = "hwadam-auth-ui";
    a.src = "/auth-ui.js?v=20260827-3";
    d.body.appendChild(a);
  }
  if (!$("hwadam-auth-calendar-compact-script")) {
    const c = d.createElement("script");
    c.id = "hwadam-auth-calendar-compact-script";
    c.src = "/auth-calendar-compact.js?v=20260827-1";
    d.body.appendChild(c);
  }
  function goParent(t) {
    try {
      const b = parent.document.querySelector(`.navItem[data-target="${t}"]`);
      if (b) {
        b.click();
        return true;
      }
    } catch {}
    return false;
  }
  function showDirect(t) {
    try {
      d.defaultView?.hwadamScreenMode?.show?.(t);
      parent.document.querySelectorAll(".navItem").forEach((item) =>
        item.classList.toggle("active", item.dataset.target === t),
      );
      d.defaultView.scrollTo(0, 0);
      return true;
    } catch {
      return false;
    }
  }
  function hasBirthResult() {
    return Boolean(
      ($("dP")?.textContent || "").trim() &&
        ($("yP")?.textContent || "").trim(),
    );
  }
  function ensureStyle() {
    if ($("hwadam-home-dashboard-style")) return;
    const s = d.createElement("style");
    s.id = "hwadam-home-dashboard-style";
    s.textContent = `#hwadamHomeDashboard{margin:8px 0 18px;color:#1f2937;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans KR",sans-serif}.hero.hdOldHero{display:none!important}.hdDashHero{position:relative;overflow:hidden;border-radius:24px;padding:24px 22px;background:linear-gradient(135deg,#173c30,#234f40);color:#fff;box-shadow:0 10px 28px rgba(24,59,47,.14)}.hdDashHero:after{content:'✿';position:absolute;right:24px;top:20px;font-size:74px;color:#f5d7a0}.hdDashBrand{font-size:14px;letter-spacing:1.6px;font-weight:900;color:#e7c783}.hdDashHero h2{margin:9px 0 8px;font-size:31px}.hdDashHero p{margin:0;max-width:76%;font-size:17px;line-height:1.65}.hdToday{margin-top:16px;padding:20px;border:1px solid #e6dccd;border-radius:22px;background:#fffdf9;display:grid;grid-template-columns:1fr 118px;gap:12px;align-items:center}.hdTodayName{font-size:22px;font-weight:900;color:#e46f20}.hdToday h3{margin:6px 0 10px;font-size:25px;line-height:1.42;color:#20352d}.hdTags{display:flex;flex-wrap:wrap;gap:7px}.hdTag{border:0;padding:7px 10px;border-radius:999px;font-size:14px;font-weight:850;cursor:pointer;min-height:auto!important;width:auto!important}.hdTag:nth-child(1){background:#fff1c9;color:#8a5c08}.hdTag:nth-child(2){background:#e7f3e9;color:#285c38}.hdTag:nth-child(3){background:#eaf2ff;color:#2d5d95}.hdTag:nth-child(4){background:#ffede5;color:#a55538}.hdCat{height:118px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#fff 0 22%,#fff2dc 23% 58%,#f8dfaa 59% 100%);display:flex;align-items:center;justify-content:center;font-size:62px}.hdFortune{margin-top:14px;padding:20px;border-radius:22px;background:#fffdf9;border:1px solid #e4d8c8;display:grid;grid-template-columns:1fr 92px;gap:12px;align-items:center}.hdFortune small{display:block;color:#9b6a25;font-weight:900;font-size:15px}.hdScoreRow{display:flex;align-items:center;gap:12px;margin:4px 0 8px}.hdScore{font-size:43px;font-weight:950;color:#e87522}.hdBadge{padding:7px 12px;border-radius:999px;background:#ffd86a;color:#7a5404;font-weight:900;font-size:14px}.hdFortune p{margin:0;font-size:16px;line-height:1.65;font-weight:700}.hdCheck{width:78px;height:78px;border-radius:50%;background:linear-gradient(145deg,#ffd64e,#e9a72d);display:flex;align-items:center;justify-content:center;color:white;font-size:42px}.hdMenu{margin-top:14px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.hdMenu button,.hdMenu a{box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;text-decoration:none;margin:0!important;min-height:92px!important;border:1px solid #e3dacd!important;background:#fff!important;border-radius:18px!important;padding:11px 6px!important;color:#27352f!important;font-size:14px!important;font-weight:900!important}.hdMenu button span,.hdMenu a span{display:block;font-size:30px;margin-bottom:8px}.hdFlow{margin-top:14px;padding:18px 18px 18px 108px;min-height:105px;border-radius:22px;background:#edf5ff;border:1px solid #d9e7f5}.hdFlow b{display:block;color:#25629c;font-size:19px;margin-bottom:5px}.hdFlow p{margin:0;font-size:15px;line-height:1.6}.hdTopicBox{margin-top:12px;padding:18px;border-radius:18px;border:1px solid #e2d8c8;background:#fff;display:none}.hdTopicBox.on{display:block}.hdTopicBox b{display:block;color:#20352d;font-size:20px;margin-bottom:9px}.hdTopicBox p{margin:0;font-size:16px;line-height:1.9;color:#39443e;word-break:keep-all}@media(max-width:430px){.hdDashHero{padding:20px 18px}.hdDashHero h2{font-size:27px}.hdToday{grid-template-columns:1fr 94px;padding:17px}.hdToday h3{font-size:22px}.hdCat{height:96px;font-size:50px}.hdMenu{gap:7px}.hdMenu button,.hdMenu a{min-height:82px!important;font-size:12px!important;padding:8px 3px!important}.hdMenu button span,.hdMenu a span{font-size:26px}.hdFlow{padding-left:22px}}`;
    s.textContent += `.hdFlowHead{display:flex;align-items:center;justify-content:space-between;gap:12px}.hdFlowHead b{font-size:22px!important}.hdFlowHead span{padding:6px 10px;border-radius:999px;background:#fff;color:#25629c;font-size:12px;font-weight:900}.hdFlowDetails{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}.hdFlowDetails div{padding:12px 9px;border-radius:14px;background:rgba(255,255,255,.78);text-align:center}.hdFlowDetails strong{display:block;color:#24567f;font-size:15px;margin-bottom:5px}.hdFlowDetails small{display:block;color:#5e7181;font-size:12px;line-height:1.45}@media(max-width:600px){.hdDashHero{padding:27px 23px!important;border-radius:26px!important}.hdDashHero h2{font-size:31px!important;line-height:1.3!important}.hdDashHero p{font-size:18px!important;line-height:1.7!important}.hdToday{padding:23px!important;grid-template-columns:1fr 105px!important}.hdTodayName{font-size:24px!important}.hdToday h3{font-size:25px!important;line-height:1.55!important}.hdFortune{padding:23px!important}.hdFortune p{font-size:18px!important;line-height:1.75!important}.hdMenu{grid-template-columns:repeat(2,1fr)!important;gap:13px!important}.hdMenu button,.hdMenu a{min-height:122px!important;padding:14px 8px!important;border-radius:21px!important;font-size:18px!important;line-height:1.35!important;box-shadow:0 5px 14px rgba(31,53,45,.06)!important}.hdMenu button span,.hdMenu a span{font-size:39px!important;margin-bottom:10px!important}.hdFlow{padding:22px!important;min-height:auto!important}.hdFlowDetails{grid-template-columns:1fr!important}.hdFlowDetails div{padding:14px!important;text-align:left!important}.hdFlowDetails strong{font-size:17px!important}.hdFlowDetails small{font-size:14px!important}.hdTopicBox b{font-size:22px!important}.hdTopicBox p{font-size:18px!important;line-height:1.85!important}}`;
    s.textContent += `@media(max-width:600px){.hdMenu{grid-template-columns:repeat(4,1fr)!important;gap:8px!important}.hdMenu button,.hdMenu a{min-height:105px!important;padding:10px 3px!important;border-radius:17px!important;font-size:14px!important;letter-spacing:-.4px!important}.hdMenu button span,.hdMenu a span{font-size:32px!important;margin-bottom:8px!important}.hdFlowDetails{grid-template-columns:repeat(3,1fr)!important;gap:7px!important}.hdFlowDetails div{padding:11px 6px!important;text-align:center!important}.hdFlowDetails strong{font-size:14px!important}.hdFlowDetails small{font-size:11px!important;line-height:1.4!important}}`;
    d.head.appendChild(s);
  }
  const TOPICS = {
    재물: "오늘은 돈의 흐름을 크게 움직이기보다 수입과 지출의 균형을 점검하는 데 유리한 날입니다. 예상하지 못한 지출이 생길 수 있으니 충동구매나 성급한 투자 결정은 피하고, 반드시 필요한 곳에 자금을 집중하는 편이 좋습니다. 이미 진행 중인 계약이나 거래가 있다면 조건을 다시 확인해 보세요. 작은 절약과 정리가 이후의 재물 흐름을 안정시키는 데 도움이 됩니다.",
    건강: "몸의 리듬과 피로 신호를 먼저 살피는 것이 좋습니다. 무리하게 속도를 내기보다 수면과 식사 시간을 일정하게 맞추고, 몸이 보내는 작은 불편도 지나치지 않는 편이 좋습니다. 가벼운 스트레칭이나 산책처럼 부담 없는 활동이 컨디션 회복에 도움이 됩니다. 오늘은 과로보다 회복에 중심을 두는 것이 좋습니다.",
    계획: "새로운 일을 한꺼번에 벌이기보다 지금 해야 할 일의 순서를 정리하는 데 좋은 날입니다. 목표를 크게 잡기보다 오늘 안에 끝낼 수 있는 한두 가지를 먼저 정해 실행해 보세요. 미뤄둔 일정이나 문서, 연락할 사람을 정리하면 흐름이 훨씬 가벼워집니다. 작은 실행이 다음 계획을 이어가는 힘이 됩니다.",
    안정: "오늘은 빠르게 결론을 내리기보다 한 번 더 확인하고 움직이는 편이 좋습니다. 감정이 앞서는 상황에서는 바로 반응하지 말고 시간을 조금 두면 판단이 선명해질 수 있습니다. 익숙한 일과 이미 정해진 약속부터 차분하게 마무리하면 전체 흐름이 안정됩니다. 사람과의 대화에서도 강하게 밀어붙이기보다 부드럽게 조율하는 태도가 도움이 됩니다.",
  };
  function ensureDashboard() {
    if ($("hwadamHomeDashboard")) return;
    const hero = d.querySelector(".hero");
    if (!hero) return;
    hero.classList.add("hdOldHero");
    const old = $("hwadamWelcome");
    if (old) old.style.display = "none";
    const x = d.createElement("section");
    x.id = "hwadamHomeDashboard";
    const year = new Date().getFullYear();
    x.innerHTML = `<div class="hdDashHero"><div class="hdDashBrand">和談 · HWADAM</div><h2>화담철학관 만세력</h2><p>원국부터 대운·세운까지 한 화면에서 확인합니다.</p></div><div class="hdToday"><div><div class="hdTodayName">오늘의 화담 ✦</div><h3>오늘의 흐름을<br>차분하게 살펴보세요</h3><div class="hdTags"><button class="hdTag" data-topic="재물">#재물</button><button class="hdTag" data-topic="건강">#건강</button><button class="hdTag" data-topic="계획">#계획</button><button class="hdTag" data-topic="안정">#안정</button></div></div><div class="hdCat">🐱</div></div><div id="hdTopicBox" class="hdTopicBox"><b id="hdTopicTitle"></b><p id="hdTopicText"></p></div><div class="hdFortune"><div><small>✦ 오늘의 안내</small><div class="hdScoreRow"><span class="hdScore">화담</span><span class="hdBadge">좋은 흐름</span></div><p>출생정보를 입력하면 원국과 대운·세운을 바탕으로 필요한 상담을 이어서 볼 수 있습니다.</p></div><div class="hdCheck">✓</div></div><div class="hdMenu"><button data-go="input"><span>📝</span>사주입력</button><button data-go="analysis"><span>📊</span>화담분석</button><button data-go="ai"><span>💬</span>AI상담</button><button data-go="calendar"><span>🗓️</span>택일달력</button><button data-go="journal"><span>📔</span>화담일지</button><button data-go="ai" data-product="compatibility"><span>💞</span>궁합</button><a target="_top" href="/?product=annual-fortune"><span>☯️</span>${year} 신년운세</a><button data-go="journal"><span>🎁</span>이벤트</button></div><div class="hdFlow"><b>최근 에너지 흐름</b><p>사주를 계산하면 현재 대운·세운과 상담 흐름을 이어서 확인할 수 있습니다.</p></div>`;
    x.querySelector(".hdFlow").innerHTML = `<div class="hdFlowHead"><b>나의 운세 흐름</b><span>한눈에 보기</span></div><p>사주를 입력하면 현재의 큰 흐름부터 올해의 변화와 저장된 상담까지 차근차근 확인할 수 있습니다.</p><div class="hdFlowDetails"><div><strong>대운·세운</strong><small>현재 인생 흐름과 올해의 변화를 확인합니다.</small></div><div><strong>월별 운세</strong><small>달마다 달라지는 재물·직업·관계 흐름을 살펴봅니다.</small></div><div><strong>상담 기록</strong><small>받은 상담과 결제한 리포트를 다시 확인합니다.</small></div></div>`;
    hero.insertAdjacentElement("afterend", x);
    x.querySelectorAll("[data-go]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (b.dataset.product) {
          const product =
            b.dataset.product === "annual-fortune"
              ? {
                  id: "annual-fortune",
                  name: `${year}년 신년운세`,
                  price: 9900,
                  at: new Date().toISOString(),
                }
              : {
                  id: "compatibility",
                  name: "궁합 상담",
                  price: 7900,
                  at: new Date().toISOString(),
                };
          try {
            localStorage.setItem(
              "hwadam_selected_product",
              JSON.stringify(product),
            );
          } catch {}
        }
        if (b.dataset.product) {
          const target = hasBirthResult() ? "ai" : "input";
          if (!hasBirthResult()) {
            try {
              sessionStorage.setItem("hwadam_product_after_input", "1");
            } catch {}
          }
          if (!showDirect(target)) goParent(target);
          return;
        }
        goParent(b.dataset.go);
      }),
    );
    x.querySelectorAll("[data-topic]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const t = b.dataset.topic,
          box = $("hdTopicBox");
        $("hdTopicTitle").textContent = `오늘의 ${t} 흐름`;
        $("hdTopicText").textContent = TOPICS[t] || "";
        box.classList.add("on");
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }),
    );
  }
  function boot() {
    ensureStyle();
    ensureDashboard();
    let t;
    new MutationObserver(() => {
      clearTimeout(t);
      t = setTimeout(ensureDashboard, 120);
    }).observe(d.body, { subtree: true, childList: true });
    setInterval(ensureDashboard, 1200);
  }
  if (d.readyState === "loading")
    d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
