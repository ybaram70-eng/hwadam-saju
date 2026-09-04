(()=>{
  const d=document;
  function add(){
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
  if(add()) return;
  let n=0;
  const t=setInterval(()=>{if(add()||n++>50)clearInterval(t)},200);
})();