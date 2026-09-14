(()=>{
  if(window.__hwadamAdminVisitStatsBooted)return;
  window.__hwadamAdminVisitStatsBooted=true;
  const d=document,$=id=>d.getElementById(id);

  async function track(){
    try{
      const day=new Date().toISOString().slice(0,10),key='hwadam_visit_'+day;
      if(localStorage.getItem(key)==='1')return;
      const r=await fetch('/api/auth-session?action=visit',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:'{}',cache:'no-store'});
      if(r.ok)localStorage.setItem(key,'1');
    }catch{}
  }

  function style(){
    if($('hwadamAdminVisitStyle'))return;
    const s=d.createElement('style');s.id='hwadamAdminVisitStyle';
    s.textContent=`#hwadamAdminVisitStats{margin:8px 10px 12px;padding:12px 14px;border:1px solid #decda7;border-radius:15px;background:#fff9ea;color:#20352d;box-shadow:0 3px 10px rgba(32,53,45,.05)}#hwadamAdminVisitStats .avsTitle{font-size:12px;font-weight:900;color:#8b6b32;margin-bottom:7px}#hwadamAdminVisitStats .avsGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}#hwadamAdminVisitStats .avsBox{padding:9px 7px;border-radius:11px;background:#fff;border:1px solid #eadfc8;text-align:center}#hwadamAdminVisitStats .avsBox small{display:block;font-size:10px;color:#746b5e;margin-bottom:2px}#hwadamAdminVisitStats .avsBox b{font-size:18px;color:#20352d}#hwadamAdminVisitStats .avsNote{margin-top:6px;font-size:10px;color:#847a6e}`;
    d.head.appendChild(s);
  }

  function render(stats){
    style();
    let box=$('hwadamAdminVisitStats');
    if(!box){box=d.createElement('section');box.id='hwadamAdminVisitStats';const bar=$('hwadamAuthBar');if(bar)bar.insertAdjacentElement('afterend',box);else d.body.prepend(box)}
    box.innerHTML=`<div class="avsTitle">관리자 방문 현황</div><div class="avsGrid"><div class="avsBox"><small>오늘</small><b>${Number(stats.today||0).toLocaleString('ko-KR')}</b></div><div class="avsBox"><small>최근 7일</small><b>${Number(stats.last7||0).toLocaleString('ko-KR')}</b></div><div class="avsBox"><small>최근 30일</small><b>${Number(stats.last30||0).toLocaleString('ko-KR')}</b></div></div><div class="avsNote">브라우저별 하루 1회 기준 간단 방문 집계</div>`;
  }

  async function loadStats(){
    try{
      const r=await fetch('/api/auth-session?action=stats',{credentials:'same-origin',cache:'no-store'});
      if(r.status===403){$('hwadamAdminVisitStats')?.remove();return}
      const j=await r.json();if(r.ok&&j.ok)render(j.stats||{});
    }catch{}
  }

  function boot(){track();setTimeout(loadStats,500);d.addEventListener('click',e=>{if(e.target.closest('#hwadamLogout,#hwadamLoginOpen,#hwadamAdminLoginOpen'))setTimeout(loadStats,900)},true);setInterval(loadStats,60000)}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
