(()=>{
  const d=document;
  const $=id=>d.getElementById(id);
  function css(){
    if($('analysis-collapse-style'))return;
    const s=d.createElement('style');
    s.id='analysis-collapse-style';
    s.textContent=`#hwadamAnalysisToggleWrap{margin:12px 0 8px}#hwadamAnalysisToggle{width:100%;border:1px solid #d9cfbd;background:#fffdf8;color:#20352d;border-radius:14px;padding:12px 13px;font-size:14px;font-weight:900;display:flex;align-items:center;justify-content:space-between;gap:8px;box-shadow:none}#hwadamAnalysisToggle .sub{font-size:10px;font-weight:700;color:#7d7467}#hwadamAnalysis.is-collapsed{display:none!important}#hwadamAnalysis{font-size:14px!important;line-height:1.65!important}#hwadamAnalysis h1,#hwadamAnalysis h2{font-size:25px!important;line-height:1.25!important}#hwadamAnalysis h3{font-size:19px!important;line-height:1.35!important}#hwadamAnalysis p,#hwadamAnalysis li,#hwadamAnalysis div,#hwadamAnalysis span{line-height:1.65}#hwadamAnalysis .analysisCard,#hwadamAnalysis .aCard,#hwadamAnalysis .box{padding-top:14px!important;padding-bottom:14px!important}`;
    d.head.appendChild(s);
  }
  function setup(){
    css();
    const a=$('hwadamAnalysis');
    const md=$('monthDetail');
    if(!a||!md)return;
    let w=$('hwadamAnalysisToggleWrap');
    if(!w){
      w=d.createElement('div');
      w.id='hwadamAnalysisToggleWrap';
      w.innerHTML='<button type="button" id="hwadamAnalysisToggle" aria-expanded="false"><span>종합 화담분석 펼쳐보기</span><span class="sub">원국·대운·세운</span></button>';
      const b=w.querySelector('#hwadamAnalysisToggle');
      b.addEventListener('click',()=>{
        const closed=a.classList.toggle('is-collapsed');
        b.setAttribute('aria-expanded',String(!closed));
        b.firstElementChild.textContent=closed?'종합 화담분석 펼쳐보기':'종합 화담분석 접기';
      });
    }
    if(!a.dataset.collapseInit){
      a.dataset.collapseInit='1';
      a.classList.add('is-collapsed');
    }
    if(md.nextElementSibling!==w)md.insertAdjacentElement('afterend',w);
    if(w.nextElementSibling!==a)w.insertAdjacentElement('afterend',a);
    const b=$('hwadamAnalysisToggle');
    if(b){const closed=a.classList.contains('is-collapsed');b.setAttribute('aria-expanded',String(!closed));b.firstElementChild.textContent=closed?'종합 화담분석 펼쳐보기':'종합 화담분석 접기'}
  }
  function boot(){
    setup();
    let t;
    new MutationObserver(()=>{clearTimeout(t);t=setTimeout(setup,120)}).observe(d.body,{subtree:true,childList:true});
    setInterval(setup,1200);
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
