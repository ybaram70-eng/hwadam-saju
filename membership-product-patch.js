(() => {
  const d = document;
  const year = new Date().getFullYear();
  const PRODUCTS = [
    {id:'annual-membership',name:'1년 회원권',price:55000,cat:'fortune',badges:['MEMBER','1년'],title:'1년 동안\n모든 유료 기능 이용',desc:'로그인한 회원 본인 기준으로 구매일로부터 1년 동안 화담 유료 기능을 이용합니다.'},
    {id:'annual-fortune',name:`${year}년 신년운세`,price:9900,cat:'fortune',badges:['NEW','연도별'],title:`${year}년\n나의 신년운세`,desc:'1년 총운과 12개월 월별 흐름을 자세히 살펴봅니다.'},
    {id:'money-business',name:'재물·사업 상담',price:5900,cat:'consult',badges:['추천','재물'],title:'돈의 흐름과\n사업 기회 분석',desc:'재물운, 사업운과 시기별 주의점을 확인합니다.'},
    {id:'compatibility',name:'궁합 상담',price:7900,cat:'consult',badges:['관계','궁합'],title:'두 사람의\n관계 흐름과 궁합',desc:'잘 맞는 점과 갈등을 줄이는 방법을 살펴봅니다.'},
    {id:'lifetime-fortune',name:'평생운세 장문 리포트',price:14900,cat:'fortune',badges:['PREMIUM','평생'],title:'평생의 흐름과\n대운 전환점 분석',desc:'재물·직업·배우자·자녀·건강·말년운과 대운 전환점을 깊게 살펴봅니다.'}
  ];
  const money=n=>Number(n).toLocaleString('ko-KR')+'원';

  function select(p){
    const value={id:p.id,name:p.name,price:p.price,at:new Date().toISOString()};
    try{localStorage.setItem('hwadam_selected_product',JSON.stringify(value));localStorage.removeItem('hwadam_formal_report_payment')}catch{}
    d.dispatchEvent(new CustomEvent('hwadam:product-selected',{detail:value}));
    try{parent.document.querySelector('.navItem[data-target="ai"]')?.click()}catch{}
  }

  function card(p){
    return `<button type="button" class="hdPromoCard" data-cat="${p.cat}" data-product="${p.id}" style="text-align:left;padding:0">
      <div class="hdPromoVisual"><div class="hdPromoBadges"><span>${p.badges[0]}</span><span>${p.badges[1]}</span></div><strong>${p.title.replace('\n','<br>')}</strong></div>
      <div class="hdPromoBody"><b>${p.name}</b><p>${p.desc}</p><div class="hdPromoPrice">${money(p.price)} <span>${p.id==='annual-membership'?'회원권 선택':'상담 선택'} ›</span></div></div>
    </button>`;
  }

  function build(){
    const promo=d.querySelector('#hwadamHomeDashboard .hdPromo');
    const track=promo?.querySelector('.hdPromoTrack');
    if(!promo||!track)return false;

    const count=promo.querySelector('.hdPromoHead b');
    if(count)count.textContent='5개 상품';
    track.innerHTML=PRODUCTS.map(card).join('');
    track.querySelectorAll('[data-product]').forEach(btn=>btn.addEventListener('click',()=>{
      const p=PRODUCTS.find(x=>x.id===btn.dataset.product);
      if(p)select(p);
    }));

    promo.querySelectorAll('.hdPromoTabs button').forEach(button=>{
      button.onclick=()=>{
        promo.querySelectorAll('.hdPromoTabs button').forEach(x=>x.classList.toggle('active',x===button));
        const filter=button.dataset.filter;
        track.querySelectorAll('.hdPromoCard').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.cat!==filter});
        track.scrollLeft=0;
      };
    });
    return true;
  }

  function boot(){
    if(build())return;
    let n=0;
    const t=setInterval(()=>{if(build()||n++>30)clearInterval(t)},200);
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
