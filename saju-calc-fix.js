(()=>{
  const d=document,$=id=>d.getElementById(id);
  const HS={갑:'甲',을:'乙',병:'丙',정:'丁',무:'戊',기:'己',경:'庚',신:'辛',임:'壬',계:'癸'},HB={자:'子',축:'丑',인:'寅',묘:'卯',진:'辰',사:'巳',오:'午',미:'未',신:'申',유:'酉',술:'戌',해:'亥'};
  const HIDDEN={자:'계',축:'기·계·신',인:'갑·병·무',묘:'을',진:'무·을·계',사:'병·무·경',오:'정·기',미:'기·정·을',신:'경·임·무',유:'신',술:'무·신·정',해:'임·갑'};
  const hj=p=>p?(HS[p[0]]||'')+(HB[p[1]]||''):'';
  const one=x=>!x?'-':typeof x==='string'?x:`${x.stem??'-'} / ${x.branch??'-'}`;
  function relations(bs){const a=[],pairs=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],clash={자:'오',축:'미',인:'신',묘:'유',진:'술',사:'해',오:'자',미:'축',신:'인',유:'묘',술:'진',해:'사'},harm={자:'미',축:'오',인:'사',묘:'진',진:'묘',사:'인',오:'축',미:'자',신:'해',유:'술',술:'유',해:'신'},breaks={자:'유',축:'진',인:'해',묘:'오',진:'축',사:'신',오:'묘',미:'술',신:'사',유:'자',술:'미',해:'인'};for(const[i,j]of pairs){if(clash[bs[i]]===bs[j])a.push(bs[i]+bs[j]+'충');if(harm[bs[i]]===bs[j])a.push(bs[i]+bs[j]+'해');if(breaks[bs[i]]===bs[j])a.push(bs[i]+bs[j]+'파')}return a.length?a.join(' · '):'두드러진 충·파·해 없음'}
  function makeYears(base){const box=$('years');if(!box)return;box.innerHTML='';for(let y=base;y<base+10;y++){const e=d.createElement('div');e.className='yb';e.innerHTML=`<b>${y}</b><small>세운</small>`;e.onclick=()=>{d.querySelectorAll('.yb').forEach(x=>x.classList.remove('selected'));e.classList.add('selected');if($('yearText'))$('yearText').innerHTML=`<b>${y}년</b><br>해당 세운의 흐름을 확인합니다.`};box.appendChild(e)}}
  async function calculate(ev){
    ev?.preventDefault?.();ev?.stopPropagation?.();ev?.stopImmediatePropagation?.();
    const btn=$('go'),st=$('st');if(!btn)return;
    try{
      btn.disabled=true;btn.textContent='계산 중…';if(st){st.className='status';st.textContent='사주를 계산하고 있습니다…'}
      const y=+$('year')?.value,m=+$('month')?.value,day=+$('day')?.value,h=+$('hour')?.value,min=+$('minute')?.value;
      if(!y||!m||!day||Number.isNaN(h)||Number.isNaN(min)||h<0||h>23||min<0||min>59)throw Error('생년월일과 시간을 확인해 주세요.');
      const lunar=d.querySelector('input[name=cal]:checked')?.value==='lunar';
      const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),12000);
      let r;try{r=await fetch('/api/saju-calc',{method:'POST',headers:{'Content-Type':'application/json'},signal:ctl.signal,body:JSON.stringify({year:y,month:m,day,hour:h,minute:min,isLunar:lunar,isLeapMonth:lunar&&$('leap')?.value==='leap',dayBoundary:$('boundary')?.value||'midnight',gender:$('gender')?.value||'female'})})}finally{clearTimeout(timer)}
      const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw Error(j.error||'사주 계산에 실패했습니다.');
      const k=j.pillars||{};
      if($('who'))$('who').textContent=(($('name')?.value||'').trim()||'고객')+'님의 사주팔자';
      if($('summary'))$('summary').textContent=`${lunar?'음력':'양력'} ${y}.${m}.${day} ${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
      for(const[id,p]of[['y',k.year],['m',k.month],['d',k.day],['h',k.hour]]){if($(id+'P'))$(id+'P').textContent=p||'';if($(id+'H'))$(id+'H').textContent=hj(p)}
      if($('dm'))$('dm').textContent=`${k.day?.[0]||'-'} 일간 · ${j.dayElement||'-'} · ${j.dayYinYang||'-'}`;
      if($('tg'))$('tg').textContent=['year','month','day','hour'].map((q,i)=>['년','월','일','시'][i]+': '+one(j.tenGods?.[q])).join(' · ');
      const ps=[k.hour,k.day,k.month,k.year];if($('hidden'))$('hidden').textContent=ps.map((p,i)=>['시','일','월','년'][i]+': '+(HIDDEN[p?.[1]]||'-')).join(' · ');
      if($('stage'))$('stage').textContent=ps.map(p=>(p?.[1]||'-')+'지').join(' · ');
      if($('vb'))$('vb').textContent=Array.isArray(j.voidBranches)?j.voidBranches.join(' · '):(j.voidBranches||'-');
      if($('rel'))$('rel').textContent=relations(ps.map(p=>p?.[1]));if($('stars'))$('stars').textContent='원국 기준 신살을 분석합니다.';
      const luck=$('luck');if(luck){luck.innerHTML='';(j.luckPillars?.pillars||[]).slice(0,10).forEach(x=>{const e=d.createElement('div');e.className='lb';e.innerHTML=`<b>${x.korean||''}</b><small>${hj(x.korean||'')}<br>${x.age??''}세</small>`;e.onclick=()=>{d.querySelectorAll('.lb').forEach(z=>z.classList.remove('selected'));e.classList.add('selected');if($('luckText'))$('luckText').innerHTML=`<b>${x.age??''}세 ${x.korean||''} 대운</b><br>한자 ${hj(x.korean||'')}`};luck.appendChild(e)})}
      makeYears(new Date().getFullYear());if($('result'))$('result').style.display='block';if(st){st.className='status';st.textContent='계산 완료'}
      try{d.defaultView?.hwadamScreenMode?.show?.('analysis')}catch{}
      $('result')?.scrollIntoView?.({behavior:'smooth',block:'start'});
    }catch(e){if(st){st.className='status err';st.textContent='계산 오류: '+(e?.name==='AbortError'?'계산 서버 응답이 늦습니다. 잠시 후 다시 시도해 주세요.':(e?.message||String(e)))}}
    finally{btn.disabled=false;btn.textContent='사주팔자 계산'}
  }
  function bind(){const btn=$('go');if(!btn||btn.dataset.serverCalcBound)return;btn.dataset.serverCalcBound='1';btn.addEventListener('click',calculate,true)}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',()=>{bind();setTimeout(bind,300);setTimeout(bind,900)},{once:true});else{bind();setTimeout(bind,300);setTimeout(bind,900)}
})();
