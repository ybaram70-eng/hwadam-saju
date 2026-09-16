(()=>{
  const d=document;
  if(d.documentElement.dataset.hwadamFlowClickFix==='1')return;
  d.documentElement.dataset.hwadamFlowClickFix='1';

  function go(target){
    try{
      const b=parent.document.querySelector(`.navItem[data-target="${target}"]`);
      if(b){b.click();return true}
    }catch{}
    try{d.defaultView?.hwadamScreenMode?.show?.(target);d.defaultView.scrollTo(0,0);return true}catch{}
    return false;
  }

  function targetFor(el){
    const t=(el?.textContent||'').replace(/\s+/g,' ').trim();
    if(t.includes('대운')||t.includes('세운'))return 'analysis';
    if(t.includes('월별 운세')||t.includes('월별운세'))return 'calendar';
    if(t.includes('상담 기록')||t.includes('상담기록'))return 'journal';
    return '';
  }

  d.addEventListener('click',e=>{
    const card=e.target.closest('.hdFlowDetails a,.hdFlowDetails div');
    if(!card)return;
    const target=targetFor(card);
    if(!target)return;
    e.preventDefault();
    e.stopPropagation();
    go(target);
  },true);

  function makeClickable(){
    d.querySelectorAll('.hdFlowDetails a,.hdFlowDetails div').forEach(el=>{
      if(!targetFor(el))return;
      el.style.cursor='pointer';
      el.style.pointerEvents='auto';
      if(!el.hasAttribute('role'))el.setAttribute('role','button');
      if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','0');
    });
  }
  makeClickable();
  new MutationObserver(makeClickable).observe(d.body,{childList:true,subtree:true});
})();