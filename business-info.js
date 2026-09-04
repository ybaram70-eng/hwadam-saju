(()=>{
  const d=document;

  function addBusinessInfo(){
    if(d.getElementById('hwadamBusinessInfo')) return true;
    const home=d.getElementById('hwadamHomeDashboard');
    if(!home) return false;
    const sec=d.createElement('section');
    sec.id='hwadamBusinessInfo';
    sec.innerHTML=`
      <div class="bizTitle">사업자 정보</div>
      <div class="bizRows">
        <div><b>상호명</b><span>화담철학관</span></div>
        <div><b>대표자명</b><span>구점애</span></div>
        <div><b>사업자등록번호</b><span>549-46-01517</span></div>
        <div><b>사업장 주소</b><span>전남광주통합특별시 순천시 오천4길 21, 105동 902호 (오천동, 골드클래스)</span></div>
        <div><b>고객문의</b><span>010-3021-4060</span></div>
      </div>
      <div class="bizLinks">
        <a href="/refund-policy.html" target="_blank" rel="noopener">환불·취소 규정</a>
        <a href="/privacy.html" target="_blank" rel="noopener">개인정보처리방침</a>
      </div>`;
    home.appendChild(sec);
    if(!d.getElementById('hwadamBusinessInfoStyle')){
      const st=d.createElement('style');
      st.id='hwadamBusinessInfoStyle';
      st.textContent=`
        #hwadamBusinessInfo{margin:18px 0 90px;padding:18px 17px;border:1px solid #ddd4c7;border-radius:18px;background:#fffdf8;color:#39433e;box-shadow:0 4px 14px rgba(32,53,45,.05)}
        #hwadamBusinessInfo .bizTitle{font-size:16px;font-weight:900;color:#20352d;margin-bottom:11px}
        #hwadamBusinessInfo .bizRows{display:grid;gap:7px}
        #hwadamBusinessInfo .bizRows>div{display:grid;grid-template-columns:104px 1fr;gap:8px;font-size:12px;line-height:1.65}
        #hwadamBusinessInfo b{color:#6f675d}
        #hwadamBusinessInfo span{word-break:keep-all}
        #hwadamBusinessInfo .bizLinks{display:flex;gap:10px;flex-wrap:wrap;margin-top:13px;padding-top:12px;border-top:1px solid #eee5d8}
        #hwadamBusinessInfo .bizLinks a{font-size:12px;font-weight:800;color:#174b39;text-decoration:underline;text-underline-offset:3px}
        @media(max-width:430px){#hwadamBusinessInfo{margin:15px 0 86px;padding:15px 14px}#hwadamBusinessInfo .bizRows>div{grid-template-columns:92px 1fr;font-size:11.5px}}
      `;
      d.head.appendChild(st);
    }
    return true;
  }

  const canonicalProducts=()=>{
    const year=new Date().getFullYear();
    return `
      <a class="hdPromoCard" data-cat="consult" target="_top" href="/?product=annual-membership"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>MEMBER</span><span>1년</span></div><strong>1년 동안<br>모든 유료 기능 이용</strong></div><div class="hdPromoBody"><b>1년 회원권</b><p>구매일로부터 1년간 화담 유료 기능 전체를 이용합니다.</p><div class="hdPromoPrice">55,000원 <span>회원권 선택 ›</span></div></div></a>
      <a class="hdPromoCard" data-cat="fortune" target="_top" href="/?product=annual-fortune"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>NEW</span><span>연도별</span></div><strong>${year}년<br>나의 신년운세</strong></div><div class="hdPromoBody"><b>${year}년 신년운세</b><p>1년 총운과 12개월 월별 흐름을 자세히 살펴봅니다.</p><div class="hdPromoPrice">9,900원 <span>상담 선택 ›</span></div></div></a>
      <a class="hdPromoCard" data-cat="consult" target="_top" href="/?product=money-business"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>추천</span><span>재물</span></div><strong>돈의 흐름과<br>사업 기회 분석</strong></div><div class="hdPromoBody"><b>재물·사업 상담</b><p>재물운, 사업운과 시기별 주의점을 확인합니다.</p><div class="hdPromoPrice">5,900원 <span>상담 선택 ›</span></div></div></a>
      <a class="hdPromoCard" data-cat="consult" target="_top" href="/?product=compatibility"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>관계</span><span>궁합</span></div><strong>두 사람의<br>관계 흐름과 궁합</strong></div><div class="hdPromoBody"><b>궁합 상담</b><p>잘 맞는 점과 갈등을 줄이는 방법을 살펴봅니다.</p><div class="hdPromoPrice">7,900원 <span>상담 선택 ›</span></div></div></a>
      <a class="hdPromoCard" data-cat="fortune" target="_top" href="/?product=lifetime-fortune"><div class="hdPromoVisual"><div class="hdPromoBadges"><span>PREMIUM</span><span>평생</span></div><strong>평생의 흐름과<br>대운 전환점 분석</strong></div><div class="hdPromoBody"><b>평생운세 장문 리포트</b><p>재물·직업·배우자·자녀·건강·말년운과 대운 전환점을 깊게 살펴봅니다.</p><div class="hdPromoPrice">14,900원 <span>상담 선택 ›</span></div></div></a>`;
  };

  function openLifetimeFortune(e){
    e?.preventDefault?.();
    const p={id:'lifetime-fortune',name:'평생운세 장문 리포트',price:14900,at:new Date().toISOString()};
    try{localStorage.setItem('hwadam_selected_product',JSON.stringify(p));localStorage.removeItem('hwadam_formal_report_payment')}catch{}
    const q='평생운세 장문 리포트로 작성해 주세요. 사주 원국을 근거로 평생 총운, 타고난 성향과 강점, 재물운, 직업·사업운, 배우자·결혼운, 가족·자녀운, 건강에서 주의할 생활 흐름, 대운별 주요 전환점과 기회·주의 시기, 중년 이후의 변화, 말년운과 삶의 방향까지 항목별로 충분히 깊고 길게 설명해 주세요. 단정적인 예언은 피하고 실제 생활에서 활용할 수 있는 조언을 포함해 주세요.';
    const ta=d.getElementById('aiQuestion');if(ta)ta.value=q;
    const status=d.getElementById('aiStatus');if(status)status.textContent='평생운세 장문 리포트 · 14,900원 상품을 선택했습니다. AI 상담을 완료하면 아래 카드결제 영역에서 결제할 수 있습니다.';
    d.dispatchEvent(new CustomEvent('hwadam:product-selected',{detail:p}));
    try{parent.document.querySelector('.navItem[data-target="ai"]')?.click()}catch{}
    setTimeout(()=>{
      const ta2=d.getElementById('aiQuestion');if(ta2&&!ta2.value.trim())ta2.value=q;
      d.getElementById('hwadamAiConsult')?.scrollIntoView({behavior:'smooth',block:'start'});
    },350);
  }

  function bindProductActions(track){
    if(!track)return;
    const lifetime=track.querySelector('a[href*="product=lifetime-fortune"]');
    if(lifetime&&!lifetime.dataset.hwadamBound){
      lifetime.dataset.hwadamBound='1';
      lifetime.addEventListener('click',openLifetimeFortune);
    }
  }

  function normalizeProducts(rebuild=false){
    const promo=d.querySelector('.hdPromo');
    const track=promo?.querySelector('.hdPromoTrack');
    if(!promo||!track) return false;

    if(rebuild) track.innerHTML=canonicalProducts();

    const allowed=['annual-membership','annual-fortune','money-business','compatibility','lifetime-fortune'];
    const seen=new Set();
    [...track.querySelectorAll('.hdPromoCard')].forEach(card=>{
      const href=card.getAttribute('href')||'';
      const match=href.match(/[?&]product=([^&#]+)/);
      const id=match?decodeURIComponent(match[1]):'';
      if(!allowed.includes(id)||seen.has(id)) card.remove();
      else seen.add(id);
    });

    if(seen.size!==5){
      track.innerHTML=canonicalProducts();
    }

    bindProductActions(track);
    const countEl=promo.querySelector('.hdPromoHead b');
    if(countEl) countEl.textContent='5개 상품';
    return true;
  }

  let tries=0;
  const timer=setInterval(()=>{
    const businessReady=addBusinessInfo();
    const productsReady=normalizeProducts(true);
    if((businessReady&&productsReady)||tries++>40){
      clearInterval(timer);
      const track=d.querySelector('.hdPromoTrack');
      if(track){
        bindProductActions(track);
        const observer=new MutationObserver(()=>normalizeProducts(false));
        observer.observe(track,{childList:true});
      }
    }
  },250);
})();