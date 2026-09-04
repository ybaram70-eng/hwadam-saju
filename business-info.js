(()=>{
  const d=document;

  function fixProducts(){
    const promo=d.querySelector('.hdPromo');
    const track=promo?.querySelector('.hdPromoTrack');
    if(!promo||!track) return false;

    const cards=[...track.querySelectorAll('.hdPromoCard')];
    const memberCards=cards.filter((card)=>{
      const text=(card.textContent||'').replace(/\s+/g,' ');
      const href=card.getAttribute('href')||'';
      return text.includes('1년 회원권')||href.includes('product=annual-membership');
    });
    const lifetimeCards=cards.filter((card)=>{
      const text=(card.textContent||'').replace(/\s+/g,' ');
      const href=card.getAttribute('href')||'';
      return text.includes('평생운세')||href.includes('product=lifetime-fortune');
    });

    if(memberCards.length>1 && lifetimeCards.length===0){
      const replacement=document.createElement('a');
      replacement.className='hdPromoCard';
      replacement.dataset.cat='fortune';
      replacement.target='_top';
      replacement.href='/?product=lifetime-fortune';
      replacement.innerHTML=`<div class="hdPromoVisual"><div class="hdPromoBadges"><span>PREMIUM</span><span>평생</span></div><strong>평생의 흐름과<br>대운 전환점 분석</strong></div><div class="hdPromoBody"><b>평생운세 장문 리포트</b><p>재물·직업·배우자·자녀·건강·말년운과 대운 전환점을 깊게 살펴봅니다.</p><div class="hdPromoPrice">14,900원 <span>상담 선택 ›</span></div></div>`;
      memberCards[1].replaceWith(replacement);
    }else if(memberCards.length===1 && lifetimeCards.length===0){
      const card=document.createElement('a');
      card.className='hdPromoCard';
      card.dataset.cat='fortune';
      card.target='_top';
      card.href='/?product=lifetime-fortune';
      card.innerHTML=`<div class="hdPromoVisual"><div class="hdPromoBadges"><span>PREMIUM</span><span>평생</span></div><strong>평생의 흐름과<br>대운 전환점 분석</strong></div><div class="hdPromoBody"><b>평생운세 장문 리포트</b><p>재물·직업·배우자·자녀·건강·말년운과 대운 전환점을 깊게 살펴봅니다.</p><div class="hdPromoPrice">14,900원 <span>상담 선택 ›</span></div></div>`;
      track.appendChild(card);
    }

    const remaining=[...track.querySelectorAll('.hdPromoCard')];
    const seenMember=[];
    remaining.forEach((card)=>{
      const text=(card.textContent||'').replace(/\s+/g,' ');
      const href=card.getAttribute('href')||'';
      if(text.includes('1년 회원권')||href.includes('product=annual-membership')){
        seenMember.push(card);
        if(seenMember.length>1) card.remove();
      }
    });

    const count=track.querySelectorAll('.hdPromoCard').length;
    const countEl=promo.querySelector('.hdPromoHead b');
    if(countEl) countEl.textContent=`${count}개 상품`;
    return true;
  }

  function add(){
    if(!d.getElementById('hwadamBusinessInfo')){
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
    }
    fixProducts();
    return true;
  }

  add();
  let n=0;
  const t=setInterval(()=>{
    add();
    if(n++>80) clearInterval(t);
  },250);

  const observer=new MutationObserver(()=>fixProducts());
  if(d.body) observer.observe(d.body,{subtree:true,childList:true});
})();