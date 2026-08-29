(()=>{
  const d=document,$=id=>d.getElementById(id);
  function css(){
    let s=$('analysis-collapse-style');
    if(!s){s=d.createElement('style');s.id='analysis-collapse-style';d.head.appendChild(s)}
    s.textContent=`
#hwadamAnalysisToggleWrap{margin:10px 0 7px}
#hwadamAnalysisToggle{width:100%;border:1px solid #d9cfbd;background:#fffdf8;color:#20352d;border-radius:12px;padding:9px 10px;font-size:11px!important;font-weight:900;display:flex;align-items:center;justify-content:space-between;gap:7px;box-shadow:none;transition:none!important;animation:none!important}
#hwadamAnalysisToggle .sub{font-size:8px!important;font-weight:700;color:#7d7467}
#hwadamAnalysis.is-collapsed{display:none!important}
#hwadamAnalysis,#hwadamAnalysis.hwadamAnalysis{font-size:10px!important;line-height:1.42!important;animation:none!important;transition:none!important;transform:none!important;opacity:1!important;filter:none!important}
#hwadamAnalysis *,#hwadamAnalysis .haGrid *,#hwadamAnalysis article *{animation:none!important;transition:none!important;transform:none!important;filter:none!important;text-shadow:none!important;line-height:1.42!important}
#hwadamAnalysis .haHead small{font-size:9px!important}
#hwadamAnalysis .haHead h3,#hwadamAnalysis h1,#hwadamAnalysis h2{font-size:16px!important;line-height:1.15!important;margin:5px 0!important}
#hwadamAnalysis .haHead>span{font-size:9px!important;padding:5px 7px!important}
#hwadamAnalysis .haGrid{gap:7px!important}
#hwadamAnalysis .haGrid article,#hwadamAnalysis article,#hwadamAnalysis .analysisCard,#hwadamAnalysis .aCard,#hwadamAnalysis .box{padding:9px!important;margin:0 0 7px!important;border-radius:12px!important}
#hwadamAnalysis .haGrid article>b,#hwadamAnalysis article>b,#hwadamAnalysis h3,#hwadamAnalysis strong,#hwadamAnalysis .analysisLabel,#hwadamAnalysis .label{font-size:12px!important;line-height:1.3!important}
#hwadamAnalysis .haGrid article>p,#hwadamAnalysis article>p,#hwadamAnalysis p,#hwadamAnalysis li,#hwadamAnalysis div,#hwadamAnalysis span{font-size:10px!important;line-height:1.42!important;margin-top:4px!important;margin-bottom:4px!important}
@media(max-width:430px){#hwadamAnalysis .haHead h3{font-size:15px!important}#hwadamAnalysis .haGrid article>b{font-size:11.5px!important}#hwadamAnalysis .haGrid article>p,#hwadamAnalysis p{font-size:9.8px!important}}
`;
  }
  function setup(){
    css();
    const a=$('hwadamAnalysis'),md=$('monthDetail');
    if(!a||!md)return;
    let w=$('hwadamAnalysisToggleWrap');
    if(!w){
      w=d.createElement('div');w.id='hwadamAnalysisToggleWrap';
      w.innerHTML='<button type="button" id="hwadamAnalysisToggle" aria-expanded="false"><span>종합 화담분석 펼쳐보기</span><span class="sub">원국·대운·세운</span></button>';
      const b=w.querySelector('#hwadamAnalysisToggle');
      b.addEventListener('click',()=>{const closed=a.classList.toggle('is-collapsed');b.setAttribute('aria-expanded',String(!closed));b.firstElementChild.textContent=closed?'종합 화담분석 펼쳐보기':'종합 화담분석 접기'});
    }
    if(!a.dataset.collapseInit){a.dataset.collapseInit='1';a.classList.add('is-collapsed')}
    if(md.nextElementSibling!==w)md.insertAdjacentElement('afterend',w);
    if(w.nextElementSibling!==a)w.insertAdjacentElement('afterend',a);
    const b=$('hwadamAnalysisToggle');if(b){const closed=a.classList.contains('is-collapsed');b.setAttribute('aria-expanded',String(!closed));b.firstElementChild.textContent=closed?'종합 화담분석 펼쳐보기':'종합 화담분석 접기'}
  }
  function boot(){setup();setTimeout(setup,700);setTimeout(setup,1800)}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
