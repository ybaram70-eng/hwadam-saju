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
    const x=sheet('비밀번호 재설정 요청',`<form class="hdResetForm"><div class="hdResetNotice">회원정보를 확인한 뒤 관리자가 임시 비밀번호를 발급합니다.</div><label>이름<input name="name" required></label><label>휴대폰번호<input name="phone" inputmode="numeric" placeholder="01012345678" required></label><label>생년월일<input name="birthDate" inputmode="numeric" maxlength="8" placeholder="예: 19651214" required></label><div class="hdAuthMsg"></div><button class="hdAuthSubmit">재설정 요청하기</button></form>`);
    x.querySelector('form').onsubmit=async e=>{
      e.preventDefault();const f=new FormData(e.currentTarget),msg=x.querySelector('.hdAuthMsg'),digits=String(f.get('birthDate')||'').replace(/\D/g,'');
      if(digits.length!==8){msg.textContent='생년월일 숫자 8자리를 입력해 주세요.';return}
      msg.textContent='요청 중…';
      try{const r=await fetch('/api/auth-reset-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:f.get('name'),phone:f.get('phone'),birthDate:`${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`})}),j=await r.json();msg.textContent=r.ok?j.message:'입력 내용을 확인해 주세요.';if(r.ok)e.currentTarget.querySelector('button').disabled=true}catch{msg.textContent='연결이 지연되고 있습니다. 다시 눌러 주세요.'}
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
    if(form&&!form.querySelector('.hdForgotBtn')){const b=d.createElement('button');b.type='button';b.className='hdForgotBtn';b.textContent='비밀번호를 잊으셨나요?';b.onclick=openRequest;form.querySelector('.hdAuthSubmit')?.insertAdjacentElement('afterend',b)}
    const bar=$('hwadamAuthBar'),userKey=bar?.querySelector('.hdAuthUser')?.textContent||'';if(bar&&userKey&&!bar.querySelector('#hwadamResetAdmin')&&bar.dataset.resetAdminChecked!==userKey){bar.dataset.resetAdminChecked=userKey;fetch('/api/auth-reset-admin').then(r=>{if(!r.ok)return;const b=d.createElement('button');b.id='hwadamResetAdmin';b.type='button';b.className='hdAuthBtn hdAdminResetBtn';b.textContent='비번요청 확인';b.onclick=openAdmin;const deleteButton=bar.querySelector('#hwadamDeleteAccount');if(deleteButton){deleteButton.className='hdAuthBtn hdAdminResetBtn';bar.insertBefore(b,deleteButton)}else bar.appendChild(b)}).catch(()=>{})}
  }
  function boot(){style();decorate();let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(decorate,80)}).observe(d.body,{subtree:true,childList:true});}
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
