(()=>{
  if(window.__hwadamPaymentBooted)return;
  window.__hwadamPaymentBooted=true;
  const d=document,$=id=>d.getElementById(id);
  let widgets=null,cfg=null,rendered=false,busy=false,lastKey='',widgetClientKey='',paymentInProgress=false;
  async function loadSdk(){
    if(window.TossPayments)return true;
    await new Promise((resolve,reject)=>{
      const old=d.querySelector('script[data-hwadam-toss-sdk]');
      if(old){
        if(window.TossPayments){resolve();return;}
        old.addEventListener('load',resolve,{once:true});
        old.addEventListener('error',reject,{once:true});
        return;
      }
      const s=d.createElement('script');
      s.dataset.hwadamTossSdk='1';
      s.src='https://js.tosspayments.com/v2/standard';
      s.onload=resolve;s.onerror=reject;d.head.appendChild(s);
    });
    return !!window.TossPayments;
  }
  function lastReport(){try{return JSON.parse(localStorage.getItem('hwadam_last_ai_consult')||'{}')||{}}catch{return{}}}
  function selectedProduct(){
    try{return JSON.parse(localStorage.getItem('hwadam_selected_product')||'{}')||{}}catch{return{}}
  }
  function entitlement(reportId){try{return(JSON.parse(localStorage.getItem('hwadam_report_entitlements')||'{}')||{})[reportId]||null}catch{return null}}
  async function valid(reportId){const e=entitlement(reportId);try{const r=await fetch('/api/report-entitlement',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({token:e?.token||'',reportId})});const x=await r.json();return !!(r.ok&&x.ok)}catch{return false}}
  function memberReportId(){try{let id=localStorage.getItem('hwadam_membership_report_id');if(!id){id='RPT-MEMBER-'+Date.now()+'-'+Math.random().toString(36).slice(2,10).toUpperCase();localStorage.setItem('hwadam_membership_report_id',id)}return id}catch{return 'RPT-MEMBER-'+Date.now()}}
  async function membership(){try{const r=await fetch('/api/membership',{credentials:'same-origin',cache:'no-store'});if(!r.ok)return null;const j=await r.json();return j.membership||null}catch{return null}}
  function ensureBox(){
    let sec=$('hwadamPaidReport');
    if(sec)return sec;
    const ai=$('hwadamAiConsult');if(!ai)return null;
    sec=d.createElement('section');sec.id='hwadamPaidReport';sec.className='card';
    sec.innerHTML=`<h2>유료 상담 결제</h2><p class="payIntro">선택한 상담 상품을 결제하면 정식 상담 리포트와 계속 상담 기능을 이용할 수 있습니다.</p><div id="payMode" class="payMode" hidden></div><div id="payState" class="payState">결제 상태를 확인하는 중입니다…</div><div id="payMethods" hidden></div><div id="payAgreement" hidden></div><button id="payStart" type="button" hidden>상담 결제하기</button>`;
    ai.appendChild(sec);
    if(!$('hwadamPayStyle')){const st=d.createElement('style');st.id='hwadamPayStyle';st.textContent=`#hwadamPaidReport{margin-top:18px}#hwadamPaidReport h2{margin:0 0 8px;color:#20352d}.payIntro{font-size:13px;line-height:1.7;color:#6f6b64}.payMode{margin:10px 0;padding:11px 12px;border-radius:12px;font-size:13px;font-weight:900;line-height:1.55}.payMode.test{background:#fff3cf;color:#99621a;border:1px solid #edcf7d}.payMode.live{background:#e9f4ee;color:#1f5d42;border:1px solid #bcd9c9}.payState{margin-top:10px;padding:11px 12px;border-radius:12px;background:#f4f0e8;color:#6f6b64;font-size:13px;line-height:1.6}#payStart{width:100%;margin-top:10px;padding:13px;border:0;border-radius:13px;background:#20352d;color:#fff;font-size:15px;font-weight:800}`;d.head.appendChild(st)}
    return sec;
  }
  async function ensureWidgets(clientKey){
    if(widgets&&widgetClientKey===clientKey)return widgets;
    if(widgets&&widgetClientKey!==clientKey){
      $('payMethods')?.replaceChildren();$('payAgreement')?.replaceChildren();
      widgets=null;rendered=false;
    }
    await loadSdk();
    if(typeof window.TossPayments!=='function')throw new Error('토스 결제 SDK를 불러오지 못했습니다.');
    const toss=window.TossPayments(clientKey);
    widgets=toss.widgets({customerKey:window.TossPayments.ANONYMOUS});
    widgetClientKey=clientKey;
    return widgets;
  }
  async function renderOnce(){
    if(rendered)return;
    const pm=$('payMethods'),pa=$('payAgreement');if(!pm||!pa||!widgets)return;
    pm.hidden=false;pa.hidden=false;
    if(pm.childElementCount>0){rendered=true;return;}
    try{await widgets.renderPaymentMethods({selector:'#payMethods',variantKey:'DEFAULT'});rendered=true}catch(e){if(String(e?.message||e).includes('하나의 결제수단')){rendered=true}else throw e}
    try{if(pa.childElementCount===0)await widgets.renderAgreement({selector:'#payAgreement',variantKey:'AGREEMENT'})}catch{}
  }
  function currentKey(){const r=lastReport(),p=selectedProduct();return[(r.reportId||''),(p.id||''),(p.price||'')].join('|')}
  function showMode(){const m=$('payMode');if(!m||!cfg)return;m.hidden=false;m.className='payMode '+(cfg.isTest?'test':'live');m.textContent=cfg.isTest?'테스트 결제입니다. 실제 금액은 청구되지 않습니다.':'실결제 환경입니다. 결제 버튼을 누르면 실제 금액이 청구됩니다.'}
  async function sync(){
    if(busy||paymentInProgress)return;ensureBox();
    const state=$('payState'),btn=$('payStart'),last=lastReport(),sel=selectedProduct();if(!state||!btn)return;
    const k=currentKey();if(k===lastKey&&cfg)return;
    busy=true;lastKey=k;
    try{
      btn.hidden=true;
      if(!sel?.id||sel.id==='free-basic'){state.textContent='유료 상담 상품을 먼저 선택해 주세요.';return}
      const isMember=sel.id==='annual-membership';
      let reportId=isMember?memberReportId():(last.reportId||'');
      const m=await membership();
      if(m?.admin||m?.plan==='admin'||(m?.source==='admin'&&!m?.expires_at)){
        state.textContent='관리자 무료 이용 · 결제 없이 이용 가능합니다.';
        btn.hidden=true;
        const reportBtn=$('aiReport');
        if(reportBtn){reportBtn.dataset.entitled='1';reportBtn.textContent='정식 상담 리포트 열기 (관리자 무료)'}
        d.dispatchEvent(new CustomEvent('hwadam:report-entitled',{detail:{reportId,admin:true}}));
        return;
      }
      if(isMember){
        if(m?.active){
          const exp=m.expires_at?new Date(m.expires_at).toLocaleDateString('ko-KR'):'';
          state.textContent=exp?`1년 회원권 이용 중 · ${exp}까지`:'1년 회원권 이용 중';return;
        }
      }else{
        if(!last.answer||!reportId){state.textContent='선택한 상품으로 AI 상담을 완료하면 결제 버튼이 활성화됩니다.';return}
        if(await valid(reportId)){state.textContent='이 상담은 결제가 완료되어 정식 열람이 가능합니다.';document.dispatchEvent(new CustomEvent('hwadam:report-entitled',{detail:{reportId}}));return}
      }
      const r=await fetch('/api/payment-config?productId='+encodeURIComponent(sel.id),{cache:'no-store'}),nextCfg=await r.json();
      if(!nextCfg.enabled){state.textContent='결제 기능은 준비되어 있습니다. 토스페이먼츠 키를 연결하면 바로 사용할 수 있습니다.';return}
      if(nextCfg.mode!=='live'&&nextCfg.mode!=='test')throw new Error('결제 환경 설정이 올바르지 않습니다.');
      if(!nextCfg.clientKey||!Number.isSafeInteger(Number(nextCfg.amount))||Number(nextCfg.amount)<=0)throw new Error('결제 키 또는 금액 설정이 올바르지 않습니다.');
      cfg=nextCfg;showMode();
      await ensureWidgets(cfg.clientKey);
      await widgets.setAmount({currency:'KRW',value:cfg.amount});
      await renderOnce();
      state.innerHTML=cfg.saleActive
        ? `<b>연말 감사 50% 할인</b><br>${cfg.productName} · <del>${Number(cfg.originalAmount).toLocaleString('ko-KR')}원</del> → <strong>${Number(cfg.amount).toLocaleString('ko-KR')}원</strong><br><small>2026년 12월 31일까지</small>`
        : `${cfg.productName} · ${Number(cfg.amount).toLocaleString('ko-KR')}원`;
      btn.hidden=false;btn.textContent=`${Number(cfg.amount).toLocaleString('ko-KR')}원 결제하기`;
      btn.onclick=async()=>{
        if(btn.dataset.paymentPending==='1'||paymentInProgress)return;
        const latest=lastReport(),latestSel=selectedProduct();
        const currentReportId=isMember?reportId:latest.reportId;
        if((!isMember&&(!currentReportId||currentReportId!==reportId))||latestSel.id!==cfg.productId){lastKey='';state.textContent='상담 또는 상품이 변경되었습니다. 결제 정보를 다시 확인합니다.';setTimeout(sync,80);return}
        const q=isMember?'1년 회원권':String(latest.question||$('aiQuestion')?.value||'').trim();
        const name=String(latest.chart?.name||$('name')?.value||'회원').trim()||'회원';
        const orderId='HWADAM-'+Date.now()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();
        try{localStorage.setItem('hwadam_pending_payment',JSON.stringify({orderId,amount:cfg.amount,reportId:currentReportId,productId:cfg.productId,productName:cfg.productName,paymentMode:cfg.mode,question:q,name,at:new Date().toISOString()}))}catch{}
        const successUrl=location.origin+'/payment-success.html?v=20261104-payfix2&reportId='+encodeURIComponent(currentReportId)+'&productId='+encodeURIComponent(cfg.productId)+'&productName='+encodeURIComponent(cfg.productName)+'&orderRef='+encodeURIComponent(orderId);
        const failUrl=location.origin+'/payment-fail.html?v=20261104-payfix2&reportId='+encodeURIComponent(currentReportId)+'&productId='+encodeURIComponent(cfg.productId);
        if(btn.dataset.paymentPending==='1')return;
        btn.dataset.paymentPending='1';
        paymentInProgress=true;
        btn.disabled=true;
        btn.textContent='결제창을 여는 중입니다…';
        try{
          await widgets.requestPayment({orderId,orderName:cfg.orderName,successUrl,failUrl,customerName:name});
        }catch(error){
          const code=String(error?.code||'');
          const message=String(error?.message||'결제 요청을 완료하지 못했습니다.');
          console.error('hwadam-payment-request-failed',{code,message});
          state.textContent='결제 요청이 완료되지 않았습니다. 카드 승인 여부를 확인한 뒤 다시 진행해 주세요. ('+(code||'결제 요청 오류')+')';
        }finally{
          paymentInProgress=false;
          btn.dataset.paymentPending='0';
          btn.disabled=false;
          btn.textContent=Number(cfg.amount).toLocaleString('ko-KR')+'원 결제하기';
        }
      };
    }catch(e){
      lastKey='';
      btn.hidden=true;
      console.error('hwadam-payment-widget-setup-failed',{message:String(e?.message||e)});
      state.textContent='결제 모듈을 준비하지 못했습니다: '+(e?.message||String(e));
    }finally{busy=false}
  }
  function boot(){
    ensureBox();sync();
    d.addEventListener('hwadam:product-selected',()=>{lastKey='';setTimeout(sync,60)});
    d.addEventListener('hwadam:report-entitled',()=>{lastKey='';setTimeout(sync,60)});
    d.addEventListener('click',e=>{
      if(e.target.closest('#aiReport')){lastKey='';setTimeout(sync,60);return}
      if(e.target.closest('#aiAsk,.hwadamProduct'))setTimeout(()=>{lastKey='';sync()},350)
    },true);
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();