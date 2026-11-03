(() => {
  const d=document,$=id=>d.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function style(){
    if($('hwadam-reset-style'))return;
    const s=d.createElement('style');s.id='hwadam-reset-style';
    s.textContent=`.hdForgotBtn{border:0;background:transparent;color:#8a6427;font-size:14px;font-weight:900;text-decoration:underline;padding:8px 2px;text-align:left}.hdResetForm{display:grid;gap:10px}.hdResetForm label{font-size:14px;font-weight:850;color:#3f4b45}.hdResetForm input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #d6cdbd;border-radius:12px;background:#fff;font-size:16px}.hdResetNotice{padding:11px 12px;border-radius:11px;background:#f7f0df;color:#725820;font-size:13px;line-height:1.65}.hdAdminResetBtn{min-height:44px!important;height:44px!important;padding:8px 14px!important;font-size:14px!important}.hdResetList{display:grid;gap:10px}.hdResetItem{padding:13px;border:1px solid #d8cdbb;border-radius:13px;background:#fff}.hdResetItem b,.hdResetItem small{display:block}.hdResetItem small{margin:5px 0;color:#6d685f}.hdResetItem input{width:100%;box-sizing:border-box;padding:11px;border:1px solid #d6cdbd;border-radius:10px;font-size:15px}.hdResetItem button{width:100%;margin-top:7px;padding:11px;border:0;border-radius:10px;background:#20352d;color:#fff;font-weight:900}`;
    d.head.appendChild(s);
  }
  function sheet(title,body){
    $('hwadamAuthModal')?.remove();
    const x=d.createElement('div');x.id='hwadamAuthModal';x.className='hdAuthModal';
    x.innerHTML=`<div class="hdAuthSheet"><div class="hdAuthHead"><h2>${title}</h2><button class="hdAuthClose" aria-label="닫기">×</button></div>${body}</div>`;
    d.body.appendChild(x);x.querySelector('.hdAuthClose').onclick=()=>x.remove();x.onclick=e=>{if(e.target===x)x.remove()};return x;
  }
  function openRequest(){
    const x=sheet('이메일로 비밀번호 재설정',`<form class="hdResetForm"><div class="hdResetNotice">회원가입 때 등록한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.</div><label>이메일<input name="email" type="email" autocomplete="email" placeholder="example@email.com" required></label><div class="hdAuthMsg"></div><button class="hdAuthSubmit">재설정 링크 받기</button></form>`);
    x.querySelector('form').onsubmit=async e=>{
      e.preventDefault();const form=e.currentTarget,f=new FormData(form),msg=x.querySelector('.hdAuthMsg'),btn=form.querySelector('button');
      btn.disabled=true;msg.textContent='메일 발송 중…';
      const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),15000);
      try{
        const r=await fetch('/api/auth-session?action=forgot-email',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',signal:ctrl.signal,body:JSON.stringify({email:f.get('email')})});
        let j={};try{j=await r.json()}catch{}
        if(r.ok){msg.textContent=j.message||'재설정 링크를 이메일로 보냈습니다.';return}
        if(j.error==='EMAIL_NOT_CONFIGURED')msg.textContent='이메일 발송 설정이 아직 완료되지 않았습니다.';
        else if(j.error==='EMAIL_INVALID')msg.textContent='이메일 주소를 확인해 주세요.';
        else msg.textContent='메일 발송에 실패했습니다. 다시 시도해 주세요.';
        btn.disabled=false;
      }catch(err){btn.disabled=false;msg.textContent=err?.name==='AbortError'?'서버 응답이 늦습니다. 다시 눌러 주세요.':'연결이 지연되고 있습니다.'}
      finally{clearTimeout(timer)}
    };
  }

  async function openAdmin(){
    const x=sheet('비밀번호 재설정 요청',`<div id="hdResetList" class="hdResetList">요청을 불러오는 중…</div>`),box=x.querySelector('#hdResetList');
    try{const r=await fetch('/api/auth-reset-admin'),j=await r.json();if(!r.ok){box.textContent='관리자만 확인할 수 있습니다.';return}if(!j.requests?.length){box.textContent='대기 중인 요청이 없습니다.';return}
      box.innerHTML=j.requests.map(q=>`<div class="hdResetItem" data-id="${Number(q.id)}"><b>${esc(q.name)}님 · ${esc(String(q.phone).replace(/(\d{3})\d+(\d{4})/,'$1-****-$2'))}</b><small>생년월일 ${esc(String(q.birth_date).slice(0,10))} · 요청 ${esc(new Date(q.requested_at).toLocaleString('ko-KR'))}</small><input type="text" minlength="8" placeholder="임시 비밀번호 8자 이상"><button type="button">임시 비밀번호 발급 완료</button><div class="hdAuthMsg"></div></div>`).join('');
      box.querySelectorAll('.hdResetItem button').forEach(b=>b.onclick=async()=>{const item=b.closest('.hdResetItem'),password=item.querySelector('input').value,msg=item.querySelector('.hdAuthMsg');if(password.length<8){msg.textContent='임시 비밀번호를 8자 이상 입력해 주세요.';return}b.disabled=true;const r=await fetch('/api/auth-reset-admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:Number(item.dataset.id),temporaryPassword:password})});if(r.ok)item.remove();else{b.disabled=false;msg.textContent='처리하지 못했습니다. 다시 눌러 주세요.'}});
    }catch{box.textContent='요청을 불러오지 못했습니다.'}
  }
  function decorate(){
    style();const form=$('hwadamLoginForm');
    if(form&&!form.querySelector('.hdForgotBtn')){const b=d.createElement('button');b.type='button';b.className='hdForgotBtn';b.textContent='비밀번호를 잊으셨나요? 이메일로 재설정';b.onclick=openRequest;form.querySelector('.hdAuthSubmit')?.insertAdjacentElement('afterend',b)}
    const bar=$('hwadamAuthBar');
  }
  function boot(){style();decorate();let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(decorate,80)}).observe(d.body,{subtree:true,childList:true});}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
