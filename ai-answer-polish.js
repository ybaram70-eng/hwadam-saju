(()=>{const d=document,$=id=>d.getElementById(id);function style(){if($('hwadam-ai-answer-polish-style'))return;const s=d.createElement('style');s.id='hwadam-ai-answer-polish-style';s.textContent=`#aiAnswer{font-size:15px!important;line-height:1.9!important}#aiAnswer .aiSectionTitle{margin:18px 0 9px!important;padding:8px 11px;border-radius:10px;background:#edf5ef;color:#1f4939;font-size:17px!important;font-weight:900!important}#aiAnswer .aiSectionTitle:first-child{margin-top:0!important}#aiAnswer ul{margin:4px 0 14px!important;padding-left:21px!important}#aiAnswer li{margin:7px 0!important;line-height:1.85!important}#aiAnswer p{margin:0 0 12px!important}@media(max-width:430px){#aiAnswer{font-size:14.5px!important}#aiAnswer .aiSectionTitle{font-size:16px!important}}`;d.head.appendChild(s)}function ensureAiNav(){try{if(parent===window)return;const pd=parent.document,nav=pd.querySelector('.bottomNav');if(!nav)return;nav.style.gridTemplateColumns='repeat(7,1fr)';let b=nav.querySelector('[data-target="ai"]');if(!b){b=pd.createElement('button');b.className='navItem';b.dataset.target='ai';b.innerHTML='<span class="ico">💬</span><span class="txt">AI상담</span>';const ana=nav.querySelector('[data-target="analysis"]');ana?.insertAdjacentElement('afterend',b)}if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>{pd.querySelectorAll('.navItem').forEach(x=>x.classList.toggle('active',x===b));try{d.defaultView.hwadamScreenMode?.show('ai')}catch{}setTimeout(()=>{const ai=$('hwadamAiConsult');if(ai){ai.classList.remove('hd-screen-hidden');ai.classList.add('hd-screen-visible');d.defaultView.scrollTo(0,0)}},180)})}}catch{}}function readSelected(){try{return JSON.parse(localStorage.getItem('hwadam_selected_product')||'{}')||{}}catch{return{}}}function money(n){return Number(n||0).toLocaleString('ko-KR')+'원'}function chosenProduct(){const p=readSelected();if(p?.id&&Number(p.price)>0)return p;return{id:'comprehensive',name:'정식 상담 리포트',price:9900,at:new Date().toISOString()}}function selectReportProduct(){const p={...chosenProduct(),at:new Date().toISOString()};try{localStorage.setItem('hwadam_selected_product',JSON.stringify(p));localStorage.removeItem('hwadam_formal_report_payment')}catch{}d.querySelectorAll('.hwadamProduct').forEach(x=>x.classList.toggle('selected',x.dataset.id===p.id));d.dispatchEvent(new CustomEvent('hwadam:product-selected',{detail:p}));setTimeout(()=>{$('hwadamPaidReport')?.scrollIntoView({behavior:'smooth',block:'start'})},120)}let adminChecked=false,adminFree=false;
async function syncAdminAccess(){
  const b=$('aiReport');
  if(!b||adminChecked)return;
  adminChecked=true;
  try{
    const r=await fetch('/api/membership',{credentials:'same-origin',cache:'no-store'});
    const j=await r.json();
    adminFree=!!(r.ok&&j?.membership?.admin);
    if(adminFree){
      b.dataset.entitled='1';
      const label='정식 상담 리포트 열기 (관리자 무료)';
      if(b.textContent!==label)b.textContent=label;
      if(b.dataset.adminSynced!=='1'){
        b.dataset.adminSynced='1';
        d.dispatchEvent(new CustomEvent('hwadam:report-entitled',{detail:{reportId:(JSON.parse(localStorage.getItem('hwadam_last_ai_consult')||'{}')||{}).reportId||'',admin:true}}));
      }
    }
  }catch{adminChecked=false}
}
function syncReportButton(){
  const b=$('aiReport');
  if(!b)return;
  if(adminFree||b.dataset.entitled==='1'){
    const label='정식 상담 리포트 열기 (관리자 무료)';
    if(b.textContent!==label)b.textContent=label;
    return;
  }
  const p=chosenProduct();
  if(Number(p.price)>0){
    const label=`정식 상담 리포트 열기 (${money(p.price)} 결제 필요)`;
    if(b.textContent!==label)b.textContent=label;
  }
  syncAdminAccess();
}function bindReport(){if(d.body.dataset.formalReportBound==='1')return;d.body.dataset.formalReportBound='1';d.addEventListener('click',e=>{const b=e.target.closest('#aiReport');if(!b)return;if(b.dataset.entitled==='1')return;const p=chosenProduct();if(p.id!=='comprehensive'||Number(p.price)!==9900){e.preventDefault();e.stopImmediatePropagation();selectReportProduct();syncReportButton()}else selectReportProduct()},true);d.addEventListener('hwadam:product-selected',()=>setTimeout(syncReportButton,60));d.addEventListener('hwadam:consult-complete',()=>setTimeout(syncReportButton,60))}function polish(){const box=$('aiAnswer');if(!box||box.hidden)return;for(const p of [...box.querySelectorAll('p,h3,h4')]){const t=p.textContent.trim();if(['핵심 요약','명리상 근거','현실적인 활용 조언'].includes(t)){if(!p.classList.contains('aiSectionTitle')){const h=d.createElement('h3');h.className='aiSectionTitle';h.textContent=t;p.replaceWith(h)}}}const html=box.innerHTML;const fixed=html.replace(/재물의 기회와 운영 감각이 있는 원국으로,?\s*수입을 만들어내는 힘은 비교적 분명합니다\.?/g,'재물을 만들 기회와 운영 감각이 함께 보이며, 수입원을 스스로 만들어가는 성향이 비교적 뚜렷합니다.');if(fixed!==html)box.innerHTML=fixed}function boot(){style();ensureAiNav();bindReport();polish();syncReportButton();syncAdminAccess();let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{ensureAiNav();bindReport();polish();syncReportButton()},80)}).observe(d.body,{subtree:true,childList:true,characterData:true})}if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot()})();