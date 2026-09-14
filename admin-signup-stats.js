(()=>{
  if(window.__hwadamAdminSignupStatsBooted)return;
  window.__hwadamAdminSignupStatsBooted=true;
  const d=document,$=id=>d.getElementById(id);

  function style(){
    if($('hwadamAdminSignupStatsStyle'))return;
    const s=d.createElement('style');s.id='hwadamAdminSignupStatsStyle';
    s.textContent=`#hwadamAdminSignupStats{margin:8px 10px 12px;padding:12px 14px;border:1px solid #decda7;border-radius:15px;background:#fff9ea;color:#20352d;box-shadow:0 3px 10px rgba(32,53,45,.05)}#hwadamAdminSignupStats .assTitle{font-size:12px;font-weight:900;color:#8b6b32;margin-bottom:7px}#hwadamAdminSignupStats .assGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}#hwadamAdminSignupStats .assBox{padding:9px 7px;border-radius:11px;background:#fff;border:1px solid #eadfc8;text-align:center}#hwadamAdminSignupStats .assBox small{display:block;font-size:10px;color:#746b5e;margin-bottom:2px}#hwadamAdminSignupStats .assBox b{font-size:18px;color:#20352d}#hwadamAdminSignupStats .assNote{margin-top:6px;font-size:10px;color:#847a6e}`;
    d.head.appendChild(s);
  }

  function render(stats){
    style();
    let box=$('hwadamAdminSignupStats');
    if(!box){
      box=d.createElement('section');box.id='hwadamAdminSignupStats';
      const bar=$('hwadamAuthBar'),hero=d.querySelector('.hero');
      if(bar)bar.insertAdjacentElement('afterend',box);
      else if(hero)hero.insertAdjacentElement('beforebegin',box);
      else d.body.prepend(box);
    }
    box.innerHTML=`<div class="assTitle">회원가입 현황</div><div class="assGrid"><div class="assBox"><small>오늘 가입</small><b>${Number(stats.today||0).toLocaleString('ko-KR')}</b></div><div class="assBox"><small>최근 7일</small><b>${Number(stats.last7||0).toLocaleString('ko-KR')}</b></div><div class="assBox"><small>전체 회원</small><b>${Number(stats.total||0).toLocaleString('ko-KR')}</b></div></div><div class="assNote">실제 회원가입 완료 건수만 집계합니다.</div>`;
  }

  async function load(){
    try{
      const r=await fetch('/api/auth-session?action=signup-stats',{credentials:'same-origin',cache:'no-store'});
      if(r.status===403){$('hwadamAdminSignupStats')?.remove();return}
      const j=await r.json();
      if(r.ok&&j.ok)render(j.stats||{});
    }catch{}
  }

  function boot(){setTimeout(load,500);setInterval(load,60000)}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
