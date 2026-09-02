(() => {
  const d = document;
  const $ = (id) => d.getElementById(id);
  const STEMS=['갑','을','병','정','무','기','경','신','임','계'];
  const BRANCHES=['자','축','인','묘','진','사','오','미','신','유','술','해'];

  function yearPillar(year){
    const i=((Number(year)-4)%60+60)%60;
    return STEMS[i%10]+BRANCHES[i%12];
  }

  function enableInputs() {
    ["name","year","month","day","hour","minute"].forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.removeAttribute("readonly");
      el.removeAttribute("disabled");
      el.disabled = false;
      el.readOnly = false;
      el.style.pointerEvents = "auto";
      el.style.touchAction = "manipulation";
      el.style.userSelect = "text";
      el.style.webkitUserSelect = "text";
      el.style.position = "relative";
      el.style.zIndex = "6";
    });
    ["gender","leap","boundary"].forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.removeAttribute("disabled");
      el.disabled = false;
      el.style.pointerEvents = "auto";
      el.style.touchAction = "manipulation";
      el.style.position = "relative";
      el.style.zIndex = "6";
    });
    d.querySelectorAll('input[name="cal"]').forEach((el) => {
      el.disabled = false;
      el.style.pointerEvents = "auto";
      el.style.touchAction = "manipulation";
      const lab = el.closest("label");
      if (lab) { lab.style.pointerEvents = "auto"; lab.style.position = "relative"; lab.style.zIndex = "6"; }
    });
  }

  function hideSamplePlaceholders() {
    ["year", "month", "day", "hour", "minute"].forEach((id) => {
      const el = $(id);
      if (el) el.placeholder = "";
    });
  }

  function revealInput() {
    hideSamplePlaceholders();
    enableInputs();
    const name = $("name");
    if (!name) return false;
    let node = name.closest(".card") || name.parentElement;
    while (node && node !== d.body) {
      node.classList.remove("hd-screen-hidden");
      if (node.matches("section, .card, main, .w") || node.contains(name)) {
        node.classList.add("hd-screen-visible");
      }
      node = node.parentElement;
    }
    try { d.scrollingElement.scrollTop = 0; d.defaultView.scrollTo(0, 0); } catch {}
    return true;
  }

  function renderDaewoon(luckPillars){
    const box=$("luck");
    if(!box)return;
    box.innerHTML='';
    const list=Array.isArray(luckPillars?.pillars)?luckPillars.pillars:Array.isArray(luckPillars)?luckPillars:[];
    list.slice(0,12).forEach((x,idx)=>{
      const p=String(x?.korean||x?.pillar||x?.ganji||x?.name||'').trim().slice(0,2);
      const age=Number(x?.age??x?.startAge??x?.start_age??x?.fromAge??(idx*10));
      if(p.length<2)return;
      const el=d.createElement('div');
      el.className='lb';
      el.dataset.p=p;
      if(Number.isFinite(age))el.dataset.age=String(age);
      el.innerHTML=`<b>${p}</b><small>${Number.isFinite(age)?age+'세':''}</small>`;
      el.addEventListener('click',()=>{
        d.querySelectorAll('.lb').forEach(z=>z.classList.remove('selected'));
        el.classList.add('selected');
        if($("luckText")) $("luckText").innerHTML=`<b>${Number.isFinite(age)?age+'세 ':''}${p} 대운</b><br>이 대운의 십신·12운성·원국과의 합충 관계를 확인합니다.`;
      });
      box.appendChild(el);
    });
    if(!box.children.length && $("luckText")) $("luckText").textContent='대운 데이터가 없습니다.';
  }

  function renderSewoon(){
    const box=$("years");
    if(!box)return;
    box.innerHTML='';
    const start=new Date().getFullYear();
    for(let y=start;y<start+10;y++){
      const p=yearPillar(y);
      const el=d.createElement('div');
      el.className='yb';
      el.dataset.year=String(y);
      el.dataset.p=p;
      el.innerHTML=`<b>${y}</b><small>${p}</small>`;
      el.addEventListener('click',()=>{
        d.querySelectorAll('.yb').forEach(z=>z.classList.remove('selected'));
        el.classList.add('selected');
        if($("yearText")) $("yearText").innerHTML=`<b>${y}년 ${p} 세운</b><br>해당 연도의 천간·지지와 원국의 관계를 확인합니다.`;
      });
      box.appendChild(el);
    }
  }

  async function directCalculate(ev) {
    ev?.preventDefault?.(); ev?.stopPropagation?.(); ev?.stopImmediatePropagation?.();
    const btn = $("go"), st = $("st");
    if (!btn || btn.dataset.busy === "1") return;
    try {
      btn.dataset.busy = "1"; btn.disabled = true; btn.textContent = "계산 중…";
      if (st) { st.className = "status"; st.textContent = "사주를 계산하고 있습니다…"; }
      const year=Number($("year")?.value), month=Number($("month")?.value), day=Number($("day")?.value), hour=Number($("hour")?.value), minute=Number($("minute")?.value);
      if (!year || !month || !day || Number.isNaN(hour) || hour<0 || hour>23 || Number.isNaN(minute) || minute<0 || minute>59) throw new Error("생년월일과 시간을 확인해 주세요.");
      const lunar = d.querySelector('input[name="cal"]:checked')?.value === "lunar";
      const ctrl = new AbortController(); const timer=setTimeout(()=>ctrl.abort(),12000);
      let res; try { res = await fetch("/api/support?action=saju-calc", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({year,month,day,hour,minute,isLunar:lunar,isLeapMonth:lunar&&$("leap")?.value==="leap",dayBoundary:$("boundary")?.value||"midnight",gender:$("gender")?.value||"female"}),signal:ctrl.signal}); } finally { clearTimeout(timer); }
      const j=await res.json().catch(()=>({})); if(!res.ok||!j.ok) throw new Error(j.error||"사주 계산에 실패했습니다.");
      const k=j.pillars||{};
      if ($("who")) $("who").textContent=(($("name")?.value||"").trim()||"고객")+"님의 사주팔자";
      if ($("summary")) $("summary").textContent=`${lunar?"음력":"양력"} ${year}.${month}.${day} ${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
      [["y",k.year],["m",k.month],["d",k.day],["h",k.hour]].forEach(([id,p])=>{ if($(id+"P")) $(id+"P").textContent=p||""; });
      if ($("dm")) $("dm").textContent=`${k.day?.[0]||"-"} 일간 · ${j.dayElement||"-"} · ${j.dayYinYang||"-"}`;
      if ($("vb")) $("vb").textContent=Array.isArray(j.voidBranches)?j.voidBranches.join(" · "):(j.voidBranches||"-");
      renderDaewoon(j.luckPillars);
      renderSewoon();
      if ($("result")) $("result").style.display="block";
      if (st) { st.className="status"; st.textContent="계산 완료"; }
      try { d.defaultView?.dispatchEvent?.(new Event('resize')); } catch {}
      try { const analysis=parent.document.querySelector('.navItem[data-target="analysis"]'); if(analysis) analysis.click(); } catch {}
      setTimeout(()=>$("result")?.scrollIntoView?.({behavior:"smooth",block:"start"}),120);
    } catch(e) {
      if (st) { st.className="status err"; st.textContent="계산 오류: "+(e?.name==="AbortError"?"서버 응답이 늦습니다. 다시 눌러 주세요.":(e?.message||String(e))); }
      else alert(e?.message||"계산 오류가 발생했습니다.");
    } finally {
      const b=$("go"); if(b){ b.dataset.busy="0"; b.disabled=false; b.textContent="사주팔자 계산"; }
      enableInputs();
    }
  }

  function hardBindCalc() {
    let btn=$("go"); if(!btn||btn.dataset.hwadamHardBound==="1") return;
    const clone=btn.cloneNode(true); clone.id="go"; clone.type="button"; clone.disabled=false; clone.style.pointerEvents="auto"; clone.style.touchAction="manipulation"; clone.style.position="relative"; clone.style.zIndex="6"; clone.dataset.hwadamHardBound="1"; btn.replaceWith(clone);
    clone.addEventListener("click",directCalculate,true);
    clone.addEventListener("touchend",e=>{e.preventDefault();directCalculate(e);},{passive:false,capture:true});
  }

  function bindNav() {
    try {
      const button=parent.document.querySelector('.navItem[data-target="input"]');
      if(!button||button.dataset.inputRevealBound)return;
      button.dataset.inputRevealBound="1";
      button.addEventListener("click",()=>{ hideSamplePlaceholders(); enableInputs(); setTimeout(()=>{revealInput();hardBindCalc();enableInputs();},40); setTimeout(()=>{revealInput();hardBindCalc();enableInputs();},180); setTimeout(()=>{revealInput();hardBindCalc();enableInputs();},500); },false);
    } catch {}
  }

  function boot(){ hideSamplePlaceholders(); enableInputs(); bindNav(); hardBindCalc(); setTimeout(()=>{enableInputs();bindNav();hardBindCalc();},250); setTimeout(()=>{enableInputs();bindNav();hardBindCalc();},800); try{const active=parent.document.querySelector('.navItem.active[data-target="input"]'); if(active)setTimeout(()=>{revealInput();hardBindCalc();enableInputs();},80);}catch{} }

  window.hwadamInputScreenFix={reveal:revealInput,hideSamplePlaceholders,enableInputs,calculate:directCalculate,renderDaewoon,renderSewoon};
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
})();
