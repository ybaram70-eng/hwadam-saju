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
    s.textContent += `@media(max-width:600px){.hdMenu{grid-template-columns:repeat(4,1fr)!important;gap:8px!important}.hdMenu button,.hdMenu a{min-height:105px!important;padding:10px 3px!important;border-radius:17px!important;font-size:14px!important;letter-spacing:-.4px!important}.hdMenu button span,.hdMenu a span{font-size:32px!important;margin-bottom:8px!important}.hdFlowDetails{grid-template-columns:repeat(3,1fr)!important;gap:7px!important}.hdFlowDetails div,.hdFlowDetails a{padding:11px 6px!important;text-align:center!important}.hdFlowDetails strong{font-size:14px!important}.hdFlowDetails small{font-size:11px!important;line-height:1.4!important}}.hdFlowDetails a{display:block;padding:12px 9px;border-radius:14px;background:rgba(255,255,255,.88);text-align:center;text-decoration:none;color:inherit;border:1px solid #d6e5f3}.hdFlowDetails a:active{background:#dcecff;transform:scale(.98)}`;
    s.textContent += `.hdPromo{margin-top:15px;margin-bottom:0;padding:18px;border:1px solid #e4d8c8;border-radius:22px;background:#fffdf9}.hdPromoHead{display:flex;justify-content:space-between;align-items:end;gap:10px}.hdPromoHead small{display:block;color:#b06a2b;font-weight:900;font-size:12px}.hdPromoHead h3{margin:4px 0 0;color:#20352d;font-size:23px}.hdPromoHead b{color:#d9602b;font-size:14px}.hdPromoTabs{display:flex;gap:7px;margin:14px 0 12px;overflow-x:auto}.hdPromoTabs button{width:auto!important;min-width:max-content!important;min-height:0!important;margin:0!important;padding:9px 14px!important;border-radius:999px!important;background:#f3f0ea!important;color:#716b62!important;font-size:13px!important}.hdPromoTabs button.active{background:#d85f2b!important;color:#fff!important}.hdPromoTrack{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 1px 10px}.hdPromoTrack::-webkit-scrollbar{height:4px}.hdPromoTrack::-webkit-scrollbar-thumb{background:#d8c9b5;border-radius:9px}.hdPromoCard{flex:0 0 84%;scroll-snap-align:start;border:1px solid #ded5c7;border-radius:19px;background:#fff;overflow:hidden;text-decoration:none;color:#28332e;box-shadow:0 7px 18px rgba(31,53,45,.08)}.hdPromoVisual{min-height:142px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(140deg,#173f31,#2c5c49);color:#fff}.hdPromoCard:nth-child(2) .hdPromoVisual{background:linear-gradient(140deg,#fff0d4,#f4c675);color:#65420f}.hdPromoCard:nth-child(3) .hdPromoVisual{background:linear-gradient(140deg,#ffe8ef,#f5b7ca);color:#763448}.hdPromoCard:nth-child(4) .hdPromoVisual{background:linear-gradient(140deg,#e9efff,#bfcff7);color:#304b86}.hdPromoBadges{display:flex;gap:6px}.hdPromoBadges span{padding:5px 8px;border-radius:999px;background:rgba(255,255,255,.9);color:#a45129;font-size:11px;font-weight:900}.hdPromoVisual strong{font-size:24px;line-height:1.35}.hdPromoBody{padding:15px 16px 17px}.hdPromoBody b{display:block;font-size:18px;color:#20352d}.hdPromoBody p{margin:7px 0 11px;font-size:14px;line-height:1.65;color:#6b6a65}.hdPromoPrice{display:flex;align-items:center;justify-content:space-between;color:#9b5c20;font-size:20px;font-weight:950}.hdPromoPrice span{font-size:13px;color:#20352d}.hdPromoCard[hidden]{display:none!important}.hdPromoFill{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.hdPromoFill button{min-height:150px!important;margin:0!important;padding:18px 15px!important;border:0!important;border-radius:18px!important;text-align:left!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:space-between!important;color:#20352d!important}.hdPromoFill button:first-child{background:linear-gradient(145deg,#fff0d8,#ffdca1)!important}.hdPromoFill button:last-child{background:linear-gradient(145deg,#e9f4ee,#cfe7db)!important}.hdPromoFill span{font-size:30px}.hdPromoFill b{font-size:18px;line-height:1.35}.hdPromoFill small{font-size:12px;line-height:1.5;color:#5e665f}body.hd-screen-mode main.w{padding-bottom:92px!important}#hwadamHomeDashboard{padding-bottom:0!important;margin-bottom:0!important}@media(max-width:600px){.hdPromo{padding:16px}.hdPromoCard{flex-basis:88%}.hdPromoVisual{min-height:132px}.hdPromoVisual strong{font-size:22px}}`;
    s.textContent += `.hdDashHero{padding:27px 24px 23px;background:linear-gradient(145deg,#123b2f 0%,#1d5542 72%,#2b6651 100%);border:1px solid rgba(226,196,135,.32);box-shadow:0 14px 34px rgba(18,59,47,.2)}.hdDashHero:after{content:'和';right:24px;top:24px;width:72px;height:72px;border:1px solid rgba(244,215,158,.55);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:serif;font-size:34px;color:#f1d39b;background:rgba(255,255,255,.06)}.hdDashHero h2{position:relative;z-index:1;margin:10px 0 8px;color:#fff8e9!important;font-size:30px;line-height:1.3}.hdDashHero p{color:#edf4ef;font-size:15px;line-height:1.6}.hdHeroActions{display:flex;gap:9px;margin-top:20px;position:relative;z-index:2}.hdHeroActions button{width:auto!important;min-height:0!important;margin:0!important;padding:11px 15px!important;border-radius:12px!important;font-size:14px!important;font-weight:900!important}.hdHeroActions button:first-child{background:#e8c47f!important;color:#173b30!important;border:1px solid #e8c47f!important}.hdHeroActions button:last-child{background:rgba(255,255,255,.09)!important;color:#fff!important;border:1px solid rgba(255,255,255,.4)!important}.hdToday{padding:22px;background:linear-gradient(150deg,#fffefa,#faf6ed);box-shadow:0 8px 24px rgba(43,55,48,.07)}.hdTodayName{font-size:15px;color:#9a6b27;letter-spacing:.2px}.hdToday h3{font-size:25px;color:#173a2f;line-height:1.5}.hdCat{height:100px;border-radius:22px;background:linear-gradient(145deg,#f4e4be,#fff8e8);color:#8f672c;font-family:serif;font-size:42px;box-shadow:inset 0 0 0 1px #eddbb4}.hdTag{padding:8px 12px!important;border:1px solid rgba(35,73,57,.08)!important}.hdMemberBar,body.hd-screen-mode main.w>div:first-child{border-radius:14px}@media(max-width:430px){.hdDashHero{padding:23px 19px 21px}.hdDashHero:after{right:18px;top:22px;width:62px;height:62px;font-size:30px}.hdDashHero h2{font-size:25px;max-width:75%}.hdDashHero p{max-width:76%;font-size:14px}.hdHeroActions button{padding:10px 12px!important;font-size:13px!important}.hdToday{padding:19px 17px}.hdToday h3{font-size:22px}.hdCat{height:88px;font-size:36px}}`;
    s.textContent += `.hdToday .hdTag{background:#f6efdf!important;color:#315142!important;border-color:#e4d5b6!important}.hdToday .hdTag:nth-child(odd){background:#edf4ee!important}.hdFortune{background:linear-gradient(150deg,#fffefa,#faf6ed)!important;border-color:#ded3bf!important;box-shadow:0 8px 24px rgba(43,55,48,.07)}.hdFortune small{color:#9a6b27!important}.hdScore{color:#173f31!important;font-size:38px!important}.hdBadge{background:#ead09a!important;color:#5f471f!important}.hdCheck{background:linear-gradient(145deg,#1b4b3b,#2e6953)!important;color:#efd69f!important;box-shadow:inset 0 0 0 1px rgba(239,214,159,.35)}.hdMenu button,.hdMenu a{border-color:#ded3bf!important;box-shadow:0 4px 12px rgba(35,57,47,.045)}.hdFlow{background:#edf4ee!important;border-color:#d3e2d8!important}.hdFlow b,.hdFlowHead b{color:#1d5944!important}.hdPromo{border-color:#ded3bf!important;background:#fffefa!important}.hdPromoTabs button.active{background:#1f5844!important;color:#fff!important}`;
    s.textContent += `.hdToday{grid-template-columns:minmax(0,1fr) 94px!important;align-items:center!important}.hdToday h3{margin-bottom:15px!important}.hdTags{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;width:100%!important}.hdToday .hdTag{position:relative!important;display:flex!important;align-items:center!important;justify-content:space-between!important;width:100%!important;min-height:56px!important;padding:11px 12px!important;border-radius:15px!important;font-size:18px!important;line-height:1.2!important;text-align:left!important;box-shadow:0 5px 12px rgba(34,69,54,.09)!important}.hdToday .hdTag:after{content:'›';font-size:24px;color:#a17b3e;line-height:1}.hdToday .hdTag:active{transform:scale(.97);box-shadow:0 2px 6px rgba(34,69,54,.08)!important}.hdCat{margin-left:4px}@media(max-width:430px){.hdToday{grid-template-columns:minmax(0,1fr) 78px!important}.hdToday .hdTag{min-height:54px!important;padding:10px!important;font-size:17px!important}.hdCat{height:78px!important;font-size:31px!important;border-radius:18px!important}}`;
    s.textContent += `.hdFortune{min-height:0!important;padding:17px 18px!important;grid-template-columns:1fr 58px!important;gap:10px!important}.hdFortune small{font-size:13px!important}.hdScoreRow{margin:3px 0 6px!important;gap:9px!important}.hdScore{font-size:24px!important;line-height:1.2!important}.hdBadge{padding:5px 9px!important;font-size:12px!important}.hdFortune p{font-size:14px!important;line-height:1.55!important;font-weight:650!important;max-width:92%}.hdCheck{width:54px!important;height:54px!important;font-size:29px!important}.hdMenu{margin-top:12px!important;gap:9px!important}.hdMenu button,.hdMenu a{min-height:100px!important;font-size:15px!important;border-width:1.5px!important}.hdMenu button span,.hdMenu a span{font-size:31px!important}@media(max-width:430px){.hdFortune{padding:15px!important;grid-template-columns:1fr 52px!important}.hdFortune p{font-size:13px!important}.hdCheck{width:50px!important;height:50px!important}.hdMenu button,.hdMenu a{min-height:94px!important;font-size:14px!important}.hdMenu button span,.hdMenu a span{font-size:29px!important}}`;
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
    x.innerHTML = `<div class="hdDashHero"><div class="hdDashBrand">和談 · HWADAM</div><h2>나의 사주,<br>삶의 흐름을 읽다</h2><p>원국부터 대운·세운까지 정확하고 편리하게 확인하세요.</p><div class="hdHeroActions"><button type="button" data-go="input">사주 입력하기</button><button type="button" data-go="analysis">내 분석 보기</button></div></div><div class="hdToday"><div><div class="hdTodayName">TODAY · 오늘의 화담</div><h3>오늘 필요한 운세를<br>선택해 보세요</h3><div class="hdTags"><button class="hdTag" data-topic="재물">재물운</button><button class="hdTag" data-topic="건강">건강운</button><button class="hdTag" data-topic="계획">계획</button><button class="hdTag" data-topic="안정">마음</button></div></div><div class="hdCat">今日</div></div><div id="hdTopicBox" class="hdTopicBox"><b id="hdTopicTitle"></b><p id="hdTopicText"></p></div><div class="hdFortune"><div><small>✦ 오늘의 안내</small><div class="hdScoreRow"><span class="hdScore">운세를 시작해 보세요</span><span class="hdBadge">간편 확인</span></div><p>출생정보 입력 후 나에게 필요한 운세를 바로 확인할 수 있습니다.</p></div><div class="hdCheck">✓</div></div><div class="hdMenu"><button data-go="input"><span>📝</span>사주입력</button><button data-go="analysis"><span>📊</span>화담분석</button><button data-go="ai"><span>💬</span>AI상담</button><button data-go="calendar"><span>🗓️</span>택일달력</button><button data-go="journal"><span>📔</span>화담일지</button><button data-go="ai" data-product="compatibility"><span>💞</span>궁합</button><a target="_top" href="/?product=annual-fortune"><span>☯️</span>${year} 신년운세</a><button data-go="journal"><span>🎁</span>이벤트</button></div><div class="hdFlow"><b>최근 에너지 흐름</b><p>사주를 계산하면 현재 대운·세운과 상담 흐름을 이어서 확인할 수 있습니다.</p></div>`;
    const compatibility = x.querySelector('[data-product="compatibility"]');
    if (compatibility) {
      compatibility.outerHTML =
        '<a target="_top" href="/?product=compatibility"><span>💞</span>궁합</a>';
    }
    x.querySelector(".hdFlow").innerHTML = `<div class="hdFlowHead"><b>나의 운세 흐름</b><span>눌러서 보기</span></div><p>원하는 항목을 누르면 해당 화면으로 바로 이동합니다.</p><div class="hdFlowDetails"><a target="_top" href="/?open=analysis"><strong>대운·세운</strong><small>현재 흐름과 올해 변화 보기</small></a><a target="_top" href="/?open=analysis"><strong>월별 운세</strong><small>달마다 달라지는 운세 보기</small></a><a target="_top" href="/?open=journal"><strong>상담 기록</strong><small>저장된 리포트 다시 보기</small></a></div>`;
    x.querySelector(".hdFlow").insertAdjacentHTML(
      "afterend",
      `<section class="hdPromo"><div class="hdPromoHead"><div><small>HWADAM SERVICE</small><h3>화담 상담 상품</h3></div><b>4개 상품</b></div><div class="hdPromoTabs"><button type="button" class="active" data-filter="all">전체</button><button type="button" data-filter="fortune">운세</button><button type="button" data-filter="consult">상담</button></div><div class="hdPromoTrack"><a class="hdPromoCard" data-cat="fortune" target="_top" href="/?product=annual-fortune"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>NEW</span><span>연도별</span></div><strong>${year}년<br>나의 신년운세</strong></div><div class="hdPromoBody"><b>${year}년 신년운세</b><p>1년 총운과 12개월 월별 흐름을 자세히 살펴봅니다.</p><div class="hdPromoPrice">9,900원 <span>상담 선택 ›</span></div></div></a><a class="hdPromoCard" data-cat="consult" target="_top" href="/?product=money-business"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>추천</span><span>재물</span></div><strong>돈의 흐름과<br>사업 기회 분석</strong></div><div class="hdPromoBody"><b>재물·사업 상담</b><p>재물운, 사업운과 시기별 주의점을 확인합니다.</p><div class="hdPromoPrice">5,900원 <span>상담 선택 ›</span></div></div></a><a class="hdPromoCard" data-cat="consult" target="_top" href="/?product=compatibility"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>관계</span><span>궁합</span></div><strong>두 사람의<br>관계 흐름과 궁합</strong></div><div class="hdPromoBody"><b>궁합 상담</b><p>잘 맞는 점과 갈등을 줄이는 방법을 살펴봅니다.</p><div class="hdPromoPrice">7,900원 <span>상담 선택 ›</span></div></div></a><a class="hdPromoCard" data-cat="consult" target="_top" href="/?product=comprehensive"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>BEST</span><span>종합</span></div><strong>나를 깊이 보는<br>종합 사주상담</strong></div><div class="hdPromoBody"><b>종합 사주 상담</b><p>성격, 재물, 직업, 관계와 올해 흐름을 종합합니다.</p><div class="hdPromoPrice">9,900원 <span>상담 선택 ›</span></div></div></a></div><div class="hdPromoFill"><button type="button" data-go="input"><span>🎁</span><b>신규 회원<br>무료 기본풀이</b><small>출생정보 입력 후 바로 확인</small></button><button type="button" data-go="journal"><span>📔</span><b>상담 리포트<br>자동 저장</b><small>화담일지에서 언제든 다시 보기</small></button></div></section>`,
    );
    x.querySelectorAll(".hdPromoTabs button").forEach((button) =>
      button.addEventListener("click", () => {
        x.querySelectorAll(".hdPromoTabs button").forEach((item) =>
          item.classList.toggle("active", item === button),
        );
        const filter = button.dataset.filter;
        x.querySelectorAll(".hdPromoCard").forEach((card) => {
          card.hidden = filter !== "all" && card.dataset.cat !== filter;
        });
        const track = x.querySelector(".hdPromoTrack");
        if (track) track.scrollLeft = 0;
      }),
    );
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
