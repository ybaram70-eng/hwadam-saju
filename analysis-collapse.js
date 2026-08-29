(()=>{
  const d=document;
  const $=id=>d.getElementById(id);
  function css(){
    if($('analysis-collapse-style'))return;
    const s=d.createElement('style');
    s.id='analysis-collapse-style';
    s.textContent=`#hwadamAnalysisToggleWrap{margin:12px 0 8px}#hwadamAnalysisToggle{width:100%;border:1px solid #d9cfbd;background:#fffdf8;color:#20352d;border-radius:14px;padding:13px 14px;font-size:15px;font-weight:900;display:flex;align-items:center;justify-content:space-between;gap:10px;box-shadow:none}#hwadamAnalysisToggle .sub{font-size:11px;font-weight:700;color:#7d7467}#hwadamAnalysis.is-collapsed{display:none!important}`;
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
      w.innerHTML='<button type="button" id="hwadamAnalysisToggle" aria-expanded="false"><span>종합 화담분석 펼쳐보기</span><span class="sub">원국·대운·세운 종합</span></button>';
      a.insertAdjacentElement('beforebegin',w);
      const b=$('hwadamAnalysisToggle');
      b.addEventListener('click',()=>{
        const closed=a.classList.toggle('is-collapsed');
        b.setAttribute('aria-expanded',String(!closed));
        b.firstElementChild.textContent=closed?'종합 화담분석 펼쳐보기':'종합 화담분석 접기';
      });
    }
    if(!a.dataset.collapseInit){
      a.dataset.collapseInit='1';
      a.classList.add('is-collapsed');
      const b=$('hwadamAnalysisToggle');
      if(b){b.setAttribute('aria-expanded','false');b.firstElementChild.textContent='종합 화담분석 펼쳐보기'}
    }
    if(w.previousElementSibling!==md)md.insertAdjacentElement('afterend',w);
  }
  function boot(){
    setup();
    let t;
    new MutationObserver(()=>{clearTimeout(t);t=setTimeout(setup,120)}).observe(d.body,{subtree:true,childList:true});
    setInterval(setup,1200);
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
